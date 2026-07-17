import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RankingBoard } from '@/components/RankingBoard';
import { formatCareerLength, formatMoney } from '@/lib/utils';
import type { GameState, PlayerRanks } from '@/types/game';

interface Props {
  game: GameState;
  ranks?: PlayerRanks | null;
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

export function EndScreen({ game, ranks, onRestart }: Props) {
  const { player, career, score } = game;
  const recent = [...career.timeline].slice(-12).reverse();
  const [showRanking, setShowRanking] = useState(true);
  const [localRanks, setLocalRanks] = useState(ranks);

  useEffect(() => {
    setLocalRanks(ranks);
  }, [ranks]);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <section className="animate-fade-in border border-[var(--border)] bg-[var(--panel)] p-8">
        <div className="mb-2 font-mono text-xs text-[var(--accent)]">FIM DE CARREIRA</div>
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-4xl font-bold">
          {END_LABELS[career.endReason ?? ''] ?? 'Fim'}
        </h2>
        <p className="mb-6 text-[var(--muted)]">
          {player.name} · {formatCareerLength(career.monthsPlayed)} · Score{' '}
          <span className="text-[var(--accent)]">{score ?? 0}</span>
        </p>

        {localRanks && (localRanks.wealth || localRanks.longevity) && (
          <div className="mb-6 border border-[var(--accent)]/40 bg-[var(--accent-dim)] p-3 font-mono text-sm">
            <div className="mb-1 text-xs text-[var(--accent)]">SUA POSIÇÃO MUNDIAL</div>
            {localRanks.wealth != null && (
              <div>#{localRanks.wealth} em patrimônio</div>
            )}
            {localRanks.longevity != null && (
              <div>#{localRanks.longevity} em longevidade</div>
            )}
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4 font-mono text-sm">
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
          <ul className="max-h-48 space-y-2 overflow-y-auto border border-[var(--border)] p-3 font-mono text-xs">
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

        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={onRestart}>
            Nova carreira
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowRanking((v) => !v)}
          >
            {showRanking ? 'Ocultar ranking' : 'Ver ranking'}
          </Button>
        </div>
      </section>

      {showRanking && (
        <RankingBoard highlightGameId={game.id} className="animate-fade-in" />
      )}
    </div>
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
