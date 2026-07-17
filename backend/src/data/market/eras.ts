import type { MarketEra } from '../../engine/types.js';

/**
 * Market eras drive salaries, hot skills and event weight modifiers.
 * Extend by appending eras — no engine changes needed.
 */
export const marketEras: MarketEra[] = [
  {
    yearStart: 2016,
    yearEnd: 2019,
    label: 'Era Angular / Mobile',
    description: 'Angular forte, React crescendo, IA irrelevante.',
    hotSkills: ['java', 'sql', 'react', 'flutter'],
    coldSkills: ['aiTools', 'rust', 'kubernetes'],
    salaryMultiplier: 1.0,
    eventWeightModifiers: {
      ai_wave: 0.2,
      react_boom: 1.3,
      angular_legacy: 1.5,
    },
  },
  {
    yearStart: 2020,
    yearEnd: 2022,
    label: 'Era Cloud & Remote',
    description: 'React dominante, cloud crescendo, remote explode.',
    hotSkills: ['react', 'node', 'docker', 'aws', 'postgres'],
    coldSkills: ['java', 'flutter'],
    salaryMultiplier: 1.15,
    eventWeightModifiers: {
      remote_life: 2.0,
      cloud_migration: 1.8,
      layoff_wave: 1.4,
      ai_wave: 0.6,
    },
  },
  {
    yearStart: 2023,
    yearEnd: 2026,
    label: 'Era IA',
    description: 'IA explode. Todo PR menciona LLM.',
    hotSkills: ['aiTools', 'python', 'react', 'aws', 'kubernetes'],
    coldSkills: ['flutter', 'java'],
    salaryMultiplier: 1.3,
    eventWeightModifiers: {
      ai_wave: 2.5,
      openai_model: 2.2,
      layoff_wave: 1.6,
    },
  },
  {
    yearStart: 2027,
    yearEnd: 2035,
    label: 'Pós-IA',
    description: 'Novas stacks emergem. Quem se adapta sobrevive.',
    hotSkills: ['aiTools', 'rust', 'go', 'kubernetes', 'python'],
    coldSkills: ['java'],
    salaryMultiplier: 1.45,
    eventWeightModifiers: {
      ai_wave: 1.8,
      new_lang_hype: 2.0,
      burnout_event: 1.3,
    },
  },
];
