import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import Para from '../components/Para';
import InfoCard from '../components/InfoCard';
import CodeBlock from '../components/CodeBlock';
import StatGrid from '../components/StatGrid';
import Code from '../components/Code';
import BlogLayout from '../layouts/BlogLayout';
import RelatedPosts from '../components/RelatedPosts';
import { POSTS } from '../data/posts';
import { T } from '../theme';
import { useTheme } from '../context/ThemeContext';

function WALAnimation() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);

  const operations = [
    { type: 'INSERT', table: 'users', data: 'id:1, name:Alice' },
    { type: 'UPDATE', table: 'users', data: 'id:1, balance:500' },
    { type: 'DELETE', table: 'sessions', data: 'id:992' },
    { type: 'INSERT', table: 'orders', data: 'id:42, user:1' }
  ];

  const MAX_STEP = operations.length + 4;

  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => {
      setStep(s => (s >= MAX_STEP + 1 ? 0 : s + 1));
    }, 1500);
    return () => clearInterval(timer);
  }, [auto, MAX_STEP]);

  // Derive arrays safely so backwards seeking works
  const memoryOps = step <= operations.length 
    ? operations.slice(0, step) 
    : (step === operations.length + 1 ? operations : 
      (step === operations.length + 2 ? [] : operations));

  // WAL sits permanently on disk from the moment the op arrives
  const walOps = step <= operations.length 
    ? operations.slice(0, step) 
    : operations;

  const diskOps = step >= operations.length + 4 ? operations : [];

  const getStatusText = () => {
    if (step === 0) return 'System Idle';
    if (step <= operations.length) return `Writing Op ${step} to Memory & WAL`;
    if (step === operations.length + 1) return 'Simulating sudden Power Loss...';
    if (step === operations.length + 2) return 'SYSTEM CRASHED. Memory wiped.';
    if (step === operations.length + 3) return 'Replaying WAL to restore Memory...';
    if (step === operations.length + 4) return 'Flushing Memory to permanent Data Files (Checkpoint)';
    return 'Resuming operations...';
  };

  const statusColor = step === operations.length + 2 ? T.red : (step === operations.length + 3 ? T.amber : T.green);

  return (
    <div style={{ margin: '40px 0', border: `1px solid ${T.border}`, borderRadius: '16px', background: T.surface, overflow: 'hidden' }}>
      <div style={{ padding: '16px', background: T.surfaceHigh, borderBottom: `1px solid ${T.borderMid}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontWeight: 900, color: T.text }}>Simulation: Write-Ahead Log</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setStep(0)} style={{ padding: '6px 12px', background: 'transparent', color: T.text, border: `1px solid ${T.borderMid}`, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Reset</button>
          <button onClick={() => { setAuto(false); setStep(s => Math.max(0, s - 1)); }} style={{ padding: '6px 12px', background: 'transparent', color: T.text, border: `1px solid ${T.borderMid}`, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Prev</button>
          <button onClick={() => { setAuto(false); setStep(s => Math.min(MAX_STEP, s + 1)); }} style={{ padding: '6px 12px', background: 'transparent', color: T.text, border: `1px solid ${T.borderMid}`, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Next</button>
          <button onClick={() => setAuto(!auto)} style={{ padding: '6px 16px', background: auto ? T.surface : T.accent, color: auto ? T.text : '#fff', border: auto ? `1px solid ${T.borderMid}` : 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{auto ? 'Pause' : 'Auto Play'}</button>
        </div>
      </div>
      
      <div style={{ padding: '12px 24px', background: `${statusColor}11`, borderBottom: `1px solid ${T.border}`, fontSize: '0.85rem', color: statusColor, fontWeight: 700, textAlign: 'center' }}>
        {getStatusText()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '24px' }}>
        
        {/* Client / Memory */}
        <div style={{ padding: '16px', border: `1px solid ${T.borderMid}`, borderRadius: '12px', background: isDark ? '#0d1117' : '#fff' }}>
          <div style={{ fontSize: '0.85rem', color: T.muted, textTransform: 'uppercase', marginBottom: '12px', fontWeight: 800 }}>Volatile Memory (RAM)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '150px' }}>
            {memoryOps.map((op, i) => (
              <div key={i} className="fade-up" style={{ padding: '8px', background: T.surfaceHigh, borderRadius: '6px', fontSize: '0.75rem', color: T.text, borderLeft: `3px solid ${T.accent}` }}>
                <span style={{ color: T.accent, fontWeight: 700, marginRight: '8px' }}>{op.type}</span>
                {op.table} &rarr; {op.data}
              </div>
            ))}
          </div>
        </div>

        {/* WAL File */}
        <div style={{ padding: '16px', border: `1px solid ${T.amber}`, borderRadius: '12px', background: `${T.amber}11` }}>
          <div style={{ fontSize: '0.85rem', color: T.amber, textTransform: 'uppercase', marginBottom: '12px', fontWeight: 800 }}>Append-Only WAL (Disk)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '150px', fontFamily: 'monospace', fontSize: '0.7rem' }}>
            {walOps.map((op, i) => (
              <div key={i} className="fade-up" style={{ color: T.text, opacity: 0.8 }}>
                [LSN:{1000 + i}] {op.type} {op.table} {op.data}
              </div>
            ))}
          </div>
        </div>

        {/* Data Files */}
        <div style={{ padding: '16px', border: `1px solid ${T.borderMid}`, borderRadius: '12px', background: isDark ? '#0d1117' : '#fff' }}>
          <div style={{ fontSize: '0.85rem', color: T.muted, textTransform: 'uppercase', marginBottom: '12px', fontWeight: 800 }}>B-Tree Files (Disk)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '150px' }}>
            {diskOps.map((op, i) => (
              <div key={i} className="fade-up" style={{ padding: '8px', background: T.surfaceHigh, borderRadius: '6px', fontSize: '0.75rem', color: T.text, borderLeft: `3px solid ${T.green}` }}>
                <span style={{ color: T.green, fontWeight: 700, marginRight: '8px' }}>FLUSH</span>
                 {op.table} structure updated
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function WALBlog() {
  const post = POSTS.find(p => p.slug === 'write-ahead-logging');

  return (
    <>
      <BlogLayout
        title={post.title}
        subtitle={post.subtitle}
        tags={post.tags}
        date={post.date}
        readTime={post.readTime}
      >
        <Para>
          Imagine running a high-traffic Postgres database processing thousands of payments a second. Suddenly, a total power grid failure occurs. Your server shuts down instantly. How do you guarantee, with absolute certainty, that the money deducted from a user's balance wasn't lost in the digital void before it could physically write to the magnetic platters?
        </Para>
        <Para>
          The answer lies in one of the most fundamental concepts in computer science and distributed system architecture: <strong>Write-Ahead Logging (WAL)</strong>.
        </Para>

        <StatGrid stats={[
          { label: 'Operation Type', value: 'Append-Only' },
          { label: 'Disk IO Cost', value: 'Sequential (Fast)' },
          { label: 'Core Goal', value: 'Durability (ACID)' },
          { label: 'Alias', value: 'Redo Log / Commit Log' }
        ]} />

        <SectionHeading title="The Performance vs. Durability Paradox" tag="The Problem" />
        <Para>
          Writing data reliably to permanent storage (HDDs or SSDs) is inherently slow because it involves seeking across B-Tree structures, finding the correct blocks, and overwriting them in a strictly structured manner. If your database did this synchronously for every <Code>UPDATE</Code> command, your application would slow to a crawl.
        </Para>
        <Para>
          To maintain extreme performance, databases like MySQL and Postgres cache all database changes entirely in volatile RAM (the "Buffer Pool"). This allows them to respond to clients incredibly fast. But memory is volatile: a crash wipes it instantly. This paradox effectively pits speed against data safety.
        </Para>

        <SectionHeading title="Enter the Write-Ahead Log" tag="The Architecture" />
        <Para>
          Write-Ahead Logging solves this paradox beautifully. Before the database is allowed to modify the main B-Tree files on disk, or even reply "Success" to the executing client, it forcefully writes a tiny string describing the change into an append-only file: the WAL.
        </Para>
        
        <InfoCard type="tip" title="Why is appending fast?">
          Appending to the absolute end of a log file requires zero seek time. It's a continuous, linear magnetic write command. Sequential I/O on modern SSDs (or even ancient spinning disks) is orders of magnitude faster than random B-Tree I/O.
        </InfoCard>

        <SectionHeading title="Interactive Crash Timeline" tag="Simulation" />
        <Para>
          Observe the timeline below. Changes enter fast memory and the sequential WAL immediately. The heavy B-Tree disk flush only happens periodically (a "Checkpoint"). Use the controls to step through exactly how a database survives power loss.
        </Para>

        <WALAnimation />

        <SectionHeading title="Internal Mechanics (The ARIES Protocol)" tag="Deep Dive" />
        <Para>
          The standard specification that most relational databases follow for WAL behavior is the <strong>ARIES</strong> algorithm (Algorithms for Recovery and Isolation Exploiting Semantics). Wait, how does the database aggressively guarantee the log gets written? It uses standard operating system <Code>fsync()</Code> commands.
        </Para>
        <Para>
          Usually, the OS completely buffers I/O operations into page caches, meaning a <Code>write()</Code> doesn't immediately touch the platters. WAL operations explicitly force an <Code>fsync()</Code> at the end of transactions, flushing the system cache straight to physical media. If an <Code>fsync()</Code> succeeds, the transaction is officially marked committed.
        </Para>

        <SectionHeading title="Recovery and Checkpointing" tag="Mechanics" />
        <Para>
          When the database boots back up after a severe crash, it knows its permanent B-Tree files are outdated. It opens the WAL, reads everything written since the last "Checkpoint" (the last time the DB successfully flushed its memory to B-Trees), and literally re-executes those operations (known as <strong>Redo</strong> phase). Once it catches up to the very last line of the WAL, the database officially resumes accepting new connections.
        </Para>
        <CodeBlock label="Postgres WAL Terminology" code={`// Every WAL entry receives a unique ID:
Log Sequence Number (LSN): 0/162E698

// A database checkpoint physically syncs memory to disk
CHECKPOINT;
// Now the WAL can safely be truncated or recycled!`} />

        <SectionHeading title="Pros and Cons" tag="Trade-offs" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '32px 0' }}>
          <div style={{ background: `${T.green}11`, padding: '24px', borderRadius: '12px', border: `1px solid ${T.green}33` }}>
            <div style={{ color: T.green, fontWeight: 800, marginBottom: '16px' }}>Advantages (Pros)</div>
            <ul style={{ color: T.text, fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: '20px' }}>
              <li><strong>Absolute ACID Durability:</strong> Guarantee zero data loss on unexpected power cycles.</li>
              <li><strong>Peak Insertion Velocity:</strong> Unlocks massive throughput because pure sequential writes bypass random block I/O.</li>
              <li><strong>Point-in-Time Replication:</strong> Replicas and Read-Only slaves operate smoothly by continuously streaming the primary server's WAL over the network, achieving near zero lag.</li>
            </ul>
          </div>
          <div style={{ background: `${T.red}11`, padding: '24px', borderRadius: '12px', border: `1px solid ${T.red}33` }}>
            <div style={{ color: T.red, fontWeight: 800, marginBottom: '16px' }}>Limitations (Cons)</div>
            <ul style={{ color: T.text, fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: '20px' }}>
              <li><strong>Recovery Bottleneck:</strong> If the gap between Disk Checkpoints is too long, the DB can take literal hours to replay a massive WAL sequence upon booting.</li>
              <li><strong>Write Amplification:</strong> The database effectively writes every query twice (once to WAL, once to B-Trees), compounding disk wear.</li>
              <li><strong>Disk Exhaustion:</strong> In a misconfigured environment, unchecked WAL files will grow indefinitely until they entirely suffocate volume storage.</li>
            </ul>
          </div>
        </div>

        <SectionHeading title="Beyond Relational Databases" tag="Wider Ecosystems" />
        <Para>
          The WAL concept isn't limited exclusively to SQL databases. High-throughput distributed message queues like <strong>Apache Kafka</strong> operate entirely by exposing the WAL directly as their core data structure. Modern consensus algorithms like <strong>Raft</strong> (used in etcd and Kubernetes) replicate a distributed WAL across multiple machines to achieve unbreakable leader elections and fault tolerance.
        </Para>

        <SectionHeading title="Conclusion" tag="Summary" />
        <Para>
          The Write-Ahead Log acts as the definitive source of truth for durable systems. By separating the fast logging of actions from the slow application of consequences, systems safely achieve the throughput of in-memory caching combined with the ironclad guarantees of permanent disk storage. 
        </Para>
        
      </BlogLayout>
      <RelatedPosts currentSlug={post.slug} />
    </>
  );
}
