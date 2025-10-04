#!/usr/bin/env python3
"""
ExoNeural Backend API
NASA Space Apps Challenge 2025
Team: ExoNeural

Flask API for exoplanet detection predictions using LightGBM model
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from marshmallow import Schema, fields, validate, ValidationError
import numpy as np
import pandas as pd
import joblib
import logging
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
log_level = os.getenv('LOG_LEVEL', 'INFO')
logging.basicConfig(
    level=getattr(logging, log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Security Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
jwt = JWTManager(app)

# Configure CORS based on environment
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
if os.getenv('FLASK_ENV') == 'production':
    CORS(app, origins=cors_origins, supports_credentials=True)
else:
    CORS(app, origins=cors_origins)

# Rate limiting
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=[f"{os.getenv('RATE_LIMIT_PER_MINUTE', '60')} per minute"]
)

class ExoplanetPredictor:
    """
    LightGBM model for exoplanet detection with 31 features
    Matches your ML engineer's trained model exactly
    """

    def __init__(self):
        self.model = None
        self.scaler = None
        self.imputer = None
        self.model_loaded = False
        self.load_models()

        # Class names matching your notebook
        self.class_names = ["False Positive", "Candidate Exoplanet", "Confirmed Exoplanet"]

        # Expected feature columns in the correct order
        self.feature_columns = [
            'koi_period', 'koi_prad', 'koi_sma', 'koi_incl', 'koi_teq',
            'koi_insol', 'koi_impact', 'koi_duration', 'koi_depth', 'koi_dor',
            'koi_eccen', 'koi_ror', 'koi_steff', 'koi_slogg', 'koi_smet',
            'koi_srad', 'koi_smass', 'koi_srho', 'koi_num_transits', 'koi_count',
            'koi_model_snr', 'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co',
            'koi_fpflag_ec', 'planet_star_radius_ratio', 'period_duration_ratio',
            'star_density_proxy', 'insol_teq_ratio', 'signal_strength', 'total_fp_flags'
        ]

    def load_models(self):
        """Load the LightGBM model and preprocessing objects"""
        try:
            model_path = "exoplanet_model_multiclass.pkl"
            scaler_path = "scaler.pkl"
            imputer_path = "imputer.pkl"

            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                logger.info("✅ LightGBM model loaded successfully")

                # Try to load scaler and imputer if they exist
                if os.path.exists(scaler_path):
                    self.scaler = joblib.load(scaler_path)
                    logger.info("✅ Scaler loaded successfully")

                if os.path.exists(imputer_path):
                    self.imputer = joblib.load(imputer_path)
                    logger.info("✅ Imputer loaded successfully")

                self.model_loaded = True
            else:
                logger.warning(f"⚠️ Model file {model_path} not found")
                self.model_loaded = False
        except Exception as e:
            logger.error(f"❌ Error loading models: {str(e)}")
            self.model_loaded = False

    def calculate_derived_features(self, data):
        """
        Calculate the 6 engineered features from the 25 input features
        Matches the feature engineering in your notebook
        """
        try:
            # planet_star_radius_ratio = koi_prad / koi_srad
            data['planet_star_radius_ratio'] = data['koi_prad'] / data['koi_srad']

            # period_duration_ratio = koi_period / koi_duration
            data['period_duration_ratio'] = data['koi_period'] / data['koi_duration']

            # star_density_proxy = koi_smass / (koi_srad ** 3)
            data['star_density_proxy'] = data['koi_smass'] / (data['koi_srad'] ** 3)

            # insol_teq_ratio = koi_insol / koi_teq
            data['insol_teq_ratio'] = data['koi_insol'] / data['koi_teq']

            # signal_strength = koi_depth * koi_model_snr
            data['signal_strength'] = data['koi_depth'] * data['koi_model_snr']

            # total_fp_flags = sum of all false positive flags
            data['total_fp_flags'] = (
                data['koi_fpflag_nt'] +
                data['koi_fpflag_ss'] +
                data['koi_fpflag_co'] +
                data['koi_fpflag_ec']
            )

            return data
        except Exception as e:
            logger.error(f"Error calculating derived features: {str(e)}")
            raise

    def predict(self, input_data):
        """
        Main prediction method
        Expects a dictionary with all 25 parameters
        """
        try:
            if not self.model_loaded or self.model is None:
                return {
                    "prediction": "Error",
                    "confidence": 0.0,
                    "error": "Model not loaded. Please ensure model files exist."
                }

            # Create DataFrame from input data
            df = pd.DataFrame([input_data])

            # Calculate the 6 derived features
            df = self.calculate_derived_features(df)

            # Ensure columns are in the correct order
            df = df[self.feature_columns]

            # Apply preprocessing if available
            if self.imputer is not None:
                df = pd.DataFrame(
                    self.imputer.transform(df),
                    columns=self.feature_columns
                )

            if self.scaler is not None:
                df_scaled = self.scaler.transform(df)
            else:
                df_scaled = df.values

            # Make prediction
            prediction = int(self.model.predict(df_scaled)[0])
            probabilities = self.model.predict_proba(df_scaled)[0]

            return {
                "prediction": self.class_names[prediction],
                "confidence": round(float(probabilities[prediction]), 4),
                "raw_prediction": prediction,
                "probabilities": {
                    "false_positive": round(float(probabilities[0]), 4),
                    "candidate": round(float(probabilities[1]), 4),
                    "confirmed": round(float(probabilities[2]), 4)
                }
            }

        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return {
                "prediction": "Error",
                "confidence": 0.0,
                "error": str(e)
            }

# Input validation schemas
class PredictionSchema(Schema):
    koi_period = fields.Float(required=True, validate=validate.Range(min=0.1, max=10000))
    koi_prad = fields.Float(required=True, validate=validate.Range(min=0.1, max=100))
    koi_sma = fields.Float(required=True, validate=validate.Range(min=0.01, max=100))
    koi_incl = fields.Float(required=True, validate=validate.Range(min=0, max=180))
    koi_teq = fields.Float(required=True, validate=validate.Range(min=50, max=5000))
    koi_insol = fields.Float(required=True, validate=validate.Range(min=0.001, max=100000))
    koi_impact = fields.Float(required=True, validate=validate.Range(min=0, max=2))
    koi_duration = fields.Float(required=True, validate=validate.Range(min=0.1, max=50))
    koi_depth = fields.Float(required=True, validate=validate.Range(min=0.1, max=100000))
    koi_dor = fields.Float(required=True, validate=validate.Range(min=1, max=1000))
    koi_eccen = fields.Float(required=True, validate=validate.Range(min=0, max=1))
    koi_ror = fields.Float(required=True, validate=validate.Range(min=0.001, max=1))
    koi_steff = fields.Float(required=True, validate=validate.Range(min=2000, max=10000))
    koi_slogg = fields.Float(required=True, validate=validate.Range(min=3, max=6))
    koi_smet = fields.Float(required=True, validate=validate.Range(min=-2, max=1))
    koi_srad = fields.Float(required=True, validate=validate.Range(min=0.1, max=10))
    koi_smass = fields.Float(required=True, validate=validate.Range(min=0.1, max=5))
    koi_srho = fields.Float(required=True, validate=validate.Range(min=0.01, max=100))
    koi_num_transits = fields.Float(required=True, validate=validate.Range(min=1, max=1000))
    koi_count = fields.Float(required=True, validate=validate.Range(min=1, max=10))
    koi_model_snr = fields.Float(required=True, validate=validate.Range(min=0.1, max=1000))
    koi_fpflag_nt = fields.Integer(required=True, validate=validate.Range(min=0, max=1))
    koi_fpflag_ss = fields.Integer(required=True, validate=validate.Range(min=0, max=1))
    koi_fpflag_co = fields.Integer(required=True, validate=validate.Range(min=0, max=1))
    koi_fpflag_ec = fields.Integer(required=True, validate=validate.Range(min=0, max=1))

class BatchPredictionSchema(Schema):
    data = fields.List(fields.Nested(PredictionSchema), required=True, validate=validate.Length(min=1, max=100))

# Initialize the predictor
predictor = ExoplanetPredictor()

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "ExoNeural API",
        "version": "2.0.0",
        "team": "ExoNeural Team - NASA Space Apps Challenge 2025",
        "model_loaded": predictor.model_loaded
    })

@app.route('/predict', methods=['POST'])
@limiter.limit("10 per minute")
def predict_exoplanet():
    """
    Predict exoplanet classification from 25 input parameters
    """
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON", "status": "error"}), 400

        data = request.get_json()
        
        # Validate input using Marshmallow schema
        try:
            validated_data = PredictionSchema().load(data)
        except ValidationError as err:
            return jsonify({
                "error": "Validation error",
                "details": err.messages,
                "status": "error"
            }), 400

        # Make prediction
        result = predictor.predict(validated_data)

        # Add metadata
        result.update({
            "status": "success",
            "model_version": "ExoNeural-v2.0",
            "timestamp": pd.Timestamp.now().isoformat()
        })

        logger.info(f"Prediction completed successfully for request from {get_remote_address()}")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Unexpected error in predict_exoplanet: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "status": "error",
            "details": "An unexpected error occurred"
        }), 500

@app.route('/batch_predict', methods=['POST'])
@limiter.limit("5 per minute")
def batch_predict():
    """
    Batch prediction for multiple exoplanet candidates
    """
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON", "status": "error"}), 400

        data = request.get_json()
        
        # Validate input using Marshmallow schema
        try:
            validated_data = BatchPredictionSchema().load(data)
        except ValidationError as err:
            return jsonify({
                "error": "Validation error",
                "details": err.messages,
                "status": "error"
            }), 400

        results = []
        for i, item in enumerate(validated_data['data']):
            try:
                result = predictor.predict(item)
                result['row_index'] = i
                results.append(result)
            except Exception as e:
                logger.error(f"Error processing row {i}: {str(e)}")
                results.append({
                    "row_index": i,
                    "prediction": "Error",
                    "confidence": 0.0,
                    "error": str(e)
                })

        logger.info(f"Batch prediction completed: {len(results)} items processed")
        return jsonify({
            "status": "success",
            "results": results,
            "total_processed": len(results)
        })

    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        return jsonify({"error": "Internal server error", "status": "error"}), 500

if __name__ == '__main__':
    # Get configuration from environment variables
    debug_mode = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    host = os.getenv('API_HOST', '0.0.0.0')
    port = int(os.getenv('API_PORT', '5000'))
    
    logger.info("🚀 Starting ExoNeural API server...")
    logger.info(f"📊 Model loaded: {predictor.model_loaded}")
    logger.info(f"🌍 Environment: {os.getenv('FLASK_ENV', 'development')}")
    logger.info(f"🔧 Debug mode: {debug_mode}")
    logger.info(f"🌐 Server: {host}:{port}")
    
    app.run(debug=debug_mode, host=host, port=port)
