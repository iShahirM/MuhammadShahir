'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { audioEngine } from '@/lib/audio';

interface Scene3DProps {
  currentChapter: number;
  scrollProgress: number; // 0 to 1 overall progress
  onSelectObject: (type: string, id: string, data?: unknown) => void;
  reducedMotion: boolean;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  currentChapter,
  scrollProgress,
  onSelectObject,
  reducedMotion
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Group references for each chapter's 3D assets
  const sphereGroupRef = useRef<THREE.Group | null>(null);
  const portal1Ref = useRef<THREE.Group | null>(null);
  const observatoryGroupRef = useRef<THREE.Group | null>(null);
  const labPillarsGroupRef = useRef<THREE.Group | null>(null);
  const metropolisGroupRef = useRef<THREE.Group | null>(null);
  const skillGalaxyGroupRef = useRef<THREE.Group | null>(null);
  const sanctuaryVaultGroupRef = useRef<THREE.Group | null>(null);
  const certCapsulesRef = useRef<{ mesh: THREE.Mesh; core: THREE.Mesh; ring: THREE.Mesh; id: string }[]>([]);
  const workspaceGroupRef = useRef<THREE.Group | null>(null);
  const sunrisePlatformRef = useRef<THREE.Group | null>(null);

  // Particle systems
  const starfieldParticlesRef = useRef<THREE.Points | null>(null);
  const neuralSphereParticlesRef = useRef<THREE.Points | null>(null);

  // Interactive meshes array for Raycasting
  const interactiveObjectsRef = useRef<{ mesh: THREE.Object3D; type: string; id: string; data?: unknown }[]>([]);

  const onSelectObjectRef = useRef(onSelectObject);
  useEffect(() => {
    onSelectObjectRef.current = onSelectObject;
  }, [onSelectObject]);

  const scrollProgressRef = useRef(scrollProgress);
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (!containerRef.current) return;
    const currentContainer = containerRef.current;

