import Head from 'next/head';
import NextLink from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { CodeBlock } from '../components/ProjectSection';
import generateRSS from '../tools/build-rss';
import { posts, popularPosts, postsForBeginners } from '../data/posts';
import { projects } from '../data/projects';

export { posts, popularPosts, postsForBeginners };

export const specialPosts = [
  {
    text: "Advent of Papers (2024)",
    href: "/advent-of-papers",
    nested: [
      {
        text: "Day 4: Is the Brain a Computer?",
        href: "/advent-of-papers/2024/dec-4-brain-computer",
        mdx: true,
      },
      {
        text: "Day 15: Programming Languages as Technical Artifacts",
        href: "/advent-of-papers/2024/dec-15-technical-artifacts",
        mdx: true,
      },
    ]
  },
]

const talks = [
  { text: "Meander: Declarative Explorations at the Limits of FP",        href: "https://www.youtube.com/watch?v=9fhnJpCgtUw", venue: "Clojure/conj" },
  { text: "Paradigms Without Progress: Kuhnian Reflections on Programming Practice", href: "https://www.youtube.com/watch?v=TkPy7aLTtAw", venue: "Strange Loop" },
];

const utilities = [
  { text: "Graph Maker",              href: "https://jimmyhmiller.github.io/graph-maker/" },
  { text: "Finite State Machine Maker", href: "https://jimmyhmiller.github.io/fsm-maker/" },
  { text: "EsLint Fixit",             href: "https://github.com/jimmyhmiller/eslint-fixit" },
  { text: "Zoom Launcher",            href: "https://github.com/jimmyhmiller/zoom-cli" },
];

const slides = [
  { text: "The Future of Programming",         href: "https://future-of-programming.now.sh" },
  { text: "What is a Monad?",                  href: "https://what-is-a-monad.now.sh" },
  { text: "Practical Functional Refactoring",  href: "https://practical-functional-refactoring.now.sh" },
  { text: "Property Based Testing",            href: "https://generative-testing.now.sh" },
  { text: "Datalog Lightning Talk",            href: "https://datalog.now.sh" },
];

// Display-only overrides for the Popular section: an italic word per title,
// which the .popular-item .t em rule colors orange.
const popularEmphasis = {
  '/ugliest-beautiful-codebase':       <>“We ran out of <em>columns</em>” — the best, worst codebase</>,
  '/easiest-way-to-build-type-checker': <>The <em>easiest</em> way to build a type checker</>,
  '/machine-code-isnt-scary':           <>Machine code <em>isn’t</em> scary</>,
  '/discovery-coding':                  <><em>Discovery</em> coding</>,
};

// "Currently" panel — pulls from real site content. Each row links somewhere.
// Tweak when life changes; rows render as anchors.
const now = {
  stamp: "may 2026",
  rows: [
    { k: "building", v: <>a <em>tensor</em> compiler</>,        href: "/projects/tensor-lang" },
    { k: "writing",  v: <><em>legibility</em> is ruining you</>, href: "/legibility-is-ruining-you" },
    { k: "using",    v: <><em>keep-running</em>, daily</>,       href: "/projects/keep-running" },
    { k: "talking",  v: <>the <em>feeling</em> of computing</>, href: "https://feelingof.com" },
  ],
  updated: "2026-05-20",
};

