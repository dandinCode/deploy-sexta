/** Core domain types for Deploy Sexta engine */

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

export type SkillId =
  | 'react'
  | 'node'
  | 'java'
  | 'python'
  | 'go'
  | 'rust'
  | 'docker'
  | 'aws'
  | 'kubernetes'
  | 'sql'
  | 'postgres'
  | 'redis'
  | 'rabbitmq'
  | 'flutter'
  | 'aiTools';

export type CareerPath =
  | 'clt'
  | 'freelancer'
  | 'consultant'
  | 'startup_founder'
  | 'software_house'
  | 'saas'
  | 'content_creator'
  | 'open_source';

export type EndReason =
  | 'retirement'
  | 'burnout'
  | 'bankruptcy'
  | 'company_sale'
  | 'billionaire'
  | 'death';

export type AttributeMap = Record<AttributeId, number>;
export type SkillMap = Partial<Record<SkillId, number>>;

export interface PersonalityCard {
  id: string;
  name: string;
  title: string;
  description: string;
  bonuses: Partial<AttributeMap>;
  skillBonuses?: SkillMap;
}

export interface Requirement {
  minAttributes?: Partial<AttributeMap>;
  maxAttributes?: Partial<AttributeMap>;
  minSkills?: SkillMap;
  careerPaths?: CareerPath[];
  minYear?: number;
  maxYear?: number;
  minMonth?: number;
  maxMonth?: number;
  minWealth?: number;
  maxWealth?: number;
  minSalary?: number;
  hasCompany?: boolean;
  tags?: string[];
}

export interface Effect {
  attributes?: Partial<AttributeMap>;
  skills?: SkillMap;
  wealth?: number;
  salary?: number;
  reputation?: number;
  mentalHealth?: number;
  setCareerPath?: CareerPath;
  setCompanyId?: string | null;
  addCompanyHistory?: string;
  addProject?: string;
  addAchievement?: string;
  addTimelineNote?: string;
  endGame?: EndReason;
  promote?: boolean;
  fire?: boolean;
}

export interface EventOption {
  id: string;
  label: string;
  description?: string;
  requirements?: Requirement;
  effects: Effect;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  weight: number;
  requirements?: Requirement;
  options: EventOption[];
  tags?: string[];
}

export interface Company {
  id: string;
  name: string;
  type: 'bigtech' | 'startup' | 'software_house' | 'agency' | 'bank' | 'own';
  salaryMultiplier: number;
  prestige: number;
  minYear?: number;
  maxYear?: number;
}

export interface MarketEra {
  yearStart: number;
  yearEnd: number;
  label: string;
  hotSkills: SkillId[];
  coldSkills: SkillId[];
  salaryMultiplier: number;
  eventWeightModifiers: Record<string, number>;
  description: string;
}

export interface TimelineEntry {
  year: number;
  month: number;
  title: string;
  description: string;
  type: 'event' | 'career' | 'project' | 'milestone';
}

export interface PlayerState {
  name: string;
  age: number;
  attributes: AttributeMap;
  skills: SkillMap;
  selectedCards: string[];
  careerPath: CareerPath;
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
  endReason: EndReason | null;
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
  rngCursor: number;
}

export interface DraftConfig {
  offered: number;
  pick: number;
}

export interface SimulationConfig {
  startYear: number;
  startAge: number;
  retirementAge: number;
  draft: DraftConfig;
  baseSalary: number;
  startingWealth: number;
}
