import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function NotFound() {
  const [input, setInput] = useState('');
  const { theme } = useTheme();
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
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 0);
    }
  };

  const isDark = theme === 'dark';
  const terminalGreen = isDark ? '#00ff41' : T.accent;
  const terminalBg = isDark ? '#0a0a0a' : T.bg;
  const errorColor = isDark ? '#ff4444' : T.red;
  const successColor = isDark ? '#60efff' : T.green;
  const textColor = isDark ? '#fff' : T.text;

  return (
    <div style={{
      minHeight: '100vh',
      background: terminalBg,
      color: terminalGreen,
      fontFamily: 'Roboto Mono, monospace',
      padding: '40px 20px',
      fontSize: '1rem',
      lineHeight: '1.5',
      cursor: 'text',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Theme Toggle Positioned in corner */}
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 100 }}>
        <ThemeToggle />
      </div>

      {/* Scanline Effect */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: isDark 
          ? 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))'
          : 'linear-gradient(rgba(255, 255, 255, 0.1) 50%, rgba(0, 0, 0, 0.05) 50%)',
        zIndex: 2,
        backgroundSize: isDark ? '100% 2px, 3px 100%' : '100% 4px',
        pointerEvents: 'none'
      }} />

      {/* CRT Vignette */}
      <div style={{
        position: 'fixed',
        inset: 0,
        boxShadow: isDark ? 'inset 0 0 100px rgba(0,0,0,0.5)' : 'none',
        zIndex: 3,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '24px', opacity: 0.8 }}>
          <pre style={{ fontSize: '0.8rem', color: errorColor, textShadow: isDark ? `0 0 8px ${errorColor}60` : 'none' }}>{`
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
              color: line.type === 'error' ? errorColor : 
                     line.type === 'success' ? successColor :
                     line.type === 'cmd' ? textColor : terminalGreen,
              textShadow: (isDark && line.type === 'error') ? `0 0 5px ${errorColor}` : 'none'
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
              color: textColor,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              width: '100%',
              caretColor: terminalGreen
            }}
          />
        </div>
      </div>
    </div>
  );
}
