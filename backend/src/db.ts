import { PrismaClient } from '@prisma/client';

export const useMemory = process.env.MEMORY_STORE === '1';

export const prisma = useMemory ? null : new PrismaClient();
