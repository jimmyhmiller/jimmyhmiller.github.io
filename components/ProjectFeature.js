import NextLink from 'next/link';
import { PrimaryArtifact, SecondaryArtifact } from './ProjectSection';

const repoLabel = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

// One project's sheet contents: prose and links on the left, its artifact in
// a recessed well on the right. The surrounding section supplies the sheet
// (`data-paper="project:<id>"`); the well is `project-well:<id>`.
//
// `fixed`: the homepage stage. The well fills the row and its artifact
// scrolls inside it, so only the prose determines the height.
// `sizer`: an invisible copy of the prose alone, used to give the homepage
// stage the height of the tallest project.
export default function ProjectFeature({ project, headingLevel = 'h3', secondary = true, fixed = false, sizer = false }) {
  const Heading = headingLevel;
  const repoIsLink = project.repo && /^https?:\/\//.test(project.repo);
  return (
    <div className={'home-feature-body' + (sizer ? ' home-feature-sizer' : '')} aria-hidden={sizer || undefined}>
      <div className="home-feature-text">
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
        {secondary && <SecondaryArtifact project={project} />}
      </div>
      {sizer ? <div className="home-feature-code" /> : (
        <div className={'home-feature-code' + (fixed ? ' is-fixed' : '')} data-paper={`project-well:${project.id}`}>
          {fixed ? <div className="well-scroll"><PrimaryArtifact project={project} /></div> : <PrimaryArtifact project={project} />}
        </div>
      )}
    </div>
  );
}
