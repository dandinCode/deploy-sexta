import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCareerLength(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} mês${rest === 1 ? '' : 'es'}`;
  if (rest === 0) return `${years} ano${years === 1 ? '' : 's'}`;
  return `${years}a ${rest}m`;
}

export const ATTRIBUTE_LABELS: Record<string, string> = {
  logic: 'Lógica',
  communication: 'Comunicação',
  business: 'Negócios',
  architecture: 'Arquitetura',
  backend: 'Backend',
  frontend: 'Frontend',
  devops: 'DevOps',
  cloud: 'Cloud',
  ai: 'IA',
  networking: 'Networking',
  creativity: 'Criatividade',
  leadership: 'Liderança',
  discipline: 'Disciplina',
  mentalHealth: 'Saúde Mental',
  reputation: 'Reputação',
};
