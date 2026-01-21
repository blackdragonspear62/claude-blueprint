"""
City Analytics Module
Advanced analytics and visualization for city metrics
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
from datetime import datetime
import json


class CityAnalytics:
    """
    Comprehensive analytics engine for city performance metrics
    """
    
    def __init__(self):
        self.metrics_history = []
        self.building_data = pd.DataFrame()
        
    def analyze_city_performance(self, city_data: Dict) -> Dict:
        """
        Analyze overall city performance across multiple dimensions
        """
        buildings = city_data.get('buildings', [])
        
        performance = {
            'efficiency_score': self._calculate_efficiency(buildings),
            'density_score': self._calculate_density(buildings),
            'distribution_score': self._calculate_distribution(buildings),
            'diversity_score': self._calculate_diversity(buildings),
            'sustainability_score': self._calculate_sustainability(buildings),
            'overall_score': 0.0,
            'timestamp': datetime.now().isoformat()
        }
        
        # Calculate weighted overall score
        weights = {
            'efficiency': 0.25,
            'density': 0.20,
            'distribution': 0.25,
            'diversity': 0.15,
            'sustainability': 0.15
        }
        
        performance['overall_score'] = sum(
            performance[f'{key}_score'] * weight 
            for key, weight in weights.items()
        )
        
        return performance
    
    def _calculate_efficiency(self, buildings: List[Dict]) -> float:
        """Calculate city efficiency based on building placement and connectivity"""
        if not buildings:
            return 0.0
        
        # Calculate average distance between buildings
        positions = np.array([[b['position'][0], b['position'][2]] for b in buildings])
        distances = []
        
        for i in range(len(positions)):
            for j in range(i + 1, len(positions)):
                dist = np.linalg.norm(positions[i] - positions[j])
                distances.append(dist)
        
        avg_distance = np.mean(distances) if distances else 0
        
        # Optimal distance is around 8-12 units
        optimal_distance = 10.0
        efficiency = max(0, 100 - abs(avg_distance - optimal_distance) * 5)
        
        return min(efficiency, 100.0)
    
    def _calculate_density(self, buildings: List[Dict]) -> float:
        """Calculate city density score"""
        if not buildings:
            return 0.0
        
        grid_size = 60
        total_area = grid_size ** 2
        
        # Calculate occupied area
        occupied_area = sum(
            b['size'][0] * b['size'][2] 
            for b in buildings
        )
        
        density_ratio = occupied_area / total_area
        
        # Optimal density is 15-25%
        if 0.15 <= density_ratio <= 0.25:
            return 100.0
        elif density_ratio < 0.15:
            return (density_ratio / 0.15) * 100
        else:
            return max(0, 100 - (density_ratio - 0.25) * 200)
    
    def _calculate_distribution(self, buildings: List[Dict]) -> float:
        """Calculate spatial distribution score"""
        if len(buildings) < 4:
            return 0.0
        
        positions = np.array([[b['position'][0], b['position'][2]] for b in buildings])
        
        # Divide grid into quadrants
        quadrants = [0, 0, 0, 0]
        for pos in positions:
            if pos[0] >= 0 and pos[1] >= 0:
                quadrants[0] += 1
            elif pos[0] < 0 and pos[1] >= 0:
                quadrants[1] += 1
            elif pos[0] < 0 and pos[1] < 0:
                quadrants[2] += 1
            else:
                quadrants[3] += 1
        
        # Calculate standard deviation (lower is better)
        std_dev = np.std(quadrants)
        max_std = len(buildings) / 4
        
        distribution_score = max(0, 100 - (std_dev / max_std) * 100)
        return distribution_score
    
    def _calculate_diversity(self, buildings: List[Dict]) -> float:
        """Calculate building type diversity score"""
        if not buildings:
            return 0.0
        
        types = [b['type'] for b in buildings]
        type_counts = pd.Series(types).value_counts()
        
        # Calculate Shannon diversity index
        proportions = type_counts / len(types)
        shannon_index = -sum(p * np.log(p) for p in proportions if p > 0)
        
        # Normalize to 0-100 scale
        max_diversity = np.log(5)  # 5 building types
        diversity_score = (shannon_index / max_diversity) * 100
        
        return diversity_score
    
    def _calculate_sustainability(self, buildings: List[Dict]) -> float:
        """Calculate sustainability score based on green spaces and infrastructure"""
        if not buildings:
            return 0.0
        
        infrastructure_count = sum(1 for b in buildings if b['type'] == 'infrastructure')
        public_count = sum(1 for b in buildings if b['type'] == 'public')
        
        total_buildings = len(buildings)
        
        # Ideal ratio: 20% infrastructure, 12% public
        infra_ratio = infrastructure_count / total_buildings
        public_ratio = public_count / total_buildings
        
        infra_score = min(100, (infra_ratio / 0.20) * 100) if infra_ratio <= 0.20 else max(0, 100 - (infra_ratio - 0.20) * 200)
        public_score = min(100, (public_ratio / 0.12) * 100) if public_ratio <= 0.12 else max(0, 100 - (public_ratio - 0.12) * 200)
        
        sustainability = (infra_score + public_score) / 2
        return sustainability
    
    def generate_heatmap_data(self, buildings: List[Dict], resolution: int = 20) -> np.ndarray:
        """
        Generate density heatmap data for visualization
        """
        grid_size = 60
        heatmap = np.zeros((resolution, resolution))
        
        cell_size = grid_size / resolution
        
        for building in buildings:
            x, z = building['position'][0], building['position'][2]
            
            # Convert to grid coordinates
            grid_x = int((x + grid_size/2) / cell_size)
            grid_z = int((z + grid_size/2) / cell_size)
            
            # Clamp to grid bounds
            grid_x = max(0, min(resolution - 1, grid_x))
            grid_z = max(0, min(resolution - 1, grid_z))
            
            # Increment density
            heatmap[grid_z, grid_x] += 1
            
            # Apply Gaussian blur effect
            for dx in range(-1, 2):
                for dz in range(-1, 2):
                    nx, nz = grid_x + dx, grid_z + dz
                    if 0 <= nx < resolution and 0 <= nz < resolution:
                        distance = np.sqrt(dx**2 + dz**2)
                        if distance > 0:
                            heatmap[nz, nx] += 0.5 / distance
        
        return heatmap
    
    def export_analytics_report(self, performance: Dict, filename: str = "analytics_report.json"):
        """Export analytics report to JSON"""
        with open(filename, 'w') as f:
            json.dump(performance, f, indent=2)
        
        print(f"Analytics report exported to {filename}")
        print(f"Overall Score: {performance['overall_score']:.2f}/100")
        print(f"Efficiency: {performance['efficiency_score']:.2f}/100")
        print(f"Distribution: {performance['distribution_score']:.2f}/100")
        print(f"Diversity: {performance['diversity_score']:.2f}/100")


def calculate_population_estimate(buildings: List[Dict]) -> int:
    """
    Estimate city population based on residential and commercial buildings
    """
    population = 0
    
    for building in buildings:
        if building['type'] == 'residential':
            # Average 50-100 residents per residential building
            population += np.random.randint(50, 100)
        elif building['type'] == 'commercial':
            # Average 20-40 workers per commercial building
            population += np.random.randint(20, 40)
        elif building['type'] == 'office':
            # Average 100-200 workers per office building
            population += np.random.randint(100, 200)
    
    return population


if __name__ == "__main__":
    # Example usage
    analytics = CityAnalytics()
    print("City Analytics Module initialized")
    print("Ready to analyze city performance metrics")
