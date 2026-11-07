import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gamification } from '@/lib/gamification';
import {
  GALAXY_CLUSTERS,
  ALL_UNIVERSE_TECHS,
} from './UniverseData';

interface Node3DData {
  id: string;
  name: string;
  type: 'center' | 'category' | 'technology';
  category?: string;
  categoryId?: string;
  priority?: number;
  priorityLabel?: string;
  role?: string;
  status?: string;
  color: string;
  colorHex: number;
  relatedTechIds?: string[];
  mesh: THREE.Mesh;
  position: THREE.Vector3;
}

interface ProjectedCategoryBadge {
  id: string;
  priority: number;
  title: string;
  color: string;
  x: number;
  y: number;
  visible: boolean;
}

interface ActiveTechTooltip {
  id: string;
  name: string;
  role?: string;
  category?: string;
  color: string;
  x: number;
  y: number;
  placement: 'placement-top' | 'placement-bottom';
}

interface GalaxyLineItem {
  line: THREE.Line;
  mat: THREE.LineBasicMaterial;
  baseColor: number;
  baseOpacity: number;
  sourceId: string;
  targetId: string;
  categoryId: string;
}

function SearchIcon() {
  return (
    <svg
      className="universe-search-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        width: '14px',
        height: '14px',
        minWidth: '14px',
        minHeight: '14px',
        maxWidth: '14px',
        maxHeight: '14px',
        flexShrink: 0,
      }}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  );
}

