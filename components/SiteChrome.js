import NextLink from 'next/link';
import { useContext } from 'react';
import { PaperContext } from './PaperDesk';

function LightingSun() {
  // tools/build-rss renders post layouts to static markup outside <PaperDesk>;
  // there is no scene to light there, so the control is omitted.
  const paper = useContext(PaperContext);
  if (!paper) return null;
  return (
    <button
      type="button"
      id="lighting-sun"
      className="lighting-sun"
      aria-label="Lighting"
      aria-haspopup="dialog"
      aria-controls="paper-settings"
      aria-expanded="false"
      onClick={paper.openLighting}
    >
      <svg aria-hidden="true" fill="none" height="26" width="26" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="5.5" />
        <path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.8 6.8l2.1 2.1M23.1 23.1l2.1 2.1M6.8 25.2l2.1-2.1M23.1 8.9l2.1-2.1" />
      </svg>
    </button>
  );
}

const GitHub = () => (
  <a href="https://github.com/jimmyhmiller" target="_blank" rel="noreferrer">GitHub</a>
);

// Homepage masthead: in-page anchors only, no wordmark (the intro is the name).
export function HomeHeader() {
  return (
    <header className="topbar">
      <nav aria-label="Main navigation">
        <a href="#popular">Popular</a>
        <a href="#projects">Projects</a>
        <a href="#posts">Posts</a>
        <a href="#advent">Advent</a>
        <a href="#papers">Papers</a>
        <a href="#talks">Talks</a>
        <GitHub />
        <LightingSun />
      </nav>
    </header>
  );
}

// Every other page: the name links home, sections link back into the homepage.
export function SiteHeader() {
  return (
    <header className="topbar topbar-page">
      <NextLink href="/" className="wordmark">Jimmy Miller</NextLink>
      <nav aria-label="Main navigation">
        <NextLink href="/#projects">Projects</NextLink>
        <NextLink href="/#posts">Posts</NextLink>
        <NextLink href="/#advent">Advent</NextLink>
        <NextLink href="/#talks">Talks</NextLink>
        <GitHub />
        <LightingSun />
      </nav>
    </header>
  );
}

export function SiteFooter({ archive = true }) {
  return (
    <footer className="site">
      <span>
        <a href="https://bsky.app/profile/jimmyhmiller.bsky.social" target="_blank" rel="noreferrer">bsky</a>
        {' · '}
        <a href="https://hachyderm.io/@jimmyhmiller" target="_blank" rel="noreferrer">mastodon</a>
        {' · '}
        <a href="https://github.com/jimmyhmiller" target="_blank" rel="noreferrer">github</a>
      </span>
      {archive && (
        <span>
          <NextLink href="/archive">archive</NextLink>
        </span>
      )}
    </footer>
  );
}