const advent = [
  { day: "01", title: "Elephant 2000",                                            href: "/advent-of-papers/2024/dec-1-elephant-2000" },
  { day: "02", title: "Software is an Abstract Artifact",                         href: "/advent-of-papers/2024/dec-2-abstract-artifact" },
  { day: "03", title: "Google's Awful Paper on Technical Debt",                   href: "/advent-of-papers/2024/dec-3-awful-google-tech-debt" },
  { day: "04", title: "Is the Brain a Computer?",                                 href: "/advent-of-papers/2024/dec-4-brain-computer" },
  { day: "05", title: "Worlds: Mutability with Control",                          href: "/advent-of-papers/2024/dec-5-worlds" },
  { day: "06", title: "Intuition in Software Development",                        href: "/advent-of-papers/2024/dec-6-intuition" },
  { day: "07", title: "Implementation is Semantic Interpretation",                href: "/advent-of-papers/2024/dec-7-interpretation" },
  { day: "08", title: "Beyond Being There: Making Remote Work Better",            href: "/advent-of-papers/2024/dec-8-beyond-being-there" },
  { day: "09", title: "What is a Game?",                                          href: "/advent-of-papers/2024/dec-9-what-is-a-game" },
  { day: "10", title: "Large Models of What?",                                    href: "/advent-of-papers/2024/dec-10-large-models-of-what" },
  { day: "11", title: "On Understanding Data Abstraction Revisited",              href: "/advent-of-papers/2024/dec-11-data-abstraction" },
  { day: "12", title: "Lazy Evaluation of Transactions in Database Systems",      href: "/advent-of-papers/2024/dec-12-lazy-transactions" },
  { day: "13", title: "What Knowledge Isn't",                                     href: "/advent-of-papers/2024/dec-13-knowledge" },
  { day: "14", title: "Bidirectional Type Checking",                              href: "/advent-of-papers/2024/dec-14-bidirectional-type-checking" },
  { day: "15", title: "Programming Languages as Technical Artifacts",             href: "/advent-of-papers/2024/dec-15-technical-artifacts" },
  { day: "16", title: "Will Computers Ever Become Easy to Use?",                  href: "/advent-of-papers/2024/dec-16-computers-easy" },
  { day: "17", title: "The Cultural Part of Cognition",                           href: "/advent-of-papers/2024/dec-17-cultural-cognition" },
  { day: "18", title: "The Structure and Legal Interpretation of Computer Programs", href: "/advent-of-papers/2024/dec-18-legal-interpretation" },
  { day: "19", title: "Everybody Clap Your Hands",                                href: "/advent-of-papers/2024/dec-19-clap-your-hands" },
  { day: "20", title: "Three Paradigms of Computer Science",                      href: "/advent-of-papers/2024/dec-20-three-paradigms" },
  { day: "21", title: "What is Conceptual Engineering and What Should It Be?",    href: "/advent-of-papers/2024/dec-21-conceptual-engineering" },
  { day: "22", title: "Once More — A Computer Revolution",                        href: "/advent-of-papers/2024/dec-22-computer-revolution" },
  { day: "23", title: "Do Artifacts Have Politics?",                              href: "/advent-of-papers/2024/dec-23-artifacts-politics" },
  { day: "24", title: "Against a Universal Definition of 'type'",                 href: "/advent-of-papers/2024/dec-24-against-types" },
];

const yearOf = (d) => (d || '').slice(0, 4);

const isExternal = (href) => /^https?:\/\//.test(href);

const InternalOrExternal = ({ href, className, children, ...rest }) => {
  if (isExternal(href)) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <NextLink href={href} className={className} {...rest}>
      {children}
    </NextLink>
  );
};

