import { useState, useCallback, useRef, useEffect } from 'react';
import { T } from '../theme';
import SimulatorCanvas from './SimulatorCanvas';

const SCENARIOS = [
  {
    id: 'setTimeout-promise',
    label: 'setTimeout + Promise',
    code: `console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');`,
    ticks: [
      { type: 'push', zone: 'stack', label: "log('start')", desc: "Push synchronous log to stack" },
      { type: 'pop', zone: 'stack', log: 'start', desc: "Execute and pop: output 'start'" },
      { type: 'push', zone: 'stack', label: "setTimeout(cb, 0)", desc: "Push setTimeout to stack" },
      { type: 'move', from: 'stack', to: 'apis', label: "timer cb", desc: "Hand off callback to Web APIs timer" },
      { type: 'pop', zone: 'stack', desc: "Pop setTimeout" },
      { type: 'push', zone: 'stack', label: "Promise.then(cb)", desc: "Push Promise.then to stack" },
      { type: 'move', from: 'stack', to: 'micro', label: "promise cb", desc: "Move callback to Microtask Queue" },
      { type: 'pop', zone: 'stack', desc: "Pop Promise.then" },
      { type: 'push', zone: 'stack', label: "log('end')", desc: "Push synchronous log to stack" },
      { type: 'pop', zone: 'stack', log: 'end', desc: "Execute and pop: output 'end'" },
      { type: 'move', from: 'apis', to: 'task', label: "timeout cb", desc: "Timer expired: move to Task Queue" },
      { type: 'flash', text: "Stack empty → Draining Microtasks", desc: "Stack is clear: processing microtasks first" },
      { type: 'move', from: 'micro', to: 'stack', label: "promise cb", desc: "Microtask Queue → Call Stack" },
      { type: 'pop', zone: 'stack', log: 'promise', desc: "Execute and pop: output 'promise'" },
      { type: 'flash', text: "Microtasks done → Check Task Queue", desc: "Microtasks empty: checking task queue" },
      { type: 'move', from: 'task', to: 'stack', label: "timeout cb", desc: "Task Queue → Call Stack" },
      { type: 'pop', zone: 'stack', log: 'timeout', desc: "Execute and pop: output 'timeout'" }
    ]
  },
  {
    id: 'async-await',
    label: 'async / await',
    code: `async function fetchData() {
  console.log('fetching...');
  const data = await Promise.resolve(42);
  console.log('got', data);
}
fetchData();
console.log('after call');`,
    ticks: [
      { type: 'push', zone: 'stack', label: "fetchData()", desc: "Call async function fetchData()" },
      { type: 'push', zone: 'stack', label: "log('fetching')", desc: "Execute internal log" },
      { type: 'pop', zone: 'stack', log: 'fetching...', desc: "Pop log, output 'fetching...'" },
      { type: 'push', zone: 'stack', label: "await Promise", desc: "Hit await: suspend function execution" },
      { type: 'move', from: 'stack', to: 'micro', label: "resume fetchData", desc: "Schedule continuation as microtask" },
      { type: 'pop', zone: 'stack', desc: "Pop fetchData (suspended)" },
      { type: 'push', zone: 'stack', label: "log('after call')", desc: "Execute synchronous code after async call" },
      { type: 'pop', zone: 'stack', log: 'after call', desc: "Pop log, output 'after call'" },
      { type: 'flash', text: "Stack empty → Draining Microtasks", desc: "Stack clear: resuming suspended async functions" },
      { type: 'move', from: 'micro', to: 'stack', label: "resume fetchData", desc: "Microtask Queue → Call Stack" },
      { type: 'push', zone: 'stack', label: "log('got 42')", desc: "Execute remaining code in async function" },
      { type: 'pop', zone: 'stack', log: 'got 42', desc: "Pop log, output 'got 42'" },
      { type: 'pop', zone: 'stack', desc: "Pop fetchData (completed)" }
    ]
  },
  {
    id: 'fetch-callbacks',
    label: 'fetch + callbacks',
    code: `console.log('A');
fetch('/api').then(r => console.log('B'));
console.log('C');`,
    ticks: [
      { type: 'push', zone: 'stack', label: "log('A')", desc: "Execute synchronous log 'A'" },
      { type: 'pop', zone: 'stack', log: 'A', desc: "Pop log 'A'" },
      { type: 'push', zone: 'stack', label: "fetch().then()", desc: "Initiate network request via Web API" },
      { type: 'move', from: 'stack', to: 'apis', label: "net request", desc: "Hand off fetch to browser networking thread" },
      { type: 'pop', zone: 'stack', desc: "Pop fetch call" },
      { type: 'push', zone: 'stack', label: "log('C')", desc: "Execute synchronous log 'C'" },
      { type: 'pop', zone: 'stack', log: 'C', desc: "Pop log 'C'" },
      { type: 'flash', text: "Waiting for network...", desc: "Browser handles background networking" },
      { type: 'move', from: 'apis', to: 'task', label: "fetch cb", desc: "Response arrived: callback moves to Task Queue" },
      { type: 'flash', text: "Stack empty → Check Task Queue", desc: "Event loop picks next pending task" },
      { type: 'move', from: 'task', to: 'stack', label: "fetch cb", desc: "Task Queue → Call Stack" },
      { type: 'push', zone: 'stack', label: "log('B')", desc: "Execute fetch callback" },
      { type: 'pop', zone: 'stack', log: 'B - response', desc: "Pop log 'B'" },
      { type: 'pop', zone: 'stack', desc: "Pop fetch callback" }
    ]
  },
  {
    id: 'promise-all',
    label: 'Promise.all',
    code: `Promise.all([fetch('/a'), fetch('/b')])
  .then(res => console.log('both done'));`,
    ticks: [
      { type: 'push', zone: 'stack', label: "Promise.all()", desc: "Initiate multiple concurrent requests" },
      { type: 'move', from: 'stack', to: 'apis', label: "fetch /a", desc: "Move first fetch to Web APIs" },
      { type: 'move', from: 'stack', to: 'apis', label: "fetch /b", desc: "Move second fetch to Web APIs" },
      { type: 'pop', zone: 'stack', desc: "Pop Promise.all" },
      { type: 'flash', text: "Concurrent requests running...", desc: "Browsers handle multiple API calls in parallel" },
      { type: 'move', from: 'apis', to: 'task', label: "/a resolved", desc: "/a completed, waiting for /b" },
      { type: 'move', from: 'apis', to: 'task', label: "/b resolved", desc: "/b completed, Promise.all ready" },
      { type: 'move', from: 'task', to: 'micro', label: ".then() cb", desc: "All resolved: logic moves to Microtask Queue" },
      { type: 'move', from: 'micro', to: 'stack', label: ".then() cb", desc: "Microtask Queue → Call Stack" },
      { type: 'push', zone: 'stack', label: "log('both done')", desc: "Execute final completion callback" },
      { type: 'pop', zone: 'stack', log: 'both done', desc: "Output completion log" },
      { type: 'pop', zone: 'stack', desc: "Pop callback" }
    ]
  }
];

