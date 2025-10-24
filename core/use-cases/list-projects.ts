import type { Project } from '../domain/project';
import type { ProjectContentReader } from '../interfaces/content';

export const listProjects = async (
  deps: { projectContentReader: ProjectContentReader },
): Promise<Project[]> => {
  const projects = await deps.projectContentReader.listProjects();
  return [...projects].sort((a, b) => a.order - b.order);
};
