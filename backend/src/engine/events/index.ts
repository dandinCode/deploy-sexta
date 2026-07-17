import type {
  AttributeMap,
  GameEvent,
  GameState,
  Requirement,
  SkillMap,
} from '../types.js';
import { getEventWeightModifier } from '../market/index.js';
import { gameEvents } from '../../data/events/catalog.js';
import type { Rng } from '../random/index.js';

export function meetsRequirement(
  state: GameState,
  req?: Requirement,
): boolean {
  if (!req) return true;

  const { player, career } = state;

  if (req.minYear && career.currentYear < req.minYear) return false;
  if (req.maxYear && career.currentYear > req.maxYear) return false;
  if (req.minMonth && career.currentMonth < req.minMonth) return false;
  if (req.maxMonth && career.currentMonth > req.maxMonth) return false;
  if (req.minWealth !== undefined && player.wealth < req.minWealth) return false;
  if (req.maxWealth !== undefined && player.wealth > req.maxWealth) return false;
  if (req.minSalary !== undefined && player.salary < req.minSalary) return false;
  if (req.hasCompany !== undefined) {
    const has = player.companyId !== null;
    if (req.hasCompany !== has) return false;
  }
  if (req.careerPaths && !req.careerPaths.includes(player.careerPath)) {
    return false;
  }
  if (req.minAttributes && !meetsMinMap(player.attributes, req.minAttributes)) {
    return false;
  }
  if (req.maxAttributes && !meetsMaxMap(player.attributes, req.maxAttributes)) {
    return false;
  }
  if (req.minSkills && !meetsMinSkills(player.skills, req.minSkills)) {
    return false;
  }

  return true;
}

function meetsMinMap(
  attrs: AttributeMap,
  min: Partial<AttributeMap>,
): boolean {
  return Object.entries(min).every(([key, value]) => {
    if (value === undefined) return true;
    return attrs[key as keyof AttributeMap] >= value;
  });
}

function meetsMaxMap(
  attrs: AttributeMap,
  max: Partial<AttributeMap>,
): boolean {
  return Object.entries(max).every(([key, value]) => {
    if (value === undefined) return true;
    return attrs[key as keyof AttributeMap] <= value;
  });
}

function meetsMinSkills(skills: SkillMap, min: SkillMap): boolean {
  return Object.entries(min).every(([key, value]) => {
    if (value === undefined) return true;
    return (skills[key as keyof SkillMap] ?? 0) >= value;
  });
}

export function filterEligibleEvents(state: GameState): GameEvent[] {
  return gameEvents.filter((event) => meetsRequirement(state, event.requirements));
}

export function computeEventWeight(
  state: GameState,
  event: GameEvent,
): number {
  const marketMod = getEventWeightModifier(state.career.currentYear, event.id);
  let weight = event.weight * marketMod;

  // Friday deploy chaos bias in later career months
  if (event.id === 'deploy_friday' && state.career.currentMonth === 12) {
    weight *= 1.4;
  }

  // Low mental health boosts burnout-related events
  if (
    event.tags?.includes('burnout') &&
    state.player.attributes.mentalHealth < 40
  ) {
    weight *= 2;
  }

  // High reputation boosts opportunity events
  if (
    event.tags?.includes('opportunity') &&
    state.player.attributes.reputation >= 60
  ) {
    weight *= 1.5;
  }

  return Math.max(0.01, weight);
}

export function selectEvent(state: GameState, rng: Rng): GameEvent {
  const eligible = filterEligibleEvents(state);
  if (eligible.length === 0) {
    return gameEvents.find((e) => e.id === 'quiet_month')!;
  }

  const weighted = eligible.map((event) => ({
    ...event,
    weight: computeEventWeight(state, event),
  }));

  return rng.weightedPick(weighted);
}

export function getEventById(id: string): GameEvent | undefined {
  return gameEvents.find((e) => e.id === id);
}

export function listAvailableOptions(state: GameState, event: GameEvent) {
  return event.options.filter((opt) => meetsRequirement(state, opt.requirements));
}
