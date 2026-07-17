import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { gameService } from '../services/game.service.js';

export async function gameRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ ok: true, service: 'deploy-sexta' }));

  app.get('/meta', async () => gameService.getMeta());

  app.post('/games', async (request, reply) => {
    const body = z
      .object({
        name: z.string().min(1).max(40).optional(),
        seed: z.number().int().optional(),
      })
      .parse(request.body ?? {});

    const game = await gameService.startGame(body.name ?? 'Dev Anônimo', body.seed);
    return reply.code(201).send(game);
  });

  app.get('/games/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const game = await gameService.getGame(id);
    if (!game) return reply.code(404).send({ error: 'Partida não encontrada' });
    return game;
  });

  app.post('/games/:id/draft', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = z
      .object({
        cardIds: z.array(z.string()).length(3),
      })
      .parse(request.body);

    try {
      const game = await gameService.selectDraft(id, body.cardIds);
      return game;
    } catch (err) {
      return reply.code(400).send({
        error: err instanceof Error ? err.message : 'Erro no draft',
      });
    }
  });

  app.post('/games/:id/choose', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = z
      .object({
        optionId: z.string().min(1),
      })
      .parse(request.body);

    try {
      const game = await gameService.choose(id, body.optionId);
      return game;
    } catch (err) {
      return reply.code(400).send({
        error: err instanceof Error ? err.message : 'Erro ao escolher',
      });
    }
  });

  app.get('/ranking', async (request) => {
    const query = z
      .object({
        by: z.enum(['wealth', 'longevity']).default('wealth'),
        limit: z.coerce.number().int().min(1).max(50).default(20),
      })
      .parse(request.query ?? {});

    const entries = await gameService.getRanking(query.by, query.limit);
    return { by: query.by, entries };
  });
}
