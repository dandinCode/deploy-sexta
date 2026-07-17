import type { PlayerState } from '../types.js';

export function addProject(
  player: PlayerState,
  projectName: string,
): PlayerState {
  if (player.projects.includes(projectName)) return player;
  return {
    ...player,
    projects: [...player.projects, projectName],
  };
}
