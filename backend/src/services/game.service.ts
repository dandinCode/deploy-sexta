import {
  createNewGame,
  confirmDraft,
  chooseOption,
  getDraftCards,
  DEFAULT_CONFIG,
  ATTRIBUTE_LABELS,
  SKILL_LABELS,
  listAvailableOptions,
  getMarketForYear,
  getCompany,
  getSalaryMultiplier,
  computeSalary,
  MAX_SENIORITY,
} from '../engine/index.js';
import type { EventOption, GameState } from '../engine/types.js';
import { gameRepository } from './game.repository.js';
import { rankingService, type RankingCategory } from './ranking.service.js';

export class GameService {
  async startGame(name: string, seed?: number) {
    const state = createNewGame(name || 'Dev Anônimo', seed);
    await gameRepository.create(state);
    return this.toPublic(state);
  }

  async getGame(id: string) {
    const row = await gameRepository.findById(id);
    if (!row) return null;
    return this.toPublic(row.state as unknown as GameState);
  }

  async selectDraft(id: string, cardIds: string[]) {
    const row = await gameRepository.findById(id);
    if (!row) throw new Error('Partida não encontrada');

    const state = row.state as unknown as GameState;
    const next = confirmDraft(state, cardIds, DEFAULT_CONFIG);
    await gameRepository.save(next);
    return this.toPublic(next);
  }

  async choose(id: string, optionId: string) {
    const row = await gameRepository.findById(id);
    if (!row) throw new Error('Partida não encontrada');

    const state = row.state as unknown as GameState;
    const next = chooseOption(state, optionId, DEFAULT_CONFIG);
    await gameRepository.save(next);

    let ranking = null;
    if (next.status === 'finished') {
      await rankingService.submitFromGame(next);
      ranking = await rankingService.getPlayerRanks(next.id);
    }

    return {
      ...this.toPublic(next),
      ranking,
    };
  }

  async getRanking(category: RankingCategory, limit = 20) {
    return rankingService.list(category, limit);
  }

  getMeta() {
    return {
      cards: getDraftCards(),
      attributes: ATTRIBUTE_LABELS,
      skills: SKILL_LABELS,
      config: DEFAULT_CONFIG,
    };
  }

  private toPublic(state: GameState) {
    const availableOptions = state.currentEvent
      ? listAvailableOptions(state, state.currentEvent).map((opt) =>
          this.enrichOption(state, opt),
        )
      : [];
    const currentCompany = state.player.companyId
      ? getCompany(state.player.companyId) ?? null
      : null;

    return {
      ...state,
      currentCompany,
      currentEvent: state.currentEvent
        ? {
            ...state.currentEvent,
            options: availableOptions,
          }
        : null,
      market: getMarketForYear(state.career.currentYear),
    };
  }

  private enrichOption(state: GameState, opt: EventOption) {
    const companyId = opt.effects.setCompanyId;
    if (typeof companyId !== 'string') return opt;

    const company = getCompany(companyId);
    if (!company) return opt;

    let seniority = state.player.seniority;
    if (opt.effects.promote && seniority < MAX_SENIORITY) {
      seniority += 1;
    }

    const projectedSalary = computeSalary(
      seniority,
      company.salaryMultiplier,
      getSalaryMultiplier(state.career.currentYear),
    );

    return {
      ...opt,
      offeredCompany: {
        id: company.id,
        name: company.name,
        type: company.type,
        prestige: company.prestige,
        salaryMultiplier: company.salaryMultiplier,
      },
      projectedSalary,
    };
  }
}

export const gameService = new GameService();
