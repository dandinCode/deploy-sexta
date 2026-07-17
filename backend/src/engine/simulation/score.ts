import type { GameState } from '../types.js';

/**
 * Score rewards memorable careers: wealth, reputation, achievements,
 * peak salary, projects and longevity — with burnout penalty.
 */
export function calculateScore(state: GameState): number {
  const { player, career } = state;

  const wealthScore = Math.min(400, Math.floor(player.wealth / 5000));
  const salaryScore = Math.min(200, Math.floor(career.peakSalary / 500));
  const repScore = player.attributes.reputation * 2;
  const projectScore = player.projects.length * 25;
  const achievementScore = player.achievements.length * 40;
  const longevityScore = Math.min(150, career.monthsPlayed);
  const companyScore = player.companyHistory.length * 15;

  let endingBonus = 0;
  switch (career.endReason) {
    case 'billionaire':
      endingBonus = 500;
      break;
    case 'company_sale':
      endingBonus = 300;
      break;
    case 'retirement':
      endingBonus = 200;
      break;
    case 'burnout':
      endingBonus = -100;
      break;
    case 'bankruptcy':
      endingBonus = -150;
      break;
    case 'death':
      endingBonus = 50;
      break;
  }

  return Math.max(
    0,
    wealthScore +
      salaryScore +
      repScore +
      projectScore +
      achievementScore +
      longevityScore +
      companyScore +
      endingBonus,
  );
}
