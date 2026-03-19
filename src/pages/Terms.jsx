import { T } from '../theme';
import SEO from '../components/SEO';
import BinaryShadow from '../components/BinaryShadow';

export default function Terms() {
  return (
    <div className="container fade-up" style={{ padding: '64px 24px', maxWidth: '800px', minHeight: '80vh' }}>
      <SEO 
        title="Terms and Conditions" 
        description="Rules and terms of service for utilizing the NullPtr Engineering knowledge base." 
      />
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: 800, marginBottom: '24px', color: T.text }}>
        <BinaryShadow>Terms & Conditions</BinaryShadow>
      </h1>
      
      <section style={{ marginBottom: '48px', marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>1. Agreement to Terms</h2>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8 }}>
          By accessing the NullPtr Engineering Blog, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws. If you disagree with any of these terms, you are prohibited from using or accessing this site.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>2. Intellectual Property Rights</h2>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8 }}>
          Other than the content you own, under these Terms, NullPtr Engineering and/or its licensors own all the intellectual property rights and materials contained in this website. The interactive widgets, diagrams, visual CSS tokens, and raw article manuscripts are proprietary.
        </p>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8, marginTop: '16px' }}>
          You are granted a limited license only for purposes of viewing the material contained on this website. You may not scrape, republish, or sell the written content without explicit written consent from the authors.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>3. Disclaimer</h2>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8 }}>
          All the materials on this website are provided "as is". NullPtr makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, NullPtr does not make any representations concerning the accuracy or reliability of the use of the materials on its website or otherwise relating to such materials.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700, marginBottom: '16px', color: T.text }}>4. Link Tracking</h2>
        <p style={{ color: T.text, fontSize: '1.05rem', lineHeight: 1.8 }}>
          NullPtr has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by NullPtr of the site. The use of any linked website is at the user's own risk.
        </p>
      </section>
    </div>
  );
}
