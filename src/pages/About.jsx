import { T } from '../theme';
import SEO from '../components/SEO';
import BinaryShadow from '../components/BinaryShadow';

export default function About() {
  return (
    <div className="container fade-up" style={{ padding: '64px 24px', maxWidth: '800px', minHeight: '80vh' }}>
      <SEO 
        title="Our Mission" 
        description="Learn about nullptr - our dedicated mission to demystify the complex layers of modern software engineering." 
      />
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: 800, marginBottom: '24px', color: T.text }}>
        <BinaryShadow>About nullptr</BinaryShadow>
      </h1>
      
      <p style={{ fontSize: '1.25rem', color: T.muted, lineHeight: 1.6, marginBottom: '48px' }}>
        <BinaryShadow>We write deep technical content for developers who want to understand how things actually work under the hood.</BinaryShadow>
      </p>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>Our Mission</h2>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '16px' }}>
          The modern web is built on layers of abstraction. While abstractions make us productive, they can also hide the fundamental truths of how our systems operate. 
        </p>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8 }}>
          NullPtr exists to demystify these layers. Whether it is dissecting a network protocol, understanding OS thread scheduling, or tracing the execution of a single line of JavaScript down to the V8 engine, we believe that clarity comes from diving deep.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>What We Cover</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['Deep dives into web and networking protocols (DNS, TLS, HTTP/3).', 'Systems programming and OS internals.', 'Database engines and distributed systems algorithms.', 'Performance optimization and profiling at scale.'].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start', color: T.text, lineHeight: 1.6 }}>
              <span style={{ color: T.accent }}>▹</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '24px', color: T.text }}>The Author</h2>
        <div style={{ display: 'flex', gap: '24px', background: T.surface, padding: '24px', borderRadius: '12px', border: `1px solid ${T.border}` }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontSize: '2rem', fontFamily: 'Poppins', fontWeight: 700, flexShrink: 0 }}>
            N
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'Poppins', fontWeight: 600, color: T.text, marginBottom: '8px' }}>NullPtr Team</h3>
            <p style={{ color: T.muted, fontSize: '0.95rem', lineHeight: 1.6 }}>
              A collective of senior engineers, systems programmers, and networking nerds dedicated to exploring the dark corners of the tech stack.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
