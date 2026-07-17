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
