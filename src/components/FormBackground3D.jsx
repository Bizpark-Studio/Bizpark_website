import React, { useRef, useEffect } from 'react';

export default function FormBackground3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Get parent element (section id="requirement-form") to attach listeners
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

    // Initialize rising particles data structures
    const N = 55;
    const particles = [];
    const fov = 400;

    const createParticle = (initY = null) => {
      const spawnY = initY !== null ? initY : Math.random() * canvas.height;
      return {
        x: Math.random() * canvas.width,
        y: spawnY,
        z: (Math.random() - 0.5) * 300,
        speedY: Math.random() * 0.8 + 0.4, // speed rising upwards
        driftX: (Math.random() - 0.5) * 0.15,
        color: Math.random() > 0.75 ? '#ffffff' : '#f2603e',
        radius: Math.random() * 1.5 + 0.5
      };
    };

    // Fill array initially
    for (let i = 0; i < N; i++) {
      particles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 1. Update and Project particles
      const projected = particles.map((p) => {
        // Move particle upwards
        p.y -= p.speedY;
        p.x += p.driftX;

        // Reset particle to bottom if it floats off top
        if (p.y < -30) {
          const fresh = createParticle(canvas.height + 30);
          Object.assign(p, fresh);
        }

        // Perspective scale projection coordinates
        const scale = fov / (fov + p.z);
        let sx = (p.x - centerX) * scale + centerX;
        let sy = (p.y - centerY) * scale + centerY;

        // Mouse repulsion physics (push nodes away from cursor)
        if (mouseRef.current.active && mouseRef.current.x !== null) {
          const dx = sx - mouseRef.current.x;
          const dy = sy - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const force = (130 - dist) / 130;
            const angle = Math.atan2(dy, dx);
            // Push node away from the mouse cursor coordinates
            sx += Math.cos(angle) * force * 20;
            sy += Math.sin(angle) * force * 12;
          }
        }

        return {
          sx,
          sy,
          sz: p.z,
          color: p.color,
          radius: p.radius,
          orig: p
        };
      });

      // 2. Draw Connections (filament lines)
      const maxDistance = 90;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];

          // Compute 3D distance between raw particle parameters
          const dx = p1.orig.x - p2.orig.x;
          const dy = p1.orig.y - p2.orig.y;
          const dz = p1.orig.z - p2.orig.z;
          const dist3D = Math.sqrt(dx*dx + dy*dy + dz*dz);

          if (dist3D < maxDistance) {
            // Fade lines based on 3D distance and depth
            const distanceFactor = 1 - dist3D / maxDistance;
            const avgDepth = (p1.sz + p2.sz) / 2;
            const depthFactor = (avgDepth + 150) / 300; // normalized depth
            
            const opacity = distanceFactor * (1 - depthFactor * 0.7) * 0.08;

            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.strokeStyle = p1.color === '#ffffff' ? `rgba(245, 244, 239, ${opacity * 1.5})` : `rgba(242, 96, 62, ${opacity})`;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Nodes
      projected.forEach((node) => {
        const depthScale = (fov - node.sz) / fov;
        const radius = node.radius * depthScale;
        const opacity = Math.max(0.05, depthScale * 0.25);

        ctx.beginPath();
        ctx.arc(node.sx, node.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color === '#ffffff' ? `rgba(245, 244, 239, ${opacity * 1.5})` : `rgba(242, 96, 62, ${opacity})`;
        ctx.fill();
      });

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
