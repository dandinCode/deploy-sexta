import { createNewGame, confirmDraft, chooseOption, meetsRequirement } from './index.js';
import { getSeniority } from './seniority/index.js';

/**
 * Estratégia "carreirista": prioriza promoções e opções que sobem atributos,
 * para validar a progressão de senioridade e salários realistas.
 */
function runCareer(seed: number) {
  let state = createNewGame('Carreirista', seed);
  state = confirmDraft(state, state.draftCards.slice(0, 3).map((c) => c.id));

  let turns = 0;
  while (state.status === 'playing' && turns < 600) {
    const ev = state.currentEvent!;
    const available = ev.options.filter((o) => meetsRequirement(state, o.requirements));
    const promo = available.find(
      (o) =>
        o.id === 'accept' ||
        o.id.startsWith('effectivate') ||
        o.id.startsWith('junior') ||
        o.id.startsWith('join_') ||
        o.id === 'accept_promo',
    );
    const mh = state.player.attributes.mentalHealth;
    const scoreOption = (o: (typeof available)[number]) => {
      const attrs = o.effects.attributes ?? {};
      let s = 0;
      for (const [k, v] of Object.entries(attrs)) {
        // Quando a saúde mental está baixa, prioriza recuperá-la fortemente.
        const w = k === 'mentalHealth' ? (mh < 50 ? 4 : 1.5) : 1;
        s += (v ?? 0) * w;
      }
      if (o.effects.fire) s -= 50;
      if (o.effects.endGame) s -= 100;
      return s;
    };
    const best = [...available].sort((a, b) => scoreOption(b) - scoreOption(a))[0]!;
    state = chooseOption(state, (promo ?? best).id);
    turns += 1;
  }

  return {
    seed,
    level: getSeniority(state.player.seniority).short,
    peak: state.career.peakSalary,
    wealth: state.player.wealth,
    months: state.career.monthsPlayed,
    end: state.career.endReason,
  };
}

console.log('seed | nível final | pico salário | patrimônio | meses | fim');
for (const seed of [1, 2, 3, 7, 11, 21, 42, 99, 123, 777]) {
  const r = runCareer(seed);
  console.log(
    `${r.seed} | ${r.level} | ${r.peak} | ${r.wealth} | ${r.months} | ${r.end}`,
  );
}
