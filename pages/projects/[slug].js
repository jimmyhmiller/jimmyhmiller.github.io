import Head from 'next/head';
import NextLink from 'next/link';
import ProjectFeature from '../../components/ProjectFeature';
import { SiteHeader, SiteFooter } from '../../components/SiteChrome';
import { projects, findProject, projectSlugs } from '../../data/projects';

export async function getStaticPaths() {
  return { paths: projectSlugs(), fallback: false };
}

export async function getStaticProps({ params }) {
  const project = findProject(params.slug);
  if (!project) return { notFound: true };
  return { props: { id: project.id } };
}

// Standalone page for each project (kept so existing /projects/<id> links
// still resolve). The homepage switches between the same sheets in place.
export default function ProjectPage({ id }) {
  const index = projects.findIndex((p) => p.id === id);
  const project = projects[index];
  const prev = projects[index - 1] ?? null;
  const next = projects[index + 1] ?? null;

  return (
    <>
      <Head>
        <title>{`${project.title} — Jimmy Miller`}</title>
        <meta name="og:description" content={project.tagline} />
      </Head>

      <SiteHeader />

      <main className="projpage">
        {/* STUB: this preface is the same on every project page.
            Replace the copy below with your real write-up on how you
            approach projects. */}
        <section className="projpage-preface">
          <span className="projpage-preface-label">Projects</span>
          <p>
            My projects are mostly <em>experiments</em>. I am more interested
            in exploring the ideas behind things to learn than I am in writing
            production-ready software. Some eventually graduate to be tools I
            use every day. But even those are mostly things I find useful, not
            for others.
          </p>
        </section>

        <div className="projpage-layout">
          <section className="home-projects projpage-sheet" data-paper={`project:${project.id}`}>
            <ProjectFeature project={project} headingLevel="h1" />
            <nav className="projpage-foot" aria-label="More projects">
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
          </section>

          <nav className="projpage-rail" data-paper="project-rail" aria-label="All projects">
            <h2 className="projpage-rail-head">Projects</h2>
            <ol>
              {projects.map((p) => (
                <li key={p.id}>
                  <NextLink href={`/projects/${p.id}`} aria-current={p.id === id ? 'page' : undefined}>
                    <span className="name">{p.title}</span>
                  </NextLink>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
