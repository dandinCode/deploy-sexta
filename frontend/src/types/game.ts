export type AttributeId =
  | 'logic'
  | 'communication'
  | 'business'
  | 'architecture'
  | 'backend'
  | 'frontend'
  | 'devops'
  | 'cloud'
  | 'ai'
  | 'networking'
  | 'creativity'
  | 'leadership'
  | 'discipline'
  | 'mentalHealth'
  | 'reputation';

export interface PersonalityCard {
  id: string;
  name: string;
  title: string;
  description: string;
  bonuses: Partial<Record<AttributeId, number>>;
  skillBonuses?: Record<string, number>;
}

export interface EventOption {
  id: string;
  label: string;
  description?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  options: EventOption[];
  tags?: string[];
}

export interface TimelineEntry {
  year: number;
  month: number;
  title: string;
  description: string;
  type: string;
}

export interface PlayerState {
  name: string;
  age: number;
  attributes: Record<AttributeId, number>;
  skills: Record<string, number>;
  selectedCards: string[];
  careerPath: string;
  companyId: string | null;
  companyHistory: string[];
  projects: string[];
  salary: number;
  wealth: number;
  achievements: string[];
  title: string;
}

export interface CareerState {
  startYear: number;
  currentYear: number;
  currentMonth: number;
  monthsPlayed: number;
  timeline: TimelineEntry[];
  peakSalary: number;
  endReason: string | null;
}

export interface MarketEra {
  yearStart: number;
  yearEnd: number;
  label: string;
  description: string;
  hotSkills: string[];
  coldSkills: string[];
  salaryMultiplier: number;
}

export interface GameState {
  id: string;
  seed: number;
  status: 'draft' | 'playing' | 'finished';
  player: PlayerState;
  career: CareerState;
  draftCards: PersonalityCard[];
  selectedDraftIds: string[];
  currentEvent: GameEvent | null;
  score: number | null;
  market?: MarketEra;
}

export interface MetaResponse {
  cards: PersonalityCard[];
  attributes: Record<string, string>;
  skills: Record<string, string>;
  config: {
    draft: { offered: number; pick: number };
    startYear: number;
  };
}
