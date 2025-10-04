import pytest
import json
from app import app, predictor

@pytest.fixture
def client():
    """Create a test client for the Flask application."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def sample_prediction_data():
    """Sample data for testing predictions."""
    return {
        'koi_period': 41.749,
        'koi_prad': 2.94,
        'koi_sma': 0.228,
        'koi_incl': 89.77,
        'koi_teq': 486.0,
        'koi_insol': 13.22,
        'koi_impact': 0.226,
        'koi_duration': 5.6098,
        'koi_depth': 1055.4,
        'koi_dor': 57.11,
        'koi_eccen': 0.0,
        'koi_ror': 0.029414,
        'koi_steff': 5506.0,
        'koi_slogg': 4.473,
        'koi_smet': 0.04,
        'koi_srad': 0.914,
        'koi_smass': 0.904,
        'koi_srho': 2.02141,
        'koi_num_transits': 34.0,
        'koi_count': 3,
        'koi_model_snr': 95.0,
        'koi_fpflag_nt': 0,
        'koi_fpflag_ss': 0,
        'koi_fpflag_co': 0,
        'koi_fpflag_ec': 0
    }

class TestHealthCheck:
    def test_health_check(self, client):
        """Test the health check endpoint."""
        response = client.get('/')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert data['service'] == 'ExoNeural API'
        assert 'model_loaded' in data

class TestPrediction:
    def test_predict_success(self, client, sample_prediction_data):
        """Test successful prediction."""
        response = client.post('/predict', 
                             data=json.dumps(sample_prediction_data),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert 'prediction' in data
        assert 'confidence' in data

    def test_predict_missing_fields(self, client):
        """Test prediction with missing required fields."""
        incomplete_data = {'koi_period': 41.749}  # Missing other fields
        
        response = client.post('/predict',
                             data=json.dumps(incomplete_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'Validation error' in data['error']

    def test_predict_invalid_data(self, client):
        """Test prediction with invalid data types."""
        invalid_data = {
            'koi_period': 'not_a_number',  # Should be float
            'koi_prad': 2.94,
            # ... other fields would be missing too
        }
        
        response = client.post('/predict',
                         data=json.dumps(invalid_data),
                         content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'

    def test_predict_out_of_range_values(self, client):
        """Test prediction with values outside valid ranges."""
        out_of_range_data = {
            'koi_period': -1,  # Should be positive
            'koi_prad': 2.94,
            # ... other fields
        }
        
        response = client.post('/predict',
                             data=json.dumps(out_of_range_data),
                             content_type='application/json')
        
        assert response.status_code == 400

    def test_predict_non_json_request(self, client):
        """Test prediction with non-JSON request."""
        response = client.post('/predict', data='not json')
        assert response.status_code == 400

class TestBatchPrediction:
    def test_batch_predict_success(self, client, sample_prediction_data):
        """Test successful batch prediction."""
        batch_data = {
            'data': [sample_prediction_data, sample_prediction_data]
        }
        
        response = client.post('/batch_predict',
                             data=json.dumps(batch_data),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert len(data['results']) == 2

    def test_batch_predict_empty_data(self, client):
        """Test batch prediction with empty data array."""
        batch_data = {'data': []}
        
        response = client.post('/batch_predict',
                             data=json.dumps(batch_data),
                             content_type='application/json')
        
        assert response.status_code == 400

    def test_batch_predict_too_many_items(self, client, sample_prediction_data):
        """Test batch prediction with too many items."""
        batch_data = {
            'data': [sample_prediction_data] * 101  # Exceeds limit of 100
        }
        
        response = client.post('/batch_predict',
                             data=json.dumps(batch_data),
                             content_type='application/json')
        
        assert response.status_code == 400

class TestModelLoading:
    def test_model_initialization(self):
        """Test that the model initializes properly."""
        assert predictor is not None
        # Note: In a real test environment, you might want to mock the model loading
        # to avoid requiring actual model files during testing
