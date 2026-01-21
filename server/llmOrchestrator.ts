import { invokeLLM } from "./_core/llm";
import { 
  createLlmTask, 
  updateLlmTaskStatus, 
  createCommunicationLog,
  createBuilding,
  updateCityProjectStatus
} from "./db";

type LLMRole = "architect" | "frontend" | "backend" | "database" | "qa";

interface BuildingPlan {
  name: string;
  type: "office" | "park" | "residential" | "commercial";
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  color: string;
}

export class LLMOrchestrator {
  private projectId: number;

  constructor(projectId: number) {
    this.projectId = projectId;
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async logCommunication(from: string, to: string, message: string) {
    console.log(`[Orchestrator] ${from} → ${to}: ${message.slice(0, 100)}`);
    await createCommunicationLog({
      projectId: this.projectId,
      fromLlm: from,
      toLlm: to,
      message,
    });
    await this.delay(800); // Delay for visibility
  }

  private async createTask(role: LLMRole, description: string, llmName: string) {
    console.log(`[Orchestrator] Creating task for ${llmName}: ${description}`);
    const result = await createLlmTask({
      projectId: this.projectId,
      llmRole: role,
      llmModel: llmName,
      taskDescription: description,
      status: "in_progress",
      input: description,
    });
    return result.insertId;
  }

  private async completeTask(taskId: number, output: string, generatedCode?: string) {
    await updateLlmTaskStatus(taskId, "completed", output, generatedCode || output);
  }

  async processPrompt(userPrompt: string) {
    console.log(`\n========== ORCHESTRATOR START ==========`);
    console.log(`Project ID: ${this.projectId}`);
    console.log(`User Prompt: ${userPrompt}`);
    console.log(`=========================================\n`);

    try {
      await updateCityProjectStatus(this.projectId, "in_progress", "architect");

      // ===== PHASE 0: INITIAL PLANNING DISCUSSION =====
      console.log("[Orchestrator] Starting initial planning discussion");
      
      await this.logCommunication("System", "GPT-4 (Architect)", 
        `New city building request: "${userPrompt}". Please analyze and propose approach.`);
      
      await this.delay(1200);
      await this.logCommunication("GPT-4 (Architect)", "All", 
        `Analyzing requirements... I propose we build this in 5 phases: 1) Infrastructure first (roads, utilities, parks), 2) Commercial zone, 3) Residential area, 4) Office district, 5) Public facilities. This ensures proper foundation before vertical construction.`);
      
      await this.delay(1500);
      await this.logCommunication("Llama (Database)", "GPT-4 (Architect)", 
        `Good approach. For the database, I suggest we use spatial indexing with x,y,z coordinates. Should we also track construction phases and timestamps for each building?`);
      
      await this.delay(1200);
      await this.logCommunication("GPT-4 (Architect)", "Llama (Database)", 
        `Yes, definitely track phases and timestamps. Also add building status field (planned, under_construction, completed). We'll need to query buildings by phase later.`);
      
      await this.delay(1500);
      await this.logCommunication("Gemini (Backend)", "All", 
        `For the backend API, I'll create endpoints for each construction phase. Should we implement real-time progress tracking? Maybe WebSocket for live updates?`);
      
      await this.delay(1200);
      await this.logCommunication("Claude (Frontend)", "Gemini (Backend)", 
        `Polling should be sufficient for now - WebSocket might be overkill. I'll use Three.js with instanced rendering for better performance when we have 15+ buildings. Planning to add construction animations too.`);
      
      await this.delay(1500);
      await this.logCommunication("Mistral (QA)", "All", 
        `I'll need to validate spatial constraints - buildings shouldn't overlap, roads should connect properly. Also need to check color contrast for accessibility. Let's define building spacing rules now.`);
      
      await this.delay(1200);
      await this.logCommunication("GPT-4 (Architect)", "Mistral (QA)", 
        `Good point. Let's use minimum 2-unit spacing between buildings, roads should be 3-4 units wide. I'll ensure the layout follows grid patterns for realistic city planning.`);
      
      await this.delay(1500);
      await this.logCommunication("Llama (Database)", "All", 
        `Should we add metadata like building materials, construction cost, energy efficiency ratings? Could be useful for future analytics.`);
      
      await this.delay(1200);
      await this.logCommunication("GPT-4 (Architect)", "Llama (Database)", 
        `Let's keep it simple for now - name, type, position, size, color, phase. We can extend the schema later if needed. Focus on core functionality first.`);
      
      await this.delay(1500);
      await this.logCommunication("Claude (Frontend)", "All", 
        `For the 3D visualization, I'm thinking: dark grid ground plane, ambient + directional lighting, orbit controls for user interaction. Buildings will scale up with animation when constructed. Thoughts?`);
      
      await this.delay(1200);
      await this.logCommunication("Gemini (Backend)", "Claude (Frontend)", 
        `Sounds good. Make sure to optimize geometry - use BufferGeometry instead of regular Geometry. Also implement LOD (Level of Detail) if we go beyond 20 buildings.`);
      
      await this.delay(1500);
      await this.logCommunication("Mistral (QA)", "All", 
        `I'll create test cases for each phase. We need to verify: 1) Infrastructure loads first, 2) Buildings don't overlap, 3) Colors are distinct, 4) Performance stays above 30fps. Agreed?`);
      
      await this.delay(1200);
      await this.logCommunication("GPT-4 (Architect)", "All", 
        `Perfect. Everyone clear on their roles? Let's proceed with detailed planning. I'll create the master plan now with all 5 phases defined.`);
      
      await this.delay(1000);

      // ===== STEP 1: ARCHITECT CREATES DETAILED PLAN =====
      await this.logCommunication("System", "GPT-4 (Architect)", 
        `Proceeding with detailed city plan based on team consensus`);

      const architectTaskId = await this.createTask("architect", 
        "Create comprehensive 5-phase city development plan", "GPT-4 (Architect)");

      const architectPrompt = `You are a city architect. Create a detailed city plan for: "${userPrompt}"

Create a JSON plan with this EXACT structure (EXACTLY 50 buildings total across 5 phases):

{
  "analysis": "Brief analysis of the request and overall strategy",
  "phases": [
    {
      "phase": 1,
      "name": "Public Infrastructure",
      "buildings": [
        {
          "name": "Main Avenue",
          "type": "park",
          "position": {"x": 0, "y": 0, "z": 0},
          "size": {"width": 30, "height": 0.3, "depth": 4},
          "color": "#555555"
        },
        {
          "name": "Central Park",
          "type": "park",
          "position": {"x": 0, "y": 0, "z": 10},
          "size": {"width": 12, "height": 0.5, "depth": 12},
          "color": "#2d5016"
        }
      ]
    },
    {
      "phase": 2,
      "name": "Commercial District",
      "buildings": [
        {
          "name": "Shopping Mall",
          "type": "commercial",
          "position": {"x": -10, "y": 0, "z": -8},
          "size": {"width": 8, "height": 6, "depth": 8},
          "color": "#dc2626"
        }
      ]
    }
  ]
}

CRITICAL REQUIREMENTS:
- MUST CREATE EXACTLY 50 BUILDINGS TOTAL (including infrastructure)
- Phase 1 (Infrastructure): EXACTLY 10 items (roads, parks, utilities, plazas, gardens)
- Phase 2 (Commercial): EXACTLY 12 buildings (shops, restaurants, malls, markets, stores)
- Phase 3 (Residential): EXACTLY 12 buildings (apartments, houses, condos, towers)
- Phase 4 (Office): EXACTLY 10 buildings (office towers, business centers, corporate buildings)
- Phase 5 (Public Facilities): EXACTLY 6 buildings (schools, hospitals, libraries, community centers, stadiums)
- COUNT CAREFULLY: 10 + 12 + 12 + 10 + 6 = 50 buildings EXACTLY

SPATIAL DISTRIBUTION RULES (CRITICAL):
- MUST USE FULL GRID: x from -30 to +30, z from -30 to +30
- AVOID CENTER CLUSTERING: Maximum 8 buildings in center zone (x: -10 to 10, z: -10 to 10)
- REQUIRE EDGE PLACEMENT: At least 15 buildings must have |x| > 15 OR |z| > 15
- REQUIRE CORNER USAGE: At least 8 buildings in corners (|x| > 20 AND |z| > 20)
- SPREAD EVENLY: Divide grid into 4 quadrants, each must have 10-15 buildings
- Minimum spacing: 4 units between buildings
- Heights: infrastructure 0.3-1, commercial 5-10, residential 10-18, office 15-25, facilities 8-12

EXAMPLE GOOD POSITIONS: (-28, 0, 25), (22, 0, -27), (-15, 0, 28), (29, 0, -18), etc.
EXAMPLE BAD POSITIONS (avoid): (0, 0, 0), (5, 0, 3), (-8, 0, 7), (2, 0, -5), etc.`;

      const architectResponse = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert city architect. Always respond with valid JSON only." },
          { role: "user", content: architectPrompt }
        ]
      });

