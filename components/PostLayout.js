import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import ThemeToggle from './ThemeToggle';
import { findPostByPath, adjacentPosts, formatPostDate } from '../data/posts';

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

      <header className="topbar">
        <NextLink href="/" className="topbar-mark">Jimmy Miller</NextLink>
        <nav>
          <NextLink href="/#posts" className="a3">posts</NextLink>
          <NextLink href="/#advent" className="a2">advent</NextLink>
          <NextLink href="/#talks" className="a4">talks</NextLink>
          <a href="https://github.com/jimmyhmiller" target="_blank" rel="noreferrer">github</a>
          <ThemeToggle />
        </nav>
      </header>

      {!hideHead && resolvedTitle && (
        <section className="article-head">
          <div className="article-head-inner">
            {resolvedDate && <div className="article-date">{formatPostDate(resolvedDate)}</div>}
            <h1 className="article-title">{resolvedTitle}</h1>
          </div>
        </section>
      )}

      <article className="article">{children}</article>

      {(prev || next) && (
        <div className="article-foot">
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
        </div>
      )}

      <footer className="site">
        <span>
          <a href="https://bsky.app/profile/jimmyhmiller.bsky.social" target="_blank" rel="noreferrer">bsky</a>
          &nbsp;·&nbsp;
          <a href="https://hachyderm.io/@jimmyhmiller" target="_blank" rel="noreferrer">mastodon</a>
          &nbsp;·&nbsp;
          <a href="https://github.com/jimmyhmiller" target="_blank" rel="noreferrer">github</a>
        </span>
      </footer>
    </>
  );
}
