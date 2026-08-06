import { gameRepository } from "../services/game.repository.js";

export const STALE_GAME_DAYS = Number(15);

export const STALE_GAME_CLEANUP_MS = Number(1440 * 60 * 1000);

export async function cleanupStaleGames(
  olderThanDays = STALE_GAME_DAYS,
): Promise<number> {
  return gameRepository.deleteStaleUnfinished(olderThanDays);
}

/**
 * Roda na subida e depois em intervalo fixo.
 * Retorna o handle do interval para shutdown, se necessário.
 */
export function startStaleGamesCleanupJob(log?: {
  info: (obj: unknown, msg?: string) => void;
  error: (obj: unknown, msg?: string) => void;
}): NodeJS.Timeout {
  const run = async () => {
    try {
      const removed = await cleanupStaleGames();
      log?.info(
        { removed, olderThanDays: STALE_GAME_DAYS },
        "Cleanup de partidas abandonadas",
      );
    } catch (err) {
      log?.error({ err }, "Falha no cleanup de partidas abandonadas");
    }
  };

  void run();
  return setInterval(() => {
    void run();
  }, STALE_GAME_CLEANUP_MS);
}
