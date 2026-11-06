import PostLayout from '../../components/PostLayout';
import MarkdownExcerpts from '../../components/specimen/markdown-excerpts.mdx';
import { findPostByPath } from '../../data/posts';

// Development only: every markdown element the posts use, on a post sheet, for
// the paper type tools (window.devTools.show()). The content is verbatim from
// published posts (tools/build-markdown-specimen.mjs); the unordered list is
// from pages/empirical.js:521-526, the one list in the posts outside code.
// The head shows the first excerpt's post so the title and date are real.
const head = findPostByPath('/machine-code-isnt-scary');

export default function MarkdownSpecimen() {
  return (
    <PostLayout title={head.text} date={head.date}>
      <MarkdownExcerpts />
      <ul>
        <li>Should we use static or dynamic types?</li>
        <li>Should we practice TDD?</li>
        <li>Should we do agile development?</li>
        <li>Should we use a memory safe-language?</li>
      </ul>
    </PostLayout>
  );
}

export function getStaticProps() {
  if (process.env.NODE_ENV !== 'development') return { notFound: true };
  return { props: {} };
}