    // 1. Initialize Three.js Scene, Camera, Renderer
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.007);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting: Bright Architectural Daylight & Soft Cyan Highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.6);
    sunLight.position.set(20, 50, 30);
    scene.add(sunLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 2.5, 70);
    cyanPointLight.position.set(12, 12, 12);
    scene.add(cyanPointLight);

    const azurePointLight = new THREE.PointLight(0x38bdf8, 2.0, 70);
    azurePointLight.position.set(-12, -12, -12);
    scene.add(azurePointLight);

    const warmHighlight = new THREE.PointLight(0xf59e0b, 1.5, 60);
    warmHighlight.position.set(0, -30, 20);
    scene.add(warmHighlight);

    interactiveObjectsRef.current = [];
    certCapsulesRef.current = [];

    // --- BUILD 3D ARCHITECTURAL OBJECTS --- //

    // A. FLOATING LIGHT PARTICLES (Daylight Dust & Photons)
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const c1 = new THREE.Color(0x06b6d4);
    const c2 = new THREE.Color(0x0284c7);
    const c3 = new THREE.Color(0x94a3b8);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 220;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 260;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 220;

      const rand = Math.random();
      const col = rand < 0.4 ? c1 : rand < 0.7 ? c2 : c3;
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.NormalBlending
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);
    starfieldParticlesRef.current = starfield;

    // B. CHAPTER 0: NEURAL INTELLIGENCE CORE
    const sphereGroup = new THREE.Group();
    const sphereCount = 1400;
    const sphereGeo = new THREE.BufferGeometry();
    const spherePos = new Float32Array(sphereCount * 3);

    for (let i = 0; i < sphereCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.0 + Math.random() * 0.5;

      spherePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      spherePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      spherePos[i * 3 + 2] = r * Math.cos(phi);
    }
    sphereGeo.setAttribute('position', new THREE.BufferAttribute(spherePos, 3));
    const sphereMat = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.09,
      transparent: true,
      opacity: 0.95
    });
    const sphereParticles = new THREE.Points(sphereGeo, sphereMat);
    sphereGroup.add(sphereParticles);
    neuralSphereParticlesRef.current = sphereParticles;

    // Core Frosted Glass Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 1.0,
      transparent: true,
      roughness: 0.08,
      metalness: 0.1,
      ior: 1.5,
      clearcoat: 1.0
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sphereGroup.add(coreMesh);

    scene.add(sphereGroup);
    sphereGroupRef.current = sphereGroup;

    // C. ARCHITECTURAL GATEWAY RINGS (Polished Aluminum & Glass)
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0, -25);

    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(4.8 + r * 1.8, 0.06, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: r === 0 ? 0x06b6d4 : r === 1 ? 0x38bdf8 : 0x0284c7,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: r % 2 === 1
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      portalGroup.add(ringMesh);
    }
    scene.add(portalGroup);
    portal1Ref.current = portalGroup;

    // D. CHAPTER 1: OBSERVATORY & ACADEMIC LAB
    const observatoryGroup = new THREE.Group();
    observatoryGroup.position.set(0, -35, -55);

    // Architectural Frosted Glass Dome
    const domeGeo = new THREE.SphereGeometry(6.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.82,
      opacity: 0.65,
      transparent: true,
      roughness: 0.1,
      metalness: 0.2
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.set(0, -2, 0);
    observatoryGroup.add(domeMesh);

    // Crystal Octahedron Award (Spirit School Pride of Institution)
    const crystalGeo = new THREE.OctahedronGeometry(2.0, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      roughness: 0.05,
      metalness: 0.2,
      transmission: 0.9,
      ior: 1.52,
      thickness: 1.2
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.set(-4.5, 2.2, 0);
    observatoryGroup.add(crystalMesh);

    // Halo Ring around Award
    const awardRingGeo = new THREE.TorusGeometry(2.6, 0.05, 16, 64);
    const awardRingMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
    const awardRingMesh = new THREE.Mesh(awardRingGeo, awardRingMat);
    awardRingMesh.position.set(-4.5, 2.2, 0);
    observatoryGroup.add(awardRingMesh);

    interactiveObjectsRef.current.push({
      mesh: crystalMesh,
      type: 'education',
      id: 'spirit-school',
      data: { name: 'The Spirit School', award: 'Pride of Institution Award (Grade A+)' }
    });

    // Innovation Lab Pillars Group
    const labPillarsGroup = new THREE.Group();
    labPillarsGroup.position.set(0, -35, -85);

    const pillarNames = ['Strategy', 'Philosophy', 'Leadership', 'Vision', 'Creativity', 'AI Tech', 'Marketing', 'Ecology'];
    const pillarColors = [0x06b6d4, 0x0284c7, 0x2563eb, 0x0d9488, 0xf59e0b, 0x0284c7, 0x06b6d4, 0x10b981];

    pillarNames.forEach((name, i) => {
      const angle = (i / pillarNames.length) * Math.PI * 2;
      const radius = 10.0;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const pGeo = new THREE.CylinderGeometry(0.35, 0.5, 5.0, 16);
      const pMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.7,
        roughness: 0.1,
        metalness: 0.3
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(x, 0, z);
      labPillarsGroup.add(pMesh);

      const orbGeo = new THREE.SphereGeometry(0.38, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: pillarColors[i],
        emissive: pillarColors[i],
        emissiveIntensity: 0.8
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.position.set(x, 3.1, z);
      labPillarsGroup.add(orbMesh);

      interactiveObjectsRef.current.push({
        mesh: pMesh,
        type: 'pillar',
        id: name.toLowerCase(),
        data: { name, color: pillarColors[i] }
      });
    });

    scene.add(observatoryGroup);
    scene.add(labPillarsGroup);
    observatoryGroupRef.current = observatoryGroup;
    labPillarsGroupRef.current = labPillarsGroup;

    // E. CHAPTER 2: GLOMORE PAKISTAN COMMAND CORE & SKILL GALAXY
    const metropolisGroup = new THREE.Group();
    metropolisGroup.position.set(0, -80, -130);

    const towerGeo = new THREE.CylinderGeometry(1.8, 3.0, 20, 16);
    const towerMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.85,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0
    });
    const towerMesh = new THREE.Mesh(towerGeo, towerMat);
    towerMesh.position.set(0, 0, 0);
    metropolisGroup.add(towerMesh);

    const orbData = [
      { id: 'orb-sales', label: 'B2B & B2C Sales Pipelines', color: 0x06b6d4 },
      { id: 'orb-seo', label: 'SEO & Web Analytics', color: 0x0284c7 },
      { id: 'orb-ai', label: 'Generative AI & Prompts', color: 0x2563eb },
      { id: 'orb-workspace', label: 'Workspace Systems', color: 0x0d9488 }
    ];

    orbData.forEach((orb, idx) => {
      const angle = (idx / 4) * Math.PI * 2;
      const orbMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 32, 32),
        new THREE.MeshPhysicalMaterial({
          color: orb.color,
          transmission: 0.7,
          roughness: 0.1,
          metalness: 0.3
        })
      );
      orbMesh.position.set(Math.cos(angle) * 6.0, 11, Math.sin(angle) * 6.0);
      metropolisGroup.add(orbMesh);

      interactiveObjectsRef.current.push({
        mesh: orbMesh,
        type: 'command-orb',
        id: orb.id,
        data: orb
      });
    });

    scene.add(metropolisGroup);
    metropolisGroupRef.current = metropolisGroup;

    // Skill Constellations
    const skillGalaxyGroup = new THREE.Group();
    skillGalaxyGroup.position.set(0, -125, -175);

    const skillsList = [
      'Search Engine Optimization', 'Web Analytics', 'Lead Generation', 'Content Strategy',
      'Market Research', 'B2B & B2C Sales', 'Generative AI Applications', 'Prompt Engineering',
      'Marketing Automation', 'Canva Ecosystem', 'Visual Communication', 'Google Workspace',
      'Microsoft Ecosystem', 'Critical Thinking', 'Strategic Leadership', 'Environmental Advocacy'
    ];

    skillsList.forEach((skill, sIdx) => {
      const angle = (sIdx / skillsList.length) * Math.PI * 2;
      const radius = 8.0 + (sIdx % 3) * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(sIdx) * 2.5;
      const z = Math.sin(angle) * radius;

      const starMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.6, 0),
        new THREE.MeshPhysicalMaterial({
          color: sIdx % 2 === 0 ? 0x06b6d4 : 0x0284c7,
          transmission: 0.8,
          roughness: 0.1,
          metalness: 0.2
        })
      );
      starMesh.position.set(x, y, z);
      skillGalaxyGroup.add(starMesh);

      interactiveObjectsRef.current.push({
        mesh: starMesh,
        type: 'skill-star',
        id: skill.toLowerCase().replace(/\s+/g, '-'),
        data: { name: skill }
      });
    });

    scene.add(skillGalaxyGroup);
    skillGalaxyGroupRef.current = skillGalaxyGroup;

    // F. CHAPTER 3: SANCTUARY OF CERTIFICATIONS (4 DEDICATED EXHIBIT STATIONS)
    const sanctuaryVaultGroup = new THREE.Group();
    sanctuaryVaultGroup.position.set(0, -165, -230);

    // Central Vault Ring Architecture
    const vaultRingGeo = new THREE.TorusGeometry(8.0, 0.2, 16, 100);
    const vaultRingMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    const vaultRingMesh = new THREE.Mesh(vaultRingGeo, vaultRingMat);
    vaultRingMesh.rotation.x = Math.PI / 2;
    sanctuaryVaultGroup.add(vaultRingMesh);

    // 4 Distinct Exhibit Waypoint Positions for the Certifications
    const certsData = [
      { id: 'ai-marketing', pos: [-6, -160, -210], color: 0x06b6d4 },
      { id: 'chatgpt-prompting', pos: [6, -170, -240], color: 0x0284c7 },
      { id: 'canva-creative', pos: [-6, -180, -270], color: 0x2563eb },
      { id: 'climate-action', pos: [6, -190, -300], color: 0x10b981 }
    ];

    certsData.forEach((c) => {
      // Capsule Outer Mesh
      const crystalOuterGeo = new THREE.IcosahedronGeometry(1.4, 1);
      const crystalOuterMat = new THREE.MeshPhysicalMaterial({
        color: c.color,
        transmission: 0.88,
        opacity: 0.95,
        transparent: true,
        roughness: 0.05,
        metalness: 0.1,
        clearcoat: 1.0,
        ior: 1.5
      });
      const crystalMesh = new THREE.Mesh(crystalOuterGeo, crystalOuterMat);
      crystalMesh.position.set(c.pos[0], c.pos[1], c.pos[2]);
      scene.add(crystalMesh);

      // Inner Glowing Core
      const coreGeo = new THREE.SphereGeometry(0.6, 16, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: c.color,
        emissive: c.color,
        emissiveIntensity: 0.8
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.set(c.pos[0], c.pos[1], c.pos[2]);
      scene.add(coreMesh);

      // Orbiting Halo Ring
      const ringGeo = new THREE.TorusGeometry(2.1, 0.04, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({ color: c.color, metalness: 0.8, roughness: 0.2 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(c.pos[0], c.pos[1], c.pos[2]);
      ringMesh.rotation.x = Math.PI / 4;
      scene.add(ringMesh);

      certCapsulesRef.current.push({ mesh: crystalMesh, core: coreMesh, ring: ringMesh, id: c.id });

      interactiveObjectsRef.current.push({
        mesh: crystalMesh,
        type: 'certification',
        id: c.id,
        data: c
      });
    });

    // Glass Bridges connecting exhibit stations
    for (let b = 0; b < certsData.length - 1; b++) {
      const p1 = certsData[b].pos;
      const p2 = certsData[b + 1].pos;
      const bridgeGeo = new THREE.BoxGeometry(0.3, 0.1, Math.hypot(p2[0] - p1[0], p2[2] - p1[2]));
      const bridgeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.8,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1
      });
      const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeMat);
      bridgeMesh.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
      bridgeMesh.lookAt(p2[0], p2[1], p2[2]);
      scene.add(bridgeMesh);
    }

    // Studio Desk & Workstation
    const workspaceGroup = new THREE.Group();
    workspaceGroup.position.set(0, -210, -325);

    const deskGeo = new THREE.BoxGeometry(9.0, 0.4, 4.5);
    const deskMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1, clearcoat: 0.8 });
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.set(0, 0, 0);
    workspaceGroup.add(deskMesh);

    const laptopGeo = new THREE.BoxGeometry(2.4, 0.14, 1.6);
    const laptopMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 });
    const laptopMesh = new THREE.Mesh(laptopGeo, laptopMat);
    laptopMesh.position.set(-1.8, 0.3, 0.6);
    workspaceGroup.add(laptopMesh);

    interactiveObjectsRef.current.push({
      mesh: laptopMesh,
      type: 'workspace-item',
      id: 'laptop',
      data: { name: 'High-Performance Workstation Laptop' }
    });

    scene.add(sanctuaryVaultGroup);
    scene.add(workspaceGroup);
    sanctuaryVaultGroupRef.current = sanctuaryVaultGroup;
    workspaceGroupRef.current = workspaceGroup;

    // G. CHAPTER 4: SUNRISE ARCHITECTURAL PLATFORM
    const sunriseGroup = new THREE.Group();
    sunriseGroup.position.set(0, -250, -360);

    const platGeo = new THREE.CylinderGeometry(9.0, 9.0, 0.5, 32);
    const platMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0
    });
    const platMesh = new THREE.Mesh(platGeo, platMat);
    platMesh.position.set(0, 0, 0);
    sunriseGroup.add(platMesh);

    const visionSphereGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const visionSphereMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      wireframe: true,
      emissive: 0xd97706,
      emissiveIntensity: 0.8
    });
    const visionSphereMesh = new THREE.Mesh(visionSphereGeo, visionSphereMat);
    visionSphereMesh.position.set(0, 3.8, 0);
    sunriseGroup.add(visionSphereMesh);

    scene.add(sunriseGroup);
    sunrisePlatformRef.current = sunriseGroup;

    // --- ANIMATION LOOP --- //
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const speedFactor = reducedMotion ? 0.3 : 1.0;

      // 1. Starfield Rotation
      if (starfieldParticlesRef.current) {
        starfieldParticlesRef.current.rotation.y = elapsedTime * 0.02 * speedFactor;
      }

      // 2. Neural Sphere Rotation & Floating
      if (sphereGroupRef.current) {
        sphereGroupRef.current.rotation.y = elapsedTime * 0.15 * speedFactor;
        sphereGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;
        sphereGroupRef.current.position.y = Math.sin(elapsedTime * 0.8) * 0.35;
      }

      // 3. Gateway Portal Rings
      if (portal1Ref.current) {
        portal1Ref.current.children.forEach((ring, idx) => {
          ring.rotation.z = (idx % 2 === 0 ? 1 : -1) * elapsedTime * (0.2 + idx * 0.1) * speedFactor;
        });
        portal1Ref.current.position.y = Math.sin(elapsedTime * 0.5 + 1.0) * 0.4;
      }

      // 4. Lab Pillars & Observatory Floating Motion
      if (observatoryGroupRef.current) {
        observatoryGroupRef.current.position.y = -35 + Math.sin(elapsedTime * 0.6) * 0.4;
      }
      if (labPillarsGroupRef.current) {
        labPillarsGroupRef.current.rotation.y = elapsedTime * 0.05 * speedFactor;
        labPillarsGroupRef.current.position.y = -35 + Math.cos(elapsedTime * 0.7) * 0.4;
      }

      // 5. Metropolis & Skill Galaxy Floating
      if (metropolisGroupRef.current) {
        metropolisGroupRef.current.position.y = -80 + Math.sin(elapsedTime * 0.5 + 2.0) * 0.5;
      }
      if (skillGalaxyGroupRef.current) {
        skillGalaxyGroupRef.current.rotation.y = elapsedTime * 0.08 * speedFactor;
        skillGalaxyGroupRef.current.position.y = -125 + Math.cos(elapsedTime * 0.6 + 1.5) * 0.45;
      }

      // 6. Certification Capsules Procedural Motion & Active Highlight
      certCapsulesRef.current.forEach((capsule, idx) => {
        capsule.mesh.rotation.y = elapsedTime * (0.3 + idx * 0.05) * speedFactor;
        capsule.mesh.rotation.x = Math.sin(elapsedTime * 0.5 + idx) * 0.2;
        capsule.ring.rotation.z = -elapsedTime * 0.4 * speedFactor;

        // Subtle continuous bobbing
        capsule.mesh.position.y = certsData[idx].pos[1] + Math.sin(elapsedTime * 1.2 + idx * 1.5) * 0.3;
        capsule.core.position.y = capsule.mesh.position.y;
        capsule.ring.position.y = capsule.mesh.position.y;
      });

      if (workspaceGroupRef.current) {
        workspaceGroupRef.current.position.y = -210 + Math.cos(elapsedTime * 0.6 + 0.8) * 0.35;
      }

      // 7. Dynamic Camera Choreography based on scroll progress
      const currentProgress = scrollProgressRef.current;
      
      // Calculate target camera positions seamlessly based on scrollProgress
      let targetY = -currentProgress * 250;
      let targetZ = 15 - currentProgress * 375;
      let targetX = Math.sin(currentProgress * Math.PI * 4) * 3.5;

      // Special Camera Waypoint Targeting for Chapter 3 Exhibits
      if (currentProgress >= 0.50 && currentProgress < 0.88) {
        if (currentProgress < 0.57) {
          // Vault Entrance
          targetX = 0; targetY = -155; targetZ = -200;
        } else if (currentProgress < 0.65) {
          // Exhibit 1: AI Marketing Capsule
          targetX = -4; targetY = -158; targetZ = -198;
        } else if (currentProgress < 0.73) {
          // Exhibit 2: ChatGPT Prompting Capsule
          targetX = 4; targetY = -168; targetZ = -228;
        } else if (currentProgress < 0.81) {
          // Exhibit 3: Canva Creative Capsule
          targetX = -4; targetY = -178; targetZ = -258;
        } else {
          // Exhibit 4: Climate Action Capsule
          targetX = 4; targetY = -188; targetZ = -288;
        }
      }

      if (cameraRef.current) {
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
        cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05;
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;

        // Mouse Parallax
        if (mouseRef.current.x !== -999) {
          cameraRef.current.position.x += (mouseRef.current.x * 1.5 - cameraRef.current.position.x) * 0.01;
          cameraRef.current.position.y += (-mouseRef.current.y * 1.5 - cameraRef.current.position.y) * 0.01;
        }

        cameraRef.current.lookAt(0, targetY - 1, targetZ - 12);
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- EVENT LISTENERS (Resize, Mousemove, Pointer Click) --- //
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handlePointerClick = (e: MouseEvent) => {
      if (!cameraRef.current || !sceneRef.current) return;

      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      const interactiveMeshes = interactiveObjectsRef.current.map((item) => item.mesh);
      const intersects = raycasterRef.current.intersectObjects(interactiveMeshes, true);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const matchedObj = interactiveObjectsRef.current.find((item) => item.mesh === hitMesh || item.mesh.children.includes(hitMesh));

        if (matchedObj) {
          audioEngine.playSelectSound();
          onSelectObjectRef.current(matchedObj.type, matchedObj.id, matchedObj.data);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('click', handlePointerClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handlePointerClick);
      cancelAnimationFrame(animationFrameId);

      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [reducedMotion]);


  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden bg-slate-50"
      style={{ touchAction: 'none' }}
    />
  );
};
