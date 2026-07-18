/**
 * Seniority ladder — mercado dev brasileiro (CLT).
 *
 * `baseSalary` é o salário mensal de referência (empresa multiplicador 1.0,
 * mercado 1.0). O salário final = baseSalary * companyMultiplier * marketMultiplier.
 *
 * A progressão é lenta e coerente: exige tempo mínimo no nível atual
 * (`monthsToPromote`) e atributos mínimos (`promoteRequires`) para subir.
 */
export interface SeniorityLevel {
  index: number;
  label: string;
  short: string;
  baseSalary: number;
  /** Meses mínimos neste nível antes de poder subir para o próximo. */
  monthsToPromote: number;
}

export const SENIORITY_LEVELS: SeniorityLevel[] = [
  { index: 0, label: 'Estagiário(a)', short: 'Estágio', baseSalary: 1600, monthsToPromote: 6 },
  { index: 1, label: 'Desenvolvedor(a) Júnior', short: 'Júnior', baseSalary: 3200, monthsToPromote: 14 },
  { index: 2, label: 'Desenvolvedor(a) Pleno', short: 'Pleno', baseSalary: 6500, monthsToPromote: 20 },
  { index: 3, label: 'Desenvolvedor(a) Sênior', short: 'Sênior', baseSalary: 11000, monthsToPromote: 28 },
  { index: 4, label: 'Especialista / Staff', short: 'Staff', baseSalary: 16000, monthsToPromote: 32 },
  { index: 5, label: 'Tech Lead', short: 'Tech Lead', baseSalary: 21000, monthsToPromote: 36 },
  { index: 6, label: 'Principal Engineer', short: 'Principal', baseSalary: 30000, monthsToPromote: 48 },
  { index: 7, label: 'CTO / Head de Engenharia', short: 'CTO', baseSalary: 45000, monthsToPromote: Infinity },
];

export const MAX_SENIORITY = SENIORITY_LEVELS.length - 1;

export function getSeniority(index: number): SeniorityLevel {
  const clamped = Math.max(0, Math.min(MAX_SENIORITY, index));
  return SENIORITY_LEVELS[clamped]!;
}

export function seniorityLabel(index: number): string {
  return getSeniority(index).label;
}

/**
 * Salário mensal final. Sem empresa (desempregado) → 0.
 */
export function computeSalary(
  seniority: number,
  companyMultiplier: number | null,
  marketMultiplier: number,
): number {
  if (companyMultiplier === null) return 0;
  const base = getSeniority(seniority).baseSalary;
  return Math.round(base * companyMultiplier * marketMultiplier);
}
