import { findProject, projects } from '../../data/projects';
import ProjectPage from './[slug]';

const ALIAS_SLUG = 'beagle';

export async function getStaticProps() {
  const project = findProject(ALIAS_SLUG);
  if (!project) {
    throw new Error(`/projects alias target "${ALIAS_SLUG}" not found in data/projects`);
  }
  const idx = projects.findIndex((p) => p.id === project.id);
  return {
    props: {
      project,
      prev: idx > 0 ? { id: projects[idx - 1].id, title: projects[idx - 1].title } : null,
      next: idx < projects.length - 1 ? { id: projects[idx + 1].id, title: projects[idx + 1].title } : null,
    },
  };
}

export default ProjectPage;
