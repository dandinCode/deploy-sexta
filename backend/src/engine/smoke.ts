/**
 * Smoke test da engine (sem DB / HTTP).
 * Run: npx tsx src/engine/smoke.ts
 */
import {
  createNewGame,
  confirmDraft,
  chooseOption,
  DEFAULT_CONFIG,
} from './index.js';

const game = createNewGame('Smoke Tester', 42);
console.log('Draft cards:', game.draftCards.map((c) => c.name).join(', '));

const picked = game.draftCards.slice(0, DEFAULT_CONFIG.draft.pick).map((c) => c.id);
let state = confirmDraft(game, picked);
console.log('Status after draft:', state.status);
console.log(
  'First event:',
  state.currentEvent?.title,
  '→ options:',
  state.currentEvent?.options.map((o) => o.id).join(', '),
);

let turns = 0;
while (state.status === 'playing' && turns < 60) {
  const option = state.currentEvent?.options[0];
  if (!option) break;
  state = chooseOption(state, option.id);
  turns += 1;
}

console.log('Turns played:', turns);
console.log('Status:', state.status);
console.log('Year/Month:', state.career.currentYear, state.career.currentMonth);
console.log('Wealth:', state.player.wealth);
console.log('Salary:', state.player.salary);
console.log('End reason:', state.career.endReason);
console.log('Score:', state.score);
console.log('OK');