const Index = () => (
  <>
    <Head>
      <title>Jimmy Miller</title>
      <link rel="alternate" type="application/rss+xml" title="jimmyhmiller.github.io" href="feed.xml" />
      <meta name="author" content="Jimmy Miller" />
    </Head>

    <header className="topbar">
      <span className="topbar-mark" />
      <nav>
        <a className="a1" href="#popular">popular</a>
        <a className="a2" href="#projects">projects</a>
        <a className="a3" href="#posts">posts</a>
        <a className="a4" href="#advent">advent</a>
        <a href="#papers">papers</a>
        <a href="#talks">talks</a>
        <a href="https://github.com/jimmyhmiller" target="_blank" rel="noreferrer">github</a>
        <ThemeToggle />
      </nav>
    </header>

    <section className="intro" id="intro">
      <div className="intro-inner">
        <div className="intro-text">
          <p className="intro-kicker">essays · talks · tools</p>
          <h1 className="intro-name">Jimmy Miller</h1>
          <p className="intro-bio">
            I build compilers, editors, and tools mostly to learn things. I write
            about programming languages, the texture of working in old codebases,
            and the <em>feeling</em> of computing — which is also the name of a
            podcast I host.
          </p>
          <a className="intro-cta" href="#posts">read the essays</a>
        </div>

        <aside className="intro-now" aria-label="What I'm up to right now">
          <div className="intro-now-tag">
            <span>currently</span>
            <span className="stamp">{now.stamp}</span>
          </div>
          <div className="intro-now-list">
            {now.rows.map((r) => (
              <InternalOrExternal key={r.k} href={r.href} className="intro-now-row">
                <span className="k">{r.k}</span>
                <span className="v">{r.v}</span>
              </InternalOrExternal>
            ))}
          </div>
        </aside>
      </div>
    </section>

    {/* Popular */}
    <section className="popular" id="popular">
      <div className="wrap">
        <div className="twocol s-orange" style={{ border: 0, padding: 0 }}>
          <div className="col-label"><b>Popular</b></div>
          <div className="popular-list">
            {popularPosts.map((p, i) => (
              <InternalOrExternal key={p.href} href={p.href} className="popular-item">
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="t">{popularEmphasis[p.href] || p.text}</span>
                <span className="meta">{yearOf(p.date)}</span>
              </InternalOrExternal>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Projects — workshop / terminal aesthetic, distinct from Popular */}
    <section className="home-projects" id="projects">
      <div className="home-projects-wrap">
        <div className="home-projects-head">
          <b className="h-title">Projects</b>
        </div>

        <div
          className="home-feature"
          style={{ '--feat-accent': projects[0].accent }}
        >
          <div className="home-feature-bar">
            <span className="dots"><i /><i /><i /></span>
            <span className="crumb"><b>{projects[0].title}</b></span>
            <span style={{ width: 36 }} />
          </div>
          <div className="home-feature-body">
            <div className="home-feature-text">
              <span className="kicker">featured</span>
              <h3>
                <NextLink href={`/projects/${projects[0].id}`}>{projects[0].title}</NextLink>
              </h3>
              <p className="tag">{projects[0].tagline}</p>
              <p className="desc">{projects[0].blurb}</p>
              <NextLink href={`/projects/${projects[0].id}`} className="cta">
                open project
              </NextLink>
            </div>
            {projects[0].code && (
              <div className="home-feature-code">
                <CodeBlock code={projects[0].code} />
              </div>
            )}
          </div>
        </div>

        <div className="home-projects-list">
          {projects.slice(1).map((p, i) => (
            <NextLink
              key={p.id}
              href={`/projects/${p.id}`}
              className="home-projects-row"
              style={{ '--row-accent': p.accent }}
            >
              <span className="n">{String(i + 2).padStart(2, '0')}</span>
              <span className="dot" />
              <span className="name">{p.title}</span>
              <span className="tag">{p.tagline}</span>
            </NextLink>
          ))}
        </div>
      </div>
    </section>

    {/* Podcast */}
    <section className="podcast-band">
      <div className="podcast-band-inner">
        <div>
          <div className="podcast-tag">podcast</div>
          <h2 className="podcast-headline">
            The <span>feeling</span><br />of computing.
          </h2>
          <p className="podcast-text">
            Conversations about what programming feels like — the part you can't
            put on a slide. PL theory, tools, and the philosophy of software with
            co-hosts and guests.
          </p>
          <a className="podcast-cta" href="https://feelingof.com" target="_blank" rel="noreferrer">
            listen at feelingof.com
          </a>
        </div>
        <div className="podcast-art" aria-hidden="true">
          <div className="podcast-art-text">
            The <em>feeling</em> of<br />computing
          </div>
        </div>
      </div>
    </section>

    {/* Essays */}
    <section id="posts">
      <div className="wrap">
        <div className="twocol s-cyan">
          <div className="col-label"><b>Essays</b></div>
          <div
            className="posts-list"
            style={{ gridTemplateRows: `repeat(${Math.ceil(posts.length / 2)}, auto)` }}
          >
            {posts.map((p) => (
              <InternalOrExternal key={p.href} href={p.href} className="posts-year-row">
                <span className="y">{yearOf(p.date)}</span>
                <span>{p.text}</span>
              </InternalOrExternal>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Advent of Papers */}
    <section className="advent" id="advent">
      <div className="advent-wrap">
        <div className="advent-intro">
          <div className="kicker">2024</div>
          <h2>Advent of Papers</h2>
          <p>
            Every day in December, a short writeup on a paper I keep coming back to.
          </p>
        </div>
        <div className="advent-list">
          {advent.map((a) => (
            <InternalOrExternal key={a.href} href={a.href} className="advent-item">
              <span className="day">{a.day}</span>
              <b>{a.title}</b>
            </InternalOrExternal>
          ))}
          <div className="advent-foot">
            Full series → <NextLink href="/advent-of-papers">advent-of-papers</NextLink>
          </div>
        </div>
      </div>
    </section>

    {/* Paper archive */}
    <section id="papers">
      <div className="wrap">
        <div className="twocol s-blue">
          <div className="col-label"><b>Papers</b></div>
          <div className="papers-block">
            <p>
              A growing archive of papers and articles I've saved over the years —
              programming languages, philosophy of computing, weird edges. Some I've
              read, some I'm working through.
            </p>
            <p>
              <NextLink href="/readings" className="papers-cta">Browse the archive</NextLink>
            </p>
            <p className="papers-aside">
              I wrote about <NextLink href="/ai-own-your-tools">how this archive came together</NextLink>.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Talks */}
    <section id="talks">
      <div className="wrap">
        <div className="twocol s-lime">
          <div className="col-label"><b>Talks</b></div>
          <div className="talks-grid">
            {talks.map((t) => (
              <a key={t.href} className="talk-card" href={t.href} target="_blank" rel="noreferrer">
                <span className="play">watch</span>
                <b>{t.text}</b>
                <span className="venue">{t.venue}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Triplets */}
    <section className="triplets">
      <div className="t-orange">
        <h3 className="triplet-head">For beginners</h3>
        <div className="triplet-list">
          {postsForBeginners.map((p) => (
            <InternalOrExternal key={p.href} href={p.href} className="triplet-item">
              <span>{p.text}</span>
              <span className="meta">→</span>
            </InternalOrExternal>
          ))}
        </div>
      </div>
      <div className="t-violet">
        <h3 className="triplet-head">Utilities</h3>
        <div className="triplet-list">
          {utilities.map((u) => (
            <a key={u.href} className="triplet-item" href={u.href} target="_blank" rel="noreferrer">
              <span>{u.text}</span>
              <span className="meta">↗</span>
            </a>
          ))}
        </div>
      </div>
      <div className="t-cyan">
        <h3 className="triplet-head">Older slides</h3>
        <div className="triplet-list">
          {slides.map((s) => (
            <a key={s.href} className="triplet-item" href={s.href} target="_blank" rel="noreferrer">
              <span>{s.text}</span>
              <span className="meta">↗</span>
            </a>
          ))}
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

// RSS list compatibility
const postsHrefs = new Set(posts.map(p => p.href));
const extraPosts = [...popularPosts, ...postsForBeginners].filter(p => !postsHrefs.has(p.href));
export const rssPosts = [...posts, ...extraPosts];

export const getStaticProps = async () => {
  if (process.env.NODE_ENV == "production") {
    generateRSS();
  }
  return { props: {} };
};

export default Index;
