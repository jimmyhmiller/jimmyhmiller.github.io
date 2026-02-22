import { Code, Heading, GlobalLayout, LinkList } from "../utils";
import Head from 'next/head';

import generateRSS from '../tools/build-rss';

export const specialPosts = [
  {
    text: "Advent of Papers (2024)",
    href: "/advent-of-papers",
    nested: [
      {
        text: "Day 4: Is the Brain a Computer?",
        href: "/advent-of-papers/2024/dec-4-brain-computer",
        mdx: true,
      },
      {
        text: "Day 15: Programming Languages as Technical Artifacts",
        href: "/advent-of-papers/2024/dec-15-technical-artifacts",
        mdx: true,
      },
    ]
  },
]

export const popularPosts = [
  {
    text: '"We ran out of columns" - The best, worst codebase',
    href: "/ugliest-beautiful-codebase",
    mdx: true,
    date: "2024-08-02",
  },
  {
    text: "The Easiest Way to Build a Type Checker",
    href: "/easiest-way-to-build-type-checker",
    mdx: true,
    date: "2025-11-22",
  },
  {
    text: "Machine Code Isn't Scary",
    href: "/machine-code-isnt-scary",
    mdx: true,
    date: "2025-06-02",
  },
  {
    text: "Discovery Coding",
    href: "/discovery-coding",
    mdx: true,
    date: "2025-01-28",
  },
]

export const postsForBeginners = [
  {
    text: "Variants Explained",
    href: "/variants-explained",
    date: "2018-08-22",
  },
  {
    text: "Variants and Protocols",
    href: "/variants-and-protocols",
    date: "2018-08-26",
  },
  {
    text: "Protomorphism",
    href: "/protomorphism",
    date: "2018-09-02",
  },
  {
    text: "Beautiful Code Through Simplicity",
    href: "/beautiful-code",
    date: "2018-09-15",
  },
  {
    text: "OOP from the Ground Up",
    href: "/oop-ground-up",
    date: "2018-09-30",
  },
  {
    text: "Side Effects, Complecting a la Carte",
    href: "/side-effects-complect",
    date: "2018-10-22",
  },
  {
    text: "Basic Functional Studies",
    href: "/basic-functional-studies",
    date: "2018-11-12",
  },
];


export const posts = [
  {
    text: "Untapped Way to Learn a Codebase: Build a Visualizer",
    href: "/learn-codebase-visualizer",
    mdx: true,
    date: "2026-02-17",
  },
  {
    text: "AI Has Made it Easy to Own Your Tools",
    href: "/ai-own-your-tools",
    mdx: true,
    date: "2025-12-26",
  },
  {
    text: "The Overly Humble Programmer",
    href: "/overly-humble-programmer",
    mdx: true,
    date: "2025-11-12",
  },
  {
    text: "Stuck? Build Your Language Backwards",
    href: "/build-your-language-backwards",
    mdx: true,
    date: "2025-06-12",
  },
  {
    text: "Being Raised by the Internet",
    href: "/raised",
    mdx: true,
    date: "2024-09-19",
  },
  {
    text: "That Will Never Change. Not Here",
    href: "/never-change",
    mdx: true,
    date: "2024-02-24",
  },
  {
    text: "Not Another Technical Debt Article",
    href: "/not-another-technical-debt-article",
    mdx: true,
    date: "2024-01-15",
  },
  {
    text: "Being Stuck in Someone Else's Theory",
    href: "/stuck",
    mdx: true,
    date: "2023-12-27",
  },
  {
    text: "ChatGPT Doesn't Know Anything",
    href: "/chatgpt",
    date: "2023-07-14",
  },
  {
    text: "What Follows from Empirical Software Research?",
    href: "/empirical",
    date: "2023-04-09",
  },
  {
    text: "The Space Between Programs",
    href: "/space-between",
    date: "2022-08-17",
  },
  {
    text: "Social Programming Language Constructs",
    href: "/social-language-constructs",
    date: "2022-08-16",
  },
  {
    text: "My Experience Building an Editor in Rust",
    href: "/editor-experience",
    date: "2022-05-01",
  },
  {
    text: "Towards Aesthetic Elements of Programming",
    href: "/aesthetic-elements",
    date: "2022-01-06",
  },
  {
    text: "CDD and the Non-Linearity of Discovery",
    href: "/cdd-non-linear",
    date: "2021-08-15",
  },
  {
    text: "Conceptual Preservation",
    href: "/conceptual-preservation",
    date: "2020-11-25",
  },
  {
    text: "Conceptual Engineering",
    href: "/conceptual-engineering",
    date: "2020-11-15",
  },
  {
    text: "Building Meander in Meander",
    href: "/building-meander-in-meander",
    date: "2020-06-08",
  },
  {
    text: "Card Driven Development",
    href: "/card-driven-development",
    date: "2019-10-06",
  },
  {
    text: "Term Rewriting with Meander",
    href: "/meander-rewriting",
    date: "2019-08-04",
  },
  {
    text: "Meander for Practical Data Transformation",
    href: "/meander-practical",
    date: "2019-06-06",
  },
  {
    text: "Named Function Composition",
    href: "/named-function-composition",
    date: "2019-01-30",
  },
  {
    text: "Defending the Incommunicability of Programs",
    href: "/incommunicability",
    date: "2018-12-28",
  },
];

