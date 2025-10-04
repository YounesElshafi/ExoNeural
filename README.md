# ExoNeural

> Advanced AI-powered exoplanet detection system using machine learning to analyze light curves and identify potential worlds beyond our solar system.

[![NASA Space Apps Challenge 2025](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge%202025-blue)](https://www.spaceappschallenge.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-green)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI/CD](https://github.com/yourusername/ExoNeural/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/ExoNeural/actions/workflows/ci.yml)

---

## 🌍 Live Demo
🔗 [Try ExoNeural Online](https://exoneuralapp2.netlify.app/)

![ExoNeural Demo](Gif/Gif.gif)

---


## 🌟 Features

- **AI-Powered Detection**: Advanced machine learning models (LightGBM, XGBoost, Random Forest) for exoplanet classification
- **Interactive Galaxy Map**: 3D visualization of discovered exoplanets with real-time filtering
- **Comprehensive Analysis**: Detailed planetary characteristics and confidence scoring
- **Batch Processing**: Support for CSV uploads and bulk predictions
- **Modern UI**: Beautiful, responsive interface with space-themed animations
- **Real-time Results**: Instant predictions with probability distributions
- **Security**: Rate limiting, input validation, and CORS protection
- **Performance**: Code splitting, lazy loading, and optimized builds
- **Testing**: Comprehensive test coverage for both frontend and backend
- **Docker**: Containerized deployment with Docker Compose

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Git**
- **Docker** (optional, for containerized deployment)

### Installation

#### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YounesElshafi/ExoNeural.git
   cd ExoNeural
   ```

2. **Backend Setup**
   ```bash
   cd web/backend
   cp env.example .env
   # Edit .env with your configuration
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd web/exoneural
   cp env.example .env
   # Edit .env with your configuration
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

#### Option 2: Docker Deployment

1. **Clone and setup**
   ```bash
   git clone https://github.com/YounesElshafi/ExoNeural.git
   cd ExoNeural
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the Application**
   - Application: http://localhost:80
   - API: http://localhost:5000

## 📁 Project Structure

```
ExoNeural/
├── 📊 Data/                    # Raw datasets (Kepler, TESS, K2)
├── 📓 Notebook/               # Jupyter notebooks and trained models
│   ├── ExoNeural.ipynb        # Main analysis notebook
│   ├── advanced.ipynb         # Advanced model training
│   └── *.pkl, *.pt, *.pth     # Trained model files
├── 🌐 web/
│   ├── 🔧 backend/            # Flask API server
│   │   ├── app.py             # Main Flask application
│   │   ├── requirements.txt   # Python dependencies
│   │   ├── Dockerfile         # Backend container
│   │   ├── tests/             # Backend tests
│   │   └── *.pkl             # Model files for API
│   └── 🎨 exoneural/          # React frontend application
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── test/         # Frontend tests
│       │   ├── App.tsx        # Main application
│       │   └── main.tsx       # Application entry point
│       ├── public/            # Static assets
│       ├── Dockerfile         # Frontend container
│       └── package.json       # Node.js dependencies
├── 🐳 docker-compose.yml      # Container orchestration
├── 🔧 nginx.conf              # Reverse proxy configuration
├── 🧪 .github/workflows/      # CI/CD pipelines
└── 📖 README.md               # This file
```

## 🛠️ System Requirements

### Backend Requirements
- **Python**: 3.8 or higher
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Storage**: 2GB free space for models and data

### Frontend Requirements
- **Node.js**: 18 or higher
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+
- **Memory**: 2GB RAM minimum

### Dependencies

#### Backend Dependencies
```
Flask==2.3.3
Flask-CORS==4.0.0
Flask-Limiter==3.5.0
Flask-JWT-Extended==4.6.0
marshmallow==3.20.1
python-dotenv==1.0.0
numpy==1.24.3
pandas==1.5.3
scikit-learn==1.3.0
lightgbm==4.0.0
joblib==1.3.0
gunicorn==21.2.0
```

#### Frontend Dependencies
```
React 19.1.1
TypeScript 5.8.3
Vite 7.1.7
Tailwind CSS 3.4.14
Framer Motion 12.23.22
Three.js 0.159.0
Axios 1.12.2
```

## 🚀 Usage

### 1. **Single Prediction**
1. Navigate to the Detection tab
2. Enter planetary parameters manually or use presets
3. Click "Predict Exoplanet" to get AI classification
4. View results with confidence scores and probabilities

### 2. **Batch Processing**
1. Prepare CSV file with required columns
2. Select "Batch Upload (CSV)" option
3. Upload your file for bulk analysis
4. Download results for further analysis

### 3. **Galaxy Map Visualization**
1. After making predictions, navigate to Galaxy Map
2. Explore discovered exoplanets in 3D space
3. Filter by classification type
4. Click planets for detailed information

### 4. **Analysis Dashboard**
1. Access the Analysis tab for comprehensive statistics
2. View discovery progress and success rates
3. Export data for research purposes

## 🔧 Development

### Running in Development Mode

#### Backend Development
```bash
cd web/backend
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

#### Frontend Development
```bash
cd web/exoneural
npm run dev
```

### Building for Production

#### Frontend Build
```bash
cd web/exoneural
npm run build
```

#### Backend Deployment
```bash
cd web/backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables

Create `.env` files in respective directories:

#### Backend (.env)
```bash
FLASK_ENV=production
FLASK_DEBUG=False
API_HOST=0.0.0.0
API_PORT=5000
CORS_ORIGINS=https://yourdomain.com
MODEL_PATH=./exoplanet_model_multiclass.pkl
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
```

#### Frontend (.env)
```bash
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=ExoNeural
```

## 🧪 Testing

### Frontend Testing
```bash
cd web/exoneural
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage
npm run test:ui       # Run tests with UI
```

### Backend Testing
```bash
cd web/backend
pip install -r test_requirements.txt
pytest                # Run all tests
pytest --cov=app     # Run with coverage
pytest -v            # Verbose output
```

### Integration Testing
```bash
# Start services
docker-compose up -d

# Run integration tests
curl -f http://localhost:5000/  # Test backend
curl -f http://localhost:80/    # Test frontend

# Stop services
docker-compose down
```

## 📊 API Documentation

### Endpoints

#### Health Check
```http
GET /
```
Returns API status and model loading information.

#### Single Prediction
```http
POST /predict
Content-Type: application/json

{
  "koi_period": 41.749,
  "koi_prad": 2.94,
  "koi_sma": 0.228,
  // ... 25 required parameters
}
```

#### Batch Prediction
```http
POST /batch_predict
Content-Type: application/json

{
  "data": [
    {
      "koi_period": 41.749,
      // ... parameters for first planet
    },
    {
      "koi_period": 8.293,
      // ... parameters for second planet
    }
  ]
}
```

### Response Format
```json
{
  "prediction": "Confirmed Exoplanet",
  "confidence": 0.9234,
  "probabilities": {
    "false_positive": 0.0234,
    "candidate": 0.0532,
    "confirmed": 0.9234
  },
  "status": "success",
  "model_version": "ExoNeural-v2.0",
  "timestamp": "2025-01-27T10:30:00Z"
}
```

## 🔒 Security Features

- **Rate Limiting**: 10 requests per minute for predictions
- **Input Validation**: Comprehensive validation using Marshmallow schemas
- **CORS Protection**: Configurable CORS origins for production
- **Error Handling**: Secure error messages without sensitive information
- **Environment Configuration**: Secure handling of secrets and configuration

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of heavy components
- **Bundle Optimization**: Manual chunk splitting for better caching
- **Error Boundaries**: Graceful error handling and recovery
- **Caching**: Optimized static asset caching
- **Compression**: Gzip compression for all text assets

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`**
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting
- Use conventional commit messages

### Code Quality

- **Linting**: ESLint for frontend, Flake8 for backend
- **Type Checking**: TypeScript for frontend, type hints for backend
- **Testing**: Comprehensive test coverage required
- **Security**: All security best practices followed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**ExoNeural Team - NASA Space Apps Challenge 2025**

- **Data Scientists**: Model development and training
- **Frontend Developers**: React application and UI/UX
- **Backend Developers**: Flask API and ML pipeline
- **DevOps Engineers**: Deployment and infrastructure

## 🙏 Acknowledgments

- **NASA** for providing the Kepler and TESS datasets
- **Space Apps Challenge** for the platform and community
- **Open Source Community** for the amazing tools and libraries
- **Exoplanet Archive** for the comprehensive planetary data

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YounesElshafi/ExoNeural/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YounesElshafi/ExoNeural/discussions)
- **Email**: contact@exoneural.space

## 🔮 Future Roadmap

- [ ] **Real-time Data Integration**: Connect to live telescope feeds
- [ ] **Advanced Visualization**: VR/AR support for galaxy exploration
- [ ] **Mobile Application**: Native iOS/Android apps
- [ ] **Collaborative Features**: Multi-user research sessions
- [ ] **API Marketplace**: Third-party integrations and extensions
- [ ] **Machine Learning Pipeline**: Automated model retraining
- [ ] **Data Export**: Advanced data export and visualization tools

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   ML Models     │
│   (React)       │◄──►│   (Flask)       │◄──►│   (LightGBM)    │
│   Port: 5173    │    │   Port: 5000    │    │   Local Files   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Docker        │    │   Data Storage  │
│   (Reverse      │    │   (Containers)  │    │   (CSV/Models)  │
│    Proxy)       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Input** → Frontend validation
2. **API Request** → Backend with rate limiting
3. **Data Validation** → Marshmallow schema validation
4. **ML Prediction** → LightGBM model inference
5. **Response** → Formatted JSON with probabilities
6. **Visualization** → 3D galaxy map and charts

---

**Built with ❤️ for the NASA Space Apps Challenge 2025**

*Advancing the search for worlds beyond our solar system through artificial intelligence.*