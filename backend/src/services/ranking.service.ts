import type { GameState } from '../engine/types.js';
import { prisma, useMemory } from '../db.js';

export type RankingCategory = 'wealth' | 'longevity';

export interface RankingEntry {
  id: string;
  gameId: string;
  playerName: string;
  wealth: number;
  monthsPlayed: number;
  peakSalary: number;
  score: number;
  endReason: string;
  createdAt: string;
  rank: number;
}

type MemoryEntry = Omit<RankingEntry, 'rank' | 'createdAt'> & {
  createdAt: Date;
};

const memoryEntries: MemoryEntry[] = [];

export class RankingService {
  async submitFromGame(state: GameState): Promise<RankingEntry | null> {
    if (state.status !== 'finished') return null;

    const payload = {
      gameId: state.id,
      playerName: state.player.name.slice(0, 40) || 'Dev Anônimo',
      wealth: Math.round(state.player.wealth),
      monthsPlayed: state.career.monthsPlayed,
      peakSalary: Math.round(state.career.peakSalary),
      score: state.score ?? 0,
      endReason: state.career.endReason ?? 'unknown',
    };

    if (useMemory || !prisma) {
      const existing = memoryEntries.find((e) => e.gameId === payload.gameId);
      if (existing) {
        return this.withRank(existing);
      }
      const entry: MemoryEntry = {
        id: crypto.randomUUID(),
        ...payload,
        createdAt: new Date(),
      };
      memoryEntries.push(entry);
      return this.withRank(entry);
    }

    const existing = await prisma.leaderboardEntry.findUnique({
      where: { gameId: payload.gameId },
    });
    if (existing) {
      return this.withRank(existing);
    }

    // Game row must exist for FK — ensure it does (create if memory→db edge case skipped)
    const game = await prisma.game.findUnique({ where: { id: payload.gameId } });
    if (!game) {
      await prisma.game.create({
        data: {
          id: payload.gameId,
          state: state as unknown as import('@prisma/client').Prisma.InputJsonValue,
          status: 'FINISHED',
          score: payload.score,
        },
      });
    }

    const created = await prisma.leaderboardEntry.create({ data: payload });
    return this.withRank(created);
  }

  async list(category: RankingCategory, limit = 20): Promise<RankingEntry[]> {
    const take = Math.min(Math.max(limit, 1), 50);

    if (useMemory || !prisma) {
      const sorted = [...memoryEntries].sort((a, b) => {
        if (category === 'wealth') {
          if (b.wealth !== a.wealth) return b.wealth - a.wealth;
          return b.score - a.score;
        }
        if (b.monthsPlayed !== a.monthsPlayed) return b.monthsPlayed - a.monthsPlayed;
        return b.wealth - a.wealth;
      });
      return sorted.slice(0, take).map((entry, i) => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
        rank: i + 1,
      }));
    }

    const orderBy =
      category === 'wealth'
        ? [{ wealth: 'desc' as const }, { score: 'desc' as const }]
        : [{ monthsPlayed: 'desc' as const }, { wealth: 'desc' as const }];

    const rows = await prisma.leaderboardEntry.findMany({
      orderBy,
      take,
    });

    return rows.map((row, i) => ({
      id: row.id,
      gameId: row.gameId,
      playerName: row.playerName,
      wealth: row.wealth,
      monthsPlayed: row.monthsPlayed,
      peakSalary: row.peakSalary,
      score: row.score,
      endReason: row.endReason,
      createdAt: row.createdAt.toISOString(),
      rank: i + 1,
    }));
  }

  async getPlayerRanks(gameId: string): Promise<{
    wealth: number | null;
    longevity: number | null;
  }> {
    if (useMemory || !prisma) {
      const entry = memoryEntries.find((e) => e.gameId === gameId);
      if (!entry) return { wealth: null, longevity: null };

      const byWealth = [...memoryEntries].sort((a, b) => b.wealth - a.wealth);
      const byLongevity = [...memoryEntries].sort(
        (a, b) => b.monthsPlayed - a.monthsPlayed,
      );

      return {
        wealth: byWealth.findIndex((e) => e.gameId === gameId) + 1 || null,
        longevity: byLongevity.findIndex((e) => e.gameId === gameId) + 1 || null,
      };
    }

    const entry = await prisma.leaderboardEntry.findUnique({
      where: { gameId },
    });
    if (!entry) return { wealth: null, longevity: null };

    const richer = await prisma.leaderboardEntry.count({
      where: {
        OR: [
          { wealth: { gt: entry.wealth } },
          { wealth: entry.wealth, score: { gt: entry.score } },
        ],
      },
    });

    const longer = await prisma.leaderboardEntry.count({
      where: {
        OR: [
          { monthsPlayed: { gt: entry.monthsPlayed } },
          {
            monthsPlayed: entry.monthsPlayed,
            wealth: { gt: entry.wealth },
          },
        ],
      },
    });

    return {
      wealth: richer + 1,
      longevity: longer + 1,
    };
  }

  private withRank(entry: {
    id: string;
    gameId: string;
    playerName: string;
    wealth: number;
    monthsPlayed: number;
    peakSalary: number;
    score: number;
    endReason: string;
    createdAt: Date;
  }): RankingEntry {
    return {
      id: entry.id,
      gameId: entry.gameId,
      playerName: entry.playerName,
      wealth: entry.wealth,
      monthsPlayed: entry.monthsPlayed,
      peakSalary: entry.peakSalary,
      score: entry.score,
      endReason: entry.endReason,
      createdAt: entry.createdAt.toISOString(),
      rank: 0,
    };
  }
}

export const rankingService = new RankingService();
