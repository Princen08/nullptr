import { useRef, useEffect, useState, useCallback } from 'react';
import { T } from '../theme';

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

export default function TLSAnimation() {
  const canvasRef = useRef(null);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  const STEPS = [
    { phase: 'TCP', title: 'TCP Handshake', packet: 'SYN/SYN-ACK/ACK', from: 'browser', to: 'server', color: T.muted, hasArrow: true, detail: 'Establishing a reliable TCP connection before security starts.' },
    { phase: 'TLS', title: 'Client Hello', packet: 'ClientHello + key_share', from: 'browser', to: 'server', color: T.blue, hasArrow: true, detail: 'Browser sends supported ciphers and an ECDH public key share.' },
    { phase: 'TLS', title: 'Server Hello', packet: 'ServerHello + key_share', from: 'server', to: 'browser', color: T.amber, hasArrow: true, detail: 'Server chooses TLS 1.3 and sends its own ECDH public key share.' },
    { phase: 'Local', title: 'ECDH Key Derivation', packet: 'Shared Secret Generated', from: 'local', to: 'local', color: T.purple, hasArrow: false, detail: 'Both parties combine key shares to generate a matching shared secret.' },
    { phase: 'TLS', title: 'Encrypted Handshake', packet: 'Certificate + Finished [Encrypted]', from: 'server', to: 'browser', color: T.green, hasArrow: true, detail: 'Server sends its ID (Certificate) and verifies it can encrypt data.' },
    { phase: 'Local', title: 'Cert Verification', packet: 'Trust Chain Validated', from: 'local', to: 'local', color: T.purple, hasArrow: false, detail: 'Browser verifies the certificate against its Root Store CAs.' },
    { phase: 'TLS', title: 'Finished', packet: 'Finished [Encrypted]', from: 'browser', to: 'server', color: T.green, hasArrow: true, detail: 'Browser confirms encryption works on its side. Handshake complete.' },
    { phase: 'HTTP', title: 'GET Request', packet: 'GET / HTTP/2 [AES]', from: 'browser', to: 'server', color: T.accent, hasArrow: true, detail: 'Safe data transmission! The GET request is fully encrypted with AES.' },
    { phase: 'HTTP', title: 'HTTP Response', packet: '200 OK + HTML [AES]', from: 'server', to: 'browser', color: T.accent, hasArrow: true, detail: 'Encrypted response received. The padlock appears in the address bar.' }
  ];

  const draw = useCallback((ctx, w, h) => {
    const time = Date.now();
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;

    ctx.clearRect(0, 0, w, h);
    const browserX = w * 0.25;
    const serverX = w * 0.75;
    const startY = 80;
    const rowH = 45;

    const resolvedTextColor = resolveColor(T.text);
    const resolvedMutedColor = resolveColor(T.muted);
    const resolvedBorderMid = resolveColor(T.borderMid);
    const resolvedGreen = resolveColor(T.green);

    // Lifelines
    ctx.setLineDash([5, 5]); ctx.strokeStyle = resolvedBorderMid;
    ctx.beginPath(); ctx.moveTo(browserX, 40); ctx.lineTo(browserX, h - 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(serverX, 40); ctx.lineTo(serverX, h - 40); ctx.stroke();
    ctx.setLineDash([]);

    // Headers
    ctx.fillStyle = resolvedTextColor; ctx.font = '700 14px Poppins'; ctx.textAlign = 'center';
    ctx.fillText('Browser', browserX, 30); ctx.fillText('google.com', serverX, 30);
    ctx.font = '400 10px Roboto Mono'; ctx.fillStyle = resolvedMutedColor;
    ctx.fillText('Client', browserX, 45); ctx.fillText('Port 443', serverX, 45);

    // Encrypted Zone Band
    if (stepIdx >= 3) {
      const ezTop = startY + 3.5 * rowH;
      ctx.fillStyle = hexToRgba(T.green, 0.05);
      ctx.fillRect(browserX - 30, ezTop, serverX - browserX + 60, (h - 40) - ezTop);
      ctx.strokeStyle = hexToRgba(T.green, 0.2);
      ctx.setLineDash([2, 4]); ctx.strokeRect(browserX - 30, ezTop, serverX - browserX + 60, (h - 40) - ezTop);
      ctx.setLineDash([]);
      ctx.fillStyle = resolvedGreen; ctx.font = '700 10px Roboto Mono';
      ctx.fillText('ENCRYPTED ZONE (AES-256-GCM)', w/2, ezTop + 20);
    }

    // Steps
    STEPS.forEach((s, i) => {
      if (i > stepIdx && !isPlaying) return;
      const sy = startY + i * rowH;
      const t = (i === stepIdx) ? progressRef.current : 1;
      if (t <= 0 && i === stepIdx) return;

      const resolvedStepColor = resolveColor(s.color);

      if (s.hasArrow) {
        const startX = s.from === 'browser' ? browserX : serverX;
        const targetX = s.from === 'browser' ? serverX : browserX;
        const currentX = startX + (targetX - startX) * t;

        ctx.beginPath(); ctx.moveTo(startX, sy); ctx.lineTo(currentX, sy);
        ctx.strokeStyle = resolvedStepColor; ctx.lineWidth = 2; ctx.stroke();
        
        if (t > 0.95) {
          const head = s.from === 'browser' ? 5 : -5;
          ctx.beginPath(); 
          ctx.moveTo(targetX, sy); 
          ctx.lineTo(targetX - head, sy - 4); 
          ctx.lineTo(targetX - head, sy + 4); 
          ctx.fillStyle = resolvedStepColor;
          ctx.fill();
        }
        ctx.fillStyle = resolvedTextColor; ctx.font = '600 12px Roboto Mono'; ctx.fillText(s.packet, w / 2, sy - 12);
      } else {
        if (s.from === 'local') {
           ctx.beginPath(); ctx.arc(browserX, sy, 12, 0, Math.PI*2); ctx.fillStyle = hexToRgba(s.color, 0.2); ctx.fill(); 
           ctx.strokeStyle = resolvedStepColor; ctx.lineWidth = 2; ctx.stroke();
           ctx.beginPath(); ctx.arc(serverX, sy, 12, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        }
        ctx.fillStyle = resolvedTextColor; ctx.font = '600 12px Roboto'; ctx.fillText(s.title, w / 2, sy - 15);
      }
    });

    if (isPlaying && stepIdx < STEPS.length - 1) {
       progressRef.current += dt / 1500;
       if (progressRef.current >= 1) {
          progressRef.current = 0;
          setStepIdx(s => s + 1);
          if (stepIdx >= STEPS.length - 2) setIsPlaying(false);
       }
    } else if (isPlaying && stepIdx === -1) {
       // Start from -1
       progressRef.current += dt / 1500;
       if (progressRef.current >= 1) {
          progressRef.current = 0;
          setStepIdx(0);
       }
    }
  }, [stepIdx, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr) { canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; ctx.scale(dpr, dpr); }
      draw(ctx, rect.width, rect.height);
      frame = requestAnimationFrame(render);
    };
    render(); return () => cancelAnimationFrame(frame);
  }, [draw]);

  const currentStep = (stepIdx >= 0 && stepIdx < STEPS.length) ? STEPS[stepIdx] : { title: "Wait to start", detail: "Ready to initiate sequence.", color: T.accent, phase: 'READY' };

  return (
    <div style={{ margin: '48px 0', border: `1px solid ${T.border}`, borderRadius: '12px', overflow: 'hidden', background: T.surface }}>
      <div style={{ height: '400px', position: 'relative', background: T.bg }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
      
      <div style={{ padding: '24px', background: T.surfaceHigh, borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'Roboto Mono', color: resolveColor(currentStep.color), textTransform: 'uppercase', marginBottom: '4px' }}>
              Step {stepIdx + 2} of {STEPS.length + 1} — {currentStep.phase}
            </div>
            <div style={{ fontSize: '1.25rem', fontFamily: 'Poppins', fontWeight: 600, color: T.text }}>
              {currentStep.title}
            </div>
            <div style={{ fontSize: '0.95rem', color: T.muted, marginTop: '4px' }}>
              {currentStep.detail}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => { setStepIdx(-1); progressRef.current = 0; setIsPlaying(false); }} style={{ padding: '8px 16px', background: 'transparent', color: T.text, border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>Reset</button>
            <button onClick={() => { if (stepIdx > -1) { setStepIdx(s => s - 1); progressRef.current = 0; } }} disabled={stepIdx === -1} style={{ padding: '8px 16px', background: 'transparent', color: stepIdx === -1 ? T.muted : T.text, border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.85rem' }}>Back</button>
            <button onClick={() => { if (stepIdx < STEPS.length-1) { setStepIdx(s => s + 1); progressRef.current = 0; } }} disabled={stepIdx === STEPS.length - 1} style={{ padding: '8px 16px', background: 'transparent', color: stepIdx === STEPS.length - 1 ? T.muted : T.text, border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.85rem' }}>Next</button>
            <button onClick={() => { if (stepIdx === STEPS.length - 1) setStepIdx(-1); setIsPlaying(!isPlaying); }} style={{ padding: '8px 20px', background: isPlaying ? T.surface : T.accent, color: isPlaying ? T.text : '#fff', border: isPlaying ? `1px solid ${T.borderMid}` : 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>{isPlaying ? 'Pause' : 'Auto Play'}</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ flex: 1, height: '4px', background: resolveColor(T.accent), borderRadius: '2px' }} />
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, height: '4px', background: i <= stepIdx ? resolveColor(s.color) : T.borderMid, borderRadius: '2px', transition: 'background 0.3s' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
