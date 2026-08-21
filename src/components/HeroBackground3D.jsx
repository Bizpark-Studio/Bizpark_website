import React, { useRef, useEffect } from 'react';

export default function HeroBackground3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Handle Resize to cover the full parent Hero container
    const resizeCanvas = () => {
      const parent = containerRef.current.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse move for parallax camera tilts
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - canvas.width / 2;
      const y = e.clientY - rect.top - canvas.height / 2;
      mouseRef.current.targetX = x * 0.0006;
      mouseRef.current.targetY = y * 0.0006;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Geometry Generation Helper
    const createCube = (size) => {
      const vertices = [
        { x: -size, y: -size, z: -size },
        { x: size, y: -size, z: -size },
        { x: size, y: size, z: -size },
        { x: -size, y: size, z: -size },
        { x: -size, y: -size, z: size },
        { x: size, y: -size, z: size },
        { x: size, y: size, z: size },
        { x: -size, y: size, z: size }
      ];
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // Back face
        [4, 5], [5, 6], [6, 7], [7, 4], // Front face
        [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
      ];
      return { vertices, edges };
    };

    const createPyramid = (size) => {
      const vertices = [
        { x: 0, y: -size * 1.2, z: 0 }, // Apex
        { x: -size, y: size, z: -size },
        { x: size, y: size, z: -size },
        { x: size, y: size, z: size },
        { x: -size, y: size, z: size }
      ];
      const edges = [
        [0, 1], [0, 2], [0, 3], [0, 4], // Apex connectors
        [1, 2], [2, 3], [3, 4], [4, 1]  // Base face
      ];
      return { vertices, edges };
    };

    const createDoubleRing = (radius, height, segments = 10) => {
      const vertices = [];
      const edges = [];
      
      // Top Ring (Y = -height/2)
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        vertices.push({
          x: radius * Math.cos(angle),
          y: -height / 2,
          z: radius * Math.sin(angle)
        });
      }
      
      // Bottom Ring (Y = height/2)
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        vertices.push({
          x: radius * Math.cos(angle),
          y: height / 2,
          z: radius * Math.sin(angle)
        });
      }

      // Construct Edges
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        edges.push([i, next]); // Top ring edge
        edges.push([i + segments, next + segments]); // Bottom ring edge
        edges.push([i, i + segments]); // Vertical connectors
        edges.push([i, next + segments]); // Diagonal columns (futuristic mesh detail)
      }

      return { vertices, edges };
    };

    // Instantiate Shape Data structures
    const shapes = [
      {
        ...createCube(40),
        id: 'cube', // Web development (layouts / boxes)
        label: 'WEB_DEV / CONTAINER',
        offsetX: -0.26, // Left side
        offsetY: -0.05,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        spinX: 0.003,
        spinY: 0.005,
        spinZ: 0.002
      },
      {
        ...createDoubleRing(38, 55, 10),
        id: 'ring', // Graphic Design (vectors / primitives)
        label: 'DSGN_VEC / GEOMETRY',
        offsetX: 0.28, // Right side
        offsetY: 0.08,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        spinX: 0.004,
        spinY: 0.002,
        spinZ: 0.006
      },
      {
        ...createPyramid(40),
        id: 'pyramid', // Software Engineering (hierarchies / structures)
        label: 'SOFT_ENG / HIERARCHY',
        offsetX: 0.0, // Center
        offsetY: -0.22,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        spinX: 0.002,
        spinY: 0.006,
        spinZ: 0.001
      }
    ];

    // Constellation stars background
    const starsCount = 75;
    const stars = [];
    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 500,
        z: (Math.random() - 0.5) * 400,
        speedZ: (Math.random() * 0.2 + 0.05) // Subtle Z drift
      });
    }

    // 3D Math rotation helpers
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

    // Camera tilt parameters for parallax
    let camTiltX = 0;
    let camTiltY = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fov = 500;

      // Smooth Camera LERP towards target mouse offset
      camTiltX += (mouseRef.current.targetY - camTiltX) * 0.08;
      camTiltY += (mouseRef.current.targetX - camTiltY) * 0.08;

      // 1. Draw Star Constellation Background
      ctx.lineWidth = 0.5;
      const starsProjected = stars.map((s) => {
        // Apply camera tilt to stars
        let pt = rotXMatrix(s, camTiltX);
        pt = rotYMatrix(pt, camTiltY);
        
        // Z-axis drift
        s.z -= s.speedZ;
        if (s.z < -200) s.z = 200; // Warp back to front

        const scale = fov / (fov + pt.z);
        return {
          sx: pt.x * scale + centerX,
          sy: pt.y * scale + centerY,
          sz: pt.z
        };
      });

      // Draw constellation links
      for (let i = 0; i < starsProjected.length; i++) {
        const s1 = stars[i];
        const sp1 = starsProjected[i];
        
        for (let j = i + 1; j < starsProjected.length; j++) {
          const s2 = stars[j];
          const sp2 = starsProjected[j];
          
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dz = s1.z - s2.z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          
          if (dist < 80) {
            const opacity = (1 - dist / 80) * 0.07;
            ctx.beginPath();
            ctx.moveTo(sp1.sx, sp1.sy);
            ctx.lineTo(sp2.sx, sp2.sy);
            ctx.strokeStyle = `rgba(245, 244, 239, ${opacity})`;
            ctx.stroke();
          }
        }
      }

      // Draw star nodes
      starsProjected.forEach((sp) => {
        const size = Math.max(0.2, (fov - sp.sz) / fov * 1.5);
        ctx.beginPath();
        ctx.arc(sp.sx, sp.sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 244, 239, 0.25)`;
        ctx.fill();
      });

      // 2. Process and Render Rotating 3D Geometries
      shapes.forEach((shape) => {
        // Spin rotations
        shape.rotX += shape.spinX;
        shape.rotY += shape.spinY;
        shape.rotZ += shape.spinZ;

        // Position coordinates based on canvas fraction offsets
        const absX = centerX + canvas.width * shape.offsetX;
        const absY = centerY + canvas.height * shape.offsetY;

        // Project and transform shape vertices
        const projectedVertices = shape.vertices.map((v) => {
          // Local Rotate
          let pt = rotXMatrix(v, shape.rotX);
          pt = rotYMatrix(pt, shape.rotY);
          pt = rotZMatrix(pt, shape.rotZ);

          // Apply Global Camera tilt (parallax)
          pt = rotXMatrix(pt, camTiltX * 1.5);
          pt = rotYMatrix(pt, camTiltY * 1.5);

          // Translate to absolute coordinate center
          pt.x += (absX - centerX);
          pt.y += (absY - centerY);

          // Perspective scaling projection
          const scale = fov / (fov + pt.z);
          return {
            sx: pt.x * scale + centerX,
            sy: pt.y * scale + centerY,
            sz: pt.z
          };
        });

        // Draw shape edges
        ctx.lineWidth = 1.0;
        shape.edges.forEach(([u, v]) => {
          const pt1 = projectedVertices[u];
          const pt2 = projectedVertices[v];

          // Compute average depth factor
          const avgZ = (pt1.sz + pt2.sz) / 2;
          const depthFactor = (avgZ + 100) / 200; // normalized depth
          const opacity = Math.max(0.04, (1 - depthFactor) * 0.15); // fade background lines

          ctx.beginPath();
          ctx.moveTo(pt1.sx, pt1.sy);
          ctx.lineTo(pt2.sx, pt2.sy);
          ctx.strokeStyle = `rgba(242, 96, 62, ${opacity})`;
          ctx.stroke();
        });

        // Draw node vertices
        projectedVertices.forEach((pt) => {
          const size = Math.max(1, (200 - pt.sz) / 200 * 2.5);
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, size, 0, Math.PI * 2);
          ctx.fillStyle = '#f5f4ef';
          ctx.fill();
        });

        // Render technical text directly floating below shape
        const textYOffset = 80;
        const avgShapeZ = projectedVertices.reduce((sum, v) => sum + v.sz, 0) / projectedVertices.length;
        const textScale = fov / (fov + avgShapeZ);
        const textX = absX * textScale + (centerX * (1 - textScale));
        const textY = (absY + textYOffset) * textScale + (centerY * (1 - textScale));

        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(242, 96, 62, 0.12)';
        ctx.textAlign = 'center';
        ctx.fillText(`// ${shape.label}`, textX, textY);
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-65"
      />
    </div>
  );
}