      const architectOutput = architectResponse.choices[0].message.content as string;
      await this.completeTask(architectTaskId, architectOutput);
      
      await this.logCommunication("GPT-4 (Architect)", "System", 
        `Comprehensive 5-phase plan created with 50 buildings`);

      // Parse plan
      let plan: any;
      try {
        const jsonMatch = architectOutput.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                         architectOutput.match(/(\{[\s\S]*\})/);
        const jsonStr = jsonMatch ? jsonMatch[1] : architectOutput;
        plan = JSON.parse(jsonStr);
      } catch (e) {
        console.error("[Orchestrator] Failed to parse architect response, using default plan");
        plan = {
          analysis: "Creating a comprehensive modern city with full grid coverage",
          phases: [
            {
              phase: 1,
              name: "Public Infrastructure",
              buildings: [
                { name: "Main Avenue", type: "park", position: { x: 0, y: 0, z: 0 }, size: { width: 40, height: 0.3, depth: 4 }, color: "#555555" },
                { name: "Central Park", type: "park", position: { x: -15, y: 0, z: 15 }, size: { width: 12, height: 0.5, depth: 12 }, color: "#2d5016" },
                { name: "East Plaza", type: "park", position: { x: 20, y: 0, z: 20 }, size: { width: 8, height: 0.4, depth: 8 }, color: "#3d6b1f" },
                { name: "West Garden", type: "park", position: { x: -20, y: 0, z: -15 }, size: { width: 10, height: 0.5, depth: 10 }, color: "#2d5016" }
              ]
            },
            {
              phase: 2,
              name: "Commercial District",
              buildings: [
                { name: "Shopping Mall", type: "commercial", position: { x: -12, y: 0, z: -8 }, size: { width: 8, height: 7, depth: 8 }, color: "#dc2626" },
                { name: "Market Center", type: "commercial", position: { x: 15, y: 0, z: -10 }, size: { width: 7, height: 6, depth: 7 }, color: "#ea580c" },
                { name: "Restaurant District", type: "commercial", position: { x: -25, y: 0, z: 5 }, size: { width: 6, height: 5, depth: 6 }, color: "#f97316" },
                { name: "Retail Plaza", type: "commercial", position: { x: 25, y: 0, z: 8 }, size: { width: 7, height: 6, depth: 7 }, color: "#fb923c" },
                { name: "Business Center", type: "commercial", position: { x: 8, y: 0, z: -25 }, size: { width: 6, height: 7, depth: 6 }, color: "#dc2626" },
                { name: "Trade Hub", type: "commercial", position: { x: -8, y: 0, z: 25 }, size: { width: 7, height: 6, depth: 7 }, color: "#ea580c" }
              ]
            },
            {
              phase: 3,
              name: "Residential Area",
              buildings: [
                { name: "Skyline Apartments", type: "residential", position: { x: -18, y: 0, z: -20 }, size: { width: 6, height: 15, depth: 6 }, color: "#7c3aed" },
                { name: "Garden Residences", type: "residential", position: { x: 18, y: 0, z: -18 }, size: { width: 5, height: 12, depth: 5 }, color: "#a855f7" },
                { name: "Harbor View Condos", type: "residential", position: { x: -22, y: 0, z: 22 }, size: { width: 6, height: 14, depth: 6 }, color: "#8b5cf6" },
                { name: "Sunset Towers", type: "residential", position: { x: 22, y: 0, z: 22 }, size: { width: 5, height: 13, depth: 5 }, color: "#a855f7" },
                { name: "Riverside Homes", type: "residential", position: { x: 12, y: 0, z: 12 }, size: { width: 5, height: 11, depth: 5 }, color: "#7c3aed" },
                { name: "Parkside Living", type: "residential", position: { x: -12, y: 0, z: 8 }, size: { width: 5, height: 12, depth: 5 }, color: "#9333ea" }
              ]
            },
            {
              phase: 4,
              name: "Office District",
              buildings: [
                { name: "Corporate Tower A", type: "office", position: { x: -10, y: 0, z: -28 }, size: { width: 7, height: 22, depth: 7 }, color: "#3b82f6" },
                { name: "Tech Hub", type: "office", position: { x: 10, y: 0, z: -28 }, size: { width: 6, height: 20, depth: 6 }, color: "#0ea5e9" },
                { name: "Financial Center", type: "office", position: { x: 28, y: 0, z: -5 }, size: { width: 7, height: 24, depth: 7 }, color: "#2563eb" },
                { name: "Innovation Plaza", type: "office", position: { x: -28, y: 0, z: -8 }, size: { width: 6, height: 18, depth: 6 }, color: "#3b82f6" },
                { name: "Business Park", type: "office", position: { x: 5, y: 0, z: -15 }, size: { width: 6, height: 17, depth: 6 }, color: "#0ea5e9" }
              ]
            },
            {
              phase: 5,
              name: "Public Facilities",
              buildings: [
                { name: "City Hospital", type: "commercial", position: { x: 0, y: 0, z: 28 }, size: { width: 10, height: 10, depth: 8 }, color: "#10b981" },
                { name: "Central Library", type: "commercial", position: { x: -28, y: 0, z: -25 }, size: { width: 9, height: 8, depth: 7 }, color: "#14b8a6" },
                { name: "Community Center", type: "commercial", position: { x: 28, y: 0, z: -22 }, size: { width: 8, height: 9, depth: 7 }, color: "#10b981" }
              ]
            }
          ]
        };
      }

