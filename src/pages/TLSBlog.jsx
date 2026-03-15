import SectionHeading from '../components/SectionHeading';
import Para from '../components/Para';
import InfoCard from '../components/InfoCard';
import CodeBlock from '../components/CodeBlock';
import StatGrid from '../components/StatGrid';
import Code from '../components/Code';
import BlogLayout from '../layouts/BlogLayout';
import RelatedPosts from '../components/RelatedPosts';
import { POSTS } from '../data/posts';
import TLSAnimation from '../animation/TLSAnimation';
import { T } from '../theme';

// Enhanced Layer Stack Component
function LayerStack() {
  const layers = [
    { name: 'Application', detail: 'HTTP / WebSockets', color: T.accent, icon: '🌐' },
    { name: 'Security', detail: 'TLS / SSL', color: T.green, icon: '🔒', highlight: true },
    { name: 'Transport', detail: 'TCP / UDP', color: T.blue, icon: '🚀' },
    { name: 'Network', detail: 'IP (IPv4/v6)', color: T.purple, icon: '📡' }
  ];

  return (
    <div style={{ margin: '40px 0', perspective: '1000px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
        {layers.map((l, i) => (
          <div 
            key={l.name}
            style={{
              padding: '16px 24px',
              background: l.highlight ? `linear-gradient(90deg, ${T.surfaceHigh}, #0d1a1e)` : T.surfaceHigh,
              border: `1px solid ${l.highlight ? T.green : T.border}`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transform: `translateZ(${ (layers.length - i) * 10}px) rotateX(10deg)`,
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              position: 'relative',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              background: 'rgba(255,255,255,0.03)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.2rem',
              border: `1px solid ${T.border}`
            }}>
              {l.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: l.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{l.name} Layer</div>
              <div style={{ fontSize: '1rem', color: T.text, fontWeight: 600 }}>{l.detail}</div>
            </div>
            {l.highlight && (
              <div style={{ 
                position: 'absolute', 
                right: '20px', 
                background: T.green, 
                color: '#000', 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                padding: '2px 8px', 
                borderRadius: '4px' 
              }}>
                TLS RESIDES HERE
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TLSBlog() {
  const post = POSTS.find(p => p.slug === 'how-https-and-tls-work');

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
          Every time you browse the web, a silent but complex cryptographic dance happens in the background. HTTPS is the foundation of web security, but what actually happens when your browser connects to a server?
        </Para>

        <StatGrid stats={[
          { label: 'Encryption', value: 'AES-256' },
          { label: 'Key Exchange', value: 'ECDHE' },
          { label: 'Hash', value: 'SHA-384' },
          { label: 'Port', value: '443' }
        ]} />

        <SectionHeading title="What is HTTPS?" tag="Basics" />
        <Para>
          HTTPS (Hypertext Transfer Protocol Secure) is the encrypted version of HTTP. It uses the Transport Layer Security (TLS) protocol to encrypt communications. This ensures <strong>Privacy</strong>, <strong>Integrity</strong>, and <strong>Authentication</strong>.
        </Para>

        <SectionHeading title="The TLS Layer Stack" tag="Architecture" />
        <Para>
          TLS sits between the Application layer (HTTP) and the Transport layer (TCP). It works by wrapping data in records that are cryptographically signed and encrypted before being sent over the wire.
        </Para>
        
        <LayerStack />

        <SectionHeading title="Interactive Handshake" tag="Visualization" />
        <Para>
          Let's watch the TLS 1.3 handshake in action. Notice how keys are generated locally before any actual data is swapped.
        </Para>
        <TLSAnimation />

        <SectionHeading title="ECDH Magic: The Key Exchange" tag="Crypto" />
        <Para>
          Elliptic Curve Diffie-Hellman (ECDH) allows two parties to establish a shared secret over an insecure channel. Neither party ever sends the actual secret; they only send "public shares" derived from mathematical curves.
        </Para>
        <InfoCard type="info" title="Why ECDHE?">
          The 'E' stands for <strong>Ephemeral</strong>. A new key is generated for every single session. This provides "Forward Secrecy"—even if a server's private key is stolen later, past sessions remain encrypted.
        </InfoCard>

        <SectionHeading title="AES-256-GCM: The Bulk Cipher" tag="Speed" />
        <Para>
          Once the shared secret is established, the handshake is over. For the actual data transfer, we switch to Symmetric Encryption (AES) because it is significantly faster than Asymmetric Math.
        </Para>
        <CodeBlock label="Modern Cipher Suite" code={`TLS_AES_256_GCM_SHA384
- TLS: Protocol
- AES_256: Symmetric Encryption
- GCM: Mode of operation (Auth Tag)
- SHA384: Hashing algorithm`} />

        <SectionHeading title="Certificate Authorities & Trust" tag="Identity" />
        <Para>
          How do you know <Code>google.com</Code> is actually Google? Through Certificates signed by a trusted third party called a Certificate Authority (CA).
        </Para>
        <InfoCard type="warning" title="Revocation">
          If a certificate is stolen, it can be revoked via CRL (Certificate Revocation Lists) or OCSP, telling browsers to no longer trust that specific cert.
        </InfoCard>

        <SectionHeading title="Security Threats" tag="Dangers" />
        <Para>
          While TLS is incredibly robust, it's not invincible. Attacks like <strong>Man-in-the-Middle (MITM)</strong> often target the trust chain (fake CAs) rather than the encryption math itself.
        </Para>

        <SectionHeading title="Conclusion" tag="Summary" />
        <Para>
          Modern HTTPS is faster and more secure than ever. By moving to TLS 1.3, the web has eliminated legacy vulnerabilities and reduced latency, ensuring that security doesn't come at the cost of performance.
        </Para>
        
        <div style={{ marginTop: '48px', color: T.muted, fontSize: '0.8rem' }}>
          References: 
          <a href="https://tools.ietf.org/html/rfc8446" style={{ color: T.accent, marginLeft: '8px' }}>RFC 8446 (TLS 1.3)</a>
        </div>
      </BlogLayout>
      <RelatedPosts currentSlug={post.slug} />
    </>
  );
}
