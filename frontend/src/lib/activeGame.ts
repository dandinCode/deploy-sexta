const ACTIVE_GAME_KEY = 'ds_active_game_id';

export function getActiveGameId(): string | null {
  try {
    const id = localStorage.getItem(ACTIVE_GAME_KEY);
    if (!id || id.length < 8) return null;
    return id;
  } catch {
    return null;
  }
}

export function setActiveGameId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_GAME_KEY, id);
  } catch {
  }
}

export function clearActiveGameId(): void {
  try {
    localStorage.removeItem(ACTIVE_GAME_KEY);
  } catch {
  }
}
