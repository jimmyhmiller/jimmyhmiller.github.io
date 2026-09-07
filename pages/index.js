import Head from 'next/head';
import NextLink from 'next/link';
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
  { text: "Meander: Declarative Explorations at the Limits of FP",        href: "https://www.youtube.com/watch?v=9fhnJpCgtUw", venue: "Strange Loop" },
  { text: "Paradigms Without Progress: Kuhnian Reflections on Programming Practice", href: "https://www.youtube.com/watch?v=TkPy7aLTtAw", venue: "Rebase" },
];

// Display-only overrides for the Popular section — nicer typographic quotes
// and dashes than the plain post title.
const popularEmphasis = {
  '/ugliest-beautiful-codebase':        "“We ran out of columns” — the best, worst codebase",
  '/easiest-way-to-build-type-checker': "The easiest way to build a type checker",
  '/machine-code-isnt-scary':           "Machine code isn’t scary",
  '/discovery-coding':                  "Discovery coding",
};

// "Currently" panel — pulls from real site content. Each row links somewhere.
// Tweak when life changes; rows render as anchors.
const now = {
  stamp: "may 2026",
  rows: [
    { k: "building", v: "a tensor compiler",         href: "/projects/tensor-lang" },
    { k: "writing",  v: "legibility is ruining you", href: "/legibility-is-ruining-you" },
    { k: "using",    v: "keep-running, daily",       href: "/projects/keep-running" },
    { k: "talking",  v: "the feeling of computing",  href: "https://feelingof.com" },
  ],
  updated: "2026-05-20",
};

// Highlight 6 of the 24 advent entries on the homepage — the longer/more
// substantial ones, plus the two you used to call out on the old index
// (Dec 4 and Dec 15). The "Full series →" foot link goes to the full archive.
const advent = [
  { day: "01", title: "Elephant 2000",                                            href: "/advent-of-papers/2024/dec-1-elephant-2000" },
  { day: "03", title: "Google's Awful Paper on Technical Debt",                   href: "/advent-of-papers/2024/dec-3-awful-google-tech-debt" },
  { day: "04", title: "Is the Brain a Computer?",                                 href: "/advent-of-papers/2024/dec-4-brain-computer" },
  { day: "05", title: "Worlds: Mutability with Control",                          href: "/advent-of-papers/2024/dec-5-worlds" },
  { day: "11", title: "On Understanding Data Abstraction Revisited",              href: "/advent-of-papers/2024/dec-11-data-abstraction" },
  { day: "15", title: "Programming Languages as Technical Artifacts",             href: "/advent-of-papers/2024/dec-15-technical-artifacts" },
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
        <NextLink className="a2" href="/projects">projects</NextLink>
        <a className="a3" href="#posts">posts</a>
        <a className="a4" href="#advent">advent</a>
        <a href="#papers">papers</a>
        <a href="#talks">talks</a>
        <a href="https://github.com/jimmyhmiller" target="_blank" rel="noreferrer">github</a>
      </nav>
    </header>

    <section className="intro" id="intro">
      <div className="intro-inner">
        <div className="intro-text">
          <h1 className="intro-name">Jimmy Miller</h1>
          <p className="intro-bio">
            I build compilers, editors, and tools mostly to learn things. I write
            about programming languages, the texture of working in old codebases,
            and the <em>feeling</em> of computing.
          </p>
          <a className="intro-cta" href="#posts">read the posts</a>
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
            The feeling<br />of computing.
          </h2>
          <p className="podcast-text">
            A podcast with an alternative take on computing. We try to explore
            things around the edge of computing, looking back in history and
            into the future of what computing has and could be.
          </p>
          <a className="podcast-cta" href="https://feelingof.com" target="_blank" rel="noreferrer">
            listen at feelingof.com
          </a>
        </div>
        <div className="podcast-art" aria-hidden="true">
          <div className="podcast-art-text">
            The feeling of<br />computing
          </div>
        </div>
      </div>
    </section>

    {/* Posts */}
    <section id="posts">
      <div className="wrap">
        <div className="twocol s-cyan">
          <div className="col-label"><b>Posts</b></div>
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
            I did an experiment where I tried to read a paper every day of
            advent and write about it. Some days are more involved than others,
            but I had a great time doing it.
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
              A collection of papers I've gathered over time. Many I've read
              but not all. Figured it was worth sharing. Plan on organizing
              more over time.
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

    <footer className="site">
      <span>
        <a href="https://bsky.app/profile/jimmyhmiller.bsky.social" target="_blank" rel="noreferrer">bsky</a>
        &nbsp;·&nbsp;
        <a href="https://hachyderm.io/@jimmyhmiller" target="_blank" rel="noreferrer">mastodon</a>
        &nbsp;·&nbsp;
        <a href="https://github.com/jimmyhmiller" target="_blank" rel="noreferrer">github</a>
      </span>
      <span>
        <NextLink href="/archive">archive</NextLink>
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
