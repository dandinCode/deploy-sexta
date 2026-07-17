import type { Company, PlayerState } from '../types.js';
import { companies } from '../../data/companies/catalog.js';

export function listCompanies(year: number): Company[] {
  return companies.filter((c) => {
    if (c.minYear && year < c.minYear) return false;
    if (c.maxYear && year > c.maxYear) return false;
    return true;
  });
}

export function getCompany(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

export function resolveCompanySalary(
  baseSalary: number,
  companyId: string | null,
  marketMultiplier: number,
): number {
  if (!companyId) return Math.round(baseSalary * marketMultiplier);
  const company = getCompany(companyId);
  if (!company) return Math.round(baseSalary * marketMultiplier);
  return Math.round(baseSalary * company.salaryMultiplier * marketMultiplier);
}

export function joinCompany(
  player: PlayerState,
  companyId: string,
): PlayerState {
  const company = getCompany(companyId);
  if (!company) return player;

  return {
    ...player,
    companyId,
    companyHistory: player.companyHistory.includes(company.name)
      ? player.companyHistory
      : [...player.companyHistory, company.name],
  };
}
