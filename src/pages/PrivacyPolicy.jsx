import { T } from '../theme';
import SEO from '../components/SEO';
import BinaryShadow from '../components/BinaryShadow';

export default function PrivacyPolicy() {
  return (
    <div className="container fade-up" style={{ padding: '64px 24px', maxWidth: '800px', minHeight: '80vh' }}>
      <SEO 
        title="Privacy Policy" 
        description="Learn how NullPtr handles your data, cookies, and third-party advertising partners like Google." 
      />
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: 800, marginBottom: '24px', color: T.text }}>
        <BinaryShadow>Privacy Policy</BinaryShadow>
      </h1>
      
      <p style={{ fontSize: '1.1rem', color: T.muted, lineHeight: 1.6, marginBottom: '48px' }}>
        Effective Date: March 19, 2026
      </p>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>1. Information We Collect</h2>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '16px' }}>
          When you visit the NullPtr Engineering Blog, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the site, we collect information about the individual web pages or blogs that you view, what websites or search terms referred you to the site, and information about how you interact with the site.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>2. Third-Party Vendors and Advertising</h2>
        <div style={{ background: `${T.accent}11`, padding: '24px', borderRadius: '12px', border: `1px solid ${T.accent}33`, marginBottom: '16px' }}>
          <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8 }}>
            <strong>Important Disclosure:</strong> We use third-party advertising companies, including <strong>Google AdSense</strong>, to serve ads when you visit our website. 
          </p>
        </div>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '16px' }}>
          These third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites on the internet. Specifically, Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to NullPtr and/or other sites on the Internet.
        </p>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8 }}>
          Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" style={{ color: T.accent, textDecoration: 'underline' }}>Google Ads Settings</a>.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>3. Tracking Technologies</h2>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '16px' }}>
          We utilize Vercel Analytics internally to understand which articles are resonating with our readers. This analytics tooling is anonymized and does not track identifiable personal footprint histories.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>4. Changes to This Policy</h2>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8 }}>
          We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. Continuous use of our platform acts as explicit consent to the updated terms.
        </p>
      </section>
    </div>
  );
}
