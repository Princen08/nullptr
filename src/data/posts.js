const POSTS = [
  { 
    slug: 'huffman-coding-explained', 
    title: 'How Huffman Coding Works', 
    subtitle: 'The Algorithm Behind ZIP, GZIP & PNG Compression',
    excerpt: 'Explore the lossless compression algorithm powering ZIP and the web through our interactive tree builder. We dive deep into prefixes, entropy, and optimal code lengths.', 
    tags: ['Compression', 'Algorithms', 'Data Structures'], 
    readTime: '8 min', 
    date: 'Mar 19, 2026' 
  },
  { 
    slug: 'how-dns-works', 
    title: 'How DNS Works', 
    subtitle: 'Resolving the Web',
    excerpt: 'A deep dive into the Domain Name System, resolving google.com from scratch. Learn about recursive resolvers, root servers, and DNS caching mechanisms.', 
    tags: ['Networking', 'DNS'], 
    readTime: '12 min', 
    date: 'Mar 08, 2026' 
  },
  { 
    slug: 'how-https-and-tls-work', 
    title: 'How HTTPS and TLS Work', 
    subtitle: 'Certificates, Handshakes & Encryption Explained',
    excerpt: 'Understanding asymmetric cryptography, certificates, and the TLS handshake. Explore AES-GCM, ECDHE key exchanges, and how trust is verified.', 
    tags: ['Security', 'Web'], 
    readTime: '8 min', 
    date: 'Mar 12, 2026' 
  },
  { 
    slug: 'event-loop-explained', 
    title: 'Event Loop Explained', 
    subtitle: 'Call Stack, Tasks, and Microtasks',
    excerpt: 'How the JavaScript Event Loop works — Call Stack, Tasks, and Microtasks. A visual guide to asynchronous execution and engine performance.', 
    tags: ['JS', 'Async'], 
    readTime: '9 min', 
    date: 'Mar 15, 2026' 
  },
  { 
    slug: 'linux-kernel-scheduler', 
    title: 'Inside the Linux Kernel Scheduler', 
    subtitle: 'Juggling Processes',
    excerpt: 'How the Completely Fair Scheduler (CFS) juggles thousands of processes using red-black trees and virtual runtime calculations.', 
    tags: ['OS', 'Internals'], 
    readTime: '20 min', 
    date: 'Mar 25, 2026' 
  },
  { 
    slug: 'write-ahead-logging', 
    title: 'Write-Ahead Logging (WAL)', 
    subtitle: 'How Databases Survive Power Failures',
    excerpt: 'A architectural dive into the backbone of database durability. Learn how Postgres, MySQL, and Kafka guarantee data integrity through append-only logs.', 
    tags: ['Databases', 'Internals', 'Architecture'], 
    readTime: '15 min', 
    date: 'Mar 18, 2026' 
  }
];

export { POSTS };

export const TOPICS = ['DNS', 'Security', 'OS Internals', 'Web', 'Algorithms', 'DevTools', 'Databases'];
export const CATEGORIES = ['All', 'Networking', 'Security', 'OS', 'Web', 'DNS', 'Internals', 'Databases', 'Architecture'];
