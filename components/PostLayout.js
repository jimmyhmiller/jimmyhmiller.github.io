import Head from 'next/head';
import NextLink from 'next/link';
import { useContext } from 'react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { findPostByPath, adjacentPosts, formatPostDate } from '../data/posts';
import { SiteHeader, SiteFooter } from './SiteChrome';

// useRouter throws if there's no Next router in context (e.g. when this
// component is rendered through ReactDOMServer.renderToStaticMarkup by
// tools/build-rss). Read the context directly instead so we get null
// rather than an exception, then fall back to props/no-op.
function useSafePathname() {
  const ctx = useContext(RouterContext);
  return ctx?.pathname || '';
}

export default function PostLayout({ children, title, date, hideHead }) {
  const pathname = useSafePathname();
  const meta = findPostByPath(pathname);
  const resolvedTitle = title || meta?.text || '';
  const resolvedDate = date || meta?.date || '';
  const { prev, next } = adjacentPosts(pathname);

  return (
    <>
      <Head>
        {resolvedTitle && <title>{`${resolvedTitle} — Jimmy Miller`}</title>}
        <link rel="alternate" type="application/rss+xml" title="jimmyhmiller.github.io" href="/feed.xml" />
      </Head>

      <SiteHeader />

      <main className="post-page">
        <div className="post-sheet" data-paper="sheet">
          {!hideHead && resolvedTitle && (
            <header className="article-head">
              {resolvedDate && <div className="article-date">{formatPostDate(resolvedDate)}</div>}
              <h1 className="article-title">{resolvedTitle}</h1>
            </header>
          )}
          <article className="article">{children}</article>
        </div>

        {(prev || next) && (
          <nav className="article-foot" data-paper="sheet-foot" aria-label="More posts">
            {prev ? (
              <NextLink href={prev.href} className="prev">
                <span className="label">Previous</span>
                {prev.text}
              </NextLink>
            ) : <span />}
            {next ? (
              <NextLink href={next.href} className="next">
                <span className="label">Next</span>
                {next.text}
              </NextLink>
            ) : <span />}
          </nav>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
