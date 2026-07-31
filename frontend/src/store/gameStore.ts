import { create } from 'zustand';
import { api } from '../api/client';
import {
  clearActiveGameId,
  getActiveGameId,
  setActiveGameId,
} from '../lib/activeGame';
import type { GameState, MetaResponse, PlayerRanks } from '../types/game';

interface GameStore {
  game: GameState | null;
  meta: MetaResponse | null;
  selectedCards: string[];
  loading: boolean;
  booting: boolean;
  error: string | null;
  playerRanks: PlayerRanks | null;
  loadMeta: () => Promise<void>;
  resumeActiveGame: () => Promise<void>;
  startGame: (name: string) => Promise<void>;
  toggleCard: (id: string) => void;
  confirmDraft: () => Promise<void>;
  choose: (optionId: string) => Promise<void>;
  reset: () => void;
}

function persistActiveGame(game: GameState) {
  if (game.status === 'draft' || game.status === 'playing') {
    setActiveGameId(game.id);
    return;
  }
  clearActiveGameId();
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  meta: null,
  selectedCards: [],
  loading: false,
  booting: true,
  error: null,
  playerRanks: null,

  loadMeta: async () => {
    try {
      const meta = await api.getMeta();
      set({ meta });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Falha ao carregar meta' });
    }
  },

  resumeActiveGame: async () => {
    const activeId = getActiveGameId();
    if (!activeId) {
      set({ booting: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const game = await api.getGame(activeId);
      if (game.status === 'finished') {
        clearActiveGameId();
        set({ game: null, loading: false, booting: false, playerRanks: null });
        return;
      }
      persistActiveGame(game);
      set({
        game,
        selectedCards: [],
        loading: false,
        booting: false,
        playerRanks: null,
      });
    } catch {
      clearActiveGameId();
      set({ game: null, loading: false, booting: false });
    }
  },

  startGame: async (name: string) => {
    set({ loading: true, error: null, selectedCards: [], playerRanks: null });
    try {
      const game = await api.startGame(name);
      persistActiveGame(game);
      set({ game, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Falha ao iniciar',
      });
    }
  },

  toggleCard: (id: string) => {
    const pickLimit = get().meta?.config.draft.pick ?? 3;
    const current = get().selectedCards;
    if (current.includes(id)) {
      set({ selectedCards: current.filter((c) => c !== id) });
      return;
    }
    if (current.length >= pickLimit) return;
    set({ selectedCards: [...current, id] });
  },

  confirmDraft: async () => {
    const { game, selectedCards, meta } = get();
    if (!game) return;
    const pick = meta?.config.draft.pick ?? 3;
    if (selectedCards.length !== pick) {
      set({ error: `Selecione exatamente ${pick} cartas` });
      return;
    }
    set({ loading: true, error: null });
    try {
      const next = await api.selectDraft(game.id, selectedCards);
      persistActiveGame(next);
      set({ game: next, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Falha no draft',
      });
    }
  },

  choose: async (optionId: string) => {
    const { game } = get();
    if (!game) return;
    set({ loading: true, error: null });
    try {
      const next = await api.chooseOption(game.id, optionId);
      const { ranking, ...gameState } = next;
      persistActiveGame(gameState);
      set({
        game: gameState,
        playerRanks: ranking ?? null,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Falha na escolha',
      });
    }
  },

  reset: () => {
    clearActiveGameId();
    set({ game: null, selectedCards: [], error: null, playerRanks: null });
  },
}));
