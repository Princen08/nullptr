import SectionHeading from '../components/SectionHeading';
import Para from '../components/Para';
import InfoCard from '../components/InfoCard';
import CodeBlock from '../components/CodeBlock';
import StatGrid from '../components/StatGrid';
import Code from '../components/Code';
import BlogLayout from '../layouts/BlogLayout';
import RelatedPosts from '../components/RelatedPosts';
import DNSGraph from '../animation/DNSGraph';
import RecordTypesTable from '../components/RecordTypesTable';
import MiniFlowDiagram from '../components/MiniFlowDiagram';
import { POSTS } from '../data/posts';

export default function DNSBlog() {
  const post = POSTS.find(p => p.slug === 'how-dns-works');

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
          Every time you type <Code>google.com</Code> into your browser and hit Enter, a massive distributed database springs into action. The Domain Name System (DNS) is the phonebook of the Internet, translating human-readable names into the IP addresses that computers use to talk to each other.
        </Para>
        
        <StatGrid stats={[
          { label: 'Time to resolve', value: '~20-120ms' },
          { label: 'Root Servers', value: '13' },
          { label: 'Queries / Sec', value: '100B+' }
        ]} />

        <SectionHeading title="The Resolution Chain" tag="Phase 1" />
        <Para>
          DNS isn't a single server you query. It's a hierarchical delegation tree. When you ask for the IP of <Code>google.com</Code>, your request might bounce across several servers if it isn't already cached locally.
        </Para>

        <MiniFlowDiagram nodes={["Client", "Resolver", "Root (.)", "TLD (.com)", "Auth DNS"]} />

        <InfoCard type="info" title="The Magic of Caching">
          In reality, the full chain of queries is rarely executed because of aggressive caching at every single layer—your browser, your operating system, your router, and your ISP's resolver all cache DNS records.
        </InfoCard>

        <SectionHeading title="Interactive Resolution Flow" tag="Visualization" />
        <Para>
          Let's trace exactly what happens when your local resolver has a cold cache and needs to perform a full recursive query to find the A record for our target domain.
        </Para>

        <DNSGraph />

        <SectionHeading title="Digging Deeper: The Command Line" tag="DevTools" />
        <Para>
          You can watch this process yourself using the <Code>dig</Code> command in your terminal. By adding the <Code>+trace</Code> flag, we force dig to bypass the cache and query from the root down.
        </Para>

        <CodeBlock label="终端 (Terminal)" code={`$ dig +trace google.com

; <<>> DiG 9.10.6 <<>> +trace google.com
;; global options: +cmd
.           518400  IN  NS  a.root-servers.net.
.           518400  IN  NS  b.root-servers.net.
...
com.        172800  IN  NS  a.gtld-servers.net.
...
google.com. 172800  IN  NS  ns1.google.com.
...
google.com. 300     IN  A   142.250.190.46`} />

        <SectionHeading title="DNS Record Types" tag="Reference" />
        <Para>
          While <Code>A</Code> records are the most common, DNS holds a variety of metadata about domains. Here's a quick cheat sheet of the most important record types you'll encounter.
        </Para>

        <RecordTypesTable />

        <InfoCard type="warning" title="Security Note: DNS Spoofing">
          Basic DNS is mostly sent in plain text over UDP port 53. This makes it vulnerable to on-path attackers and spoofing. Technologies like DNS-over-HTTPS (DoH) and DNSSEC have emerged to provide encryption and cryptographic validation to the resolution chain.
        </InfoCard>
      </BlogLayout>
      <RelatedPosts currentSlug={post.slug} />
    </>
  );
}
