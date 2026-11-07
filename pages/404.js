import Head from 'next/head';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';

// Next's default 404 text, set on the post sheet with the site's header and
// footer, so a missing page looks like the rest of the site (with or without
// JavaScript) instead of Next's unstyled error screen.
export default function NotFound() {
  return (
    <>
      <Head>
        <title>404: This page could not be found.</title>
      </Head>

      <SiteHeader />

      <main className="post-page" data-paper-page="post">
        <div className="post-sheet" data-paper="sheet">
          <header className="article-head">
            <h1 className="article-title">404</h1>
          </header>
          <article className="article">
            <p>This page could not be found.</p>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
