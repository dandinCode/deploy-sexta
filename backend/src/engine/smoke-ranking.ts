import { createNewGame, confirmDraft, chooseOption } from './index.js';
import { rankingService } from '../services/ranking.service.js';

let state = createNewGame('Rico Dev', 99);
state = confirmDraft(
  state,
  state.draftCards.slice(0, 3).map((c) => c.id),
);

let turns = 0;
while (state.status === 'playing' && turns < 80) {
  const opt = state.currentEvent?.options[0];
  if (!opt) break;
  state = chooseOption(state, opt.id);
  turns += 1;
}

await rankingService.submitFromGame(state);
const wealth = await rankingService.list('wealth');
const longevity = await rankingService.list('longevity');
const ranks = await rankingService.getPlayerRanks(state.id);

console.log(
  JSON.stringify(
    {
      status: state.status,
      wealth: state.player.wealth,
      months: state.career.monthsPlayed,
      topWealth: wealth[0]?.playerName,
      topLongevity: longevity[0]?.playerName,
      ranks,
    },
    null,
    2,
  ),
);
