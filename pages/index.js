import Head from 'next/head';
import NextLink from 'next/link';
import { useState } from 'react';
import ProjectFeature from '../components/ProjectFeature';
import { HomeHeader, SiteFooter } from '../components/SiteChrome';
import { usePaper, useBrowserLayoutEffect } from '../components/PaperDesk';
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

// Projects switch in place: choosing a row swaps the sheet's contents and its
// paper (pigment, height, edges, artifact well) — see lib/paper/materials.js.
function Projects() {
  const [currentId, setCurrentId] = useState(projects[0].id);
  const paper = usePaper();
  const index = projects.findIndex((p) => p.id === currentId);
  const current = projects[index];
  useBrowserLayoutEffect(() => { paper.refresh(); }, [currentId, paper]);

  return (
    <section className="home-projects" data-paper={`project:${current.id}`} id="projects">
      <div className="home-projects-wrap">
        <div className="home-projects-head">
          <h2 className="h-title">Projects</h2>
        </div>
        <div className="home-feature" id="project-feature" aria-live="polite">
          <ProjectFeature key={current.id} project={current} />
        </div>
        <div className="home-projects-list">
          {projects.map((p) => (
            <button
              type="button"
              key={p.id}
              className="home-projects-row"
              aria-pressed={p.id === current.id}
              aria-controls="project-feature"
              onClick={() => setCurrentId(p.id)}
            >
              <span className="name">{p.title}</span>
              <span className="tag">{p.tagline}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const Index = () => (
  <>
    <Head>
      <title>Jimmy Miller</title>
      <link rel="alternate" type="application/rss+xml" title="jimmyhmiller.github.io" href="feed.xml" />
      <meta name="author" content="Jimmy Miller" />
    </Head>

    <HomeHeader />

    <main>
      <div className="hero">
        <div className="hero-intro">
          <section className="intro" data-paper="intro" id="intro">
            <div className="intro-inner">
              <div className="intro-text">
                <h1 className="intro-name">Jimmy Miller</h1>
                <p className="intro-bio">
                  I'm obsessed with building editors. 
                  I am always working on at least 3 new programming languages ideas.
                  I wish I knew how to make things look good.
                </p>
                <a className="intro-cta" href="#posts">read the posts</a>
              </div>
            </div>
          </section>
        </div>
        <div className="hero-popular">
          <section className="popular" data-paper="popular" id="popular">
            <div className="wrap">
              <div className="twocol">
                <div className="col-label"><h2>Popular</h2></div>
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
        </div>
      </div>

      <Projects />

      <section className="podcast-band" data-paper="podcast" id="podcast-title" aria-label="Feeling of Computing">
        <div className="podcast-band-inner">
          <div>
            <p className="podcast-text">
              A podcast with an alternative take on computing. We try to explore
              things around the edge of computing, looking back in history and
              into the future of what computing has and could be.
            </p>
            <a className="podcast-cta" href="https://feelingof.com/episodes" target="_blank" rel="noreferrer">
              Listen to the podcast
            </a>
          </div>
          <img className="podcast-art" src="/images/feeling-of/feeling-of-computing-mark.svg" alt="Feeling of Computing" width="1000" height="1000" loading="lazy" />
        </div>
      </section>

      <div className="section-heading writing-heading">
        <NextLink href="/archive">The complete archive ↗</NextLink>
      </div>
      <section data-paper="posts" id="posts">
        <div className="wrap">
          <div className="twocol">
            <div className="col-label"><h2>Posts</h2></div>
            <div className="posts-list">
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

      <section className="advent" data-paper="advent" id="advent">
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

      <div className="reference-grid">
        <section data-paper="papers" id="papers">
          <div className="wrap">
            <div className="twocol">
              <div className="col-label"><h2>Papers</h2></div>
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

        <section data-paper="talks" id="talks">
          <div className="wrap">
            <div className="twocol">
              <div className="col-label"><h2>Talks</h2></div>
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
      </div>
    </main>

    <SiteFooter />
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
