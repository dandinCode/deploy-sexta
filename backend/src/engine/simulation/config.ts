import type { SimulationConfig } from '../types.js';

export const DEFAULT_CONFIG: SimulationConfig = {
  startYear: 2016,
  startAge: 22,
  retirementAge: 40,
  draft: {
    offered: 8,
    pick: 3,
  },
  baseSalary: 3200,
  startingWealth: 2000,
};
