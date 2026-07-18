import {
  createNewGame,
  confirmDraft,
  chooseOption,
  meetsRequirement,
} from './index.js';

/**
 * Smoke: verifica que o mesmo evento não se repete em sequência
 * e que reaparece com baixa frequência nas janelas curtas.
 */
function play(seed: number, turns: number) {
  let state = createNewGame('CooldownTest', seed);
  state = confirmDraft(
    state,
    state.draftCards.slice(0, 3).map((c) => c.id),
  );

  const ids: string[] = [];
  let t = 0;
  while (state.status === 'playing' && t < turns) {
    const ev = state.currentEvent!;
    ids.push(ev.id);
    const available = ev.options.filter((o) =>
      meetsRequirement(state, o.requirements),
    );
    const safe =
      available.find((o) => !o.effects.fire && !o.effects.endGame) ??
      available[0]!;
    state = chooseOption(state, safe.id);
    t += 1;
  }
  return ids;
}

const ids = play(42, 80);

let consecutive = 0;
for (let i = 1; i < ids.length; i++) {
  if (ids[i] === ids[i - 1]) consecutive += 1;
}

let shortRepeat = 0;
for (let i = 0; i < ids.length; i++) {
  for (let j = i + 1; j < Math.min(i + 5, ids.length); j++) {
    if (ids[i] === ids[j]) shortRepeat += 1;
  }
}

const unique = new Set(ids).size;
console.log(
  JSON.stringify(
    {
      turns: ids.length,
      uniqueEvents: unique,
      consecutiveRepeats: consecutive,
      repeatsWithin5Months: shortRepeat,
      sample: ids.slice(0, 20),
    },
    null,
    2,
  ),
);

if (consecutive > 0) {
  console.error('FAIL: evento repetiu em sequência');
  process.exit(1);
}
if (shortRepeat > 3) {
  console.error('FAIL: demasiadas repetições em janela de 5 meses');
  process.exit(1);
}
console.log('OK');
