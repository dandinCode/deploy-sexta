import Fastify from 'fastify';
import cors from '@fastify/cors';
import { gameRoutes } from './routes/game.routes.js';
import { registerClientIdentity } from './plugins/client-identity.js';

export async function buildApp() {
  const app = Fastify({
    logger: true,
    trustProxy: true,
  });

  await app.register(cors, {
    origin: true,
    allowedHeaders: ['Content-Type', 'X-Device-Id'],
  });

  await registerClientIdentity(app);
  await app.register(gameRoutes, { prefix: '/api' });

  return app;
}
