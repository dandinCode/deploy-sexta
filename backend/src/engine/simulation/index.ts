import type {
  Effect,
  EndReason,
  GameState,
  PersonalityCard,
  SimulationConfig,
} from '../types.js';
import { createCareer, advanceMonth, addTimelineEntry, markCareerEnd, updatePeakSalary } from '../career/index.js';
import { createPlayerFromDraft, monthlyPassiveTick } from '../player/index.js';
import { applyAttributeDelta, applySkillDelta } from '../player/attributes.js';
import { createRng } from '../random/index.js';
import { selectEvent, getEventById, listAvailableOptions, meetsRequirement } from '../events/index.js';
import { joinCompany, getCompany } from '../companies/index.js';
import { addProject } from '../projects/index.js';
import { getSalaryMultiplier } from '../market/index.js';
import { personalityCards } from '../../data/cards/catalog.js';
import { DEFAULT_CONFIG } from './config.js';
import { calculateScore } from './score.js';

export function createNewGame(
  name: string,
  seed = Date.now(),
  config: SimulationConfig = DEFAULT_CONFIG,
): GameState {
  const rng = createRng(seed);
  const draftCards = rng.shuffle(personalityCards).slice(0, config.draft.offered);

  return {
    id: crypto.randomUUID(),
    seed,
    status: 'draft',
    player: createPlayerFromDraft(name, [], config),
    career: createCareer(config.startYear),
    draftCards,
    selectedDraftIds: [],
    currentEvent: null,
    score: null,
    rngCursor: 0,
  };
}

export function confirmDraft(
  state: GameState,
  selectedIds: string[],
  config: SimulationConfig = DEFAULT_CONFIG,
): GameState {
  if (state.status !== 'draft') {
    throw new Error('Draft já finalizado');
  }
  if (selectedIds.length !== config.draft.pick) {
    throw new Error(`Selecione exatamente ${config.draft.pick} cartas`);
  }

  const selected = selectedIds.map((id) => {
    const card = state.draftCards.find((c) => c.id === id);
    if (!card) throw new Error(`Carta inválida: ${id}`);
    return card;
  });

  const player = createPlayerFromDraft(state.player.name, selected, config);
  let next: GameState = {
    ...state,
    status: 'playing',
    player,
    selectedDraftIds: selectedIds,
  };

  next = beginMonth(next);
  return next;
}

export function beginMonth(state: GameState): GameState {
  if (state.status !== 'playing') return state;

  const rng = createRng(state.seed + state.career.monthsPlayed * 9973);
  const event = selectEvent(state, rng);

  return {
    ...state,
    currentEvent: event,
    rngCursor: state.rngCursor + 1,
  };
}

export function chooseOption(
  state: GameState,
  optionId: string,
  config: SimulationConfig = DEFAULT_CONFIG,
): GameState {
  if (state.status !== 'playing') {
    throw new Error('Partida não está em andamento');
  }
  if (!state.currentEvent) {
    throw new Error('Nenhum evento ativo');
  }

  const event = getEventById(state.currentEvent.id) ?? state.currentEvent;
  const option = event.options.find((o) => o.id === optionId);
  if (!option) {
    throw new Error('Opção inválida');
  }
  if (!meetsRequirement(state, option.requirements)) {
    throw new Error('Requisitos da opção não atendidos');
  }

  let next = applyEffect(state, option.effects, event.title, option.label);

  // Check end conditions before advancing
  const endReason = detectEndReason(next, config);
  if (endReason) {
    return finishGame(next, endReason);
  }

  next = tickMonth(next, config);

  const afterTickEnd = detectEndReason(next, config);
  if (afterTickEnd) {
    return finishGame(next, afterTickEnd);
  }

  return beginMonth(next);
}