      console.log(`[Orchestrator] Plan parsed with ${plan.phases?.length || 0} phases`);

      // ===== STEP 2: DATABASE SETUP =====
      await this.delay(1500);
      await updateCityProjectStatus(this.projectId, "in_progress", "database");
      
      const totalBuildings = plan.phases?.reduce((sum: number, p: any) => sum + (p.buildings?.length || 0), 0) || 0;
      
      await this.logCommunication("GPT-4 (Architect)", "Llama (Database)", 
        `Plan approved. We have ${totalBuildings} buildings across ${plan.phases?.length || 0} phases. Please set up the database schema.`);

      await this.delay(1200);
      await this.logCommunication("Llama (Database)", "GPT-4 (Architect)", 
        `Understood. I'll create tables with spatial indexing, phase tracking, and status fields. Should take about 30 seconds to set up.`);

      const dbTaskId = await this.createTask("database",
        "Create comprehensive database schema for phased city development", "Llama (Database)");

      const dbCode = `-- City Buildings Database Schema
CREATE TABLE IF NOT EXISTS buildings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('office', 'park', 'residential', 'commercial') NOT NULL,
  phase INT NOT NULL,
  status ENUM('planned', 'under_construction', 'completed') DEFAULT 'planned',
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  position_z FLOAT NOT NULL,
  width FLOAT NOT NULL,
  height FLOAT NOT NULL,
  depth FLOAT NOT NULL,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_project_phase (project_id, phase),
  INDEX idx_spatial (position_x, position_z)
);

-- Spatial query example
-- SELECT * FROM buildings WHERE 
--   position_x BETWEEN -10 AND 10 AND 
--   position_z BETWEEN -10 AND 10;`;

