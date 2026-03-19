import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const dataDir = path.join(__dirname, '..', 'src', 'data');

const fileMapping = {
  'huffman-coding-explained': 'HuffmanBlog.jsx',
  'how-dns-works': 'DNSBlog.jsx',
  'how-https-and-tls-work': 'TLSBlog.jsx',
  'event-loop-explained': 'EventLoopBlog.jsx',
  'write-ahead-logging': 'WALBlog.jsx'
};

const searchIndex = {};

for (const [slug, filename] of Object.entries(fileMapping)) {
  const filePath = path.join(pagesDir, filename);
  if (fs.existsSync(filePath)) {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    
    // Very simple text extraction: extract everything inside >...<, ignoring jsx logic
    // We'll just strip out all <Tags> and {JS logic}
    let text = rawContent
      // Remove import and functional component definitions
      .replace(/import.*?['"];/g, '')
      .replace(/export default function.*/, '')
      // Remove blocks of code inside <CodeBlock>
      .replace(/<CodeBlock[^>]*code=\{`([^`]+)`\}[^>]*\/>/g, '$1')
      // Remove JSX tags
      .replace(/<\/?[A-Z][a-zA-Z0-9]*[^>]*>/g, ' ')
      .replace(/<\/?[a-z][a-zA-Z0-9]*[^>]*>/g, ' ')
      // Remove JS expressions in JSX like style={{...}}
      .replace(/\{[^}]+\}/g, ' ')
      // Remove multiple spaces, newlines
      .replace(/\s+/g, ' ')
      .trim();
      
    searchIndex[slug] = text;
  }
}

fs.writeFileSync(path.join(dataDir, 'searchIndex.json'), JSON.stringify(searchIndex, null, 2));
console.log('Search index generated at src/data/searchIndex.json');
