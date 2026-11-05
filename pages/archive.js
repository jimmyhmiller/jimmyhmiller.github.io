import Head from 'next/head';
import NextLink from 'next/link';
import { postsForBeginners, utilities, slides } from '../data/posts';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';

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

      <SiteHeader />

      <main className="archive-page" data-paper-page="archive">
        <header className="page-head">
          <div className="article-date">Archive</div>
          <h1 className="article-title">Older bits</h1>
        </header>

        <div className="triplets">
          <section data-paper="archive-a">
            <h2 className="triplet-head">For beginners</h2>
            <div className="triplet-list">
              {postsForBeginners.map((p) => <Row key={p.href} {...p} />)}
            </div>
          </section>
          <section data-paper="archive-b">
            <h2 className="triplet-head">Utilities</h2>
            <div className="triplet-list">
              {utilities.map((u) => <Row key={u.href} {...u} />)}
            </div>
          </section>
          <section data-paper="archive-c">
            <h2 className="triplet-head">Older slides</h2>
            <div className="triplet-list">
              {slides.map((s) => <Row key={s.href} {...s} />)}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter archive={false} />
    </>
  );
}
