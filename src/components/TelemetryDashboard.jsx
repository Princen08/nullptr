import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { T } from '../theme';

export default function TelemetryDashboard() {
  const [uptime, setUptime] = useState(0);
  const [dataMB, setDataMB] = useState(() => 0.85 + Math.random() * 0.5); 
  const [interrupts, setInterrupts] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
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
    <div className={`telemetry-panel ${isMinimized ? 'minimized' : ''}`} style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 1000,
      background: T.navBg,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: `1px solid ${T.border}`,
      borderRadius: '12px',
      padding: isMinimized ? '8px 12px' : '16px',
      width: isMinimized ? 'auto' : '200px',
      fontFamily: 'Roboto Mono, monospace',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      pointerEvents: 'auto', // Now needs pointer events for toggle
      userSelect: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: isMinimized ? '0' : '12px',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: isMinimized ? 'pointer' : 'default'
    }}
    onClick={() => isMinimized && setIsMinimized(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: isMinimized ? 'none' : `1px solid ${T.border}`, paddingBottom: isMinimized ? '0' : '8px', marginBottom: isMinimized ? '0' : '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.green, boxShadow: `0 0 10px ${T.green}` }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: T.text, letterSpacing: '1px' }}>SYS_TLRY</span>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: T.muted, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            padding: '2px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = T.text}
          onMouseLeave={e => e.currentTarget.style.color = T.muted}
        >
          {isMinimized ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="14" y1="10" x2="21" y2="3"></line>
              <line x1="10" y1="14" x2="3" y2="21"></line>
            </svg>
          )}
        </button>
      </div>

      {!isMinimized && (
        <>
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
        </>
      )}

      <style>{`
        @keyframes telemetryPulse {
          0% { left: -30%; }
          100% { left: 130%; }
        }
        @media (max-width: 768px) {
          .telemetry-panel {
            width: ${isMinimized ? 'auto' : '140px'} !important;
            padding: ${isMinimized ? '6px 10px' : '10px'} !important;
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
