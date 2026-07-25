import type { FastifyInstance } from 'fastify';
import {
  clientIdentityService,
  getClientIp,
  getDeviceIdHeader,
} from '../services/client-identity.service.js';

export async function registerClientIdentity(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    const path = request.url.split('?')[0] ?? '';
    if (!path.startsWith('/api') || path === '/api/health') return;

    const ip = getClientIp(request);
    const deviceId = getDeviceIdHeader(request);

    if (await clientIdentityService.isIpBanned(ip)) {
      return reply.code(403).send({ error: 'Acesso bloqueado' });
    }

    await clientIdentityService.touch(deviceId, ip);
  });
}
