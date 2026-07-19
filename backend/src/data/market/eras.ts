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
    hotSkills: ['angular', 'java', 'spring', 'php', 'sql', 'react', 'flutter'],
    coldSkills: ['aiTools', 'rust', 'kubernetes', 'cobol'],
    salaryMultiplier: 1.0,
    eventWeightModifiers: {
      ai_wave: 0.2,
      react_boom: 1.3,
      frontend_framework_choice: 1.5,
      enterprise_backend_stack: 1.4,
      mobile_stack: 1.3,
      typescript_adoption: 0.6,
      cobol_legacy: 0.7,
    },
  },
  {
    yearStart: 2020,
    yearEnd: 2022,
    label: 'Era Cloud & Remote',
    description: 'React dominante, cloud crescendo, remote explode.',
    hotSkills: ['typescript', 'react', 'node', 'nestjs', 'docker', 'aws', 'postgres'],
    coldSkills: ['cobol', 'rails', 'flutter'],
    salaryMultiplier: 1.15,
    eventWeightModifiers: {
      remote_life: 2.0,
      cloud_migration: 1.8,
      layoff_wave: 1.4,
      ai_wave: 0.6,
      typescript_adoption: 1.8,
      python_product: 1.3,
      mobile_stack: 1.2,
    },
  },
  {
    yearStart: 2023,
    yearEnd: 2026,
    label: 'Era IA',
    description: 'IA explode. Todo PR menciona LLM.',
    hotSkills: ['aiTools', 'python', 'django', 'typescript', 'react', 'aws', 'kubernetes'],
    coldSkills: ['cobol', 'rails', 'angular'],
    salaryMultiplier: 1.3,
    eventWeightModifiers: {
      ai_wave: 2.5,
      openai_model: 2.2,
      layoff_wave: 1.6,
      python_product: 1.6,
      typescript_adoption: 1.3,
      enterprise_backend_stack: 0.9,
    },
  },
  {
    yearStart: 2027,
    yearEnd: 2035,
    label: 'Pós-IA',
    description: 'Novas stacks emergem. Quem se adapta sobrevive.',
    hotSkills: ['aiTools', 'rust', 'go', 'kubernetes', 'python', 'typescript'],
    coldSkills: ['cobol', 'rails'],
    salaryMultiplier: 1.45,
    eventWeightModifiers: {
      ai_wave: 1.8,
      new_lang_hype: 2.0,
      burnout_event: 1.3,
      typescript_adoption: 1.2,
      enterprise_backend_stack: 0.8,
      cobol_legacy: 0.5,
    },
  },
];
