import NextLink from 'next/link';
import { PrimaryArtifact, SecondaryArtifact } from './ProjectSection';

const repoLabel = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

// One project's sheet contents: prose and links on the left, its artifact in
// a recessed well on the right. The surrounding section supplies the sheet
// (`data-paper="project:<id>"`); the well is `project-well:<id>`.
export default function ProjectFeature({ project, index, count, headingLevel = 'h3' }) {
  const Heading = headingLevel;
  const repoIsLink = project.repo && /^https?:\/\//.test(project.repo);
  return (
    <div className="home-feature-body">
      <div className="home-feature-text">
        <span className="kicker">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        <Heading>{project.title}</Heading>
        <p className="tag">{project.tagline}</p>
        <p className="desc">{project.blurb}</p>
        {(repoIsLink || project.writeup) && (
          <ul className="project-links">
            {repoIsLink && (
              <li>
                <span className="k">repo</span>
                <a href={project.repo} target="_blank" rel="noreferrer">{repoLabel(project.repo)}</a>
              </li>
            )}
            {project.writeup && (
              <li>
                <span className="k">essay</span>
                <NextLink href={project.writeup}>{project.writeup}</NextLink>
              </li>
            )}
          </ul>
        )}
        <SecondaryArtifact project={project} />
      </div>
      <div className="home-feature-code" data-paper={`project-well:${project.id}`}>
        <PrimaryArtifact project={project} />
      </div>
    </div>
  );
}
