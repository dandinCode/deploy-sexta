import type { MarketEra, SkillId } from '../types.js';
import { marketEras } from '../../data/market/eras.js';

export function getMarketForYear(year: number): MarketEra {
  const era = marketEras.find(
    (e) => year >= e.yearStart && year <= e.yearEnd,
  );
  return era ?? marketEras[marketEras.length - 1]!;
}

export function getSkillDemand(
  year: number,
  skill: SkillId,
): 'hot' | 'cold' | 'neutral' {
  const market = getMarketForYear(year);
  if (market.hotSkills.includes(skill)) return 'hot';
  if (market.coldSkills.includes(skill)) return 'cold';
  return 'neutral';
}

export function getSalaryMultiplier(year: number): number {
  return getMarketForYear(year).salaryMultiplier;
}

export function getEventWeightModifier(year: number, eventId: string): number {
  const market = getMarketForYear(year);
  return market.eventWeightModifiers[eventId] ?? 1;
}
