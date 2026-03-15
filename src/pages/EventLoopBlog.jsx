import SectionHeading from '../components/SectionHeading';
import Para from '../components/Para';
import InfoCard from '../components/InfoCard';
import CodeBlock from '../components/CodeBlock';
import StatGrid from '../components/StatGrid';
import Code from '../components/Code';
import EventLoopSimulator from '../animation/EventLoopSimulator';
import BlogLayout from '../layouts/BlogLayout';
import RelatedPosts from '../components/RelatedPosts';
import { POSTS } from '../data/posts';
import { T } from '../theme';

export default function EventLoopBlog() {
  const post = POSTS.find(p => p.slug === 'event-loop-explained');

  return (
    <>
      <BlogLayout 
        title={post.title}
        subtitle={post.subtitle}
        tags={post.tags}
        date={post.date}
        readTime={post.readTime}
      >
        <StatGrid stats={[
          { label: 'JS Threads', value: '1' },
          { label: 'Stack Size', value: '~10k' },
          { label: 'Priority', value: 'Microtasks' },
          { label: 'Min Delay', value: '4ms' },
          { label: 'Libuv Phases', value: '6' }
        ]} />

        <SectionHeading title="The Single-Threaded Myth" tag="Fundamentals" />
        <Para>
          JavaScript is famously single-threaded. This means it has one Call Stack and one Memory Heap — it can do exactly one thing at a time. If you run a while loop for 10 seconds, the browser UI freezes because JavaScript cannot process clicks or paint the screen while the stack is busy.
        </Para>
        <Para>
          However, we can still fetch data, play videos, and run timers without blocking. This magic isn't inside the JavaScript engine (like V8) itself. It's provided by the <strong>Runtime Environment</strong> (the Browser or Node.js). The Event Loop is the coordinator that bridges the gap between the core engine and these asynchronous Web APIs.
        </Para>

        <SectionHeading title="The Call Stack" tag="The Engine" />
        <Para>
          The Call Stack is a LIFO (Last In, First Out) data structure. Every time you call a function, a new "Stack Frame" is pushed to the top. When the function returns, it is popped off.
        </Para>
        <CodeBlock label="Call Stack Example" code={`function greet() {
  console.log('Hello');
}

function start() {
  greet();
}

start();`} />
        <InfoCard title="Stack Overflow" type="warning" icon="🔥">
          If a function calls itself infinitely, the stack grows until it exceeds its memory limit. This is the origin of the "Stack Overflow" error — the engine simply runs out of room to track the function calls.
        </InfoCard>

        <SectionHeading title="Web APIs: The Background Workers" tag="The Runtime" />
        <Para>
          When you call <Code>setTimeout</Code> or <Code>fetch</Code>, you aren't actually waiting in JS. You are handing off a task to the browser's C++ threads. The browser timer ticks independently, or the OS handle manages the networking. 
        </Para>
        <Para>
          Only when the background work is finished does the browser place your callback into a queue. But it doesn't just jump onto the stack! It must wait for the "Loop" to check if the stack is clear.
        </Para>

        <SectionHeading title="Live Event Loop Simulator" tag="Interactive" />
        <Para>
          Pick a scenario below to see exactly how items move between the Stack, Web APIs, and the different priority queues.
        </Para>

        <EventLoopSimulator />

        <SectionHeading title="Tasks vs Microtasks" tag="Prioritization" />
        <Para>
          Not all queues are created equal. The Event Loop prioritizes <strong>Microtasks</strong> (Promises, async/await) over <strong>Tasks</strong> (setTimeout, Events).
        </Para>
        <InfoCard title="The Golden Rule" type="accent">
          After every single task finishes, the engine MUST drain the <strong>entire</strong> microtask queue before picking the next task. If a microtask adds another microtask, that one runs too.
        </InfoCard>

        <SectionHeading title="async/await Demystified" tag="Sugar" />
        <Para>
          An <Code>async</Code> function doesn't make code run in the background. It just returns a Promise. When you <Code>await</Code> a promise, the function execution is paused, the current stack frame is popped, and the remainder of the function is wrapped in a microtask for later execution.
        </Para>
        <CodeBlock label="Sugar Translation" code={`// This...
async function run() {
  const x = await fetch();
  console.log(x);
}

// ...is basically this:
function run() {
  return fetch().then(x => {
    console.log(x);
  });
}`} />

        <SectionHeading title="The Event Loop Tick" tag="Execution" />
        <Para>
          The browser's main loop follows a very specific order on every iteration:
        </Para>
        <ol style={{ marginLeft: '24px', color: T.text, lineHeight: 1.8, marginBottom: '24px' }}>
          <li>Execute all synchronous code on the <strong>Call Stack</strong>.</li>
          <li>Drain the entire <strong>Microtask Queue</strong>.</li>
          <li><strong>Render</strong>: If enough time has passed (usually 16ms), the browser performs Layout, Paint, and Composite.</li>
          <li>Pick exactly <strong>ONE</strong> task from the Task Queue.</li>
          <li>Repeat.</li>
        </ol>

        <SectionHeading title="Common Gotchas" tag="FAQ" />
        <InfoCard title="Why does Promise run before setTimeout(0)?" type="info">
          Because <Code>Promise.then</Code> is a microtask, and <Code>setTimeout</Code> is a task. Microtasks are always drained before the next task can start.
        </InfoCard>
        <InfoCard title="Why use requestAnimationFrame?" type="success">
          <Code>rAF</Code> is specifically tied to the browser's Rendering phase (Step 3). Using it ensures your animation updates align perfectly with the screen's refresh rate, unlike <Code>setTimeout</Code> which might fire in the middle of a frame.
        </InfoCard>

        <SectionHeading title="Conclusion" tag="Summary" />
        <Para>
          Understanding the Event Loop is the difference between a developer who struggles with "randomly" firing callbacks and one who writes predictable, high-performance applications. Remember: <strong>Synchronous first, Microtasks second, Rendering third, and Tasks last.</strong>
        </Para>
      </BlogLayout>
      <RelatedPosts currentSlug={post.slug} />
    </>
  );
}
