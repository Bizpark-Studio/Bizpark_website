import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function HeroThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11.5);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 3. Multi-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xf2603e, 4.5, 30);
    keyLight.position.set(6, 5, 8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffaa40, 3.0, 25);
    fillLight.position.set(-6, -4, 6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, 8, -6);
    scene.add(rimLight);

    // 4. Main 3D Composition Group (Positioned on the right for balanced layout)
    const mainGroup = new THREE.Group();
    const isMobile = window.innerWidth < 1024;
    mainGroup.position.set(isMobile ? 0 : 2.5, isMobile ? -0.8 : 0, 0);
    scene.add(mainGroup);

    // 5. 3D Cyber Torus Knot Core
    const knotGeo = new THREE.TorusKnotGeometry(1.8, 0.32, 140, 36, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x14100e,
      emissive: 0xf2603e,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.85,
      flatShading: true
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    mainGroup.add(knotMesh);

    // 5a. Cyber Wireframe Lattice
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    const wireMesh = new THREE.Mesh(knotGeo, wireMat);
    wireMesh.scale.setScalar(1.02);
    mainGroup.add(wireMesh);

    // 5b. Glowing Inner Energy Sphere
    const innerGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xff8547,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 6. Dual Helical Energy Gyro Rings
    const ring1Geo = new THREE.TorusGeometry(3.3, 0.03, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xf2603e,
      emissive: 0xf2603e,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.95
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3.2;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(4.0, 0.025, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xffaa40,
      emissive: 0xffd166,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.95
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = -Math.PI / 5;
    mainGroup.add(ring2);

    // 7. Orbiting Energy Nodes along the Rings
    const nodesCount = 10;
    const nodesGroup = new THREE.Group();
    mainGroup.add(nodesGroup);

    const nodeMeshes = [];
    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < nodesCount; i++) {
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodesGroup.add(nodeMesh);
      nodeMeshes.push({
        mesh: nodeMesh,
        angle: (i / nodesCount) * Math.PI * 2,
        radius: i % 2 === 0 ? 3.3 : 4.0,
        speed: (i % 2 === 0 ? 0.8 : -0.7) * 0.02,
        isRing1: i % 2 === 0
      });
    }

    // 8. Interactive Cursor-Driven 3D Particle Vortex
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 12;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleData.push({
        x,
        y,
        z,
        vx: 0,
        vy: 0,
        vz: 0,
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#f2603e') }
      },
      vertexShader: `
        uniform float uTime;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (44.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = 0.35 + 0.45 * sin(uTime * 0.6 + pos.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float glow = pow(1.0 - dist * 2.0, 1.6);
          gl_FragColor = vec4(uColor, glow * vAlpha * 0.65);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 9. Mouse & Scroll Listeners
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    const scroll = {
      current: 0,
      target: 0
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
    };

    const handleScroll = () => {
      scroll.target = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 10. Responsive Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const mobile = window.innerWidth < 1024;
      mainGroup.position.set(mobile ? 0 : 2.5, mobile ? -0.8 : 0, 0);
    };

    window.addEventListener('resize', handleResize);

    // 11. Animation Render Loop (Tracking Mouse & Scroll Dynamics)
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (direct cursor tracking)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Smooth scroll interpolation (scroll-driven transforms)
      scroll.current += (scroll.target - scroll.current) * 0.06;
      const scrollFactor = scroll.current * 0.003;

      // A. Direct Cursor-Follow Rotation + Scroll-Driven Spin
      mainGroup.rotation.y = elapsedTime * 0.15 + mouse.x * 0.75 + scrollFactor * 2.2;
      mainGroup.rotation.x = elapsedTime * 0.1 + -mouse.y * 0.65 + scrollFactor * 1.5;
      mainGroup.rotation.z = mouse.x * 0.35 + scrollFactor * 0.8;

      // Dynamic scale and depth shifts during scroll
      const dynamicScale = 1.0 + Math.sin(scrollFactor * 0.5) * 0.15;
      mainGroup.scale.setScalar(dynamicScale);

      // B. Helical Gyro Rings Counter-Rotations
      ring1.rotation.z = elapsedTime * 0.2 + scrollFactor * 3.0;
      ring2.rotation.z = -elapsedTime * 0.18 - scrollFactor * 2.5;

      // C. Orbiting Energy Nodes along the rings
      nodeMeshes.forEach((item) => {
        item.angle += item.speed + (scrollFactor * 0.01);
        const nx = Math.cos(item.angle) * item.radius;
        const ny = Math.sin(item.angle) * item.radius;
        const nz = Math.sin(item.angle * 2.0) * 0.4;

        if (item.isRing1) {
          item.mesh.position.set(nx, ny, nz);
        } else {
          item.mesh.position.set(nx, -ny, nz);
        }
      });

      // D. Interactive Cursor Particle Swarm Physics
      const positions = particleGeo.attributes.position.array;
      const cursor3D = new THREE.Vector3(mouse.x * 6.0, mouse.y * 4.5, 2.0);

      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        
        // Gentle organic harmonic float
        p.baseY += Math.sin(elapsedTime * 0.4 + p.phase) * 0.003;
        p.baseX += Math.cos(elapsedTime * 0.3 + p.phase) * 0.003;

        // Scroll warp velocity
        p.z -= scrollFactor * 0.05;
        if (p.z < -8) p.z = 10;
        if (p.z > 10) p.z = -8;

        // Mouse magnetic attractor force
        const dx = cursor3D.x - p.x;
        const dy = cursor3D.y - p.y;
        const dz = cursor3D.z - p.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 5.0) {
          const force = (5.0 - dist) * 0.008;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.vz += (dz / dist) * force;
        }

        // Return to base positions with spring damping
        p.vx += (p.baseX - p.x) * 0.015;
        p.vy += (p.baseY - p.y) * 0.015;
        p.vz += (p.baseZ - p.z) * 0.015;

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.vz *= 0.92;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      }

      particleGeo.attributes.position.needsUpdate = true;

      // E. Soft Camera Parallax tracking cursor & scroll glide
      camera.position.x = mouse.x * 1.2;
      camera.position.y = mouse.y * 0.9 - (scroll.current * 0.001);
      camera.lookAt(mainGroup.position.x * 0.4, mainGroup.position.y * 0.4, 0);

      // Update shader time
      particleMat.uniforms.uTime.value = elapsedTime;

      renderer.render(scene, camera);
    };

    animate();

    // 12. Complete Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      knotGeo.dispose();
      knotMat.dispose();
      wireMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
    />
  );
}
