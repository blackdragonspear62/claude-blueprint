"""
Python API Service
Microservice for handling compute-intensive city generation tasks
"""

from flask import Flask, request, jsonify
from ai_city_generator import CityGenerator, Building
from city_analytics import CityAnalytics, calculate_population_estimate
import json
from typing import Dict, List

app = Flask(__name__)

# Initialize services
city_generator = CityGenerator()
analytics = CityAnalytics()


@app.route('/api/generate-positions', methods=['POST'])
def generate_positions():
    """
    Generate optimal building positions using Poisson disk sampling
    """
    try:
        data = request.json
        grid_size = data.get('grid_size', 60)
        building_count = data.get('building_count', 50)
        
        generator = CityGenerator(grid_size=grid_size, building_count=building_count)
        positions = generator.generate_spatial_distribution()
        
        return jsonify({
            'success': True,
            'positions': positions.tolist(),
            'count': len(positions)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/analyze-city', methods=['POST'])
def analyze_city():
    """
    Analyze city performance and return comprehensive metrics
    """
    try:
        city_data = request.json
        performance = analytics.analyze_city_performance(city_data)
        
        # Calculate additional metrics
        buildings = city_data.get('buildings', [])
        population = calculate_population_estimate(buildings)
        
        performance['estimated_population'] = population
        performance['building_count'] = len(buildings)
        
        return jsonify({
            'success': True,
            'performance': performance
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/optimize-layout', methods=['POST'])
def optimize_layout():
    """
    Optimize building layout using simulated annealing
    """
    try:
        data = request.json
        buildings_data = data.get('buildings', [])
        
        # Convert to Building objects
        buildings = [
            Building(
                id=b['id'],
                name=b['name'],
                type=b['type'],
                position=tuple(b['position']),
                size=tuple(b['size']),
                color=b['color'],
                phase=b['phase']
            )
            for b in buildings_data
        ]
        
        # Optimize layout
        optimized = city_generator.optimize_layout(buildings)
        
        # Convert back to dict
        optimized_data = [
            {
                'id': b.id,
                'name': b.name,
                'type': b.type,
                'position': list(b.position),
                'size': list(b.size),
                'color': b.color,
                'phase': b.phase
            }
            for b in optimized
        ]
        
        return jsonify({
            'success': True,
            'buildings': optimized_data
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/generate-heatmap', methods=['POST'])
def generate_heatmap():
    """
    Generate density heatmap data for visualization
    """
    try:
        data = request.json
        buildings = data.get('buildings', [])
        resolution = data.get('resolution', 20)
        
        heatmap = analytics.generate_heatmap_data(buildings, resolution)
        
        return jsonify({
            'success': True,
            'heatmap': heatmap.tolist(),
            'resolution': resolution
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Python AI City Service',
        'version': '1.0.0'
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
