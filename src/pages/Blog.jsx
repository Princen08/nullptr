import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import PostCard from '../components/PostCard';
import { T } from '../theme';
import { POSTS, CATEGORIES } from '../data/posts';
import SEO from '../components/SEO';
import BinaryShadow from '../components/BinaryShadow';

export default function Blog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fusePosts = useMemo(() => new Fuse(POSTS, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'tags', weight: 1.5 },
      { name: 'excerpt', weight: 1 },
      { name: 'content', weight: 0.5 }
    ],
    threshold: 0.35, 
    distance: 100
  }), []);

  const filteredPosts = useMemo(() => {
    let result = POSTS;
    if (search.trim()) {
      result = fusePosts.search(search).map(res => res.item);
    }
    if (category !== 'All') {
      result = result.filter(post => post.tags.includes(category));
    }
    return result;
  }, [search, category, fusePosts]);

  return (
    <div className="container" style={{ padding: '64px 24px 120px 24px' }}>
      <SEO 
        title="Engineering Blog" 
        description="Deep dives into networking, security, and low-level system internals. Explore our latest technical dissections." 
      />
      <header style={{ marginBottom: '64px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontFamily: 'Poppins', fontWeight: 800, color: T.text, marginBottom: '16px' }}>
          <BinaryShadow>Engineering Blog</BinaryShadow>
        </h1>
        <p style={{ color: T.muted, fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          <BinaryShadow>Deep dives into networking, security, and low-level system internals.</BinaryShadow>
        </p>
      </header>

      <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <input 
          type="text" 
          placeholder="Search articles..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '600px', margin: '0 auto', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '12px', padding: '16px 24px', color: T.text, fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '8px 20px', borderRadius: '99px', border: `1px solid ${category === cat ? T.accent : T.border}`, background: category === cat ? T.accentSoft : 'transparent', color: category === cat ? T.accent : T.muted, fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
        {filteredPosts.map(post => (
          <PostCard key={post.slug} {...post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: T.muted }}>
          No articles found matching your criteria.
        </div>
      )}
    </div>
  );
}
