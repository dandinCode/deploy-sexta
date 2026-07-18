import type { PlayerState } from '../types.js';

export function addProject(
  player: PlayerState,
  projectName: string,
): PlayerState {
  return {
    ...player,
    currentProject: projectName,
    projects: player.projects.includes(projectName)
      ? player.projects
      : [...player.projects, projectName],
  };
}
