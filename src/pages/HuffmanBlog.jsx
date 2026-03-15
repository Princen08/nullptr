import React, { useState, useEffect, useRef, useMemo } from 'react';
import { T } from '../theme';
import { useTheme } from '../context/ThemeContext';
import BlogLayout from '../layouts/BlogLayout';
import SectionHeading from '../components/SectionHeading';
import Para from '../components/Para';
import InfoCard from '../components/InfoCard';
import CodeBlock from '../components/CodeBlock';
import StatGrid from '../components/StatGrid';
import Code from '../components/Code';
import RelatedPosts from '../components/RelatedPosts';
import { POSTS } from '../data/posts';

/**
 * HUFFMAN BLOG COMPONENT
 * Implements a high-fidelity, high-contrast Huffman Coding simulator
 * aligned with the NullPtr "elite" tech aesthetic.
 */

// --- Resolve CSS vars for canvas (CSS vars are not supported in Canvas 2D) ---
// getComputedStyle reads the *current* resolved values, which respect the active
// [data-theme] attribute — so this works correctly for both light and dark mode.
function getCanvasColors() {
  const s = getComputedStyle(document.documentElement);
  const get = (v) => s.getPropertyValue(v).trim();
  return {
    bg:      get('--bg'),
    grid:    get('--faint'),
    accent:  get('--accent'),
    green:   get('--green'),
    red:     get('--red'),
    amber:   get('--amber'),
    muted:   get('--muted'),
    text:    get('--text'),
    surface: get('--surface'),
  };
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#d946ef', '#f97316', '#22d3ee'];
// Removed legacy CtrlBtn in favor of inline unified responsive footer components
// --- HUFFMAN LOGIC ---

class Node {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
    this.x = 0;
    this.y = 0;
  }
}

function computeHuffman(input) {
  if (!input) return { steps: [], charColors: {}, stats: null };
  const str = input.toUpperCase();
  const freqs = {};
  for (const c of str) freqs[c] = (freqs[c] || 0) + 1;

  const charColors = {};
  Object.keys(freqs).sort().forEach((c, i) => charColors[c] = COLORS[i % COLORS.length]);

  const steps = [];
  const sortedArr = Object.entries(freqs).sort((a,b) => b[1] - a[1]);
  
  // Step 1: Initial Frequencies
  steps.push({
    type: 'freq',
    data: sortedArr,
    title: 'Symbol Weights',
    desc: 'Analyzing character distribution. More frequent symbols earn shorter paths.'
  });

  let forest = sortedArr.map(([c, f]) => new Node(c, f)).sort((a,b) => a.freq - b.freq);

  // Step 2..N: Merges
  while (forest.length > 1) {
    const l = forest.shift();
    const r = forest.shift();
    const parent = new Node(null, l.freq + r.freq, l, r);
    forest.push(parent);
    forest.sort((a,b) => a.freq - b.freq || (a.char === null ? 1 : -1));
    
    steps.push({
      type: 'tree',
      forest: [...forest],
      active: [l, r, parent],
      title: `Merge: Cluster identified`,
      desc: `Pairing lowest weight nodes (${l.char||'sum'} + ${r.char||'sum'}) into a subtree.`
    });
  }

  const root = forest[0];
  const codes = {};
  const walk = (n, c) => {
    if (!n) return;
    if (n.char) codes[n.char] = c;
    walk(n.left, c + '0');
    walk(n.right, c + '1');
  };
  walk(root, '');

  steps.push({
    type: 'codes',
    codes,
    title: 'Optimal Prefix Map',
    desc: 'The binary tree is translated into a dictionary of prefix-free codes.'
  });

  const encoded = str.split('').map(c => codes[c]).join('');
  const stats = {
    orig: str.length * 8,
    comp: encoded.length,
    ratio: (100 - (encoded.length / (str.length * 8) * 100)).toFixed(1)
  };

  steps.push({
    type: 'encoded',
    input: str,
    codes,
    encoded,
    stats,
    title: 'Compression Complete',
    desc: 'The original character stream is now a dense variable-length bitstream.'
  });

  return { steps, charColors, stats };
}

// --- SIMULATOR ---

