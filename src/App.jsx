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

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1, paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/how-https-and-tls-work" element={<TLSBlog />} />
          <Route path="/blog/event-loop-explained" element={<EventLoopBlog />} />
          <Route path="/blog/:slug" element={<DNSBlog />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
