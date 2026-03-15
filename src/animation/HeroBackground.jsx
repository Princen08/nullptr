import { useRef, useEffect } from 'react';
import { T } from '../theme';

export default function HeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    let particles = [];
    
    const resolveColor = (colorVar) => {
      if (!colorVar || !colorVar.startsWith('var')) return colorVar;
      const name = colorVar.slice(4, -1);
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    };

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      particles = [];
      const count = Math.floor((rect.width * rect.height) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1
        });
      }
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const accentColor = resolveColor(T.accent);
      const mutedColor = resolveColor(T.muted);
      
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = rect.width;
        if (p.x > rect.width) p.x = 0;
        if (p.y < 0) p.y = rect.height;
        if (p.y > rect.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = i % 5 === 0 ? accentColor : mutedColor;
        ctx.globalAlpha = 0.2;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = accentColor;
            ctx.globalAlpha = (1 - dist / 100) * 0.1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });

      frame = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1, 
        opacity: 0.6 
      }} 
    />
  );
}