function HuffmanSimulator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [val, setVal] = useState('MISSISSIPPI');
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const { steps, charColors, stats } = useMemo(() => computeHuffman(val), [val]);

  useEffect(() => { setIdx(0); setAuto(false); }, [val]);
  
  useEffect(() => {
    if (auto) {
      const timer = setInterval(() => {
        if (idx < steps.length - 1) setIdx(i => i + 1);
        else setAuto(false);
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [auto, idx, steps.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;

    const step = steps[idx];
    if (!step) return;

    const draw = () => {
      const CC = getCanvasColors();

      // Dynamic Height — ensuring we account for the ~160px absolute HUD overlay at the bottom
      let h = 580;
      if (step.type === 'tree') {
        const depth = (n) => !n ? 0 : 1 + Math.max(depth(n.left), depth(n.right));
        const maxD = step.forest.reduce((acc, n) => Math.max(acc, depth(n)), 0);
        h = Math.max(580, 100 + maxD * 90 + 160);
      } else if (step.type === 'codes') {
        h = Math.max(580, 150 + Object.keys(step.codes).length * 52 + 160);
      } else if (step.type === 'encoded') {
        // Measure bitstream height needed (may wrap into multiple rows)
        const totalBits = step.input.split('').reduce((a, c) => a + (step.codes[c]?.length || 0), 0);
        const bitsPerRow = Math.floor((canvas.width - 80) / 20);
        const bitRows = bitsPerRow > 0 ? Math.ceil(totalBits / bitsPerRow) : 1;
        h = Math.max(580, 300 + bitRows * 34 + 180);
      }
      
      if (canvas.height !== h || canvas.width !== containerRef.current.clientWidth) {
        canvas.height = h;
        canvas.width = containerRef.current.clientWidth;
        // Do not return here so that the loop proceeds to draw and schedule the next frame
      }

      const W = canvas.width;
      const H = canvas.height;
      
      ctx.fillStyle = CC.bg;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = CC.grid;
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const pill = (x, y, w, ph, col, txt, dim) => {
        ctx.globalAlpha = dim ? 0.3 : 1;
        ctx.fillStyle = col;
        ctx.fillRect(x, y, w, ph);
        ctx.fillStyle = '#000';
        ctx.font = '900 13px "Roboto Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(txt, x + w / 2, y + ph / 2 + 5);
        ctx.globalAlpha = 1;
      };

      if (step.type === 'freq') {
        const total = step.data.reduce((a, b) => a + b[1], 0);
        const bw = 46;
        const gap = 20;
        const sx = (W - (step.data.length * (bw + gap) - gap)) / 2;
        const by = 200;

        step.data.forEach(([c, f], i) => {
          const x = sx + i * (bw + gap);
          const bh = (f / total) * (H - 350);
          
          ctx.beginPath(); ctx.arc(x + bw/2, by, 22, 0, Math.PI * 2);
          ctx.fillStyle = charColors[c]; ctx.fill();
          ctx.strokeStyle = CC.text; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#000'; ctx.font = '900 15px "Roboto Mono"'; ctx.textAlign = 'center';
          ctx.fillText(c, x + bw/2, by + 6);

          ctx.fillStyle = charColors[c] + '33';
          ctx.fillRect(x, by + 40, bw, bh);
          ctx.fillStyle = charColors[c];
          ctx.fillRect(x, by + 40 + bh - 4, bw, 4);

          ctx.fillStyle = CC.text; ctx.font = '900 14px "Roboto Mono"';
          ctx.fillText(f, x + bw/2, by + 75 + bh);
        });
      }

      else if (step.type === 'tree') {
        const count = (n) => (!n ? 0 : (!n.left && !n.right ? 1 : count(n.left) + count(n.right)));
        const layout = (n, x, y, av) => {
           if (!n) return;
           n.x = x; n.y = y;
           if (!n.left && !n.right) return;
           const l = count(n.left), r = count(n.right), tot = l + r;
           layout(n.left, x - (av/2) * (l/tot), y + 90, av * (l/tot));
           layout(n.right, x + (av/2) * (r/tot), y + 90, av * (r/tot));
        };

        const tw = step.forest.reduce((a, n) => a + count(n), 0) * 75;
        let curX = (W - tw) / 2;
        step.forest.forEach(r => {
           const rw = count(r) * 75;
           layout(r, curX + rw/2, 80, rw);
           curX += rw;
        });

        const active = step.active || [];
        const nodeTextColor = isDark ? '#000' : '#fff';
        const edgeInactive = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
        const internalNodeCol = isDark ? '#fff' : '#334155';

        const drawNodes = (n, e) => {
          if (!n) return;
          if (e) {
            [n.left, n.right].forEach((child, i) => {
              if (!child) return;
              const isA = active.includes(n) && active.includes(child);
              ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(child.x, child.y);
              ctx.strokeStyle = isA ? CC.text : edgeInactive;
              ctx.lineWidth = isA ? 4 : 2; ctx.stroke();
              ctx.fillStyle = isA ? (i === 0 ? CC.accent : CC.red) : CC.muted;
              ctx.font = '900 14px "Roboto Mono"';
              ctx.fillText(i === 0 ? '0' : '1', (n.x + child.x)/2 + (i===0?-16:16), (n.y + child.y)/2);
              drawNodes(child, true);
            });
          } else {
            const isA = active.includes(n);
            ctx.beginPath(); ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
            ctx.fillStyle = n.char ? charColors[n.char] : (n === active[2] ? CC.amber : internalNodeCol);
            ctx.globalAlpha = isA ? 1 : 0.25; ctx.fill();
            if (isA) { ctx.lineWidth = 3; ctx.strokeStyle = CC.text; ctx.stroke(); }
            ctx.globalAlpha = 1; ctx.fillStyle = nodeTextColor; ctx.font = '900 14px "Roboto Mono"'; ctx.textAlign = 'center';
            ctx.fillText(n.char || n.freq, n.x, n.y + 6);
            drawNodes(n.left, false); drawNodes(n.right, false);
          }
        };
        step.forest.forEach(r => drawNodes(r, true));
        step.forest.forEach(r => drawNodes(r, false));
      }

      else if (step.type === 'codes') {
        const arr = Object.entries(step.codes).sort((a,b) => a[0].localeCompare(b[0]));
        const sx = Math.max(20, (W - 500) / 2), sy = 100;
        const rowSurface = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
        ctx.fillStyle = CC.accent; ctx.font = '900 13px "Roboto Mono"'; ctx.textAlign = 'left';
        ctx.fillText('SYMBOL', sx, sy - 45);
        ctx.fillText('BIT PATH', sx + 120, sy - 45);
        ctx.fillText('WIDTH', sx + 430, sy - 45);

        arr.forEach(([c, cd], i) => {
          const y = sy + i * 52;
          ctx.fillStyle = rowSurface; ctx.fillRect(sx - 10, y - 28, 520, 44);
          ctx.beginPath(); ctx.arc(sx + 22, y - 6, 16, 0, Math.PI * 2);
          ctx.fillStyle = charColors[c]; ctx.fill();
          ctx.fillStyle = '#000'; ctx.font = '900 14px "Roboto Mono"'; ctx.textAlign = 'center';
          ctx.fillText(c, sx + 22, y);

          ctx.textAlign = 'left';
          cd.split('').forEach((b, bi) => pill(sx + 120 + bi * 28, y - 22, 24, 30, b === '0' ? CC.green : CC.red, b));
          ctx.fillStyle = CC.text; ctx.font = '900 14px "Roboto Mono"'; ctx.textAlign = 'right';
          ctx.fillText(`${cd.length} bits`, sx + 500, y);
        });
      }

      else if (step.type === 'encoded') {
        const pad = 40;
        const sx = pad, sy = 100;
        const bitsPerRow = Math.max(1, Math.floor((W - pad * 2) / 20));

        // Input stream header
        ctx.fillStyle = CC.text; ctx.font = '700 12px "Roboto Mono"'; ctx.textAlign = 'left';
        ctx.fillText('INPUT STREAM:', sx, sy);
        const pillW = Math.min(36, Math.floor((W - pad * 2) / step.input.length) - 2);
        const totalPillW = step.input.length * (pillW + 2) - 2;
        const pillStartX = (W - totalPillW) / 2;
        step.input.split('').forEach((c, i) => pill(pillStartX + i * (pillW + 2), sy + 16, pillW, 32, charColors[c], c));

        // Bitstream header
        ctx.fillStyle = CC.amber; ctx.font = '700 12px "Roboto Mono"'; ctx.textAlign = 'left';
        ctx.fillText('BITSTREAM OUTPUT:', sx, sy + 70);

        // Collect all bits
        const allBits = [];
        step.input.split('').forEach(c => {
          (step.codes[c] || '').split('').forEach(b => allBits.push(b));
        });

        // Render in rows
        allBits.forEach((b, bi) => {
          const row = Math.floor(bi / bitsPerRow);
          const col = bi % bitsPerRow;
          pill(sx + col * 20, sy + 88 + row * 32, 18, 28, b === '0' ? CC.green : CC.red, b);
        });

        // Stats box
        const bitRows = Math.ceil(allBits.length / bitsPerRow);
        const by = sy + 88 + bitRows * 32 + 20;
        const boxSurface = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
        ctx.fillStyle = boxSurface; ctx.fillRect(sx, by, W - pad * 2, 72);
        ctx.strokeStyle = CC.accent; ctx.lineWidth = 2; ctx.strokeRect(sx, by, W - pad * 2, 72);
        ctx.fillStyle = CC.text; ctx.font = '900 22px Poppins'; ctx.textAlign = 'center';
        ctx.fillText(`${step.stats.ratio}% Space Optimization`, W/2, by + 46);
      }

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [idx, steps, charColors, isDark]);

  const step = steps[idx] || steps[0];
  if (!step) return null; // Safety for completely empty steps

  const phaseCol = { freq: T.accent, tree: T.amber, codes: T.green, encoded: T.green }[step.type] || T.accent;

  return (
    <div id="huffman-sim" style={{ 
      margin: '56px 0', 
      borderRadius: '24px', 
      overflow: 'hidden', 
      background: T.surface, 
      border: `1px solid ${T.border}`,
      boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6)' 
    }}>
      {/* Input Header */}
      <div style={{ padding: '32px', borderBottom: `1px solid ${T.border}`, background: T.surfaceHigh }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
             <input
                type="text"
                maxLength={20}
                value={val}
                onChange={e => setVal(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  background: T.bg,
                  border: `2px solid ${T.borderMid}`,
                  borderRadius: '12px',
                  padding: '16px 20px',
                  color: T.text,
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  fontFamily: 'Roboto Mono',
                  outline: 'none',
                  boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.3)'
                }}
             />
             <div style={{ position: 'absolute', top: '-10px', left: '16px', background: T.surface, padding: '0 8px', fontSize: '0.65rem', fontWeight: 900, color: T.accent, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Kernel Input
             </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['DATA', 'ALGO', 'HUFFMAN'].map(p => (
              <button key={p} onClick={() => setVal(p)} style={{ padding: '12px 22px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, background: val === p ? T.accent : T.surfaceHigh, color: val === p ? '#000' : T.muted, border: `1px solid ${val === p ? T.accent : T.border}`, cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Surface Area */}
      <div ref={containerRef} style={{ position: 'relative', background: T.bg, minHeight: '580px' }}>
        <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
        
        {/* HUD Info */}
        <div style={{ 
          position: 'absolute', bottom: '24px', left: '24px', right: '24px',
          background: isDark ? 'rgba(10, 15, 28, 0.92)' : 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(20px)',
          border: `1px solid ${T.border}`, borderRadius: '20px', padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, background: phaseCol, color: '#000', textTransform: 'uppercase' }}>{step.type}</span>
              <span style={{ fontSize: '0.8rem', color: T.muted, fontWeight: 700 }}>BLOCK {idx + 1} OF {steps.length}</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: T.text, marginBottom: '4px' }}>{step.title}</div>
            <div style={{ fontSize: '0.95rem', color: T.muted, fontFamily: 'Roboto' }}>{step.desc}</div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div style={{ padding: '24px', background: T.surfaceHigh, borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '100%' }}>
                <button onClick={() => setIdx(0)} style={{ flex: 1, maxWidth: '100px', padding: '10px 0', background: 'transparent', color: T.text, border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>Reset</button>
                <button onClick={() => setIdx(i => Math.max(0, i-1))} disabled={idx === 0} style={{ flex: 1, maxWidth: '100px', padding: '10px 0', background: 'transparent', color: idx === 0 ? T.faint : T.text, border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>Back</button>
                <button onClick={() => setIdx(i => Math.min(steps.length-1, i+1))} disabled={idx === steps.length - 1} style={{ flex: 1, maxWidth: '100px', padding: '10px 0', background: 'transparent', color: idx === steps.length - 1 ? T.faint : T.text, border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>Next</button>
              </div>
              <button 
                onClick={() => { if (idx >= steps.length - 1) setIdx(0); setAuto(!auto); }} 
                style={{ 
                  width: '100%', maxWidth: '316px', padding: '12px 0', 
                  background: auto ? T.surface : T.accent, 
                  color: auto ? T.text : '#fff', 
                  border: auto ? `1px solid ${T.borderMid}` : 'none', 
                  borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, 
                  boxShadow: auto ? 'none' : `0 4px 12px rgba(99,102,241,0.2)` 
                }}
              >
                {auto ? 'Pause Simulation' : 'Auto Play Simulation'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginTop: '24px' }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: '4px', background: i <= idx ? T.accent : T.borderMid, borderRadius: '2px', transition: 'background 0.3s' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- BLOG PAGE ---

export default function HuffmanBlog() {
  const post = POSTS.find(p => p.slug === 'huffman-coding-explained') || {
    title: 'Huffman Coding Explained',
    subtitle: 'The Core Engine of GZIP & PNG Compression',
    tags: ['Algorithms', 'Compression'],
    date: 'Mar 2026',
    readTime: '10 min'
  };

  return (
    <>
      <BlogLayout {...post}>
        <StatGrid stats={[
          { label: 'Complexity', value: 'O(N log N)', color: T.accent },
          { label: 'Efficiency', value: 'Provably Optimal', color: T.green },
          { label: 'Category', value: 'Lossless', color: T.amber },
          { label: 'Year', value: '1952', color: T.red }
        ]} />

        <SectionHeading title="Dynamic Precision" tag="Information Theory" />
        <Para>
          Why do we waste 8 bits on the letter 'e' and 8 bits on 'x'? In a typical English text, 'e' is 100x more common. Huffman coding fixes this by giving common symbols short binary codes and rare symbols longer ones.
        </Para>
        
        <InfoCard type="tip" title="Decodability Guarantee">
           Huffman produces a <strong>Prefix-Free</strong> code. No code is a prefix of another (e.g., if 'e' is 0, nothing else starts with 0). This allows the computer to read a continuous bitstream and slice it into characters perfectly without needing separators.
        </InfoCard>

        <SectionHeading title="The Greedy Construction" tag="Architecture" />
        <Para>
          The algorithm is beautifully simple:
          <br />1. Count every character's frequency.
          <br />2. Treat each character as a leaf node.
          <br />3. Repeatedly merge the two nodes with the <strong>lowest weight</strong> until only one root node remains.
        </Para>

        <CodeBlock label="merger.js" code={`while (forest.length > 1) {
  const [l, r] = forest.extractTwoLowest();
  const parent = new Node(l.freq + r.freq, l, r);
  forest.insert(parent);
}`} />

        <SectionHeading title="Interactive Binary Trace" tag="Live Simulator" />
        <Para>
          Input your own data below to watch the binary tree assemble. Note how the most frequent characters stay closest to the root for maximum bit recovery.
        </Para>

        <HuffmanSimulator />

        <SectionHeading title="The DEFLATE Pipeline" tag="Real World" />
        <Para>
          Standalone Huffman is great, but combined with LZ77, it becomes <strong>DEFLATE</strong>—the magic inside GZIP and ZIP files. LZ77 finds duplicate strings, and Huffman squeezes the result into the smallest possible bitstream.
        </Para>

        <InfoCard title="Why 1952 matters">
          David Huffman was a student at MIT when he invented this. His professor gave him the choice between a final exam or a paper on finding the most efficient code. He found the algorithm that Shannon and Fano couldn't quite perfect, yielding the most efficient result possible.
        </InfoCard>

      </BlogLayout>
      <RelatedPosts currentSlug="huffman-coding-explained" />
    </>
  );
}
