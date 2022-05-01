import { Code, Heading, GlobalLayout, LinkList } from "../utils.js";

import generateRSS from '../tools/build-rss';

export const excludeRss = true;

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

const Index = () => (
  <GlobalLayout>
    <LinkList title="Readings" items={readings} />
    <LinkList title="Posts (Most Recent First)" items={posts} />
    <LinkList title="For Beginners" items={postsForBeginners} />

    <LinkList title="Talks" items={talks} />
    <LinkList title="Utilities" items={utilities} />
    <LinkList title="Old Libraries" items={libraries} />
    <LinkList title="Slides" items={slides} />
    <LinkList title="Projects on Hold" items={project} />
  </GlobalLayout>
);

export const getStaticProps = () => {
  generateRSS();
  return {props: {}}
}

export default Index;
