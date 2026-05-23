import Head from 'next/head';
import NextLink from 'next/link';
import { Artifact } from '../../components/ProjectSection';
import MobileProjectPager from '../../components/MobileProjectPager';
import { projects, findProject, projectSlugs } from '../../data/projects';

export async function getStaticPaths() {
  return { paths: projectSlugs(), fallback: false };
}

export async function getStaticProps({ params }) {
  const project = findProject(params.slug);
  if (!project) return { notFound: true };
  const idx = projects.findIndex((p) => p.id === project.id);
  return {
    props: {
      project,
      prev: idx > 0 ? { id: projects[idx - 1].id, title: projects[idx - 1].title } : null,
      next: idx < projects.length - 1 ? { id: projects[idx + 1].id, title: projects[idx + 1].title } : null,
    },
  };
}

// Trim https:// and trailing slash for the visible repo label.
const repoLabel = (url) =>
  url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export default function ProjectPage({ project, prev, next }) {
  const { id, title, tagline, bg, fg, accent, blurb, writeup, repo } = project;
  const repoIsLink = repo && /^https?:\/\//.test(repo);
  // Empty-string when a field doesn't need review so the attribute is omitted.
  const needs = (field) =>
    project.needsReview && project.needsReview.includes(field) ? '1' : undefined;

  return (
    <div className="projpage" style={{ '--proj-bg': bg, '--proj-fg': fg, '--accent': accent }}>
      <Head>
        <title>{`${title} — Jimmy Miller`}</title>
        <meta name="og:description" content={tagline} />
      </Head>

      <header className="topbar">
        <NextLink href="/" className="topbar-mark">Jimmy Miller</NextLink>
        <nav>
          <a href="https://github.com/jimmyhmiller" target="_blank" rel="noreferrer">github</a>
        </nav>
      </header>

      {/* STUB: this preface is the same on every project page.
          Replace the copy below with your real write-up on how you
          approach projects. */}
      <section className="projpage-preface">
        <div className="projpage-preface-inner">
          <span className="projpage-preface-label">Projects</span>
          <p>
            My projects are mostly <em>experiments</em>. I am more interested
            in exploring the ideas behind things to learn than I am in writing
            production-ready software. Some eventually graduate to be tools I
            use every day. But even those are mostly things I find useful, not
            for others.
          </p>
        </div>
      </section>

      <div className="projpage-layout">
        <main className="projpage-main">
          <section className="projpage-hero">
            <h1 className="projpage-title">{title}</h1>
            <p className="projpage-tagline" data-needs-review={needs('tagline')}>{tagline}</p>
            <p className="projpage-blurb" data-needs-review={needs('blurb')}>{blurb}</p>
            {(repoIsLink || writeup) && (
              <ul className="projpage-links">
                {repoIsLink && (
                  <li>
                    <span className="k">repo</span>
                    <a href={repo} target="_blank" rel="noreferrer">{repoLabel(repo)}</a>
                  </li>
                )}
                {writeup && (
                  <li>
                    <span className="k">essay</span>
                    <NextLink href={writeup}>{writeup}</NextLink>
                  </li>
                )}
              </ul>
            )}
          </section>

          <section
            className="projpage-artifact"
            data-needs-review={
              ['code', 'arch', 'table', 'terminal', 'imageCaption'].some((k) => needs(k)) ? '1' : undefined
            }
          >
            <Artifact project={project} />
          </section>

          <nav className="projpage-foot">
            {prev ? (
              <NextLink href={`/projects/${prev.id}`} className="prev">
                <span className="label">Previous</span>
                {prev.title}
              </NextLink>
            ) : <span />}
            {next ? (
              <NextLink href={`/projects/${next.id}`} className="next">
                <span className="label">Next</span>
                {next.title}
              </NextLink>
            ) : <span />}
          </nav>
        </main>

        <aside className="projpage-rail" aria-label="All projects">
          <div className="projpage-rail-head">Projects</div>
          <ol>
            {projects.map((p, i) => (
              <li
                key={p.id}
                className={p.id === id ? 'is-current' : ''}
                style={{ '--row-accent': p.accent }}
              >
                <NextLink href={`/projects/${p.id}`}>
                  <span className="n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="dot" />
                  <span className="name">{p.title}</span>
                </NextLink>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <MobileProjectPager projects={projects} currentId={id} prev={prev} next={next} />
    </div>
  );
}
