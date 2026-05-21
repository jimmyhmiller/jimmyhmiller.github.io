import Head from 'next/head';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';

import { useState, useEffect, useRef } from 'react';
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import haskell from 'react-syntax-highlighter/dist/esm/languages/prism/haskell';
import clojure from 'react-syntax-highlighter/dist/esm/languages/prism/clojure';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';

import PostLayout from './components/PostLayout';

export const Link = NextLink;

// ─── Video / Image (kept from original) ─────────────────────────────
const Video = ({ src }) => {
  const [playing, setPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const mp4Src = src.replace(/\.gif$/, '.mp4');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAutoPlayed) {
        const v = videoRef.current;
        if (v) {
          v.play();
          setPlaying(true);
          setHasAutoPlayed(true);
        }
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAutoPlayed]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.currentTime = 0;
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', cursor: 'pointer' }} onClick={toggle}>
      <video
        ref={videoRef}
        src={mp4Src}
        muted
        playsInline
        style={{ width: '100%', display: 'block', borderRadius: 4 }}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 64, height: 64, borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 0, height: 0,
            borderTop: '14px solid transparent',
            borderBottom: '14px solid transparent',
            borderLeft: '22px solid white',
            marginLeft: 4,
          }} />
        </div>
      )}
    </div>
  );
};

