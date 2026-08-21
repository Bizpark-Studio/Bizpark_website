import React, { useRef, useEffect, useState } from 'react';

export default function CyberGlobe() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [coordinates, setCoordinates] = useState({ lat: '6.9271° N', lon: '79.8612° E' });
  const [sysTime, setSysTime] = useState('');

  // Mouse coordinate tracking
  const mouseRef = useRef({ x: null, y: null, active: false });

  // Update holographic dashboard readouts
  useEffect(() => {
    const coordInterval = setInterval(() => {
      // Simulate real-time satellite coordination changes
      const randomLatOffset = (Math.random() * 0.009).toFixed(4);
      const randomLonOffset = (Math.random() * 0.009).toFixed(4);
      setCoordinates({
        lat: `6.92${randomLatOffset.slice(2)}° N`,
        lon: `79.86${randomLonOffset.slice(2)}° E`
      });
    }, 4000);

    const clockInterval = setInterval(() => {
      const now = new Date();
      setSysTime(now.toTimeString().split(' ')[0]);
    }, 1000);

    return () => {
      clearInterval(coordInterval);
      clearInterval(clockInterval);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Set Canvas Dimensions based on container
    const resizeCanvas = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fibonacci Sphere Particle Generation
    const N = 130;
    const baseRadius = 135;
    const points = [];

    for (let i = 0; i < N; i++) {
      // Fibonacci distribution across a sphere
      const phi = Math.acos(-1 + (2 * i) / N);
      const theta = Math.sqrt(N * Math.PI) * phi;
      
      points.push({
        x: baseRadius * Math.cos(theta) * Math.sin(phi),
        y: baseRadius * Math.sin(theta) * Math.sin(phi),
        z: baseRadius * Math.cos(phi),
        baseX: baseRadius * Math.cos(theta) * Math.sin(phi),
        baseY: baseRadius * Math.sin(theta) * Math.sin(phi),
        baseZ: baseRadius * Math.cos(phi),
        color: i % 4 === 0 ? '#ffffff' : '#f2603e' // Mix white nodes with primary orange nodes
      });
    }

    // Animation constants
    let angleY = 0.0025; // Auto rotation Y
    let angleX = 0.0012; // Auto rotation X

    // Helper functions for 3D rotation
    const rotateY = (pt, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = pt.x * cos - pt.z * sin;
      const z = pt.x * sin + pt.z * cos;
      return { ...pt, x, z };
    };

    const rotateX = (pt, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = pt.y * cos - pt.z * sin;
      const z = pt.y * sin + pt.z * cos;
      return { ...pt, y, z };
    };

    const drawScene = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fov = 400;

      // 1. Rotate all particles in 3D space
      for (let i = 0; i < points.length; i++) {
        let pt = points[i];
        
        // Auto-rotation
        pt = rotateY(pt, angleY);
        pt = rotateX(pt, angleX);
        
        points[i] = pt;
      }

      // 2. Compute projected positions and cursor interactions
      const projected = points.map((pt) => {
        // Translate & Scale perspective projection
        const scale = fov / (fov + pt.z);
        let sx = pt.x * scale + centerX;
        let sy = pt.y * scale + centerY;

        // Mouse Attraction/Displacement physics (2D cursor space)
        if (mouseRef.current.active && mouseRef.current.x !== null) {
          const dx = sx - mouseRef.current.x;
          const dy = sy - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 110) {
            // Calculate push force inversely proportional to distance
            const force = (110 - dist) / 110;
            const angle = Math.atan2(dy, dx);
            sx += Math.cos(angle) * force * 20;
            sy += Math.sin(angle) * force * 20;
          }
        }

        return {
          sx,
          sy,
          depth: pt.z,
          color: pt.color
        };
      });

      // 3. Draw Connecting Links (Constellation lines)
      const maxDistance3D = 75;
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const proj1 = projected[i];

        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const proj2 = projected[j];

          // Compute 3D distance between nodes
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < maxDistance3D) {
            // Determine alpha based on 3D distance and average depth
            const avgDepth = (p1.z + p2.z) / 2;
            const depthFactor = (avgDepth + baseRadius) / (2 * baseRadius); // 0 (front) to 1 (back)
            
            // Fader for connection
            const distanceFader = 1 - dist3D / maxDistance3D;
            const opacity = distanceFader * (1 - depthFactor * 0.7) * 0.18;
            
            ctx.beginPath();
            ctx.moveTo(proj1.sx, proj1.sy);
            ctx.lineTo(proj2.sx, proj2.sy);
            
            // White or orange connections
            if (p1.color === '#ffffff' && p2.color === '#ffffff') {
              ctx.strokeStyle = `rgba(245, 244, 239, ${opacity * 1.5})`;
            } else {
              ctx.strokeStyle = `rgba(242, 96, 62, ${opacity})`;
            }
            
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 4. Draw Nodes
      projected.forEach((node) => {
        // Size proportional to depth (foreground nodes are larger)
        const sizeFactor = (baseRadius - node.depth) / (2 * baseRadius); // 1 (front) to 0 (back)
        const radius = 1 + sizeFactor * 2.8;
        const opacity = 0.2 + sizeFactor * 0.8;

        ctx.beginPath();
        ctx.arc(node.sx, node.sy, radius, 0, Math.PI * 2);
        
        if (node.color === '#ffffff') {
          ctx.fillStyle = `rgba(245, 244, 239, ${opacity})`;
          ctx.shadowBlur = radius * 1.5;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        } else {
          ctx.fillStyle = `rgba(242, 96, 62, ${opacity})`;
          ctx.shadowBlur = radius * 2;
          ctx.shadowColor = 'rgba(242, 96, 62, 0.5)';
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for lines
      });

      // 5. Draw Cyber HUD Details in Canvas
      ctx.strokeStyle = 'rgba(242, 96, 62, 0.05)';
      ctx.lineWidth = 1;
      
      // Horizontal centerline
      ctx.beginPath();
      ctx.moveTo(10, centerY);
      ctx.lineTo(canvas.width - 10, centerY);
      ctx.stroke();
      
      // Vertical centerline
      ctx.beginPath();
      ctx.moveTo(centerX, 10);
      ctx.lineTo(centerX, canvas.height - 10);
      ctx.stroke();

      // Outer bounding wireframe circles
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + 15, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(242, 96, 62, 0.08)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + 45, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 244, 239, 0.03)';
      ctx.stroke();

      animationId = requestAnimationFrame(drawScene);
    };

    // Begin Animation Loop
    animationId = requestAnimationFrame(drawScene);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Mouse listeners
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[3/2] bg-[#0d0d0d] cut border border-[#f2603e]/30 shadow-2xl shadow-[#f2603e]/10 overflow-hidden group select-none"
    >
      {/* 3D Hologram Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Cyber HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-between font-mono text-[9px] text-[#605e58] select-none z-10">
        
        {/* Top bar */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-1">
            <span className="text-white/40 font-chakra text-[10px] tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#f2603e] rounded-full animate-ping" />
              HOLO_SYS: ACTIVE
            </span>
            <span>FREQ: 60Hz · NODES: 130</span>
          </div>
          <div className="text-right">
            <span className="block text-white/50">{sysTime || '00:00:00'}</span>
            <span>SEC_STATUS: SECURE</span>
          </div>
        </div>

        {/* Diagonal reticle indicators (cyber decorations) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-dashed border-[#f2603e]/10 animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-dotted border-[#f5f4ef]/5 animate-[spin_40s_linear_infinite_reverse]" />

        {/* Bottom bar */}
        <div className="flex items-end justify-between w-full pt-12">
          <div className="space-y-0.5">
            <span className="block text-[8px] text-[#605e58]">SATELLITE SYNC:</span>
            <span className="text-[#f2603e] font-bold block">{coordinates.lat}</span>
            <span className="text-[#f2603e] font-bold block">{coordinates.lon}</span>
          </div>
          <div className="text-right space-y-0.5">
            <span className="block">PROJ_MATRIX: ISOMETRIC</span>
            <span className="block text-[#f5f4ef]/30 text-[8px]">BIZPARKSTUDIO // RENDER v1.0.2</span>
          </div>
        </div>

      </div>

      {/* Futuristic corner cut highlights */}
      <div className="absolute top-0 right-0 w-8 h-[1px] bg-[#f2603e]/40" />
      <div className="absolute top-0 right-0 w-[1px] h-8 bg-[#f2603e]/40" />
      <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-[#f2603e]/40" />
      <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-[#f2603e]/40" />
    </div>
  );
}