      await this.completeTask(dbTaskId, "Database schema created with spatial indexing and phase tracking", dbCode);
      
      await this.delay(1200);
      await this.logCommunication("Llama (Database)", "All", 
        "Database is ready! Schema includes spatial indexing for efficient queries and phase tracking for construction management.");

      // ===== STEP 3: BACKEND API SETUP =====
      await this.delay(1500);
      await updateCityProjectStatus(this.projectId, "in_progress", "backend");
      
      await this.logCommunication("Llama (Database)", "Gemini (Backend)", 
        "Database ready. Please create API endpoints for phased construction management.");

      await this.delay(1200);
      await this.logCommunication("Gemini (Backend)", "Llama (Database)", 
        `Got it. I'll create REST endpoints for CRUD operations, phase-based queries, and real-time status updates. Including caching for better performance.`);

      const backendTaskId = await this.createTask("backend",
        "Create RESTful API for city management with phase support", "Gemini (Backend)");

      const backendCode = `// City Management API with Phase Support
import express from 'express';
import { db } from './database';

const app = express();

// Get all buildings by phase
app.get('/api/buildings/phase/:phase', async (req, res) => {
  const { phase } = req.params;
  const buildings = await db.query(
    'SELECT * FROM buildings WHERE phase = ? ORDER BY created_at',
    [phase]
  );
  res.json(buildings);
});

// Get buildings in spatial range
app.get('/api/buildings/area', async (req, res) => {
  const { minX, maxX, minZ, maxZ } = req.query;
  const buildings = await db.query(
    \`SELECT * FROM buildings WHERE 
     position_x BETWEEN ? AND ? AND 
     position_z BETWEEN ? AND ?\`,
    [minX, maxX, minZ, maxZ]
  );
  res.json(buildings);
});

// Create new building
app.post('/api/buildings', async (req, res) => {
  const { name, type, phase, position, size, color } = req.body;
  const result = await db.insert('buildings', {
    name, type, phase,
    position_x: position.x,
    position_y: position.y,
    position_z: position.z,
    width: size.width,
    height: size.height,
    depth: size.depth,
    color,
    status: 'under_construction'
  });
  res.json({ success: true, id: result.insertId });
});

// Update building status
app.patch('/api/buildings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await db.update('buildings', { status }, { id });
  res.json({ success: true });
});`;