export const Image = ({ src, alt }) => {
  const [fullScreen, setFullScreen] = useState(false);
  if (src.endsWith('.gif')) return <Video src={src} />;
  return (
    <>
      {fullScreen && (
        <div
          onClick={() => setFullScreen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 99 }}
        />
      )}
      {fullScreen && (
        <img
          onClick={() => setFullScreen(false)}
          src={src}
          alt={alt}
          style={{ position: 'fixed', zIndex: 100, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw' }}
        />
      )}
      <img onClick={() => setFullScreen(true)} src={src} alt={alt} style={{ width: '100%', cursor: 'zoom-in' }} />
    </>
  );
};

// ─── Syntax highlighting ────────────────────────────────────────────
const clojure2 = (Prism) => {
  clojure(Prism);
  Prism.languages.clojure = {
    ...Prism.languages.clojure,
    number: /\b-?(0x)?\d*\.?\d+\b/g,
    logicVariable: /(\?|!)[a-zA-Z][a-zA-Z0-9-]+/,
  };
};
clojure2.displayName = 'clojure';
clojure2.aliases = [];

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('haskell', haskell);
SyntaxHighlighter.registerLanguage('clojure', clojure2);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('diff', diff);
SyntaxHighlighter.registerLanguage('bash', bash);

// Single Prism theme that reads colors from CSS variables defined in
// globals.css. Light/dark switching happens via [data-theme="light"] there —
// no JS theme detection, no SSR flash.
export const prismTheme = {
  'code[class*="language-"]': { color: 'var(--tok-text)', fontFamily: 'var(--mono)', textShadow: 'none' },
  'pre[class*="language-"]':  { color: 'var(--tok-text)', fontFamily: 'var(--mono)', textShadow: 'none' },
  'comment':   { color: 'var(--tok-comment)', fontStyle: 'italic' },
  'prolog':    { color: 'var(--tok-comment)', fontStyle: 'italic' },
  'doctype':   { color: 'var(--tok-comment)' },
  'cdata':     { color: 'var(--tok-comment)' },
  'punctuation': { color: 'var(--tok-punctuation)' },
  'property':  { color: 'var(--tok-property)' },
  'tag':       { color: 'var(--tok-number)' },
  'boolean':   { color: 'var(--tok-number)' },
  'number':    { color: 'var(--tok-number)' },
  'constant':  { color: 'var(--tok-number)' },
  'symbol':    { color: 'var(--tok-number)' },
  'deleted':   { color: 'var(--tok-number)' },
  'selector':  { color: 'var(--tok-keyword)' },
  'attr-name': { color: 'var(--tok-keyword)' },
  'string':    { color: 'var(--tok-string)' },
  'char':      { color: 'var(--tok-string)' },
  'builtin':   { color: 'var(--tok-function)' },
  'inserted':  { color: 'var(--tok-string)' },
  'operator':  { color: 'var(--tok-operator)' },
  'entity':    { color: 'var(--tok-function)' },
  'url':       { color: 'var(--tok-function)' },
  'variable':  { color: 'var(--tok-text)' },
  'atrule':    { color: 'var(--tok-string)' },
  'attr-value':{ color: 'var(--tok-string)' },
  'function':  { color: 'var(--tok-function)' },
  'class-name':{ color: 'var(--tok-class)' },
  'keyword':   { color: 'var(--tok-keyword)' },
  'regex':     { color: 'var(--tok-number)' },
  'important': { color: 'var(--tok-number)', fontWeight: 'bold' },
  'bold':      { fontWeight: 'bold' },
  'italic':    { fontStyle: 'italic' },
  'logicVariable': { color: 'var(--tok-function)' },
};

function useThemeMode() {
  const [mode, setMode] = useState('dark');
  useEffect(() => {
    const read = () => setMode(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return mode;
}

// Backwards-compatible hook for legacy callers (TypeCheckerDemo, legibility post).
// `isDark` follows the document theme; `toggleTheme` flips and persists.
export function useTheme() {
  const mode = useThemeMode();
  const toggleTheme = () => {
    const cur = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (_) {}
  };
  return { isDark: mode === 'dark', toggleTheme };
}

// ─── Terminal block (❯ prompts) ─────────────────────────────────────
const Terminal = ({ source }) => {
  const lines = source.replace(/^\n/, '').replace(/\n$/, '').split('\n');
  return (
    <pre>
      <code>
        {lines.map((line, i) => {
          const promptMatch = line.match(/^(❯\s*)(.*)/);
          const commentMatch = line.match(/^(#.*)/);
          if (promptMatch) {
            return (
              <span key={i}>
                <span style={{ color: 'var(--c-lime)' }}>{promptMatch[1]}</span>
                <span style={{ color: 'var(--c-cyan)' }}>{promptMatch[2]}</span>
                {'\n'}
              </span>
            );
          }
          if (commentMatch) {
            return <span key={i} style={{ color: 'var(--ink-mute)', fontStyle: 'italic' }}>{line}{'\n'}</span>;
          }
          return <span key={i}>{line}{'\n'}</span>;
        })}
      </code>
    </pre>
  );
};

const removeFirst = (arr) => {
  if (arr.length > 1) arr.shift();
  return arr;
};

export const detectIndent = (source) => /^ */.exec(source)[0].length;

export const removeIndent = (source) => {
  const lines = removeFirst(source.split('\n'));
  const indent = detectIndent(lines[0]);
  return lines.map((s) => s.substring(indent)).join('\n');
};

export const formatCode = (source) => removeIndent(source);

export const Code = ({ source, language, removeIndent = true }) => {
  if (language === 'bash' && source.includes('❯')) {
    return <Terminal source={removeIndent ? formatCode(source) : source} />;
  }
  return (
    <SyntaxHighlighter language={language} style={prismTheme}>
      {removeIndent ? formatCode(source) : source}
    </SyntaxHighlighter>
  );
};

export const GenericCode = ({ children }) => <Code source={children} />;
export const Javascript = ({ children }) => <Code language="javascript" source={children} />;
export const Haskell    = ({ children }) => <Code language="haskell"    source={children} />;
export const Clojure    = ({ children }) => <Code language="clojure"    source={children} />;
export const Ruby       = ({ children }) => <Code language="ruby"       source={children} />;

// ─── Inline term / blockquote / note / aside ────────────────────────
export const Term = ({ children }) => <code>{children}</code>;

export const BlockQuote = ({ children }) => <blockquote>{children}</blockquote>;

const NoteTitle = () => (
  <p style={{ padding: 0, margin: 0, color: 'var(--c-blue)' }}>
    <strong>ⓘ Note</strong>
  </p>
);

export const Note = ({ children, Title = NoteTitle }) => (
  <div style={{
    background: 'color-mix(in oklab, var(--c-blue) 12%, transparent)',
    border: '1px solid color-mix(in oklab, var(--c-blue) 35%, transparent)',
    borderLeft: '3px solid var(--c-blue)',
    padding: '12px 14px',
    borderRadius: 4,
    margin: '1.6em 0',
  }}>
    {Title && <Title />}
    {children}
  </div>
);

export const Aside = ({ children, title }) => (
  <details style={{
    margin: '1.6em 0',
    padding: '10px 14px',
    border: '1px solid var(--rule)',
    borderRadius: 4,
    background: 'var(--bg-soft)',
    color: 'var(--ink-soft)',
  }}>
    <summary style={{ cursor: 'pointer', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      Aside {title}
    </summary>
    <div style={{ paddingTop: 10 }}>{children}</div>
  </details>
);

export const Attribution = ({ children }) => (
  <p style={{
    fontSize: 13,
    color: 'var(--ink-mute)',
    marginTop: -14,
    marginLeft: 12,
    fontFamily: 'var(--mono)',
  }}>
    — <span style={{ textDecoration: 'underline' }}>{children}</span>
  </p>
);

// ─── Layout / Headings ──────────────────────────────────────────────
// These render plain HTML elements that pick up the article styles
// defined in styles/globals.css (drop-cap, blue-rule h2, italic h3, mono h4).
const sizeToElem = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' };
export const Heading = ({ text, size = 1 }) => {
  const Elem = sizeToElem[size];
  if (!Elem) throw new Error('Undefined Heading Size');
  return <Elem>{text}</Elem>;
};

export const Title = ({ text }) => (
  <>
    <Head><title>{text}</title></Head>
    {/* The h1 is rendered by PostLayout's article-head — keep this as a no-op
        so MDX `# Title` lines don't double up the page title. */}
  </>
);

export const Padding = ({ children, top, left, right, bottom }) => (
  <div style={{ paddingTop: top, paddingLeft: left, paddingRight: right, paddingBottom: bottom }}>
    {children}
  </div>
);
export const Margin = ({ children, top, left, right, bottom }) => (
  <div style={{ marginTop: top, marginLeft: left, marginRight: right, marginBottom: bottom }}>
    {children}
  </div>
);
export const AbsolutePosition = ({ children, right, top, left, bottom }) => (
  <div style={{ position: 'absolute', right, left, top, bottom }}>{children}</div>
);

export const LargeText = ({ children }) => (
  <p style={{ fontSize: '1.5em', marginBottom: 18 }}>{children}</p>
);
export const MediumText = ({ children }) => (
  <p style={{ fontSize: '1.1em' }}>{children}</p>
);

const ListItem = ({ href, text, Elem, nested }) => (
  <li key={href}>
    <Elem>
      <Link href={href}>{text}</Link>
    </Elem>
    {nested && nested.length > 0 && (
      <ul style={{ listStyleType: 'disc', paddingLeft: '2.5em', marginTop: '-0.5em', marginBottom: 0 }}>
        {nested.map((n) => (
          <li key={n.href}><p style={{ fontSize: '1.1em', margin: 0 }}><Link href={n.href}>{n.text}</Link></p></li>
        ))}
      </ul>
    )}
  </li>
);

export const LinkList = ({ items, Elem = LargeText, title, headingSize = 2 }) => (
  <>
    <Heading size={headingSize} text={title} />
    <ul>{items.map((item) => ListItem({ ...item, Elem }))}</ul>
  </>
);

export const RandomList = ({ items, Elem }) => {
  const [shuffled, setShuffled] = useState([]);
  useEffect(() => {
    setShuffled([...items].sort(() => Math.random() - 0.5));
  }, [items]);
  return <ul>{shuffled.map((item, i) => <li key={i}><Elem>{item.text}</Elem></li>)}</ul>;
};

export const List = ({ items, Elem }) => (
  <ul>{items.map((item, i) => <li key={i}><Elem>{item.text}</Elem></li>)}</ul>
);

// GlobalLayout = post layout. All MDX files / demo .js post pages use this.
export const GlobalLayout = ({ children, title, date, hideHead }) => {
  useEffect(() => {
    const path = window.location.pathname;
    const urlPath = encodeURIComponent(path.replace(/^\//, ''));
    fetch(`https://github-sites-simple-stats-jimmyhmiller.vercel.app/api/${path === '/' ? 'index' : urlPath}`);
  }, []);

  return (
    <PostLayout title={title} date={date} hideHead={hideHead}>
      {children}
    </PostLayout>
  );
};
