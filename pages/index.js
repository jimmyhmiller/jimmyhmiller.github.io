import { Code, Heading, GlobalLayout, LinkList } from "../utils.js";

import generateRSS from '../tools/build-rss';


export const postsForBeginners = [
  {
    text: "Variants Explained",
    href: "/variants-explained",
  },
  {
    text: "Variants and Protocols",
    href: "/variants-and-protocols",
  },
  {
    text: "Protomorphism",
    href: "/protomorphism",
  },
  {
    text: "Beautiful Code Through Simplicity",
    href: "/beautiful-code",
  },
  {
    text: "OOP from the Ground Up",
    href: "/oop-ground-up",
  },
  {
    text: "Side Effects, Complecting a la Carte",
    href: "/side-effects-complect",
  },
  {
    text: "Basic Functional Studies",
    href: "/basic-functional-studies",
  },
];

export const posts = [
  {
    text: "Not Another Technical Debt Article",
    href: "/technical-debt",
    mdx: true,
  },
  {
    text: "Being Stuck in Someone Else’s Theory",
    href: "/stuck",
    mdx: true,
  },
  {
    text: "ChatGPT Doesn't Know Anything",
    href: "/chatgpt",
  },
  {
    text: "What Follows from Empirical Software Research?",
    href: "/empirical",
  },
  {
    text: "The Space Between Programs",
    href: "/space-between",
  },
  {
    text: "Social Programming Language Constructs",
    href: "/social-language-constructs",
  },
  {
    text: "My Experience Building an Editor in Rust",
    href: "/editor-experience",
  },
  {
    text: "Towards Aesthetic Elements of Programming",
    href: "/aesthetic-elements",
  },
  {
    text: "CDD and the Non-Linearity of Discovery",
    href: "/cdd-non-linear",
  },
  {
    text: "Conceptual Preservation",
    href: "/conceptual-preservation",
  },
  {
    text: "Conceptual Engineering",
    href: "/conceptual-engineering",
  },
  {
    text: "Building Meander in Meander",
    href: "/building-meander-in-meander",
  },
  {
    text: "Card Driven Development",
    href: "/card-driven-development",
  },
  {
    text: "Term Rewriting with Meander",
    href: "/meander-rewriting",
  },
  {
    text: "Meander for Practical Data Transformation",
    href: "/meander-practical",
  },
  {
    text: "Named Function Composition",
    href: "/named-function-composition",
  },
  {
    text: "Defending the Incommunicability of Programs",
    href: "/incommunicability",
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
    text: "Programming Readings",
    href: "/muse",
  },
];

const contact = [
  {
    text: "Twitter",
    href:"https://twitter.com/jimmyhmiller",
  },
  {
    text: "Github",
    href: "https://github.com/jimmyhmiller",
  }
]

const podcast = [
  {
    text: "Future Of Coding",
    href: "https://futureofcoding.org/episodes/",
  }
]

const Index = () => (
  <GlobalLayout>
    <LinkList title="Posts" items={posts} />
    <LinkList title="Podcast" items={podcast} />
    <LinkList title="Talks" items={talks} />
    <LinkList title="Posts For Beginners" items={postsForBeginners} />
    <LinkList title="Utilities" items={utilities} />
    <LinkList title="Old Libraries" items={libraries} />
    <LinkList title="Slides from Old Talks" items={slides} />
    <LinkList title="Projects on Hold" items={project} />
    <LinkList title="Readings" items={readings} />
    <LinkList title="Personal Links" items={contact} />
  </GlobalLayout>
);

export const getStaticProps = async () => {
  generateRSS();
  return {props: {}}
}

export default Index;
