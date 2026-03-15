import { useState, useRef, useEffect, useCallback } from 'react';
import { useCanvasLoop } from './useCanvasLoop';
import { T } from '../theme';

const NODES = {
  user:      { id: 'user', cx: 0.07, cy: 0.50, label: 'You', sub: 'Client' },
  browser:   { id: 'browser', cx: 0.25, cy: 0.28, label: 'Browser', sub: 'Cache' },
  resolver:  { id: 'resolver', cx: 0.48, cy: 0.52, label: 'ISP Resolver', sub: 'Recursive' },
  root:      { id: 'root', cx: 0.72, cy: 0.20, label: 'Root Server', sub: '(.)' },
  tld:       { id: 'tld', cx: 0.72, cy: 0.65, label: '.com TLD', sub: 'Top-Level' },
  auth:      { id: 'auth', cx: 0.88, cy: 0.42, label: 'Auth DNS', sub: 'google.com' },
  webserver: { id: 'webserver', cx: 0.25, cy: 0.78, label: 'google.com', sub: 'Web Server' }
};

const STEPS = [
  { id: 1, title: 'Type URL', phase: 'init', from: 'user', to: 'browser', active: ['user', 'browser'], packet: 'google.com', color: T.blue, detail: 'User types google.com into the address bar.' },
  { id: 2, title: 'Check Cache/Ask OS', phase: 'query', from: 'browser', to: 'resolver', active: ['browser', 'resolver'], packet: 'Query: google.com', color: T.accent, detail: 'Browser checks cache, then asks ISP Resolver.' },
  { id: 3, title: 'Query Root', phase: 'query', from: 'resolver', to: 'root', active: ['resolver', 'root'], packet: 'Where is .com?', color: T.amber, detail: 'Resolver has no cache, queries the root server.' },
  { id: 4, title: 'Root Response', phase: 'response', from: 'root', to: 'resolver', active: ['root', 'resolver'], packet: '.com TLD IP', color: T.green, detail: 'Root responds with IP of the .com TLD server.' },
  { id: 5, title: 'Query TLD', phase: 'query', from: 'resolver', to: 'tld', active: ['resolver', 'tld'], packet: 'Where is google?', color: T.amber, detail: 'Resolver asks .com TLD for google.com authoritative server.' },
  { id: 6, title: 'TLD Response', phase: 'response', from: 'tld', to: 'resolver', active: ['tld', 'resolver'], packet: 'Auth DNS IP', color: T.green, detail: 'TLD responds with the IP of google.com Auth DNS.' },
  { id: 7, title: 'Query Auth', phase: 'query', from: 'resolver', to: 'auth', active: ['resolver', 'auth'], packet: 'A Record?', color: T.amber, detail: 'Resolver queries Auth DNS for the A record.' },
  { id: 8, title: 'Auth Response', phase: 'response', from: 'auth', to: 'resolver', active: ['auth', 'resolver'], packet: '142.250.x.x', color: T.green, detail: 'Auth DNS replies with the actual IP address.' },
  { id: 9, title: 'Cache & Reply', phase: 'response', from: 'resolver', to: 'browser', active: ['resolver', 'browser'], packet: '142.250.x.x', color: T.green, detail: 'Resolver caches the IP and returns it to the browser.' },
  { id: 10, title: 'Connect to Web', phase: 'done', from: 'browser', to: 'webserver', active: ['browser', 'webserver'], packet: 'HTTP GET', color: T.purple, detail: 'Browser connects to the resolved IP to fetch the page.' }
];

