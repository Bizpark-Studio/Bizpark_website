import React, { useRef, useEffect, useState } from 'react';

export default function CyberKnot() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const [hudStats, setHudStats] = useState({ lobes: 'p: 3 | q: 5', load: '12.4 TFLOPS' });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Handle Resize to fit the hero tilted showcase card aspect ratio
    const resizeCanvas = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinate offsets inside the card
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - canvas.width / 2;
      const y = e.clientY - rect.top - canvas.height / 2;
      mouseRef.current.targetX = x * 0.003;
      mouseRef.current.targetY = y * 0.003;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 3D Math rotation matrices
    const rotXMatrix = (p, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x,
        y: p.y * cos - p.z * sin,
        z: p.y * sin + p.z * cos
      };
    };

    const rotYMatrix = (p, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos - p.z * sin,
        y: p.y,
        z: p.x * sin + p.z * cos
      };
    };

    const rotZMatrix = (p, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos,
        z: p.z
      };
    };

    // Vector normalization and cross product helpers for Tube construction
    const normalize = (v) => {
      const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      if (len === 0) return { x: 0, y: 0, z: 0 };
      return { x: v.x / len, y: v.y / len, z: v.z / len };
    };

    const cross = (v1, v2) => {
      return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
      };
    };

    // Animation constants
    let localRotX = 0;
    let localRotY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth camera tilt LERP based on mouse
      tiltX += (mouseRef.current.targetY - tiltX) * 0.08;
      tiltY += (mouseRef.current.targetX - tiltY) * 0.08;

      // Incremental time rotation
      time += 0.015;
      
      // Dynamic spin speed controlled by mouse activity
      const spinSpeedY = 0.008 + Math.abs(tiltY) * 0.05;
      const spinSpeedX = 0.004 + Math.abs(tiltX) * 0.05;
      localRotX += spinSpeedX;
      localRotY += spinSpeedY;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fov = 450;

      // 1. Generate Torus Knot Geometry spine points
      // We morph the knot parameters p & q based on time and mouse activity
      const p = 3; 
      const q = 4 + Math.sin(time * 0.5) * 0.4; // morphing lobe density
      const steps = 70; // segments along the knot path
      const tubeSegments = 8; // circle ribs around each spine step
      
      // Adjust thickness and radius dynamically based on cursor movement
      const baseRadius = 55 + Math.sin(time) * 5;
      const tubeRadius = 14 + Math.abs(tiltX + tiltY) * 20; 

      const spinePoints = [];
      for (let i = 0; i <= steps; i++) {
        const phi = (i / steps) * Math.PI * 2;
        
        // Torus knot path equations
        const r = baseRadius * (1.6 + 0.6 * Math.sin(q * phi));
        const x = r * Math.cos(p * phi);
        const y = r * Math.sin(p * phi);
        const z = baseRadius * 0.8 * Math.cos(q * phi);

        spinePoints.push({ x, y, z });
      }

      // 2. Generate 3D Tube mesh vertices around spine points
      const vertices = [];
      
      for (let i = 0; i < steps; i++) {
        const curr = spinePoints[i];
        const next = spinePoints[i + 1];

        // Spine direction vector
        const T = normalize({ x: next.x - curr.x, y: next.y - curr.y, z: next.z - curr.z });
        
        // Perpendicular vector N
        let refVec = { x: 0, y: 1, z: 0 };
        if (Math.abs(T.y) > 0.9) refVec = { x: 1, y: 0, z: 0 };
        const N = normalize(cross(T, refVec));
        
        // Binormal vector B
        const B = normalize(cross(T, N));

        // Generate circular ribs around the spine node
        const ring = [];
        for (let j = 0; j < tubeSegments; j++) {
          const theta = (j / tubeSegments) * Math.PI * 2;
          
          // Coordinate in the local normal/binormal plane
          const vx = curr.x + (N.x * Math.cos(theta) + B.x * Math.sin(theta)) * tubeRadius;
          const vy = curr.y + (N.y * Math.cos(theta) + B.y * Math.sin(theta)) * tubeRadius;
          const vz = curr.z + (N.z * Math.cos(theta) + B.z * Math.sin(theta)) * tubeRadius;

          ring.push({ x: vx, y: vy, z: vz });
        }
        vertices.push(ring);
      }

      // 3. Project and transform all mesh vertices to 2D
      const projected = vertices.map((ring) => {
        return ring.map((v) => {
          // Local Spin rotations
          let pt = rotXMatrix(v, localRotX);
          pt = rotYMatrix(pt, localRotY);
          pt = rotZMatrix(pt, time * 0.2);

          // Camera Tilts (parallax)
          pt = rotXMatrix(pt, tiltX * 1.5);
          pt = rotYMatrix(pt, -tiltY * 1.5);

          // Perspective projection scaling
          const scale = fov / (fov + pt.z);
          return {
            sx: pt.x * scale + centerX,
            sy: pt.y * scale + centerY,
            sz: pt.z
          };
        });
      });

      // 4. Draw Wireframe Tube Mesh Lines
      ctx.lineWidth = 0.8;
      const maxZ = 120; // normalized depth fader

      for (let i = 0; i < steps; i++) {
        const nextRingIdx = (i + 1) % steps;
        
        for (let j = 0; j < tubeSegments; j++) {
          const nextSegmentIdx = (j + 1) % tubeSegments;

          const pCurrent = projected[i][j];
          const pNextRing = projected[nextRingIdx][j];
          const pNextSegment = projected[i][nextSegmentIdx];

          // Compute average depth for lines opacity fading
          const avgZRing = (pCurrent.sz + pNextRing.sz) / 2;
          const avgZSegment = (pCurrent.sz + pNextSegment.sz) / 2;

          const normZRing = Math.max(0, Math.min(1, (avgZRing + maxZ) / (maxZ * 2)));
          const normZSegment = Math.max(0, Math.min(1, (avgZSegment + maxZ) / (maxZ * 2)));

          // Horizontal grid lines along tube length
          ctx.beginPath();
          ctx.moveTo(pCurrent.sx, pCurrent.sy);
          ctx.lineTo(pNextRing.sx, pNextRing.sy);
          
          // White filaments or Orange filaments
          if (j % 2 === 0) {
            ctx.strokeStyle = `rgba(245, 244, 239, ${Math.max(0.02, (1 - normZRing) * 0.16)})`;
          } else {
            ctx.strokeStyle = `rgba(242, 96, 62, ${Math.max(0.015, (1 - normZRing) * 0.12)})`;
          }
          ctx.stroke();

          // Vertical circular rib connections
          ctx.beginPath();
          ctx.moveTo(pCurrent.sx, pCurrent.sy);
          ctx.lineTo(pNextSegment.sx, pNextSegment.sy);
          ctx.strokeStyle = `rgba(242, 96, 62, ${Math.max(0.01, (1 - normZSegment) * 0.1)})`;
          ctx.stroke();
        }
      }

      // 5. Draw Glowing Mesh Nodes (alternate junctions)
      for (let i = 0; i < steps; i += 2) {
        for (let j = 0; j < tubeSegments; j += 2) {
          const node = projected[i][j];
          const normZ = (node.sz + maxZ) / (maxZ * 2);
          const opacity = Math.max(0.05, (1 - normZ) * 0.4);

          ctx.beginPath();
          ctx.arc(node.sx, node.sy, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = j % 4 === 0 ? `rgba(245, 244, 239, ${opacity * 1.5})` : `rgba(242, 96, 62, ${opacity})`;
          ctx.fill();
        }
      }

      // 6. Draw HUD overlays inside Canvas
      ctx.strokeStyle = 'rgba(242, 96, 62, 0.05)';
      ctx.lineWidth = 0.8;
      
      // Bounding HUD Circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.8, 0, Math.PI * 2);
      ctx.stroke();

      // Matrix target scope lines
      ctx.beginPath();
      ctx.moveTo(centerX - 10, centerY); ctx.lineTo(centerX + 10, centerY);
      ctx.moveTo(centerX, centerY - 10); ctx.lineTo(centerX, centerY + 10);
      ctx.stroke();

      // Trigger coordinates state updates slightly
      if (Math.random() > 0.98) {
        const calculatedLoad = (10 + Math.abs(tiltX * 20) + Math.random() * 2).toFixed(1);
        setHudStats({
          lobes: `p: ${p} | q: ${q.toFixed(2)}`,
          load: `${calculatedLoad} TFLOPS`
        });
      }

      animationId = requestAnimationFrame(render);
    };

    // Start rendering loops
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/2] bg-[#0d0d0d] cut overflow-hidden select-none"
    >
      {/* 3D Torus Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Cyberpunk HUD Frame Text Overlays */}
      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between font-mono text-[9px] text-[#605e58] z-10">
        
        {/* Top Section Info */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <span className="text-white/40 font-chakra text-[10px] tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#f2603e] rounded-full animate-ping" />
              CYBER_KNOT: ON
            </span>
            <span>TYPE: TREFOIL_RIB_MESH</span>
          </div>
          <div className="text-right">
            <span className="block text-white/50">{hudStats.lobes}</span>
            <span>SHAPE_MORPH: MORPHING</span>
          </div>
        </div>

        {/* Diagonal HUD Spinner circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-dashed border-[#f2603e]/10 animate-[spin_50s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dotted border-white/5 animate-[spin_30s_linear_infinite_reverse]" />

        {/* Bottom Section Info */}
        <div className="flex items-end justify-between w-full">
          <div className="space-y-0.5">
            <span className="block text-[8px]">ENGINE_LOAD:</span>
            <span className="text-[#f2603e] font-bold block">{hudStats.load}</span>
          </div>
          <div className="text-right space-y-0.5">
            <span>AXIS_MATRIX: PROJ_3D</span>
            <span className="block text-[#f5f4ef]/20 text-[8px]">BIZPARKSTUDIO // SHAPE_LOADER</span>
          </div>
        </div>

      </div>

      {/* Frame border highlight corners */}
      <div className="absolute top-0 right-0 w-8 h-[1px] bg-[#f2603e]/40" />
      <div className="absolute top-0 right-0 w-[1px] h-8 bg-[#f2603e]/40" />
      <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-[#f2603e]/40" />
      <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-[#f2603e]/40" />
    </div>
  );
}
