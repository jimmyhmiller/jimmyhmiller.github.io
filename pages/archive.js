import Head from 'next/head';
import NextLink from 'next/link';
import { postsForBeginners, utilities, slides } from '../data/posts';

const isExternal = (href) => /^https?:\/\//.test(href);

const Row = ({ href, text }) => (
  isExternal(href) ? (
    <a className="triplet-item" href={href} target="_blank" rel="noreferrer">
      <span>{text}</span>
      <span className="meta">↗</span>
    </a>
  ) : (
    <NextLink className="triplet-item" href={href}>
      <span>{text}</span>
      <span className="meta">→</span>
    </NextLink>
  )
);

export default function Archive() {
  return (
    <>
      <Head>
        <title>Archive — Jimmy Miller</title>
      </Head>

      <header className="topbar">
        <NextLink href="/" className="topbar-mark">Jimmy Miller</NextLink>
        <nav>
          <a href="https://github.com/jimmyhmiller" target="_blank" rel="noreferrer">github</a>
        </nav>
      </header>

      <section className="article-head">
        <div className="article-head-inner">
          <div className="article-date">Archive</div>
          <h1 className="article-title">Older bits</h1>
        </div>
      </section>

      <section className="triplets">
        <div className="t-orange">
          <h3 className="triplet-head">For beginners</h3>
          <div className="triplet-list">
            {postsForBeginners.map((p) => <Row key={p.href} {...p} />)}
          </div>
        </div>
        <div className="t-violet">
          <h3 className="triplet-head">Utilities</h3>
          <div className="triplet-list">
            {utilities.map((u) => <Row key={u.href} {...u} />)}
          </div>
        </div>
        <div className="t-cyan">
          <h3 className="triplet-head">Older slides</h3>
          <div className="triplet-list">
            {slides.map((s) => <Row key={s.href} {...s} />)}
          </div>
        </div>
      </section>

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
