import Fastify from 'fastify';
import cors from '@fastify/cors';
import { gameRoutes } from './routes/game.routes.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  await app.register(gameRoutes, { prefix: '/api' });

  return app;
}
