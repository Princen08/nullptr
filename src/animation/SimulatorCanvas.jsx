import { useRef, useEffect } from 'react';
import { T } from '../theme';

// Utility to resolve CSS variables in Canvas
function resolveColor(colorVar) {
  if (!colorVar || !colorVar.startsWith('var')) return colorVar;
  const name = colorVar.slice(4, -1);
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgba(color, alpha) {
  const resolved = resolveColor(color);
  if (resolved.startsWith('rgba')) {
    return resolved.replace(/[\d.]+\)$/g, `${alpha})`);
  }
  if (resolved.startsWith('rgb')) {
    return resolved.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }
  if (resolved.startsWith('#')) {
    let r = parseInt(resolved.slice(1, 3), 16),
        g = parseInt(resolved.slice(3, 5), 16),
        b = parseInt(resolved.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return resolved;
}

export default function SimulatorCanvas({ currentContent, flyingParts, flashText }) {
  const canvasRef = useRef(null);

  const ZONES = {
    stack: { x: 0.15, y: 0.6, w: 0.2, h: 0.6, color: T.accent, label: "Call Stack" },
    apis: { x: 0.5, y: 0.2, w: 0.3, h: 0.2, color: T.purple, label: "Web APIs" },
    micro: { x: 0.5, y: 0.5, w: 0.3, h: 0.2, color: T.green, label: "Microtask Queue" },
    task: { x: 0.85, y: 0.6, w: 0.2, h: 0.6, color: T.amber, label: "Task Queue" },
    loop: { x: 0.5, y: 0.85, r: 40, color: T.text, label: "Event Loop" }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      const w = rect.width;
      const h = rect.height;
      const time = Date.now();

      ctx.clearRect(0, 0, w, h);

      const resolvedTextColor = resolveColor(T.text);
      const resolvedSurfaceColor = resolveColor(T.surface);

      // Draw Zones
      Object.keys(ZONES).forEach(k => {
        const z = ZONES[k];
        const resolvedZoneColor = resolveColor(z.color);

        if (k === 'loop') {
          const cx = z.x * w;
          const cy = z.y * h;
          const spinning = (time * 0.003);
          const isChecking = flashText !== "";
          
          ctx.beginPath();
          ctx.arc(cx, cy, z.r, 0, Math.PI * 2);
          ctx.strokeStyle = isChecking ? resolvedTextColor : hexToRgba(T.text, 0.2);
          ctx.lineWidth = isChecking ? 4 : 2;
          ctx.setLineDash([10, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
          
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(spinning);
          ctx.beginPath();
          ctx.arc(0, 0, z.r - 8, 0, Math.PI * 0.5);
          ctx.strokeStyle = resolveColor(T.accent);
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = isChecking ? resolvedTextColor : resolveColor(T.muted);
          ctx.font = '600 12px Poppins, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(z.label.toUpperCase(), cx, cy + z.r + 20);
          
          if (flashText) {
            ctx.fillStyle = resolvedTextColor;
            ctx.font = 'italic 500 13px Roboto, sans-serif';
            ctx.fillText(flashText, cx, cy + z.r + 40);
          }
          return;
        }

        const zx = z.x * w - (z.w * w) / 2;
        const zy = z.y * h - (z.h * h) / 2;
        const zw = z.w * w;
        const zh = z.h * h;

        ctx.strokeStyle = hexToRgba(z.color, 0.3);
        ctx.lineWidth = 1;
        ctx.strokeRect(zx, zy, zw, zh);
        
        ctx.fillStyle = hexToRgba(z.color, 0.05);
        ctx.fillRect(zx, zy, zw, zh);

        ctx.fillStyle = resolvedZoneColor;
        ctx.font = '700 11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(z.label.toUpperCase(), z.x * w, zy - 10);

        // Draw content
        const items = currentContent[k] || [];
        items.forEach((item, i) => {
          const itemH = 30;
          const itemW = zw - 20;
          let iy;
          if (k === 'stack') {
            iy = (zy + zh) - (i + 1) * (itemH + 5);
          } else {
            iy = zy + 10 + i * (itemH + 5);
          }
          
          ctx.fillStyle = hexToRgba(z.color, 0.2);
          ctx.beginPath();
          ctx.roundRect(z.x * w - itemW / 2, iy, itemW, itemH, 4);
          ctx.fill();
          ctx.strokeStyle = resolvedZoneColor;
          ctx.stroke();

          ctx.fillStyle = resolvedTextColor;
          ctx.font = '10px Roboto Mono, monospace';
          ctx.fillText(item, z.x * w, iy + 18);
        });
      });

      // Draw Flying Parts
      flyingParts.forEach(p => {
        const f = ZONES[p.from];
        const t = ZONES[p.to];
        const fx = f.x * w;
        const fy = f.y * h;
        const tx = t.x * w;
        const ty = t.y * h;
        
        const cpX = (fx + tx) / 2;
        const cpY = Math.min(fy, ty) - 100;
        
        const t_ = p.progress;
        const x = (1-t_)*(1-t_)*fx + 2*(1-t_)*t_*cpX + t_*t_*tx;
        const y = (1-t_)*(1-t_)*fy + 2*(1-t_)*t_*cpY + t_*t_*ty;

        const resolvedFromColor = resolveColor(f.color);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = resolvedFromColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = resolvedFromColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = resolvedSurfaceColor;
        const tw = ctx.measureText(p.label).width;
        ctx.beginPath();
        ctx.roundRect(x - (tw+10)/2, y - 25, tw + 10, 16, 8);
        ctx.fill();
        ctx.strokeStyle = resolvedFromColor;
        ctx.stroke();
        ctx.fillStyle = resolvedTextColor;
        ctx.font = '9px Roboto Mono';
        ctx.fillText(p.label, x, y - 14);
      });

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [currentContent, flyingParts, flashText]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
