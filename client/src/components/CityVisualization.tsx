import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { trpc } from "@/lib/trpc";

interface CityVisualizationProps {
  projectId?: number;
}

export default function CityVisualization({ projectId }: CityVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const buildingsRef = useRef<Map<number, THREE.Mesh>>(new Map());

  // Fetch real-time buildings data
  const { data: buildings, refetch } = trpc.city.getBuildings.useQuery(
    { projectId: projectId! },
    { 
      enabled: !!projectId,
      refetchInterval: 5000, // Poll every 2 seconds
    }
  );

  // Auto-refresh when projectId changes
  useEffect(() => {
    if (projectId) {
      refetch();
    }
  }, [projectId, refetch]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(50, 40, 50);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 10;
    controls.maxDistance = 150;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 40, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -80;
    directionalLight.shadow.camera.right = 80;
    directionalLight.shadow.camera.top = 80;
    directionalLight.shadow.camera.bottom = -80;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(150, 150);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid
    const gridHelper = new THREE.GridHelper(150, 75, 0x10b981, 0x10b981);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update buildings in real-time
  useEffect(() => {
    if (!sceneRef.current || !buildings) return;

    const scene = sceneRef.current;
    const existingBuildings = buildingsRef.current;

    // Add or update buildings
    buildings.forEach((building) => {
      if (!existingBuildings.has(building.id)) {
        // Create new building
        const height = building.height || 10;
        const width = building.width || 3;
        const depth = building.depth || 3;

        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(building.color || "#10b981"),
          roughness: 0.7,
          metalness: 0.3,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          building.positionX || 0,
          height / 2,
          building.positionZ || 0
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add(mesh);
        existingBuildings.set(building.id, mesh);

        // Animate building appearance
        mesh.scale.set(0.1, 0.1, 0.1);
        const targetScale = new THREE.Vector3(1, 1, 1);
        const animateScale = () => {
          mesh.scale.lerp(targetScale, 0.1);
          if (mesh.scale.distanceTo(targetScale) > 0.01) {
            requestAnimationFrame(animateScale);
          }
        };
        animateScale();
      }
    });

    // Remove buildings that no longer exist
    existingBuildings.forEach((mesh, id) => {
      if (!buildings.find(b => b.id === id)) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        existingBuildings.delete(id);
      }
    });
  }, [buildings]);

  return <div ref={containerRef} className="w-full h-full" />;
}