const talks = [
  {
    text: "Meander: Declarative Explorations at the Limits of FP",
    href: "https://www.youtube.com/watch?v=9fhnJpCgtUw",
  },
  {
    text: "Paradigms Without Progress: Kuhnian Reflections on Programming Practice",
    href: "https://www.youtube.com/watch?v=TkPy7aLTtAw",
  },
];

const utilities = [
  {
    text: "Graph Maker",
    href: "https://jimmyhmiller.github.io/graph-maker/",
  },
  {
    text: "Finite State Machine Maker",
    href: "https://jimmyhmiller.github.io/fsm-maker/",
  },
  {
    text: "EsLint Fixit",
    href: "https://github.com/jimmyhmiller/eslint-fixit",
  },
  {
    text: "Zoom Launcher",
    href: "https://github.com/jimmyhmiller/zoom-cli",
  },
];

const libraries = [
  {
    text: "MultiMethods in Javascript",
    href: "https://github.com/jimmyhmiller/multiple-methods",
  },
  {
    text: "React Redux Connected",
    href: "https://github.com/jimmyhmiller/react-redux-connected",
  },
];

const slides = [
  {
    text: "The Future of Programming",
    href: "https://future-of-programming.now.sh",
  },
  {
    text: "What is a Monad?",
    href: "https://what-is-a-monad.now.sh",
  },
  {
    text: "Practical Functional Refactoring",
    href: "https://practical-functional-refactoring.now.sh",
  },
  {
    text: "Property Based Testing",
    href: "https://generative-testing.now.sh",
  },
  {
    text: "Datalog Lightning Talk",
    href: "https://datalog.now.sh",
  },
];

const project = [
  {
    text: "One Hundred Lines or Less",
    href: "https://github.com/jimmyhmiller/one-hundred-lines-or-less",
  },
];

const readings = [
  {
    text: "Programming Papers",
    href: "/readings",
  },
];

const contact = [
  {
    text: "Bluesky",
    href:"https://bsky.app/profile/jimmyhmiller.bsky.social",
  },
  {
    text: "Mastodon",
    href:"https://hachyderm.io/@jimmyhmiller",
  },
  {
    text: "Github",
    href: "https://github.com/jimmyhmiller",
  }
]

const podcast = [
  {
    text: "Feeling of Computing",
    href: "https://feelingof.com",
  }
]

const Index = () => (
  <GlobalLayout>
    <Head>
      <title>Jimmy Miller</title>
    </Head>
    <LinkList title="Popular Posts" items={popularPosts} />
    <LinkList title="Special Posts" items={specialPosts} />
    <LinkList title="Podcast" items={podcast} />
    <LinkList title="Papers Archive" items={readings} />
    <LinkList title="Posts" items={posts} />
    <LinkList title="Talks" items={talks} />
    <LinkList title="Posts For Beginners" items={postsForBeginners} />
    <LinkList title="Utilities" items={utilities} />
    <LinkList title="Old Libraries" items={libraries} />
    <LinkList title="Slides from Old Talks" items={slides} />
    <LinkList title="Projects on Hold" items={project} />
    <LinkList title="Personal Links" items={contact} />
  </GlobalLayout>
);





// Derive RSS list: posts (newest-first) + extras not already in posts
const postsHrefs = new Set(posts.map(p => p.href));
const extraPosts = [...popularPosts, ...postsForBeginners].filter(p => !postsHrefs.has(p.href));
export const rssPosts = [...posts, ...extraPosts];



export const getStaticProps = async () => {
  if (process.env.NODE_ENV == "production") {
    generateRSS();
  }
  return {props: {}}
}

export default Index;
