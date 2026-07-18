import type { SimulationConfig } from '../types.js';

export const DEFAULT_CONFIG: SimulationConfig = {
  startYear: 2016,
  startAge: 20,
  retirementAge: 60,
  draft: {
    offered: 8,
    pick: 3,
  },
  startingWealth: 500,
  startCompanyId: 'primeiro_estagio',
};
