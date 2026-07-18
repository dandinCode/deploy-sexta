import type { PersonalityCard, PlayerState, SimulationConfig } from '../types.js';
import {
  applyAttributeDelta,
  applySkillDelta,
  createBaseAttributes,
} from './attributes.js';
import { computeSalary, seniorityLabel } from '../seniority/index.js';
import { getCompany } from '../companies/index.js';
import { getSalaryMultiplier } from '../market/index.js';

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

  const companyId = config.startCompanyId;
  const companyMul = companyId ? (getCompany(companyId)?.salaryMultiplier ?? null) : null;
  const salary = computeSalary(0, companyMul, getSalaryMultiplier(config.startYear));
  const company = companyId ? getCompany(companyId) : undefined;

  return {
    name,
    age: config.startAge,
    attributes,
    skills,
    selectedCards: cards.map((c) => c.id),
    careerPath: 'clt',
    companyId: companyId ?? null,
    companyHistory: company ? [company.name] : [],
    projects: [],
    salary,
    wealth: config.startingWealth,
    achievements: [],
    title: seniorityLabel(0),
    seniority: 0,
    monthsInLevel: 0,
  };
}

/**
 * Ganho mensal de patrimônio: poupança líquida após custo de vida.
 * Estagiário quase não sobra; a taxa de poupança melhora com a senioridade.
 */
export function monthlyPassiveTick(player: PlayerState): PlayerState {
  const costOfLiving = 1200 + player.seniority * 500;
  const savingsRate = 0.35;
  const wealthGain = Math.round((player.salary - costOfLiving) * savingsRate);

  // Saúde mental tende a um equilíbrio: piora em crise, recupera quando saudável.
  const mh = player.attributes.mentalHealth;
  let mhDelta = 0;
  if (mh < 35) mhDelta = -2;
  else if (mh >= 55) mhDelta = 2;
  else mhDelta = 1;
  if (player.attributes.discipline < 25) mhDelta -= 1;

  return {
    ...player,
    wealth: player.wealth + wealthGain,
    monthsInLevel: player.monthsInLevel + 1,
    attributes: {
      ...player.attributes,
      mentalHealth: Math.max(0, Math.min(100, mh + mhDelta)),
    },
  };
}