function applyEffect(
  state: GameState,
  effect: Effect,
  eventTitle: string,
  optionLabel: string,
): GameState {
  let player = { ...state.player };
  let career = { ...state.career };

  player = {
    ...player,
    attributes: applyAttributeDelta(player.attributes, effect.attributes),
    skills: applySkillDelta(player.skills, effect.skills),
  };

  if (effect.wealth) player.wealth += effect.wealth;
  if (effect.salary) player.salary = Math.max(0, player.salary + effect.salary);
  if (effect.setCareerPath) player.careerPath = effect.setCareerPath;

  if (effect.setCompanyId !== undefined) {
    if (effect.setCompanyId === null) {
      player.companyId = null;
    } else {
      player = joinCompany(player, effect.setCompanyId);
      const company = getCompany(effect.setCompanyId);
      if (company) {
        const marketMul = getSalaryMultiplier(career.currentYear);
        player.salary = Math.round(
          Math.max(player.salary, 3500) * company.salaryMultiplier * (marketMul / 1.0),
        );
      }
    }
  }

  if (effect.addCompanyHistory) {
    if (!player.companyHistory.includes(effect.addCompanyHistory)) {
      player.companyHistory = [...player.companyHistory, effect.addCompanyHistory];
    }
  }

  if (effect.addProject) {
    player = addProject(player, effect.addProject);
  }

  if (effect.addAchievement) {
    if (!player.achievements.includes(effect.addAchievement)) {
      player.achievements = [...player.achievements, effect.addAchievement];
    }
  }

  if (effect.promote) {
    player.title = promoteTitle(player.title);
    player.salary = Math.round(player.salary * 1.25);
    player.attributes = applyAttributeDelta(player.attributes, {
      reputation: 5,
      leadership: 3,
    });
  }

  if (effect.fire) {
    player.companyId = null;
    player.salary = Math.round(player.salary * 0.4);
    player.attributes = applyAttributeDelta(player.attributes, {
      mentalHealth: -10,
      reputation: -5,
    });
  }

  career = addTimelineEntry(career, {
    title: eventTitle,
    description: optionLabel,
    type: 'event',
  });

  if (effect.addTimelineNote) {
    career = addTimelineEntry(career, {
      title: effect.addTimelineNote,
      description: optionLabel,
      type: 'milestone',
    });
  }

  career = updatePeakSalary(career, player.salary);

  if (effect.endGame) {
    career = markCareerEnd(career, effect.endGame);
  }

  return {
    ...state,
    player,
    career,
    currentEvent: null,
  };
}

function tickMonth(state: GameState, config: SimulationConfig): GameState {
  let player = monthlyPassiveTick(state.player);
  let career = advanceMonth(state.career);

  // Age up every January
  if (career.currentMonth === 1 && career.monthsPlayed > 0) {
    player = { ...player, age: player.age + 1 };
  }

  // Soft market salary drift
  const marketMul = getSalaryMultiplier(career.currentYear);
  if (player.companyId && career.currentMonth === 1) {
    player = {
      ...player,
      salary: Math.round(player.salary * (0.98 + marketMul * 0.02)),
    };
  }

  career = updatePeakSalary(career, player.salary);

  return { ...state, player, career };
}

function detectEndReason(
  state: GameState,
  config: SimulationConfig,
): EndReason | null {
  if (state.career.endReason) return state.career.endReason;
  if (state.player.age >= config.retirementAge) return 'retirement';
  if (state.player.attributes.mentalHealth <= 0) return 'burnout';
  if (state.player.wealth < -50000) return 'bankruptcy';
  if (state.player.wealth >= 1_000_000_000) return 'billionaire';
  return null;
}

function finishGame(state: GameState, reason: EndReason): GameState {
  const career = markCareerEnd(
    addTimelineEntry(state.career, {
      title: endReasonLabel(reason),
      description: 'Fim da carreira.',
      type: 'milestone',
    }),
    reason,
  );

  const finished: GameState = {
    ...state,
    status: 'finished',
    career,
    currentEvent: null,
    score: null,
  };

  return {
    ...finished,
    score: calculateScore(finished),
  };
}

function promoteTitle(current: string): string {
  const ladder = [
    'Júnior em potencial',
    'Desenvolvedor Júnior',
    'Desenvolvedor Pleno',
    'Desenvolvedor Sênior',
    'Tech Lead',
    'Staff Engineer',
    'Principal Engineer',
    'CTO',
  ];
  const idx = ladder.indexOf(current);
  if (idx === -1 || idx === ladder.length - 1) return current;
  return ladder[idx + 1]!;
}

function endReasonLabel(reason: EndReason): string {
  const labels: Record<EndReason, string> = {
    retirement: 'Aposentadoria',
    burnout: 'Burnout total',
    bankruptcy: 'Falência',
    company_sale: 'Venda da empresa',
    billionaire: 'Bilionário',
    death: 'Fim inesperado',
  };
  return labels[reason];
}

export function getDraftCards(): PersonalityCard[] {
  return personalityCards;
}

export { DEFAULT_CONFIG };
