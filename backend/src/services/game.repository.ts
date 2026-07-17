import { Prisma, PrismaClient } from '@prisma/client';
import type { GameState } from '../engine/types.js';
import { prisma, useMemory } from '../db.js';

type StoredGame = {
  id: string;
  state: GameState;
  status: 'DRAFT' | 'PLAYING' | 'FINISHED';
  score: number | null;
};

const memory = new Map<string, StoredGame>();

export class GameRepository {
  async create(state: GameState) {
    const row: StoredGame = {
      id: state.id,
      state,
      status: mapStatus(state.status),
      score: state.score,
    };

    if (useMemory || !prisma) {
      memory.set(state.id, row);
      return row;
    }

    return prisma.game.create({
      data: {
        id: state.id,
        state: state as unknown as Prisma.InputJsonValue,
        status: mapStatus(state.status),
        score: state.score,
      },
    });
  }

  async findById(id: string) {
    if (useMemory || !prisma) {
      return memory.get(id) ?? null;
    }
    return prisma.game.findUnique({ where: { id } });
  }

  async save(state: GameState) {
    const row: StoredGame = {
      id: state.id,
      state,
      status: mapStatus(state.status),
      score: state.score,
    };

    if (useMemory || !prisma) {
      memory.set(state.id, row);
      return row;
    }

    return (prisma as PrismaClient).game.update({
      where: { id: state.id },
      data: {
        state: state as unknown as Prisma.InputJsonValue,
        status: mapStatus(state.status),
        score: state.score,
      },
    });
  }
}

function mapStatus(status: GameState['status']) {
  switch (status) {
    case 'draft':
      return 'DRAFT' as const;
    case 'playing':
      return 'PLAYING' as const;
    case 'finished':
      return 'FINISHED' as const;
  }
}

export const gameRepository = new GameRepository();
