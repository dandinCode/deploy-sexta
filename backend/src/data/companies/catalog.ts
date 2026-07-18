import type { Company } from '../../engine/types.js';

/**
 * Add companies here — engine resolves by id.
 */
export const companies: Company[] = [
  {
    id: 'primeiro_estagio',
    name: 'DevHouse (estágio)',
    type: 'software_house',
    salaryMultiplier: 1.0,
    prestige: 20,
  },
  {
    id: 'startup_local',
    name: 'Nubug Startup',
    type: 'startup',
    salaryMultiplier: 0.85,
    prestige: 40,
  },
  {
    id: 'software_house_sp',
    name: 'Code&Ship SP',
    type: 'software_house',
    salaryMultiplier: 1.0,
    prestige: 50,
  },
  {
    id: 'banco_digital',
    name: 'Banco Pixel',
    type: 'bank',
    salaryMultiplier: 1.35,
    prestige: 65,
  },
  {
    id: 'bigtech_br',
    name: 'MercadoLivre Tech',
    type: 'bigtech',
    salaryMultiplier: 1.6,
    prestige: 80,
  },
  {
    id: 'google',
    name: 'Google',
    type: 'bigtech',
    salaryMultiplier: 2.4,
    prestige: 95,
    minYear: 2018,
  },
  {
    id: 'openai_co',
    name: 'OpenAI',
    type: 'bigtech',
    salaryMultiplier: 2.8,
    prestige: 98,
    minYear: 2023,
  },
  {
    id: 'agencia_web',
    name: 'Agência Deploy',
    type: 'agency',
    salaryMultiplier: 0.9,
    prestige: 35,
  },
  {
    id: 'own_startup',
    name: 'Sua Startup',
    type: 'own',
    salaryMultiplier: 0.5,
    prestige: 70,
  },
];
