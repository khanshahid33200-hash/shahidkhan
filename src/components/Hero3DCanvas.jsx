import React, { useRef, useEffect } from 'react';

const Hero3DCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Particles Mesh parameters
    const points = [];
    const numPoints = 85;
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.2,
      });
    }

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) * 0.001;
      mouseY = (e.clientY - rect.top - height / 2) * 0.001;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angleX += 0.003 + mouseY * 0.05;
      angleY += 0.005 + mouseX * 0.05;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (Math.abs(p.x) > 300) p.vx *= -1;
        if (Math.abs(p.y) > 300) p.vy *= -1;
        if (Math.abs(p.z) > 300) p.vz *= -1;

        // 3D Rotation
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;
        let x2 = p.x * cosY + z1 * sinY;
        let z2 = -p.x * sinY + z1 * cosY;

        // Perspective Projection
        const fov = 400;
        const scale = fov / (fov + z2 + 400);
        const xProj = x2 * scale + width / 2;
        const yProj = y1 * scale + height / 2;

        projected.push({ x: xProj, y: yProj, scale, radius: p.radius });

        // Draw Liquid Orange Point
        const alpha = Math.min(1, Math.max(0.15, scale * 0.9));
        ctx.fillStyle = `rgba(255, 107, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(xProj, yProj, p.radius * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw mesh connection lines
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.28;
            ctx.strokeStyle = `rgba(255, 138, 0, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-70">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default Hero3DCanvas;
