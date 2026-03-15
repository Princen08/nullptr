import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { T } from '../theme';

export default function TelemetryDashboard() {
  const [uptime, setUptime] = useState(0);
  const [dataMB, setDataMB] = useState(() => 0.85 + Math.random() * 0.5); 
  const [interrupts, setInterrupts] = useState(0);
  const startTimeRef = useRef(null);
  const lastScrollPos = useRef(0);
  const location = useLocation();

  useEffect(() => {
    // Set start time on mount if not set
    if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
    }

    const timer = setInterval(() => {
      if (startTimeRef.current) {
        setUptime(Date.now() - startTimeRef.current);
      }
    }, 100);

    const handleInteraction = () => {
      setInterrupts(prev => prev + 1);
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const diff = Math.abs(currentScroll - lastScrollPos.current);
      if (diff > 50) {
        setDataMB(prev => prev + (diff / 25000));
        setInterrupts(prev => prev + 1);
        lastScrollPos.current = currentScroll;
      }
    };

    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Use timeout to avoid synchronous setState inside effect (Linter rule)
    const timeout = setTimeout(() => {
      setDataMB(prev => prev + 1.2 + Math.random());
      setInterrupts(prev => prev + 8);
    }, 0);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const formatUptime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    const centi = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${hours}:${mins}:${secs}:${centi}`;
  };

  return (
    <div className="telemetry-panel" style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 1000,
      background: T.navBg,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: `1px solid ${T.border}`,
      borderRadius: '12px',
      padding: '16px',
      width: '200px',
      fontFamily: 'Roboto Mono, monospace',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      pointerEvents: 'none',
      userSelect: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'opacity 0.3s ease, transform 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${T.border}`, paddingBottom: '8px', marginBottom: '4px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.green, boxShadow: `0 0 10px ${T.green}` }} />
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: T.text, letterSpacing: '1px' }}>SYSTEM_TELEMETRY</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <StatItem label="UPTIME" value={formatUptime(uptime)} color={T.accent} />
        <StatItem label="DATA_RX" value={`${dataMB.toFixed(2)} MB`} color={T.purple} />
        <StatItem label="INTERRUPTS" value={interrupts.toLocaleString()} color={T.amber} />
      </div>

      <div style={{ marginTop: '4px', height: '2px', background: T.faint, borderRadius: '1px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          height: '100%', 
          width: '30%', 
          background: T.accent, 
          animation: 'telemetryPulse 2s infinite ease-in-out' 
        }} />
      </div>

      <style>{`
        @keyframes telemetryPulse {
          0% { left: -30%; }
          100% { left: 130%; }
        }
        @media (max-width: 768px) {
          .telemetry-panel {
            width: 140px !important;
            padding: 10px !important;
            bottom: 12px !important;
            left: 12px !important;
            gap: 6px !important;
          }
          .telemetry-panel span {
            font-size: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: '0.55rem', color: T.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: '0.75rem', color: color, fontWeight: 700 }}>{value}</span>
    </div>
  );
}