export function UniverseScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // State
  const [selectedNode, setSelectedNode] = useState<Node3DData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node3DData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAutoExploring, setIsAutoExploring] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [projectedCategories, setProjectedCategories] = useState<ProjectedCategoryBadge[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<ActiveTechTooltip | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Imperative action refs
  const focusNodeRef = useRef<((nodeId: string) => void) | null>(null);
  const focusCategoryRef = useRef<((catId: string) => void) | null>(null);
  const resetViewRef = useRef<(() => void) | null>(null);

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_UNIVERSE_TECHS.filter(
      (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  // Three.js Mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. WebGL Support Test
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // 2. Setup Three.js Scene & Camera (Framed for 65–80% canvas occupancy)
    const width = container.clientWidth;
    const height = container.clientHeight || 640;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e0e);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    const defaultCameraPos = new THREE.Vector3(0, 0, 22.5);
    const defaultLookAt = new THREE.Vector3(0, 0, 0);

    const targetCameraPos = defaultCameraPos.clone();
    const currentLookAt = defaultLookAt.clone();
    const targetLookAt = defaultLookAt.clone();

    camera.position.copy(defaultCameraPos);
    camera.lookAt(currentLookAt);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 3. Ambient & Key Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const redCoreLight = new THREE.PointLight(0xe50914, 2.8, 35);
    redCoreLight.position.set(0, 0, 0);
    scene.add(redCoreLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    topKeyLight.position.set(6, 14, 10);
    scene.add(topKeyLight);

    // 4. Graph Group (Rotates during idle & drag)
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    const allNodes: Node3DData[] = [];
    const interactiveMeshes: THREE.Mesh[] = [];
    const allGalaxyLines: GalaxyLineItem[] = [];

    // --- 5. CENTRAL DEVELOPER CORE (Saureet) ---
    // Clean spherical shading with depthWrite = true and high renderOrder
    const coreGeo = new THREE.SphereGeometry(1.35, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xe50914,
      emissive: 0xe50914,
      emissiveIntensity: 0.75,
      roughness: 0.28,
      metalness: 0.72,
      depthTest: true,
      depthWrite: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0, 0);
    coreMesh.renderOrder = 10;
    graphGroup.add(coreMesh);
    interactiveMeshes.push(coreMesh);

    // Subtle Core Energy Halo (Soft ambient glow)
    const haloGeo = new THREE.SphereGeometry(1.52, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xff3333,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    coreMesh.add(haloMesh);

    // EXACTLY TWO LAYERED CONCENTRIC ORBITAL RINGS
    // Both render BEHIND the central sphere without cutting through
    // Primary Ring: Thin illuminated red outline, slight tilt, slow continuous rotation
    const primaryRingGeo = new THREE.TorusGeometry(2.35, 0.016, 16, 80);
    const primaryRingMat = new THREE.MeshBasicMaterial({
      color: 0xe50914,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const primaryRing = new THREE.Mesh(primaryRingGeo, primaryRingMat);
    primaryRing.position.set(0, 0, -0.45);
    primaryRing.rotation.set(0.28, 0.16, 0);
    primaryRing.renderOrder = 2;
    graphGroup.add(primaryRing);

    // Secondary Ring: Thinner, different tilt, lower opacity, smooth opposite rotation
    const secondaryRingGeo = new THREE.TorusGeometry(3.05, 0.012, 16, 80);
    const secondaryRingMat = new THREE.MeshBasicMaterial({
      color: 0xff6666,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    });
    const secondaryRing = new THREE.Mesh(secondaryRingGeo, secondaryRingMat);
    secondaryRing.position.set(0, 0, -0.75);
    secondaryRing.rotation.set(-0.22, 0.36, 0);
    secondaryRing.renderOrder = 1;
    graphGroup.add(secondaryRing);

    const coreData: Node3DData = {
      id: 'center',
      name: 'Developer Core // Saureet',
      type: 'center',
      role: 'Full-Stack Software Engineering · Applied Machine Learning · Systems Architecture',
      color: '#E50914',
      colorHex: 0xe50914,
      mesh: coreMesh,
      position: new THREE.Vector3(0, 0, 0),
    };
    coreMesh.userData = coreData;
    allNodes.push(coreData);

    // --- 6. BUILD 5 GALAXY CLUSTERS & NODES ---
    const particleFlowData: { pos: THREE.Vector3; start: THREE.Vector3; end: THREE.Vector3; speed: number; progress: number }[] = [];

    GALAXY_CLUSTERS.forEach((galaxy) => {
      const hubPos = new THREE.Vector3(...galaxy.position);

      // Galaxy Hub Sphere
      const hubGeo = new THREE.SphereGeometry(galaxy.hubSize, 24, 24);
      const hubMat = new THREE.MeshStandardMaterial({
        color: galaxy.colorHex,
        emissive: galaxy.colorHex,
        emissiveIntensity: 0.65,
        roughness: 0.25,
        metalness: 0.75,
      });
      const hubMesh = new THREE.Mesh(hubGeo, hubMat);
      hubMesh.position.copy(hubPos);
      graphGroup.add(hubMesh);
      interactiveMeshes.push(hubMesh);

      // Beacon ring around Galaxy Hub
      const beaconGeo = new THREE.RingGeometry(galaxy.hubSize * 1.3, galaxy.hubSize * 1.45, 32);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: galaxy.colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.rotation.x = Math.PI / 2;
      hubMesh.add(beaconMesh);

      const hubData: Node3DData = {
        id: galaxy.id,
        name: galaxy.title,
        type: 'category',
        categoryId: galaxy.id,
        category: galaxy.title,
        priority: galaxy.priority,
        priorityLabel: galaxy.priorityLabel,
        role: galaxy.subtitle,
        color: galaxy.color,
        colorHex: galaxy.colorHex,
        mesh: hubMesh,
        position: hubPos,
      };
      hubMesh.userData = hubData;
      allNodes.push(hubData);

      // Core-to-Galaxy Energy Beam (Conduit)
      const coreToHubGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), hubPos]);
      const coreToHubMat = new THREE.LineBasicMaterial({
        color: 0xe50914,
        transparent: true,
        opacity: 0.35,
      });
      const coreToHubLine = new THREE.Line(coreToHubGeo, coreToHubMat);
      graphGroup.add(coreToHubLine);

      allGalaxyLines.push({
        line: coreToHubLine,
        mat: coreToHubMat,
        baseColor: 0xe50914,
        baseOpacity: 0.35,
        sourceId: 'center',
        targetId: galaxy.id,
        categoryId: galaxy.id,
      });

      // Flowing Energy Particle between Core and Galaxy Hub
      particleFlowData.push({
        pos: new THREE.Vector3(0, 0, 0),
        start: new THREE.Vector3(0, 0, 0),
        end: hubPos.clone(),
        speed: 0.007 + Math.random() * 0.004,
        progress: Math.random(),
      });

      // Individual Technology Nodes
      galaxy.technologies.forEach((tech) => {
        const techPos = new THREE.Vector3(...tech.position);

        const techGeo = new THREE.SphereGeometry(tech.size, 20, 20);
        const techMat = new THREE.MeshStandardMaterial({
          color: galaxy.priority === 1 ? 0xe50914 : 0xd1d5db,
          emissive: galaxy.colorHex,
          emissiveIntensity: galaxy.priority === 1 ? 0.45 : 0.22,
          roughness: 0.35,
          metalness: 0.65,
        });
        const techMesh = new THREE.Mesh(techGeo, techMat);
        techMesh.position.copy(techPos);
        graphGroup.add(techMesh);
        interactiveMeshes.push(techMesh);

        // Atmosphere halo
        const haloG = new THREE.SphereGeometry(tech.size * 1.25, 16, 16);
        const haloM = new THREE.MeshBasicMaterial({
          color: galaxy.colorHex,
          transparent: true,
          opacity: 0.15,
          blending: THREE.AdditiveBlending,
        });
        const haloSubMesh = new THREE.Mesh(haloG, haloM);
        techMesh.add(haloSubMesh);

        const techData: Node3DData = {
          id: tech.id,
          name: tech.name,
          type: 'technology',
          category: galaxy.title,
          categoryId: galaxy.id,
          priority: tech.priority,
          priorityLabel: galaxy.priorityLabel,
          role: tech.role,
          status: tech.status,
          color: tech.color,
          colorHex: tech.colorHex,
          relatedTechIds: tech.relatedTechIds,
          mesh: techMesh,
          position: techPos,
        };
        techMesh.userData = techData;
        allNodes.push(techData);

        // Line from Galaxy Hub to Tech Node
        const hubToTechGeo = new THREE.BufferGeometry().setFromPoints([hubPos, techPos]);
        const hubToTechMat = new THREE.LineBasicMaterial({
          color: galaxy.colorHex,
          transparent: true,
          opacity: 0.22,
        });
        const hubToTechLine = new THREE.Line(hubToTechGeo, hubToTechMat);
        graphGroup.add(hubToTechLine);

        allGalaxyLines.push({
          line: hubToTechLine,
          mat: hubToTechMat,
          baseColor: galaxy.colorHex,
          baseOpacity: 0.22,
          sourceId: galaxy.id,
          targetId: tech.id,
          categoryId: galaxy.id,
        });

        // Particle flowing from hub to tech
        particleFlowData.push({
          pos: hubPos.clone(),
          start: hubPos.clone(),
          end: techPos.clone(),
          speed: 0.009 + Math.random() * 0.006,
          progress: Math.random(),
        });
      });
    });

    // Inter-technology Conceptual Lines
    const renderedPairs = new Set<string>();
    ALL_UNIVERSE_TECHS.forEach((t) => {
      t.relatedTechIds.forEach((relId) => {
        const pairKey = [t.id, relId].sort().join('--');
        if (renderedPairs.has(pairKey)) return;
        renderedPairs.add(pairKey);

        const sourceNode = allNodes.find((n) => n.id === t.id);
        const targetNode = allNodes.find((n) => n.id === relId);
        if (sourceNode && targetNode) {
          const interGeo = new THREE.BufferGeometry().setFromPoints([sourceNode.position, targetNode.position]);
          const interMat = new THREE.LineBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.14,
          });
          const interLine = new THREE.Line(interGeo, interMat);
          graphGroup.add(interLine);

          allGalaxyLines.push({
            line: interLine,
            mat: interMat,
            baseColor: 0x444444,
            baseOpacity: 0.14,
            sourceId: t.id,
            targetId: relId,
            categoryId: t.categoryId,
          });
        }
      });
    });

    // Energy Flowing Particles Buffer Geometry
    const flowParticleGeo = new THREE.BufferGeometry();
    const flowCount = particleFlowData.length;
    const flowPositions = new Float32Array(flowCount * 3);
    flowParticleGeo.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));
    const flowParticleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.24,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const flowParticleSystem = new THREE.Points(flowParticleGeo, flowParticleMat);
    graphGroup.add(flowParticleSystem);

    // Background Starfield Particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 550;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x888888,
      size: 0.16,
      transparent: true,
      opacity: 0.45,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // --- 7. POINTER & INTERACTION CONTROLS ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-999, -999);
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);

      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        const hitData = intersects[0].object.userData as Node3DData;
        setHoveredNode(hitData);
      } else {
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
        setHoveredNode(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);

      if (intersects.length > 0) {
        const hitData = intersects[0].object.userData as Node3DData;
        setSelectedNode(hitData);
        gamification.unlockAchievement('skill-hunter');
        setIsAutoExploring(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
      setIsAutoExploring(false);
    };

    const handleWindowMouseUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      graphGroup.rotation.y += deltaX * 0.005;
      graphGroup.rotation.x = THREE.MathUtils.clamp(
        graphGroup.rotation.x + deltaY * 0.005,
        -0.6,
        0.6
      );
    };

    // Touch Support for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setIsAutoExploring(false);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      graphGroup.rotation.y += deltaX * 0.006;
      graphGroup.rotation.x = THREE.MathUtils.clamp(
        graphGroup.rotation.x + deltaY * 0.006,
        -0.6,
        0.6
      );
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    // Zoom on wheel (clamped between 8 and 30)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCameraPos.z = THREE.MathUtils.clamp(targetCameraPos.z + e.deltaY * 0.015, 8, 30);
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('mousemove', handleWindowMouseMove);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // --- 8. IMPERATIVE ACTION HOOKS (Focus, Reset) ---
    focusCategoryRef.current = (catId: string) => {
      setActiveCategory(catId);
      if (catId === 'all') {
        targetCameraPos.copy(defaultCameraPos);
        targetLookAt.copy(defaultLookAt);
        graphGroup.rotation.set(0, 0, 0);
      } else {
        const cluster = GALAXY_CLUSTERS.find((g) => g.id === catId);
        if (cluster) {
          targetCameraPos.set(...cluster.cameraTarget);
          targetLookAt.set(...cluster.lookAt);
        }
      }
    };

    focusNodeRef.current = (nodeId: string) => {
      const node = allNodes.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
        gamification.unlockAchievement('skill-hunter');
        const focusPos = node.position.clone().add(new THREE.Vector3(0, 0, 6.5));
        targetCameraPos.copy(focusPos);
        targetLookAt.copy(node.position);
      }
    };

    resetViewRef.current = () => {
      setActiveCategory('all');
      setSelectedNode(null);
      setIsAutoExploring(false);
      targetCameraPos.copy(defaultCameraPos);
      targetLookAt.copy(defaultLookAt);
      graphGroup.rotation.set(0, 0, 0);
    };

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- 9. INTERSECTION OBSERVER (Offscreen Animation Pausing) ---
    let isSectionVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isSectionVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // --- 10. ANIMATION & RENDER LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isSectionVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera Smooth LERP (Spring-like gliding)
      camera.position.lerp(targetCameraPos, 0.045);
      currentLookAt.lerp(targetLookAt, 0.045);
      camera.lookAt(currentLookAt);

      // Idle Rotation when user is not dragging
      if (!prefersReducedMotion && !isDragging) {
        graphGroup.rotation.y += delta * 0.02;
        starField.rotation.y -= delta * 0.004;
      }

      // TWO ORBITAL RINGS: Smooth opposite continuous rotation
      primaryRing.rotation.z += delta * 0.12;
      secondaryRing.rotation.z -= delta * 0.08;

      // Central Core Gentle Breathing Pulsing (Spherical shading, no harsh bloom)
      if (!prefersReducedMotion) {
        const corePulse = 0.72 + Math.sin(time * 2.2) * 0.14;
        coreMat.emissiveIntensity = corePulse;
        haloMat.opacity = 0.14 + Math.sin(time * 2.2) * 0.05;
      }

      // Conduits highlighting logic on hover and selection
      const activeId = hoveredNode?.id || selectedNode?.id;
      const activeCat = activeCategory;

      allGalaxyLines.forEach((item) => {
        let targetOpacity = item.baseOpacity;
        let targetColor = item.baseColor;

        if (activeId) {
          if (item.sourceId === activeId || item.targetId === activeId) {
            targetOpacity = 0.85;
            targetColor = hoveredNode?.colorHex || selectedNode?.colorHex || item.baseColor;
          } else if (
            (hoveredNode?.relatedTechIds?.includes(item.sourceId) && hoveredNode?.relatedTechIds?.includes(item.targetId)) ||
            (selectedNode?.relatedTechIds?.includes(item.sourceId) && selectedNode?.relatedTechIds?.includes(item.targetId))
          ) {
            targetOpacity = 0.58;
          } else {
            targetOpacity = item.baseOpacity * 0.45;
          }
        } else if (activeCat !== 'all') {
          if (item.categoryId === activeCat) {
            targetOpacity = 0.65;
          } else {
            targetOpacity = item.baseOpacity * 0.35;
          }
        }

        item.mat.opacity = THREE.MathUtils.lerp(item.mat.opacity, targetOpacity, 0.1);
        item.mat.color.lerp(new THREE.Color(targetColor), 0.1);
      });

      // Smooth Node Hover Scaling & Gentle Weightless Floating Motion
      if (!prefersReducedMotion) {
        allNodes.forEach((node, idx) => {
          const isHov = hoveredNode?.id === node.id;
          const isSel = selectedNode?.id === node.id;
          const targetScale = isHov ? 1.4 : isSel ? 1.25 : 1.0;

          // Smooth spring-like lerp scaling
          node.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.14);

          // Subtle harmonic floating motion
          const floatY = Math.sin(time * 1.5 + idx * 0.7) * 0.04;
          node.mesh.position.y = node.position.y + floatY;
        });
      }

      // Energy Particles Flowing Along Lines
      if (!prefersReducedMotion) {
        const posAttr = flowParticleGeo.getAttribute('position') as THREE.BufferAttribute;
        particleFlowData.forEach((p, idx) => {
          p.progress = (p.progress + p.speed) % 1.0;
          p.pos.lerpVectors(p.start, p.end, p.progress);
          posAttr.setXYZ(idx, p.pos.x, p.pos.y, p.pos.z);
        });
        posAttr.needsUpdate = true;
      }

      // --- 11. SCREEN-SPACE PROJECTED LABELS ---
      // A. Exactly 5 permanently visible category badges anchored outside clusters at labelPosition
      const catBadges: ProjectedCategoryBadge[] = [];
      const tempLabelVec = new THREE.Vector3();

      GALAXY_CLUSTERS.forEach((cluster) => {
        tempLabelVec.set(...cluster.labelPosition);
        tempLabelVec.applyEuler(graphGroup.rotation);
        tempLabelVec.project(camera);

        const isBehind = tempLabelVec.z > 1.0;
        const sx = (tempLabelVec.x * 0.5 + 0.5) * width;
        const sy = (-tempLabelVec.y * 0.5 + 0.5) * height;

        catBadges.push({
          id: cluster.id,
          priority: cluster.priority,
          title: cluster.title,
          color: cluster.color,
          x: Math.round(sx),
          y: Math.round(sy),
          visible: !isBehind && sx > -100 && sx < width + 100 && sy > -50 && sy < height + 50,
        });
      });
      setProjectedCategories(catBadges);

      // B. Individual technology node tooltip (Revealed ONLY on hover or selection)
      const targetNode = hoveredNode || selectedNode;
      if (targetNode && targetNode.type === 'technology') {
        const tempNodeVec = new THREE.Vector3();
        targetNode.mesh.getWorldPosition(tempNodeVec);
        tempNodeVec.project(camera);

        const isBehind = tempNodeVec.z > 1.0;
        const sx = (tempNodeVec.x * 0.5 + 0.5) * width;
        const sy = (-tempNodeVec.y * 0.5 + 0.5) * height;

        if (!isBehind && sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          setActiveTooltip({
            id: targetNode.id,
            name: targetNode.name,
            role: targetNode.role,
            category: targetNode.category,
            color: targetNode.color,
            x: Math.round(sx),
            y: Math.round(sy),
            placement: sy < 140 ? 'placement-bottom' : 'placement-top',
          });
        } else {
          setActiveTooltip(null);
        }
      } else {
        setActiveTooltip(null);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion, activeCategory, hoveredNode, selectedNode]);

  // --- AUTO EXPLORE MODE TOUR CONTROLLER ---
  useEffect(() => {
    if (!isAutoExploring) return;

    const tourSteps = [
      'code-engineering',
      'ai-data-intelligence',
      'web-development',
      'design-digital-creation',
      'mobile-development',
      'all',
    ];

    const timer = setTimeout(() => {
      const nextStep = (currentTourStep + 1) % tourSteps.length;
      setCurrentTourStep(nextStep);
      focusCategoryRef.current?.(tourSteps[nextStep]);
    }, 4500);

    return () => clearTimeout(timer);
  }, [isAutoExploring, currentTourStep]);

  const handleToggleAutoExplore = () => {
    if (isAutoExploring) {
      setIsAutoExploring(false);
    } else {
      setIsAutoExploring(true);
      setCurrentTourStep(0);
      focusCategoryRef.current?.('code-engineering');
    }
  };

  const handleSelectSearchResult = (techId: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    focusNodeRef.current?.(techId);
  };

  const handleChipClick = (relId: string) => {
    focusNodeRef.current?.(relId);
  };

  const currentTourCluster = GALAXY_CLUSTERS.find((g) => g.id === GALAXY_CLUSTERS[currentTourStep]?.id);

  if (!webglSupported) {
    return (
      <div className="universe-webgl-notice">
        <p>WebGL is not available in your browser. Below is the accessible categorized skills directory.</p>
      </div>
    );
  }

  return (
    <div className="universe-outer-container">
      {/* ====================================================================
          1. STRUCTURED TOP TOOLBAR
          Contains: All 6 Category Tabs (Left) + Search & Controls (Right)
          ==================================================================== */}
      <div className="universe-structured-toolbar">
        {/* Category Filter Navigation */}
        <div className="universe-toolbar-categories" role="tablist" aria-label="Skill Galaxy filter">
          <button
            type="button"
            className={`universe-cat-btn ${activeCategory === 'all' ? 'is-active' : ''}`}
            onClick={() => focusCategoryRef.current?.('all')}
            role="tab"
            aria-selected={activeCategory === 'all'}
          >
            <span className="universe-cat-dot" style={{ background: '#FFFFFF' }} />
            <span>All Skills</span>
          </button>

          {GALAXY_CLUSTERS.map((g) => {
            const isActive = activeCategory === g.id;
            return (
              <button
                key={g.id}
                type="button"
                className={`universe-cat-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => focusCategoryRef.current?.(g.id)}
                style={{
                  borderColor: isActive ? g.color : undefined,
                }}
                role="tab"
                aria-selected={isActive}
              >
                <span className="universe-cat-dot" style={{ background: g.color }} />
                <span>{`0${g.priority} ${g.title}`}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Canvas Controls */}
        <div className="universe-toolbar-controls">
          {/* Dedicated Skill Search Box with 14px SVG */}
          <div className="universe-search-box">
            <SearchIcon />
            <input
              type="text"
              className="universe-search-input"
              placeholder="Search skill..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              aria-label="Search skills in 3D universe"
            />
            {searchQuery && (
              <button
                type="button"
                className="universe-search-clear"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <ul className="universe-search-dropdown" role="listbox">
                {searchResults.map((tech) => (
                  <li
                    key={tech.id}
                    className="universe-search-dropdown-item"
                    onClick={() => handleSelectSearchResult(tech.id)}
                    role="option"
                    aria-selected="false"
                  >
                    <span className="universe-search-item__name">{tech.name}</span>
                    <span className="universe-search-item__cat">{tech.category}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Explore Mode */}
          <button
            type="button"
            className={`universe-tool-btn ${isAutoExploring ? 'universe-tool-btn--active' : ''}`}
            onClick={handleToggleAutoExplore}
            title="Auto-tour all 5 skill galaxies sequentially"
            aria-label={isAutoExploring ? 'Pause Auto Explore' : 'Start Auto Explore Mode'}
          >
            {isAutoExploring ? <PauseIcon /> : <PlayIcon />}
            <span>{isAutoExploring ? 'Pause Tour' : 'Explore Mode'}</span>
          </button>

          {isAutoExploring && (
            <button
              type="button"
              className="universe-tool-btn"
              onClick={() => {
                setIsAutoExploring(false);
                resetViewRef.current?.();
              }}
              title="Stop auto tour"
              aria-label="Stop Tour"
            >
              <StopIcon />
              <span>Stop</span>
            </button>
          )}

          {/* Reset View */}
          <button
            type="button"
            className="universe-tool-btn"
            onClick={() => resetViewRef.current?.()}
            title="Reset 3D camera to default overview"
            aria-label="Reset Camera View"
          >
            <ResetIcon />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          2. 3D WEBGL CANVAS WRAPPER
          ==================================================================== */}
      <div className="universe-canvas-wrapper" data-cursor="drag" ref={containerRef}>
        {/* Auto-Explore Tour Banner */}
        {isAutoExploring && currentTourCluster && (
          <div
            className="universe-tour-banner"
            style={{ '--tour-accent': currentTourCluster.color } as React.CSSProperties}
            aria-live="polite"
          >
            <span className="universe-tour-pulse-dot" />
            <span className="universe-tour-banner__title">
              TOURING GALAXY 0{currentTourCluster.priority} // {currentTourCluster.title.toUpperCase()}
            </span>
          </div>
        )}

        {/* 3D Projected Labels Overlay (Category Badges + Hover/Select Tooltip) */}
        <div className="universe-labels-overlay" aria-hidden="true">
          {/* Exactly 5 permanently visible Category Badges outside clusters */}
          {projectedCategories.map((cat) => {
            if (!cat.visible) return null;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`universe-category-badge ${isActive ? 'is-active' : ''}`}
                style={{
                  left: `${cat.x}px`,
                  top: `${cat.y}px`,
                  '--cat-color': cat.color,
                } as React.CSSProperties}
                onClick={() => focusCategoryRef.current?.(cat.id)}
                aria-label={`Focus ${cat.title} Galaxy`}
              >
                <span className="universe-cat-num">{`0${cat.priority}`}</span>
                <span className="universe-cat-title">{cat.title}</span>
              </button>
            );
          })}

          {/* Individual Technology Tooltip (Visible ONLY on hover or selection) */}
          {activeTooltip && (
            <div
              className={`universe-tech-tooltip ${activeTooltip.placement}`}
              style={{
                left: `${activeTooltip.x}px`,
                top: `${activeTooltip.y}px`,
                '--tech-color': activeTooltip.color,
              } as React.CSSProperties}
            >
              <div className="universe-tech-tooltip__name">{activeTooltip.name}</div>
              {activeTooltip.category && (
                <div className="universe-tech-tooltip__cat">{activeTooltip.category}</div>
              )}
            </div>
          )}
        </div>

        {/* Cinematic Skill Inspector Drawer (Right Side Panel) */}
        {selectedNode && (
          <div
            className="universe-inspector-panel"
            style={{ '--inspector-accent': selectedNode.color } as React.CSSProperties}
            role="dialog"
            aria-label={`${selectedNode.name} architecture inspector`}
          >
            <div className="universe-inspector__header">
              <div>
                <span className="universe-inspector__priority-tag">
                  {selectedNode.priorityLabel || (selectedNode.priority ? `PRIORITY 0${selectedNode.priority}` : 'CORE SYSTEM')}
                </span>
                <h3 className="universe-inspector__title">{selectedNode.name}</h3>
                {selectedNode.category && (
                  <p className="universe-inspector__category">{selectedNode.category}</p>
                )}
              </div>
              <button
                type="button"
                className="universe-inspector__close"
                onClick={() => setSelectedNode(null)}
                aria-label="Close inspector drawer"
              >
                ✕
              </button>
            </div>

            <div className="universe-inspector__body">
              {selectedNode.role && (
                <div>
                  <div className="universe-inspector__section-label">Architecture Role</div>
                  <p className="universe-inspector__role-text">{selectedNode.role}</p>
                </div>
              )}

              {selectedNode.relatedTechIds && selectedNode.relatedTechIds.length > 0 && (
                <div>
                  <div className="universe-inspector__section-label">Connected Technologies</div>
                  <div className="universe-inspector__chips">
                    {selectedNode.relatedTechIds.map((relId) => {
                      const relNode = ALL_UNIVERSE_TECHS.find((t) => t.id === relId);
                      return (
                        <button
                          key={relId}
                          type="button"
                          className="universe-inspector-chip"
                          onClick={() => handleChipClick(relId)}
                          title={`Inspect ${relNode?.name || relId}`}
                        >
                          {relNode?.name || relId} →
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedNode.status && (
                <div>
                  <div className="universe-inspector__section-label">Deployment Status</div>
                  <span className="badge badge--exploring">{selectedNode.status}</span>
                </div>
              )}
            </div>

            <div className="universe-inspector__footer">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => focusNodeRef.current?.(selectedNode.id)}
              >
                Focus in 3D
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setSelectedNode(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Bottom Instruction & Legend Bar */}
        <div className="universe-hud-bottombar">
          <div className="universe-instructions-pill" aria-hidden="true">
            Drag to rotate · Scroll to zoom · Click node to inspect
          </div>

          <div className="universe-quick-legend" aria-hidden="true">
            <span><span className="universe-legend-dot" style={{ background: '#E50914' }} />01 Code</span>
            <span><span className="universe-legend-dot" style={{ background: '#A855F7' }} />02 AI/Data</span>
            <span><span className="universe-legend-dot" style={{ background: '#38BDF8' }} />03 Web</span>
            <span><span className="universe-legend-dot" style={{ background: '#818CF8' }} />04 Design</span>
            <span><span className="universe-legend-dot" style={{ background: '#2DD4BF' }} />05 Mobile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
