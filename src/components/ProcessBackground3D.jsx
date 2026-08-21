import React, { useRef, useEffect } from 'react';

export default function ProcessBackground3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Get parent element (section id="process") to listen to mouse moves
    const parent = containerRef.current.parentElement;

    const resizeCanvas = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
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

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    // Flow config
    const numStrands = 3;
    const nodesPerStrand = 55;
    const baseSpacingX = 35;

    // 3D rotation math helper
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

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += 0.012; // slow, smooth workflow rate

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fov = 500;

      // Project particles in 3D strands
      const strands = [];

      for (let s = 0; s < numStrands; s++) {
        strands[s] = [];
        const baseOffsetY = (s - 1) * 80; // separate strand offsets vertically
        
        for (let i = 0; i < nodesPerStrand; i++) {
          const lx = (i - nodesPerStrand / 2) * baseSpacingX;
          
          // Compute wave dynamics
          let lz = Math.sin(i * 0.18 + time + s) * 45;
          let ly = baseOffsetY + Math.cos(i * 0.12 + time * 0.8 + s) * 20;

          // Apply slight landscape tilt
          let pt = { x: lx, y: ly + 20, z: lz };
          pt = rotXMatrix(pt, Math.PI / 5.2);
          pt = rotYMatrix(pt, Math.PI / 15);

          // Perspective screen translation projection
          const scale = fov / (fov + pt.z);
          const sx = pt.x * scale + centerX;
          const sy = pt.y * scale + centerY;

          strands[s].push({ sx, sy, sz: pt.z, color: s === 1 ? '#ffffff' : '#f2603e' });
        }
      }

      // Add Mouse repulsion grid pushes
      if (mouseRef.current.active && mouseRef.current.x !== null) {
        for (let s = 0; s < numStrands; s++) {
          for (let i = 0; i < nodesPerStrand; i++) {
            const node = strands[s][i];
            const dx = node.sx - mouseRef.current.x;
            const dy = node.sy - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              const force = (130 - dist) / 130;
              const angle = Math.atan2(dy, dx);
              // Displace node slightly away from cursor
              node.sx += Math.cos(angle) * force * 18;
              node.sy += Math.sin(angle) * force * 18;
            }
          }
        }
      }

      // Draw connections along each strand
      ctx.lineWidth = 1.0;
      for (let s = 0; s < numStrands; s++) {
        for (let i = 0; i < nodesPerStrand - 1; i++) {
          const pt1 = strands[s][i];
          const pt2 = strands[s][i + 1];

          // Compute average depth and opacity
          const avgZ = (pt1.sz + pt2.sz) / 2;
          const depthFactor = (avgZ + 100) / 200; // normalized depth
          const opacity = Math.max(0.015, (1 - depthFactor) * 0.08); // very subtle back fader

          ctx.beginPath();
          ctx.moveTo(pt1.sx, pt1.sy);
          ctx.lineTo(pt2.sx, pt2.sy);
          
          if (pt1.color === '#ffffff') {
            ctx.strokeStyle = `rgba(245, 244, 239, ${opacity * 1.5})`;
          } else {
            ctx.strokeStyle = `rgba(242, 96, 62, ${opacity})`;
          }
          
          ctx.stroke();
        }
      }

      // Draw Nodes
      for (let s = 0; s < numStrands; s++) {
        for (let i = 0; i < nodesPerStrand; i += 2) { // draw every alternate node
          const pt = strands[s][i];
          const opacity = Math.max(0.02, (1 - (pt.sz + 80) / 160) * 0.16);

          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, 1.0, 0, Math.PI * 2);
          ctx.fillStyle = pt.color === '#ffffff' ? `rgba(245, 244, 239, ${opacity * 1.5})` : `rgba(242, 96, 62, ${opacity})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-55"
      />
    </div>
  );
}
