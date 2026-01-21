"""
AI City Generation Module
Handles intelligent city layout generation and spatial optimization
"""

import numpy as np
from typing import List, Dict, Tuple
from dataclasses import dataclass
import json


@dataclass
class Building:
    """Represents a building in the city"""
    id: str
    name: str
    type: str
    position: Tuple[float, float, float]
    size: Tuple[float, float, float]
    color: str
    phase: int


class CityGenerator:
    """
    Advanced city generation using spatial algorithms and AI-driven placement
    """
    
    def __init__(self, grid_size: int = 60, building_count: int = 50):
        self.grid_size = grid_size
        self.building_count = building_count
        self.buildings: List[Building] = []
        self.occupied_positions = set()
        
    def generate_spatial_distribution(self) -> np.ndarray:
        """
        Generate optimal spatial distribution using Poisson disk sampling
        for even building placement across the city grid
        """
        positions = []
        min_distance = 4.0
        max_attempts = 30
        
        while len(positions) < self.building_count:
            for _ in range(max_attempts):
                x = np.random.uniform(-self.grid_size/2, self.grid_size/2)
                z = np.random.uniform(-self.grid_size/2, self.grid_size/2)
                
                # Check minimum distance from existing buildings
                if self._is_valid_position(x, z, positions, min_distance):
                    positions.append((x, z))
                    break
        
        return np.array(positions)
    
    def _is_valid_position(self, x: float, z: float, 
                          existing: List[Tuple], min_dist: float) -> bool:
        """Check if position maintains minimum distance from existing buildings"""
        for ex, ez in existing:
            dist = np.sqrt((x - ex)**2 + (z - ez)**2)
            if dist < min_dist:
                return False
        return True
    
    def calculate_building_metrics(self, buildings: List[Building]) -> Dict:
        """
        Calculate city statistics and metrics
        """
        metrics = {
            'total_buildings': len(buildings),
            'infrastructure_count': sum(1 for b in buildings if b.type == 'infrastructure'),
            'commercial_count': sum(1 for b in buildings if b.type == 'commercial'),
            'residential_count': sum(1 for b in buildings if b.type == 'residential'),
            'office_count': sum(1 for b in buildings if b.type == 'office'),
            'public_count': sum(1 for b in buildings if b.type == 'public'),
            'average_building_size': np.mean([b.size[1] for b in buildings]),
            'city_density': len(buildings) / (self.grid_size ** 2),
            'spatial_coverage': self._calculate_coverage(buildings)
        }
        return metrics
    
    def _calculate_coverage(self, buildings: List[Building]) -> float:
        """Calculate percentage of grid covered by buildings"""
        if not buildings:
            return 0.0
        
        positions = np.array([(b.position[0], b.position[2]) for b in buildings])
        
        # Calculate convex hull area
        from scipy.spatial import ConvexHull
        try:
            hull = ConvexHull(positions)
            coverage = hull.volume / (self.grid_size ** 2)
            return min(coverage * 100, 100.0)
        except:
            return 0.0
    
    def optimize_layout(self, buildings: List[Building]) -> List[Building]:
        """
        Optimize building layout using simulated annealing
        to improve spatial distribution and aesthetics
        """
        # Simulated annealing parameters
        temperature = 100.0
        cooling_rate = 0.95
        min_temperature = 0.1
        
        current_energy = self._calculate_layout_energy(buildings)
        best_buildings = buildings.copy()
        best_energy = current_energy
        
        while temperature > min_temperature:
            # Generate neighbor solution
            new_buildings = self._perturb_layout(buildings)
            new_energy = self._calculate_layout_energy(new_buildings)
            
            # Accept or reject new solution
            delta_energy = new_energy - current_energy
            if delta_energy < 0 or np.random.random() < np.exp(-delta_energy / temperature):
                buildings = new_buildings
                current_energy = new_energy
                
                if current_energy < best_energy:
                    best_buildings = buildings.copy()
                    best_energy = current_energy
            
            temperature *= cooling_rate
        
        return best_buildings
    
    def _calculate_layout_energy(self, buildings: List[Building]) -> float:
        """Calculate energy function for layout optimization"""
        energy = 0.0
        
        # Penalty for clustering
        for i, b1 in enumerate(buildings):
            for b2 in buildings[i+1:]:
                dist = np.sqrt(
                    (b1.position[0] - b2.position[0])**2 + 
                    (b1.position[2] - b2.position[2])**2
                )
                if dist < 5.0:
                    energy += (5.0 - dist) ** 2
        
        # Reward for even distribution
        positions = np.array([(b.position[0], b.position[2]) for b in buildings])
        center = np.mean(positions, axis=0)
        distances = np.sqrt(np.sum((positions - center)**2, axis=1))
        energy -= np.std(distances) * 10
        
        return energy
    
    def _perturb_layout(self, buildings: List[Building]) -> List[Building]:
        """Slightly modify building positions for optimization"""
        new_buildings = buildings.copy()
        idx = np.random.randint(0, len(new_buildings))
        building = new_buildings[idx]
        
        # Small random displacement
        dx = np.random.normal(0, 2.0)
        dz = np.random.normal(0, 2.0)
        
        new_x = np.clip(building.position[0] + dx, -self.grid_size/2, self.grid_size/2)
        new_z = np.clip(building.position[2] + dz, -self.grid_size/2, self.grid_size/2)
        
        new_buildings[idx] = Building(
            id=building.id,
            name=building.name,
            type=building.type,
            position=(new_x, building.position[1], new_z),
            size=building.size,
            color=building.color,
            phase=building.phase
        )
        
        return new_buildings


def export_city_data(buildings: List[Building], filename: str = "city_export.json"):
    """Export city data to JSON format"""
    data = {
        'buildings': [
            {
                'id': b.id,
                'name': b.name,
                'type': b.type,
                'position': b.position,
                'size': b.size,
                'color': b.color,
                'phase': b.phase
            }
            for b in buildings
        ]
    }
    
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    # Example usage
    generator = CityGenerator(grid_size=60, building_count=50)
    positions = generator.generate_spatial_distribution()
    print(f"Generated {len(positions)} building positions")
    print(f"Spatial distribution complete")
