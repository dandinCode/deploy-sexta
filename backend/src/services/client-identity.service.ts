import type { FastifyRequest } from 'fastify';
import { prisma, useMemory } from '../db.js';

type DeviceRecord = {
  deviceId: string;
  lastIp: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  requestCount: number;
};

const memoryDevices = new Map<string, DeviceRecord>();
const memoryBannedIps = new Set<string>();

export function getClientIp(request: FastifyRequest): string {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]!.trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0]!.split(',')[0]!.trim();
  }
  return request.ip || '0.0.0.0';
}

export function getDeviceIdHeader(request: FastifyRequest): string | null {
  const raw = request.headers['x-device-id'];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, 80);
  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(trimmed)) return null;
  return trimmed;
}

export class ClientIdentityService {
  async isIpBanned(ip: string): Promise<boolean> {
    if (useMemory || !prisma) {
      return memoryBannedIps.has(ip);
    }
    const row = await prisma.bannedIp.findUnique({ where: { ip } });
    return !!row;
  }

  /** Registra/atualiza aparelho + IP (para contar usuários únicos no banco). */
  async touch(deviceId: string | null, ip: string) {
    if (!deviceId) return;

    if (useMemory || !prisma) {
      const existing = memoryDevices.get(deviceId);
      const now = new Date();
      if (existing) {
        existing.lastIp = ip;
        existing.lastSeenAt = now;
        existing.requestCount += 1;
      } else {
        memoryDevices.set(deviceId, {
          deviceId,
          lastIp: ip,
          firstSeenAt: now,
          lastSeenAt: now,
          requestCount: 1,
        });
      }
      return;
    }

    await prisma.clientDevice.upsert({
      where: { deviceId },
      create: {
        deviceId,
        lastIp: ip,
        requestCount: 1,
      },
      update: {
        lastIp: ip,
        requestCount: { increment: 1 },
      },
    });
  }
}

export const clientIdentityService = new ClientIdentityService();
