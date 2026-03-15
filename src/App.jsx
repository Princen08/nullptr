import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import DNSBlog from './pages/DNSBlog';
import TLSBlog from './pages/TLSBlog';
import EventLoopBlog from './pages/EventLoopBlog';
import About from './pages/About';
import NotFound from './pages/NotFound';
import CommandPalette from './components/CommandPalette';
import MemoryScrollbar from './components/MemoryScrollbar';
import TelemetryDashboard from './components/TelemetryDashboard';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TelemetryDashboard />
      
      <Routes>
        {/* Full screen 404 - no Nav/Footer */}
        <Route path="/404" element={<NotFound />} />
        
        <Route path="*" element={
          <>
            <Nav />
            <MemoryScrollbar />
            <main style={{ flex: 1, paddingTop: '80px', paddingRight: 'var(--scrollbar-width, 60px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/how-https-and-tls-work" element={<TLSBlog />} />
                <Route path="/blog/event-loop-explained" element={<EventLoopBlog />} />
                <Route path="/blog/:slug" element={<DNSBlog />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
      
      <Analytics />
      <CommandPalette />
      
      <style>{`
        :root {
          --scrollbar-width: 60px;
        }
        @media (max-width: 768px) {
          :root {
            --scrollbar-width: 12px;
          }
        }
        @media (max-width: 768px) {
          /* Hide telemetry on very small mobile screens to save space if needed, 
             or we can just keep it slim. Let's keep it for now but adjust position. */
        }
      `}</style>
    </div>
  );
}

export default App;
