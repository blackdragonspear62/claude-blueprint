# Python AI Services

Advanced Python modules for AI-driven city generation, analytics, and optimization.

## Modules

### 🤖 ai_city_generator.py
Intelligent city layout generation using advanced spatial algorithms:
- **Poisson Disk Sampling** - Even spatial distribution
- **Simulated Annealing** - Layout optimization
- **Spatial Analysis** - Coverage and density calculations

### 📊 city_analytics.py
Comprehensive city performance analytics:
- **Performance Scoring** - Multi-dimensional city evaluation
- **Density Heatmaps** - Visual density analysis
- **Population Estimation** - AI-based population modeling
- **Sustainability Metrics** - Green space and infrastructure analysis

### 🌐 api_service.py
Flask-based microservice API:
- `/api/generate-positions` - Generate optimal building positions
- `/api/analyze-city` - Comprehensive city analysis
- `/api/optimize-layout` - Layout optimization
- `/api/generate-heatmap` - Density heatmap generation

## Installation

```bash
cd python
pip install -r requirements.txt
```

## Usage

### Standalone Scripts

```python
from ai_city_generator import CityGenerator

# Generate city layout
generator = CityGenerator(grid_size=60, building_count=50)
positions = generator.generate_spatial_distribution()
```

```python
from city_analytics import CityAnalytics

# Analyze city performance
analytics = CityAnalytics()
performance = analytics.analyze_city_performance(city_data)
print(f"Overall Score: {performance['overall_score']:.2f}/100")
```

### API Service

Start the Flask microservice:

```bash
python api_service.py
```

The service will be available at `http://localhost:5000`

## API Endpoints

### Generate Positions
```bash
POST /api/generate-positions
Content-Type: application/json

{
  "grid_size": 60,
  "building_count": 50
}
```

### Analyze City
```bash
POST /api/analyze-city
Content-Type: application/json

{
  "buildings": [...]
}
```

### Optimize Layout
```bash
POST /api/optimize-layout
Content-Type: application/json

{
  "buildings": [...]
}
```

## Architecture

The Python services complement the Node.js backend by handling:
- Compute-intensive spatial algorithms
- Advanced analytics and machine learning
- Scientific computing with NumPy/SciPy
- Data analysis with Pandas

This hybrid architecture leverages the strengths of both ecosystems for optimal performance.

## Dependencies

- **NumPy** - Numerical computing
- **Pandas** - Data analysis
- **SciPy** - Scientific computing
- **Flask** - Web framework
- **Scikit-learn** - Machine learning utilities
