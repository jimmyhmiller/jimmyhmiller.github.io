import { Image, BlockQuote, Code, Term, AnchoredHeading } from "./utils.mjs";

// Map MDX elements to plain HTML — styling lives in styles/globals.css
// under the `.article` scope (drop cap, blue rule on h2, italic h3, etc.).
//
// h1 is intentionally suppressed: the post title is rendered by
// PostLayout's `article-head` band above the content, so the MDX
// `# Title` line would otherwise duplicate it.
export function useMDXComponents(components) {
  return {
    h1: () => null,
    h2: ({ children }) => <AnchoredHeading as="h2">{children}</AnchoredHeading>,
    h3: ({ children }) => <AnchoredHeading as="h3">{children}</AnchoredHeading>,
    h4: ({ children }) => <AnchoredHeading as="h4">{children}</AnchoredHeading>,
    img: (props) => <Image {...props} />,
    blockquote: (props) => <BlockQuote {...props} />,
    pre: ({ children }) => <>{children}</>,
    code: ({ children, className }) => {
      if (!className) return <Term>{children}</Term>;
      return (
        <Code
          source={children}
          language={className?.replace("language-", "")}
          removeIndent={false}
        />
      );
    },
    ...components,
  };
}
