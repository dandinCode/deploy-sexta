import { prisma, useMemory } from '../db.js';

export type FeedbackEntry = {
  id: string;
  authorName: string;
  message: string;
  gameId: string | null;
  createdAt: string;
};

export type CreateFeedbackInput = {
  authorName: string;
  message: string;
  gameId?: string | null;
  deviceId?: string | null;
  clientIp?: string | null;
};

type MemoryFeedback = {
  id: string;
  authorName: string;
  message: string;
  gameId: string | null;
  deviceId: string | null;
  clientIp: string | null;
  createdAt: Date;
};

const memoryFeedbacks: MemoryFeedback[] = [];

function toPublic(entry: {
  id: string;
  authorName: string;
  message: string;
  gameId: string | null;
  createdAt: Date;
}): FeedbackEntry {
  return {
    id: entry.id,
    authorName: entry.authorName,
    message: entry.message,
    gameId: entry.gameId,
    createdAt: entry.createdAt.toISOString(),
  };
}

export class FeedbackService {
  async create(input: CreateFeedbackInput): Promise<FeedbackEntry> {
    const authorName = input.authorName.trim().slice(0, 40) || 'Anônimo';
    const message = input.message.trim().slice(0, 1000);
    if (!message) {
      throw new Error('Mensagem obrigatória');
    }

    if (useMemory || !prisma) {
      const entry: MemoryFeedback = {
        id: crypto.randomUUID(),
        authorName,
        message,
        gameId: input.gameId ?? null,
        deviceId: input.deviceId ?? null,
        clientIp: input.clientIp ?? null,
        createdAt: new Date(),
      };
      memoryFeedbacks.unshift(entry);
      return toPublic(entry);
    }

    const created = await prisma.feedback.create({
      data: {
        authorName,
        message,
        gameId: input.gameId ?? null,
        deviceId: input.deviceId ?? null,
        clientIp: input.clientIp ?? null,
      },
    });

    return toPublic(created);
  }

  async list(limit = 50): Promise<FeedbackEntry[]> {
    const take = Math.min(Math.max(limit, 1), 100);

    if (useMemory || !prisma) {
      return memoryFeedbacks.slice(0, take).map(toPublic);
    }

    const rows = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      take,
    });

    return rows.map(toPublic);
  }
}

export const feedbackService = new FeedbackService();
