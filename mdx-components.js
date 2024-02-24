import { Heading, GlobalLayout, Title, Term, Image, BlockQuote } from "./utils.js";
 
// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.
 
export function useMDXComponents(components) {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <Title text={children}></Title>,
    h2: ({ children }) => <Heading size="2" text={children}></Heading>,
    h3: ({ children }) => <Heading size="3" text={children}></Heading>,
    h4: ({ children }) => <Heading size="4" text={children}></Heading>,
    img: (props) => (
      <Image {...props} />
    ),
    blockquote: (props) => (
      <BlockQuote {...props} />
    ),
    ...components,
  }
}