const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Resolve CSS variables and handle opacity
function resolveColor(colorVar) {
  if (!colorVar.startsWith('var')) return colorVar;
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

function drawIcon(ctx, iconType, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(r/24, r/24);
  ctx.beginPath();
  if(iconType === 'user' || iconType === 'browser') {
    ctx.rect(-8, -6, 16, 10);
    ctx.moveTo(-4, 8); ctx.lineTo(4, 8);
    ctx.moveTo(0, 4); ctx.lineTo(0, 8);
  } else if(iconType === 'globe' || iconType === 'root') {
    ctx.arc(0, 0, 8, 0, Math.PI*2);
    ctx.moveTo(-8, 0); ctx.lineTo(8, 0);
    ctx.moveTo(0, -8); ctx.lineTo(0, 8);
  } else {
    ctx.rect(-6, -8, 12, 4);
    ctx.rect(-6, -2, 12, 4);
    ctx.rect(-6, 4, 12, 4);
  }
  ctx.stroke();
  ctx.restore();
}

export default function DNSGraph() {
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const waitTimeRef = useRef(0);

  const setStepIdxSafe = (idx) => {
    progressRef.current = 0;
    setStepIdx(Math.max(0, Math.min(idx, STEPS.length - 1)));
  };

  const draw = useCallback((ctx, w, h) => {
    const time = Date.now();
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;

    ctx.clearRect(0, 0, w, h);

    const step = STEPS[stepIdx];
    const resolvedStepColor = resolveColor(step.color);
    const resolvedTextColor = resolveColor(T.text);
    const resolvedMutedColor = resolveColor(T.muted);
    const resolvedBorderColor = resolveColor(T.border);
    
    if (isPlaying) {
      if (progressRef.current < 1) {
        progressRef.current = Math.min(1, progressRef.current + dt / 1500); 
      } else {
        if (waitTimeRef.current < 500) {
          waitTimeRef.current += dt;
        } else {
          waitTimeRef.current = 0;
          if (stepIdx < STEPS.length - 1) {
            setStepIdxSafe(stepIdx + 1);
          } else {
            setIsPlaying(false);
          }
        }
      }
    }

    const t = easeInOutCubic(progressRef.current);
    const pulsing = (Math.sin(time * 0.005) + 1) / 2;

    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    Object.keys(NODES).forEach(k1 => {
      Object.keys(NODES).forEach(k2 => {
        if (k1 < k2) {
          const n1 = NODES[k1], n2 = NODES[k2];
          ctx.beginPath();
          ctx.setLineDash([4, 6]);
          ctx.strokeStyle = hexToRgba(T.text, 0.06);
          ctx.moveTo(n1.cx * w, n1.cy * h);
          ctx.lineTo(n2.cx * w, n2.cy * h);
          ctx.stroke();
        }
      });
    });

    ctx.setLineDash([]);
    if (step.from && step.to) {
      const fn = NODES[step.from];
      const tn = NODES[step.to];
      ctx.beginPath();
      ctx.strokeStyle = progressRef.current < 1 ? resolvedStepColor : hexToRgba(step.color, 0.3);
      ctx.lineWidth = progressRef.current < 1 ? 2 : 1;
      ctx.moveTo(fn.cx * w, fn.cy * h);
      ctx.lineTo(tn.cx * w, tn.cy * h);
      ctx.stroke();
    }

    Object.values(NODES).forEach(node => {
      const isActive = step.active.includes(node.id);
      const nx = node.cx * w;
      const ny = node.cy * h;
      const r = 27;

      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI * 2);
      
      if (isActive) {
        ctx.fillStyle = hexToRgba(step.color, 0.15 + pulsing * 0.1);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = resolvedStepColor;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(nx, ny, r + 4 + pulsing * 4, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(step.color, 0.1);
        ctx.fill();
      } else {
        ctx.fillStyle = hexToRgba(T.text, 0.04);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = hexToRgba(T.text, 0.09);
        ctx.stroke();
      }

      ctx.strokeStyle = isActive ? resolvedTextColor : hexToRgba(T.text, 0.5);
      ctx.lineWidth = 1.5;
      drawIcon(ctx, node.id, nx, ny, r);

      ctx.fillStyle = isActive ? resolvedTextColor : hexToRgba(T.text, 0.7);
      ctx.font = '600 11px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny + r + 16);
      
      ctx.fillStyle = hexToRgba(T.text, 0.4);
      ctx.font = '9px Roboto Mono, monospace';
      ctx.fillText(node.sub, nx, ny + r + 28);
    });

    if (progressRef.current > 0 && progressRef.current < 1) {
      const fn = NODES[step.from];
      const tn = NODES[step.to];
      const px = fn.cx * w + (tn.cx * w - fn.cx * w) * t;
      const py = fn.cy * h + (tn.cy * h - fn.cy * h) * t;

      for(let i=1; i<=8; i++) {
        const tr = progressRef.current - (i * 0.02);
        if(tr > 0) {
          const et = easeInOutCubic(tr);
          const trx = fn.cx * w + (tn.cx * w - fn.cx * w) * et;
          const try_ = fn.cy * h + (tn.cy * h - fn.cy * h) * et;
          ctx.beginPath();
          ctx.arc(trx, try_, 3, 0, Math.PI*2);
          ctx.fillStyle = hexToRgba(step.color, 1 - (i*0.1));
          ctx.fill();
        }
      }

      ctx.beginPath();
      ctx.arc(px, py, 6 + pulsing*2, 0, Math.PI*2);
      ctx.fillStyle = resolvedStepColor;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI*2);
      ctx.fillStyle = resolveColor(T.bg);
      ctx.fill();

      ctx.font = '10px Roboto Mono, monospace';
      const tw = ctx.measureText(step.packet).width;
      const pillW = tw + 16;
      ctx.fillStyle = resolveColor(T.surface);
      ctx.strokeStyle = resolvedStepColor;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.roundRect(px - pillW/2, py - 32, pillW, 20, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = resolvedTextColor;
      ctx.fillText(step.packet, px, py - 18);
    }

  }, [stepIdx, isPlaying]);

  const canvasRef = useCanvasLoop(draw, [stepIdx, isPlaying]);
  const currentStep = STEPS[stepIdx];

  return (
    <div style={{ margin: '48px 0', border: `1px solid ${T.border}`, borderRadius: '12px', overflow: 'hidden', background: T.surface }}>
      <div style={{ position: 'relative', width: '100%', height: '400px', background: T.bg }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
      
      <div style={{ padding: '24px', borderTop: `1px solid ${T.border}`, background: T.surfaceHigh }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'Roboto Mono', color: resolveColor(currentStep.color), textTransform: 'uppercase', marginBottom: '4px' }}>
              Step {currentStep.id} of 10 — {currentStep.phase}
            </div>
            <div style={{ fontSize: '1.25rem', fontFamily: 'Poppins', fontWeight: 600, color: T.text }}>
              {currentStep.title}
            </div>
            <div style={{ fontSize: '0.95rem', color: T.muted, marginTop: '4px' }}>
              {currentStep.detail}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setStepIdxSafe(0)} style={{ padding: '8px 16px', border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.85rem', color: T.text }}>
              Reset
            </button>
            <button onClick={() => setStepIdxSafe(stepIdx - 1)} disabled={stepIdx === 0} style={{ padding: '8px 16px', border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.85rem', color: stepIdx === 0 ? T.muted : T.text }}>
              Back
            </button>
            <button onClick={() => setStepIdxSafe(stepIdx + 1)} disabled={stepIdx === STEPS.length - 1} style={{ padding: '8px 16px', border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.85rem', color: stepIdx === STEPS.length - 1 ? T.muted : T.text }}>
              Next
            </button>
            <button onClick={() => {
              if (stepIdx === STEPS.length - 1) setStepIdxSafe(0);
              setIsPlaying(!isPlaying);
            }} style={{ padding: '8px 16px', background: isPlaying ? T.surface : T.accent, color: isPlaying ? T.text : '#fff', border: isPlaying ? `1px solid ${T.borderMid}` : 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
              {isPlaying ? 'Pause' : 'Auto Play'}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, height: '4px', background: i <= stepIdx ? resolveColor(s.color) : T.borderMid, borderRadius: '2px', transition: 'background 0.3s' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
