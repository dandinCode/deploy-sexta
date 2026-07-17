import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/utils';
import type { GameState } from '@/types/game';

interface Props {
  game: GameState;
  onRestart: () => void;
}

const END_LABELS: Record<string, string> = {
  retirement: 'Aposentadoria',
  burnout: 'Burnout',
  bankruptcy: 'Falência',
  company_sale: 'Venda da empresa',
  billionaire: 'Bilionário',
  death: 'Fim inesperado',
};

export function EndScreen({ game, onRestart }: Props) {
  const { player, career, score } = game;
  const recent = [...career.timeline].slice(-12).reverse();

  return (
    <section className="animate-fade-in mx-auto max-w-3xl border border-[var(--border)] bg-[var(--panel)] p-8">
      <div className="mb-2 font-mono text-xs text-[var(--accent)]">FIM DE CARREIRA</div>
      <h2 className="mb-2 font-[family-name:var(--font-display)] text-4xl font-bold">
        {END_LABELS[career.endReason ?? ''] ?? 'Fim'}
      </h2>
      <p className="mb-8 text-[var(--muted)]">
        {player.name} · {career.monthsPlayed} meses · Score{' '}
        <span className="text-[var(--accent)]">{score ?? 0}</span>
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 font-mono text-sm md:grid-cols-4">
        <Metric label="Maior salário" value={formatMoney(career.peakSalary)} />
        <Metric label="Patrimônio" value={formatMoney(player.wealth)} />
        <Metric label="Empresas" value={`${player.companyHistory.length}`} />
        <Metric label="Projetos" value={`${player.projects.length}`} />
      </div>

      {player.achievements.length > 0 && (
        <div className="mb-8">
          <div className="mb-2 font-mono text-xs text-[var(--accent)]">CONQUISTAS</div>
          <div className="flex flex-wrap gap-2">
            {player.achievements.map((a) => (
              <span
                key={a}
                className="border border-[var(--border)] px-2 py-1 font-mono text-xs"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="mb-2 font-mono text-xs text-[var(--accent)]">TIMELINE</div>
        <ul className="max-h-64 space-y-2 overflow-y-auto border border-[var(--border)] p-3 font-mono text-xs">
          {recent.map((t, i) => (
            <li key={`${t.year}-${t.month}-${i}`} className="text-[var(--muted)]">
              <span className="text-[var(--text)]">
                {t.month}/{t.year}
              </span>{' '}
              — {t.title}: {t.description}
            </li>
          ))}
        </ul>
      </div>

      <Button size="lg" onClick={onRestart}>
        Nova carreira
      </Button>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--border)] p-3">
      <div className="text-[10px] text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-[var(--text)]">{value}</div>
    </div>
  );
}
