import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';

export default function NotFound() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'error', text: 'PANIC: KERNEL_THREAD_HANG_DETECTION_EXCEEDED' },
    { type: 'error', text: 'SEGMENTATION_FAULT AT 0x0000404' },
    { type: 'info', text: 'Illegal reference at virtual address 0xNULL' },
    { type: 'info', text: '' },
    { type: 'prompt', text: 'The system has entered an unstable state. Type "reboot" or "jmp 0x0" to recover.' }
  ]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    // Keep focus even if clicked elsewhere
    const handleClick = () => inputRef.current?.focus();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newHistory = [...history, { type: 'cmd', text: `> ${input}` }];

      if (cmd === 'reboot' || cmd === 'jmp 0x0' || cmd === 'home') {
        newHistory.push({ type: 'success', text: 'Initializing system recovery...' });
        newHistory.push({ type: 'success', text: 'Jump successful. Returning to head...' });
        setHistory(newHistory);
        setTimeout(() => navigate('/'), 800);
      } else if (cmd === 'ls') {
        newHistory.push({ type: 'info', text: 'total 0' });
        newHistory.push({ type: 'info', text: 'drwxr-xr-x  2 root  root  64 Mar 15 17:14 .' });
        newHistory.push({ type: 'info', text: 'drwxr-xr-x  2 root  root  64 Mar 15 17:14 ..' });
        setHistory(newHistory);
      } else if (cmd === 'help') {
        newHistory.push({ type: 'info', text: 'Available instructions: reboot, jmp 0x0, home, ls, help, whoami' });
        setHistory(newHistory);
      } else if (cmd === 'whoami') {
        newHistory.push({ type: 'info', text: 'lost_soul_in_address_space' });
        setHistory(newHistory);
      } else if (cmd === '') {
        setHistory(newHistory);
      } else {
        newHistory.push({ type: 'error', text: `UNKNOWN_INSTRUCTION: ${cmd}` });
        setHistory(newHistory);
      }
      
      setInput('');
      // Scroll to bottom after state update
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 0);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#00ff41', // Classic Terminal Green
      fontFamily: 'Roboto Mono, monospace',
      padding: '40px 20px',
      fontSize: '1rem',
      lineHeight: '1.5',
      cursor: 'text',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Scanline Effect */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        zIndex: 2,
        backgroundSize: '100% 2px, 3px 100%',
        pointerEvents: 'none'
      }} />

      {/* CRT Vignette */}
      <div style={{
        position: 'fixed',
        inset: 0,
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
        zIndex: 3,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '24px', opacity: 0.8 }}>
          <pre style={{ fontSize: '0.8rem', color: '#ff4444' }}>{`
  _  _ _   _ _    _    ____ _____ ____  
 | \\| | | | | |  | |  |  _ \\_   _|  _ \\ 
 | .  | |_| | |__| |__| |_) || | | |_) |
 |_|\\_|\\___/|____|____|  __/ |_| |  _ < 
                      |_|        |_| \\_\\
          `}</pre>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {history.map((line, i) => (
            <div key={i} style={{ 
              color: line.type === 'error' ? '#ff4444' : 
                     line.type === 'success' ? '#60efff' :
                     line.type === 'cmd' ? '#fff' : '#00ff41',
              textShadow: line.type === 'error' ? '0 0 5px #ff4444' : 'none'
            }}>
              {line.text}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', marginTop: '12px' }}>
          <span style={{ marginRight: '8px' }}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            autoFocus
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              width: '100%',
              caretColor: '#00ff41'
            }}
          />
        </div>
      </div>
    </div>
  );
}
