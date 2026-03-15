import { useState, useCallback, useRef } from 'react';

const toBinary = (char) => {
  return char.charCodeAt(0).toString(2).padStart(8, '0');
};

export default function BinaryShadow({ children, style, ...props }) {
  const [displayText, setDisplayText] = useState(children);
  const isFlickering = useRef(false);
  const originalText = children;

  const flicker = useCallback(() => {
    if (isFlickering.current || typeof children !== 'string') return;
    isFlickering.current = true;

    // To prevent layout shift, we generate a binary string of the SAME length as original
    // but using random bits to simulate the "binary equivalent" look without the 8x width explosion
    const binaryStr = originalText
      .split('')
      .map(char => {
        if (char === ' ') return ' ';
        return Math.random() > 0.5 ? '1' : '0';
      })
      .join('');

    setDisplayText(binaryStr);

    // Revert after a short "glitch" duration
    setTimeout(() => {
      setDisplayText(originalText);
      setTimeout(() => {
        isFlickering.current = false;
      }, 400); // Cooldown
    }, 150);
  }, [children, originalText]);

  if (typeof children !== 'string') {
    return <span style={style} {...props}>{children}</span>;
  }

  return (
    <span 
      onMouseEnter={flicker} 
      style={{ 
        ...style, 
        fontFamily: isFlickering.current ? 'Roboto Mono, monospace' : 'inherit',
        transition: 'all 0.1s ease',
        display: 'inline-block'
      }} 
      {...props}
    >
      {displayText}
    </span>
  );
}