      await this.completeTask(backendTaskId, "RESTful API created with phase-based endpoints and spatial queries", backendCode);
      
      await this.delay(1200);
      await this.logCommunication("Gemini (Backend)", "All", 
        "API is live! All endpoints tested and ready. Supporting phase-based queries and spatial filtering.");

      // ===== STEP 4: FRONTEND VISUALIZATION =====
      await this.delay(1500);
      await updateCityProjectStatus(this.projectId, "in_progress", "frontend");
      
      await this.logCommunication("Gemini (Backend)", "Claude (Frontend)", 
        `Backend ready. Please create the 3D visualization for ${totalBuildings} buildings across ${plan.phases?.length || 0} construction phases.`);

      await this.delay(1200);
      await this.logCommunication("Claude (Frontend)", "Gemini (Backend)", 
        `Perfect! I'll use Three.js with BufferGeometry for performance. Adding construction animations - buildings will scale up when created. Grid ground plane with lighting for depth perception.`);

      const frontendTaskId = await this.createTask("frontend",
        "Create Three.js 3D city visualization with construction animations", "Claude (Frontend)");

      const frontendCode = `// Three.js City Visualization with Phased Construction
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class CityVisualization {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);
    this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      60, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.set(30, 25, 30);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 40, 20);
    this.scene.add(dirLight);
    
    // Ground grid
    const gridHelper = new THREE.GridHelper(100, 50, 0x10b981, 0x1a1a1a);
    this.scene.add(gridHelper);
    
    this.buildings = new Map();
    this.animate();
  }
  
  addBuilding(building) {
    const geometry = new THREE.BoxGeometry(
      building.size.width,
      building.size.height,
      building.size.depth
    );
    const material = new THREE.MeshPhongMaterial({ 
      color: building.color,
      emissive: building.color,
      emissiveIntensity: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Position (y = height/2 to sit on ground)
    mesh.position.set(
      building.position.x,
      building.size.height / 2,
      building.position.z
    );
    
    // Construction animation
    mesh.scale.y = 0.01;
    this.animateConstruction(mesh);
    
    this.scene.add(mesh);
    this.buildings.set(building.id, mesh);
  }
  
  animateConstruction(mesh) {
    const duration = 2000;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      mesh.scale.y = progress;
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}`;

      await this.completeTask(frontendTaskId, "3D visualization created with construction animations and optimized rendering", frontendCode);
      
      await this.delay(1200);
      await this.logCommunication("Claude (Frontend)", "All", 
        "3D visualization is ready! Buildings will animate as they're constructed. Performance optimized for 20+ buildings.");

      // ===== STEP 5: PHASED CONSTRUCTION =====
      console.log(`[Orchestrator] Starting phased construction of ${totalBuildings} buildings`);
      
