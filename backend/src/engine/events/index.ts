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
  if (req.minSeniority !== undefined && player.seniority < req.minSeniority) {
    return false;
  }
  if (req.maxSeniority !== undefined && player.seniority > req.maxSeniority) {
    return false;
  }
  if (
    req.minMonthsInLevel !== undefined &&
    player.monthsInLevel < req.minMonthsInLevel
  ) {
    return false;
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

/** Quantos meses de histórico guardamos para cooldown. */
export const EVENT_HISTORY_SIZE = 14;
/** Meses em que o mesmo evento fica bloqueado se houver alternativa. */
export const EVENT_HARD_COOLDOWN = 5;
/** Meses de intervalo entre eventos diferentes sobre o mesmo tema. */
export const EVENT_GROUP_HARD_COOLDOWN = 8;

export function listAvailableOptions(state: GameState, event: GameEvent) {
  return event.options.filter((opt) => meetsRequirement(state, opt.requirements));
}

export function filterEligibleEvents(state: GameState): GameEvent[] {
  return gameEvents.filter((event) => {
    if (!meetsRequirement(state, event.requirements)) return false;
    const available = listAvailableOptions(state, event).length;
    // Eventos com uma única opção autorada (ex.: layoff) são válidos;
    // demais precisam de pelo menos 2 escolhas disponíveis.
    if (event.options.length === 1) return available === 1;
    return available >= 2;
  });
}

function recentHistory(state: GameState): string[] {
  return state.recentEventIds ?? [];
}

/**
 * Penalidade por repetição recente.
 * Quanto mais perto no histórico, menor o peso.
 * 0 = bloqueado (último turno / muito recente).
 */
export function cooldownMultiplier(state: GameState, eventId: string): number {
  const recent = recentHistory(state);
  if (recent.length === 0) return 1;

  // Posição a partir do fim: 0 = último evento jogado
  const fromEnd = [...recent].reverse().indexOf(eventId);
  if (fromEnd === -1) return 1;

  const monthsAgo = fromEnd + 1;
  if (monthsAgo <= 1) return 0; // nunca o mesmo no mês seguinte
  if (monthsAgo <= 3) return 0.02;
  if (monthsAgo <= 5) return 0.08;
  if (monthsAgo <= 8) return 0.25;
  if (monthsAgo <= 12) return 0.5;
  return 0.75;
}

/**
 * Cooldown compartilhado por tema. Ex.: React em alta e hype de uma nova
 * linguagem pertencem a `technology_trend`, então não aparecem em sequência.
 */
export function groupCooldownMultiplier(
  state: GameState,
  event: GameEvent,
): number {
  if (!event.cooldownGroup) return 1;

  const recent = [...recentHistory(state)].reverse();
  const fromEnd = recent.findIndex(
    (id) => getEventById(id)?.cooldownGroup === event.cooldownGroup,
  );
  if (fromEnd === -1) return 1;

  const monthsAgo = fromEnd + 1;
  if (monthsAgo <= EVENT_GROUP_HARD_COOLDOWN) return 0;
  if (monthsAgo <= 11) return 0.15;
  if (monthsAgo <= EVENT_HISTORY_SIZE) return 0.4;
  return 1;
}

export function computeEventWeight(
  state: GameState,
  event: GameEvent,
  { applyCooldown = true }: { applyCooldown?: boolean } = {},
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

  if (applyCooldown) {
    weight *= cooldownMultiplier(state, event.id);
    weight *= groupCooldownMultiplier(state, event);
  }

  return Math.max(0, weight);
}

export function selectEvent(state: GameState, rng: Rng): GameEvent {
  const eligible = filterEligibleEvents(state);
  if (eligible.length === 0) {
    return gameEvents.find((e) => e.id === 'quiet_month')!;
  }

  const recent = recentHistory(state);
  const hardBlocked = new Set(recent.slice(-EVENT_HARD_COOLDOWN));
  const blockedGroups = new Set(
    recent
      .slice(-EVENT_GROUP_HARD_COOLDOWN)
      .map((id) => getEventById(id)?.cooldownGroup)
      .filter((group): group is string => Boolean(group)),
  );

  // Prefere eventos fora do cooldown individual e temático.
  let pool = eligible.filter(
    (event) =>
      !hardBlocked.has(event.id) &&
      (!event.cooldownGroup || !blockedGroups.has(event.cooldownGroup)),
  );
  // Se todos os temas estiverem bloqueados, preserva ao menos o cooldown exato.
  if (pool.length === 0) {
    pool = eligible.filter((event) => !hardBlocked.has(event.id));
  }
  if (pool.length === 0) {
    pool = eligible;
  }

  const weighted = pool.map((event) => ({
    ...event,
    weight: computeEventWeight(state, event, {
      // No fallback extremo (só eventos bloqueados), ainda aplica soft cooldown.
      applyCooldown: true,
    }),
  }));

  const withWeight = weighted.filter((e) => e.weight > 0);
  if (withWeight.length > 0) {
    return rng.weightedPick(withWeight);
  }

  // Último recurso: algo elegível sem cooldown (ex.: pouquíssimos eventos possíveis).
  const fallback = eligible.map((event) => ({
    ...event,
    weight: computeEventWeight(state, event, { applyCooldown: false }),
  }));
  return rng.weightedPick(fallback);
}

export function getEventById(id: string): GameEvent | undefined {
  return gameEvents.find((e) => e.id === id);
}
