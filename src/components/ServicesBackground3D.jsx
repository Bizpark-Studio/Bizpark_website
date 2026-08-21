import React, { useRef, useEffect } from 'react';

export default function ServicesBackground3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0; // Incremental local time variable to avoid Date.now() trigonometric precision loss

    // Get parent element to attach mouse listeners (since canvas has pointer-events-none)
    const parent = containerRef.current.parentElement;

    const resizeCanvas = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse coordinate listener (attached to parent section)
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

    // Grid Dimension Definitions
    const cols = 28;
    const rows = 18;
    const spacingX = 65;
    const spacingY = 50;

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

      // Increment local time smoothly per animation frame
      time += 0.016; 
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fov = 600;

      // Project grid vertices
      const grid = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          // Local Grid Coordinates centered in space
          const lx = (c - cols / 2) * spacingX;
          const ly = (r - rows / 2) * spacingY;
          
          // Undulating sine wave calculation driven by column/row indexes and time
          let lz = Math.sin(c * 0.28 + time) * Math.cos(r * 0.28 + time) * 35;
          
          // Apply isometric rotation matrices to create a 3D landscape slope
          let pt = { x: lx, y: ly + 120, z: lz };
          pt = rotXMatrix(pt, Math.PI / 4.8); // Tilt downwards
          pt = rotYMatrix(pt, -Math.PI / 16);  // Minor side angle rotation

          // Perspective screen translation projection
          const scale = fov / (fov + pt.z);
          const sx = pt.x * scale + centerX;
          const sy = pt.y * scale + centerY;

          grid[r].push({ sx, sy, sz: pt.z, r, c });
        }
      }

      // Add Mouse interactive repulsion ripple directly on projected coordinates
      if (mouseRef.current.active && mouseRef.current.x !== null) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const node = grid[r][c];
            const dx = node.sx - mouseRef.current.x;
            const dy = node.sy - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 160) {
              // Node displacement vector
              const force = (160 - dist) / 160;
              const angle = Math.atan2(dy, dx);
              // Shift screen coordinates outwards (glowing ripple effect)
              node.sx += Math.cos(angle) * force * 24;
              node.sy += Math.sin(angle) * force * 24;
            }
          }
        }
      }

      // Draw Grid Mesh Lines
      ctx.lineWidth = 0.8;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = grid[r][c];

          // Draw Horizontal Connections
          if (c < cols - 1) {
            const nextCol = grid[r][c + 1];
            // Normalize depth of line for opacity fade
            const avgZ = (node.sz + nextCol.sz) / 2;
            const opacity = Math.max(0.015, (1 - (avgZ + 100) / 200) * 0.08); // faint orange lines

            ctx.beginPath();
            ctx.moveTo(node.sx, node.sy);
            ctx.lineTo(nextCol.sx, nextCol.sy);
            ctx.strokeStyle = `rgba(242, 96, 62, ${opacity})`;
            ctx.stroke();
          }

          // Draw Vertical Connections
          if (r < rows - 1) {
            const nextRow = grid[r + 1][c];
            const avgZ = (node.sz + nextRow.sz) / 2;
            const opacity = Math.max(0.015, (1 - (avgZ + 100) / 200) * 0.08);

            ctx.beginPath();
            ctx.moveTo(node.sx, node.sy);
            ctx.lineTo(nextRow.sx, nextRow.sy);
            ctx.strokeStyle = `rgba(242, 96, 62, ${opacity})`;
            ctx.stroke();
          }
        }
      }

      // Draw Grid Nodes (glowing dots)
      for (let r = 0; r < rows; r += 2) { // Render only alternate rows for speed & clean style
        for (let c = 0; c < cols; c += 2) {
          const node = grid[r][c];
          const opacity = Math.max(0.04, (1 - (node.sz + 80) / 160) * 0.25);
          
          ctx.beginPath();
          ctx.arc(node.sx, node.sy, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(242, 96, 62, ${opacity})`;
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
