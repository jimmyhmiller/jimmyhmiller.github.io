import {
  Code,
  Heading,
  GlobalLayout,
  LinkList
} from '../utils.js';

const posts = [
  {
    text: "Variants Explained",
    href: "/variants-explained/",
  },
  {
    text: "Variants and Protocols",
    href: "/variants-and-protocols/",
  },
]

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
    href: "https://github.com/jimmyhmiller/eslint-fixit"
  }
]

const libraries = [
  {
    text: "MultiMethods in Javascript",
    href: "https://github.com/jimmyhmiller/multiple-methods"
  },
  {
    text: "React Redux Connected",
    href: "https://github.com/jimmyhmiller/react-redux-connected"
  }
]

const slides = [
  {
    text: "The Future of Programming",
    href: "https://future-of-programming.now.sh"
  },
  {
    text: "What is a Monad?",
    href: "https://what-is-a-monad.now.sh"
  },
  {
    text: "Practical Functional Refactoring",
    href: "https://practical-functional-refactoring.now.sh"
  },
  {
    text: "Property Based Testing",
    href: "https://generative-testing.now.sh"
  },
  {
    text: "Datalog Lightning Talk",
    href: "https://datalog.now.sh"
  }
]

export default () =>
  <GlobalLayout>
    <LinkList
      title="Posts"
      items={posts}
    />
    <LinkList
      title="Utilities"
      items={utilities}
    />
    <LinkList
      title="Libraries"
      items={libraries}
    />
    <LinkList
      title="Slides"
      items={slides}
    />
  </GlobalLayout>
