import { buildApp } from './app.js';
import { startStaleGamesCleanupJob } from './jobs/cleanup-stale-games.js';

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '0.0.0.0';

const app = await buildApp();

try {
  await app.listen({ port, host });
  console.log(`Deploy Sexta API on http://${host}:${port}`);
  startStaleGamesCleanupJob(app.log);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