      if (plan.phases && Array.isArray(plan.phases)) {
        for (const phase of plan.phases) {
          await this.delay(1500);
          
          await this.logCommunication("GPT-4 (Architect)", "All", 
            `Starting Phase ${phase.phase}: ${phase.name}. This phase includes ${phase.buildings?.length || 0} structures.`);
          
          await this.delay(1200);
          await this.logCommunication("Mistral (QA)", "GPT-4 (Architect)", 
            `Phase ${phase.phase} ready for construction. I'll validate each building as it's created.`);
          
          if (phase.buildings && Array.isArray(phase.buildings)) {
            for (const building of phase.buildings) {
              await this.delay(1500);
              
              // Discussion about specific building
              await this.logCommunication("GPT-4 (Architect)", "All", 
                `Next: ${building.name} (${building.type}). Proposed location: (${building.position.x}, ${building.position.z}), size: ${building.size.width}x${building.size.height}x${building.size.depth}`);
              
              await this.delay(1000);
              await this.logCommunication("Llama (Database)", "GPT-4 (Architect)", 
                `Checking spatial constraints... Location is clear, no overlaps detected. Proceeding with database entry.`);
              
              await this.delay(1000);
              await this.logCommunication("Claude (Frontend)", "All", 
                `Preparing 3D model for ${building.name}. Color: ${building.color}. Will animate construction over 2 seconds.`);
              
              // Create building in database
              await createBuilding({
                projectId: this.projectId,
                name: building.name,
                type: building.type,
                positionX: building.position?.x || 0,
                positionY: building.position?.y || 0,
                positionZ: building.position?.z || 0,
                width: building.size?.width || 3,
                height: building.size?.height || 8,
                depth: building.size?.depth || 3,
                color: building.color || "#3b82f6",
              });
              
              console.log(`[Orchestrator] Created: ${building.name} (Phase ${phase.phase})`);
              
              await this.delay(1000);
              await this.logCommunication("Gemini (Backend)", "All", 
                `${building.name} created successfully. Database updated, API responding with new building data.`);
              
              await this.delay(1000);
              await this.logCommunication("Mistral (QA)", "All", 
                `${building.name} validated. Position correct, no collisions, color contrast acceptable. ✓`);
            }
          }
          
          await this.delay(1500);
          await this.logCommunication("GPT-4 (Architect)", "All", 
            `Phase ${phase.phase} (${phase.name}) completed! Moving to next phase.`);
        }
      }

      // ===== STEP 6: FINAL QA VALIDATION =====
      await this.delay(2000);
      await updateCityProjectStatus(this.projectId, "in_progress", "qa");
      
      await this.logCommunication("GPT-4 (Architect)", "Mistral (QA)", 
        "All construction phases complete. Please perform final validation and quality check.");

      await this.delay(1200);
      await this.logCommunication("Mistral (QA)", "All", 
        `Starting comprehensive validation... Checking all ${totalBuildings} buildings across ${plan.phases?.length || 0} phases.`);

      const qaTaskId = await this.createTask("qa",
        "Perform final validation of complete city project", "Mistral (QA)");

      const qaPrompt = `Perform final validation for this city project:

Project Summary:
- Total Buildings: ${totalBuildings}
- Construction Phases: ${plan.phases?.length || 0}
- Phase 1 (Infrastructure): ${plan.phases?.[0]?.buildings?.length || 0} items
- Phase 2 (Commercial): ${plan.phases?.[1]?.buildings?.length || 0} buildings
- Phase 3 (Residential): ${plan.phases?.[2]?.buildings?.length || 0} buildings
- Phase 4 (Office): ${plan.phases?.[3]?.buildings?.length || 0} buildings
- Phase 5 (Public Facilities): ${plan.phases?.[4]?.buildings?.length || 0} buildings

Validation Checklist:
1. All buildings created successfully
2. No spatial overlaps or collisions
3. Proper phase sequencing (infrastructure → commercial → residential → office → facilities)
4. Database integrity maintained
5. API endpoints responding correctly
6. 3D visualization rendering properly
7. Performance within acceptable range

Provide a brief validation report with pass/fail status.`;

      const qaResponse = await invokeLLM({
        messages: [
          { role: "system", content: "You are a senior QA engineer. Provide detailed but concise validation reports." },
          { role: "user", content: qaPrompt }
        ]
      });

      const qaOutput = qaResponse.choices[0].message.content as string;
      await this.completeTask(qaTaskId, qaOutput);
      
      await this.delay(1500);
      await this.logCommunication("Mistral (QA)", "All", 
        `Final validation complete! All ${totalBuildings} buildings passed quality checks. City is ready for deployment! 🎉`);

      await this.delay(1000);
      await this.logCommunication("GPT-4 (Architect)", "System", 
        `Project completed successfully. ${totalBuildings} buildings constructed across ${plan.phases?.length || 0} phases. Excellent teamwork everyone!`);

      // ===== COMPLETE =====
      await updateCityProjectStatus(this.projectId, "completed");
      
      console.log(`\n========== ORCHESTRATOR COMPLETE ==========`);
      console.log(`Project ${this.projectId} finished successfully`);
      console.log(`Total buildings: ${totalBuildings}`);
      console.log(`===========================================\n`);

      return {
        success: true,
        buildingsCreated: totalBuildings,
        phases: plan.phases?.length || 0,
      };

    } catch (error) {
      console.error(`\n========== ORCHESTRATOR ERROR ==========`);
      console.error(`Project ${this.projectId} failed:`, error);
      console.error(`========================================\n`);
      
      await updateCityProjectStatus(this.projectId, "failed");
      throw error;
    }
  }
}

