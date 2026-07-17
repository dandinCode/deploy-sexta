import type {
  GameState,
  GameStateWithRanking,
  MetaResponse,
  RankingCategory,
  RankingResponse,
} from '../types/game';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? `Erro HTTP ${res.status}`);
  }
  return data as T;
}

export const api = {
  getMeta: () => request<MetaResponse>('/meta'),
  startGame: (name: string) =>
    request<GameState>('/games', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  getGame: (id: string) => request<GameState>(`/games/${id}`),
  selectDraft: (id: string, cardIds: string[]) =>
    request<GameState>(`/games/${id}/draft`, {
      method: 'POST',
      body: JSON.stringify({ cardIds }),
    }),
  chooseOption: (id: string, optionId: string) =>
    request<GameStateWithRanking>(`/games/${id}/choose`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    }),
  getRanking: (by: RankingCategory = 'wealth', limit = 20) =>
    request<RankingResponse>(`/ranking?by=${by}&limit=${limit}`),
};
