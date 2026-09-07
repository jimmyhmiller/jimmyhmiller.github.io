// Shared post metadata. Imported by both pages/index.js and components/PostLayout.js.
// Source of truth — pages/index.js re-exports for backward compat with build-rss.

export const popularPosts = [
  {
    text: '"We ran out of columns" - The best, worst codebase',
    href: "/ugliest-beautiful-codebase",
    mdx: true,
    date: "2024-08-02",
  },
  {
    text: "The Easiest Way to Build a Type Checker",
    href: "/easiest-way-to-build-type-checker",
    mdx: true,
    date: "2025-11-22",
  },
  {
    text: "Machine Code Isn't Scary",
    href: "/machine-code-isnt-scary",
    mdx: true,
    date: "2025-06-02",
  },
  {
    text: "Discovery Coding",
    href: "/discovery-coding",
    mdx: true,
    date: "2025-01-28",
  },
];

export const postsForBeginners = [
  { text: "Variants Explained",                   href: "/variants-explained",        date: "2018-08-22" },
  { text: "Variants and Protocols",               href: "/variants-and-protocols",    date: "2018-08-26" },
  { text: "Protomorphism",                        href: "/protomorphism",             date: "2018-09-02" },
  { text: "Beautiful Code Through Simplicity",    href: "/beautiful-code",            date: "2018-09-15" },
  { text: "OOP from the Ground Up",               href: "/oop-ground-up",             date: "2018-09-30" },
  { text: "Side Effects, Complecting a la Carte", href: "/side-effects-complect",     date: "2018-10-22" },
  { text: "Basic Functional Studies",             href: "/basic-functional-studies",  date: "2018-11-12" },
];

// Popular posts (those also surfaced in the homepage "Popular" section) are
// inlined into this list in chronological order so they show up in the full
// posts list too. The dedup in pages/index.js's RSS shim keeps the feed
// from picking them up twice.
export const posts = [
  { text: "The Chasm: The Shape of Unfinished AI Codebases",      href: "/shape-of-unfinished-ai-codebases",     mdx: true, date: "2026-09-07" },
  { text: "Legibility is Ruining You",                            href: "/legibility-is-ruining-you",            mdx: true, date: "2026-04-02" },
  { text: "Untapped Way to Learn a Codebase: Build a Visualizer", href: "/learn-codebase-visualizer",            mdx: true, date: "2026-02-17" },
  { text: "AI Has Made it Easy to Own Your Tools",                href: "/ai-own-your-tools",                    mdx: true, date: "2025-12-26" },
  { text: "The Easiest Way to Build a Type Checker",              href: "/easiest-way-to-build-type-checker",    mdx: true, date: "2025-11-22" },
  { text: "The Overly Humble Programmer",                          href: "/overly-humble-programmer",             mdx: true, date: "2025-11-12" },
  { text: "Stuck? Build Your Language Backwards",                  href: "/build-your-language-backwards",        mdx: true, date: "2025-06-12" },
  { text: "Machine Code Isn't Scary",                              href: "/machine-code-isnt-scary",              mdx: true, date: "2025-06-02" },
  { text: "Discovery Coding",                                      href: "/discovery-coding",                     mdx: true, date: "2025-01-28" },
  { text: "Being Raised by the Internet",                          href: "/raised",                               mdx: true, date: "2024-09-19" },
  { text: '"We ran out of columns" — the best, worst codebase',    href: "/ugliest-beautiful-codebase",           mdx: true, date: "2024-08-02" },
  { text: "That Will Never Change. Not Here",                      href: "/never-change",                         mdx: true, date: "2024-02-24" },
  { text: "Not Another Technical Debt Article",                    href: "/not-another-technical-debt-article",   mdx: true, date: "2024-01-15" },
  { text: "Being Stuck in Someone Else's Theory",                  href: "/stuck",                                mdx: true, date: "2023-12-27" },
  { text: "ChatGPT Doesn't Know Anything",                         href: "/chatgpt",                              date: "2023-07-14" },
  { text: "What Follows from Empirical Software Research?",        href: "/empirical",                            date: "2023-04-09" },
  { text: "The Space Between Programs",                            href: "/space-between",                        date: "2022-08-17" },
  { text: "Social Programming Language Constructs",                href: "/social-language-constructs",           date: "2022-08-16" },
  { text: "My Experience Building an Editor in Rust",              href: "/editor-experience",                    date: "2022-05-01" },
  { text: "Towards Aesthetic Elements of Programming",             href: "/aesthetic-elements",                   date: "2022-01-06" },
  { text: "CDD and the Non-Linearity of Discovery",                href: "/cdd-non-linear",                       date: "2021-08-15" },
  { text: "Conceptual Preservation",                               href: "/conceptual-preservation",              date: "2020-11-25" },
  { text: "Conceptual Engineering",                                href: "/conceptual-engineering",               date: "2020-11-15" },
  { text: "Building Meander in Meander",                           href: "/building-meander-in-meander",          date: "2020-06-08" },
  { text: "Card Driven Development",                               href: "/card-driven-development",              date: "2019-10-06" },
  { text: "Term Rewriting with Meander",                           href: "/meander-rewriting",                    date: "2019-08-04" },
  { text: "Meander for Practical Data Transformation",             href: "/meander-practical",                    date: "2019-06-06" },
  { text: "Named Function Composition",                            href: "/named-function-composition",           date: "2019-01-30" },
  { text: "Defending the Incommunicability of Programs",           href: "/incommunicability",                    date: "2018-12-28" },
];

// Archive content — small utilities and old slide decks. Lives on /archive.
export const utilities = [
  { text: "Graph Maker",                href: "https://jimmyhmiller.github.io/graph-maker/" },
  { text: "Finite State Machine Maker", href: "https://jimmyhmiller.github.io/fsm-maker/" },
  { text: "EsLint Fixit",               href: "https://github.com/jimmyhmiller/eslint-fixit" },
  { text: "Zoom Launcher",              href: "https://github.com/jimmyhmiller/zoom-cli" },
];

export const slides = [
  { text: "The Future of Programming",        href: "https://future-of-programming.now.sh" },
  { text: "What is a Monad?",                 href: "https://what-is-a-monad.now.sh" },
  { text: "Practical Functional Refactoring", href: "https://practical-functional-refactoring.now.sh" },
  { text: "Property Based Testing",           href: "https://generative-testing.now.sh" },
  { text: "Datalog Lightning Talk",           href: "https://datalog.now.sh" },
];

const all = [...posts, ...popularPosts, ...postsForBeginners];

export function findPostByPath(pathname) {
  if (!pathname) return null;
  // Try exact match first, then trim trailing slash
  return all.find((p) => p.href === pathname) ||
         all.find((p) => p.href === pathname.replace(/\/$/, '')) ||
         null;
}

// Returns { prev, next } from the chronological essays list ("posts" array)
// for navigation at the foot of an article.
export function adjacentPosts(pathname) {
  const idx = posts.findIndex((p) => p.href === pathname);
  if (idx === -1) return { prev: null, next: null };
  return {
    next: idx > 0 ? posts[idx - 1] : null,           // newer = next in time
    prev: idx < posts.length - 1 ? posts[idx + 1] : null, // older = prev
  };
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function formatPostDate(d) {
  if (!d) return '';
  const m = /^(\d{4})-(\d{2})/.exec(d);
  if (!m) return d;
  const month = MONTHS[parseInt(m[2], 10) - 1] || '';
  return `${month} ${m[1]}`;
}
