import type { PersonalityCard, PlayerState, SimulationConfig } from '../types.js';
import {
  applyAttributeDelta,
  applySkillDelta,
  createBaseAttributes,
} from './attributes.js';

export function createPlayerFromDraft(
  name: string,
  cards: PersonalityCard[],
  config: SimulationConfig,
): PlayerState {
  let attributes = createBaseAttributes(38);
  let skills = {};

  for (const card of cards) {
    attributes = applyAttributeDelta(attributes, card.bonuses);
    skills = applySkillDelta(skills, card.skillBonuses);
  }

  return {
    name,
    age: config.startAge,
    attributes,
    skills,
    selectedCards: cards.map((c) => c.id),
    careerPath: 'clt',
    companyId: null,
    companyHistory: [],
    projects: [],
    salary: config.baseSalary,
    wealth: config.startingWealth,
    achievements: [],
    title: 'Júnior em potencial',
  };
}

export function monthlyPassiveTick(player: PlayerState): PlayerState {
  const wealthGain = Math.round(player.salary / 12);
  const burnoutRisk =
    player.attributes.discipline < 30 || player.attributes.mentalHealth < 40
      ? -2
      : 0;

  return {
    ...player,
    wealth: player.wealth + wealthGain,
    attributes: {
      ...player.attributes,
      mentalHealth: Math.max(
        0,
        Math.min(100, player.attributes.mentalHealth + burnoutRisk),
      ),
    },
  };
}