export default function EventLoopSimulator() {
  const [activeTab, setActiveTab] = useState(0);
  const [tickIdx, setTickIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [logs, setLogs] = useState([]);
  const [flyingParts, setFlyingParts] = useState([]);
  const [currentContent, setCurrentContent] = useState({ stack: [], apis: [], micro: [], task: [] });
  const [flashText, setFlashText] = useState("");
  
  const lastTimeRef = useRef(Date.now());
  const waitTimeRef = useRef(0);
  const tickDelay = (11 - speed) * 150;

  const resetSimulator = useCallback((newTabIdx = activeTab) => {
    setTickIdx(-1); setIsPlaying(false); setLogs([]); setFlyingParts([]);
    setCurrentContent({ stack: [], apis: [], micro: [], task: [] });
    setFlashText(""); setActiveTab(newTabIdx);
  }, [activeTab]);

  const runTick = useCallback((dir = 1) => {
    const scenario = SCENARIOS[activeTab];
    const nextIdx = tickIdx + dir;
    
    if (nextIdx < -1 || nextIdx >= scenario.ticks.length) {
      if (dir === 1) setIsPlaying(false);
      return;
    }

    if (dir === -1) {
      // Re-run from start up to nextIdx
      let tempStack = [], tempApis = [], tempMicro = [], tempTask = [], tempLogs = [];
      for (let i = 0; i <= nextIdx; i++) {
        const t = scenario.ticks[i];
        if (t.type === 'push') { if (t.zone === 'stack') tempStack.push(t.label); else if (t.zone === 'apis') tempApis.push(t.label); else if (t.zone === 'micro') tempMicro.push(t.label); else if (t.zone === 'task') tempTask.push(t.label); }
        else if (t.type === 'pop') { if (t.zone === 'stack') tempStack.pop(); else if (t.zone === 'apis') tempApis.shift(); else if (t.zone === 'micro') tempMicro.shift(); else if (t.zone === 'task') tempTask.shift(); if (t.log) tempLogs.push({ text: t.log, color: T.accent }); }
        else if (t.type === 'move') { 
          if (t.from === 'stack') tempStack.pop(); else if (t.from === 'apis') tempApis.shift(); else if (t.from === 'micro') tempMicro.shift(); else if (t.from === 'task') tempTask.shift();
          if (t.to === 'stack') tempStack.push(t.label); else if (t.to === 'apis') tempApis.push(t.label); else if (t.to === 'micro') tempMicro.push(t.label); else if (t.to === 'task') tempTask.push(t.label);
        }
      }
      setCurrentContent({ stack: tempStack, apis: tempApis, micro: tempMicro, task: tempTask });
      setLogs(tempLogs);
      setTickIdx(nextIdx);
      setFlashText("");
      return;
    }

    const tick = scenario.ticks[nextIdx];
    setTickIdx(nextIdx); setFlashText("");

    if (tick.type === 'push') setCurrentContent(p => ({ ...p, [tick.zone]: [...p[tick.zone], tick.label] }));
    else if (tick.type === 'pop') {
      setCurrentContent(p => { const arr = [...p[tick.zone]]; arr.pop(); return { ...p, [tick.zone]: arr }; });
      if (tick.log) setLogs(p => [...p, { text: tick.log, color: T.accent }]);
    } else if (tick.type === 'move') {
      setFlyingParts(p => [...p, { id: Date.now(), from: tick.from, to: tick.to, label: tick.label, progress: 0 }]);
      setCurrentContent(p => {
        const next = { ...p }; const arr = [...next[tick.from]];
        if (tick.from !== 'stack') arr.shift(); else arr.pop();
        next[tick.from] = arr; return next;
      });
    } else if (tick.type === 'flash') setFlashText(tick.text);

  }, [activeTab, tickIdx]);

  useEffect(() => {
    let frame;
    const loop = () => {
      const time = Date.now(); const dt = time - lastTimeRef.current; lastTimeRef.current = time;
      if (isPlaying) {
        waitTimeRef.current += dt;
        if (waitTimeRef.current >= tickDelay) {
          waitTimeRef.current = 0;
          runTick(1);
        }
      }
      setFlyingParts(prev => {
        const remaining = [];
        prev.forEach(p => {
          const nextP = p.progress + dt / 800;
          if (nextP >= 1) setCurrentContent(curr => (curr[p.to].includes(p.label) && p.to !== 'stack') ? curr : { ...curr, [p.to]: [...curr[p.to], p.label] });
          else remaining.push({ ...p, progress: nextP });
        });
        return remaining;
      });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, tickDelay, runTick]);

  const currentScenario = SCENARIOS[activeTab];
  const currentTick = tickIdx >= 0 ? currentScenario.ticks[tickIdx] : { desc: "Wait for execution to start" };

  return (
    <div style={{ margin: '48px 0', border: `1px solid ${T.border}`, borderRadius: '12px', overflow: 'hidden', background: T.surface }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.surfaceHigh }}>
        {SCENARIOS.map((s, i) => (
          <button key={s.id} onClick={() => resetSimulator(i)} style={{ flex: 1, padding: '16px', fontSize: '0.85rem', fontWeight: 600, color: activeTab === i ? T.accent : T.muted, background: activeTab === i ? 'rgba(99,102,241,0.05)' : 'transparent', borderBottom: `2px solid ${activeTab === i ? T.accent : 'transparent'}`, transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div style={{ position: 'relative', background: T.bg, borderRight: `1px solid ${T.border}`, minHeight: '350px', height: '40vh' }}>
          <SimulatorCanvas currentContent={currentContent} flyingParts={flyingParts} flashText={flashText} />
        </div>
        <div style={{ background: T.bg, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.7rem', fontFamily: 'Roboto Mono', color: T.accent, textTransform: 'uppercase', marginBottom: '8px' }}>Source Code</div>
            <div style={{ background: T.surface, padding: '12px', borderRadius: '8px', border: `1px solid ${T.border}`, fontFamily: 'Roboto Mono', fontSize: '11px', color: T.text, whiteSpace: 'pre', overflowX: 'auto', minHeight: '100px' }}>{currentScenario.code}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: '0.7rem', fontFamily: 'Roboto Mono', color: T.accent, textTransform: 'uppercase', marginBottom: '8px' }}>Console Output</div>
            <div style={{ background: T.faint, borderRadius: '8px', border: `1px solid ${T.border}`, padding: '10px', flex: 1, overflowY: 'auto', minHeight: '80px' }}>
              {logs.map((log, i) => (<div key={i} style={{ color: log.color, fontFamily: 'Roboto Mono', fontSize: '0.8rem', marginBottom: '4px' }}>&gt; {log.text}</div>))}
              {logs.length === 0 && <div style={{ color: T.muted, fontSize: '0.75rem', fontStyle: 'italic' }}>waiting for code...</div>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', background: T.surfaceHigh, borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontFamily: 'Roboto Mono', color: T.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Step {tickIdx + 2} of {currentScenario.ticks.length + 1}
            </div>
            <div style={{ fontSize: '1.1rem', fontFamily: 'Poppins', fontWeight: 600, color: T.text, lineHeight: 1.2 }}>
              {tickIdx === -1 ? "Idle: Ready to execute" : (currentTick.label || "Processing")}
            </div>
            <div style={{ fontSize: '0.85rem', color: T.muted, marginTop: '6px', maxWidth: '400px', marginInline: 'auto' }}>
              {currentTick.desc}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span style={{ fontSize: '0.65rem', color: T.muted, fontFamily: 'Poppins', fontWeight: 700 }}>SPEED</span>
               <input type="range" min="1" max="10" value={speed} onChange={e => setSpeed(parseInt(e.target.value))} style={{ width: '100px', accentColor: T.accent, cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '100%' }}>
                <button onClick={() => resetSimulator()} style={{ flex: 1, maxWidth: '100px', padding: '10px 0', background: 'transparent', color: T.text, border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>Reset</button>
                <button onClick={() => runTick(-1)} disabled={tickIdx === -1} style={{ flex: 1, maxWidth: '100px', padding: '10px 0', background: 'transparent', color: tickIdx === -1 ? T.faint : T.text, border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.8rem' }}>Back</button>
                <button onClick={() => runTick(1)} disabled={tickIdx >= currentScenario.ticks.length - 1} style={{ flex: 1, maxWidth: '100px', padding: '10px 0', background: 'transparent', color: tickIdx >= currentScenario.ticks.length - 1 ? T.faint : T.text, border: `1px solid ${T.borderMid}`, borderRadius: '8px', fontSize: '0.8rem' }}>Next</button>
              </div>
              <button 
                onClick={() => { if (tickIdx >= currentScenario.ticks.length - 1) resetSimulator(); setIsPlaying(!isPlaying); }} 
                style={{ 
                  width: '100%', maxWidth: '316px', padding: '12px 0', 
                  background: isPlaying ? T.surface : T.accent, 
                  color: isPlaying ? T.text : '#fff', 
                  border: isPlaying ? `1px solid ${T.borderMid}` : 'none', 
                  borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, 
                  boxShadow: isPlaying ? 'none' : `0 4px 12px rgba(99,102,241,0.2)` 
                }}
              >
                {isPlaying ? 'Pause Simulation' : 'Auto Play Simulation'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginTop: '24px' }}>
          <div style={{ flex: 1, height: '4px', background: T.accent, borderRadius: '2px' }} />
          {currentScenario.ticks.map((s, i) => (
            <div key={i} style={{ flex: 1, height: '4px', background: i <= tickIdx ? T.accent : T.borderMid, borderRadius: '2px', transition: 'background 0.3s' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
