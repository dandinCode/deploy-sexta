import {
  createNewGame,
  confirmDraft,
  chooseOption,
  meetsRequirement,
  getEventById,
  EVENT_GROUP_HARD_COOLDOWN,
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

let consecutive = 0;
let shortRepeat = 0;
let thematicRepeat = 0;
let totalTurns = 0;
const allIds = new Set<string>();

for (const seed of [1, 2, 3, 7, 11, 21, 42, 99, 123, 777]) {
  const ids = play(seed, 100);
  totalTurns += ids.length;
  ids.forEach((id) => allIds.add(id));

  for (let i = 1; i < ids.length; i++) {
    if (ids[i] === ids[i - 1]) consecutive += 1;
  }

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < Math.min(i + 5, ids.length); j++) {
      if (ids[i] === ids[j]) shortRepeat += 1;
    }

    const group = getEventById(ids[i]!)?.cooldownGroup;
    if (!group) continue;
    for (
      let j = i + 1;
      j <= Math.min(i + EVENT_GROUP_HARD_COOLDOWN, ids.length - 1);
      j++
    ) {
      if (getEventById(ids[j]!)?.cooldownGroup === group) {
        thematicRepeat += 1;
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      turns: totalTurns,
      uniqueEvents: allIds.size,
      consecutiveRepeats: consecutive,
      repeatsWithin5Months: shortRepeat,
      thematicRepeatsInsideCooldown: thematicRepeat,
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
if (thematicRepeat > 0) {
  console.error('FAIL: eventos do mesmo tema apareceram dentro do cooldown');
  process.exit(1);
}
console.log('OK');
