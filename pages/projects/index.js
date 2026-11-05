import { findProject } from '../../data/projects';
import ProjectPage from './[slug]';

const ALIAS_SLUG = 'beagle';

export async function getStaticProps() {
  const project = findProject(ALIAS_SLUG);
  if (!project) {
    throw new Error(`/projects alias target "${ALIAS_SLUG}" not found in data/projects`);
  }
  return { props: { id: project.id } };
}

export default ProjectPage;
