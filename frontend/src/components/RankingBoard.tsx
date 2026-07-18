import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { cn, formatCareerLength, formatMoney } from '@/lib/utils';
import type { RankingCategory, RankingEntry } from '@/types/game';

interface Props {
  highlightGameId?: string;
  compact?: boolean;
  className?: string;
}

export function RankingBoard({ highlightGameId, compact = false, className }: Props) {
  const [by, setBy] = useState<RankingCategory>('wealth');
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void api
      .getRanking(by, compact ? 10 : 20)
      .then((res) => {
        if (!cancelled) setEntries(res.entries);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar ranking');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [by, compact]);

  return (
    <section
      className={cn(
        'border border-[var(--border)] bg-[var(--panel)] p-4 md:p-6',
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-xs tracking-widest text-[var(--accent)]">
            RANKING MUNDIAL
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
            Hall da fama
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={by === 'wealth' ? 'default' : 'outline'}
            onClick={() => setBy('wealth')}
          >
            Patrimônio
          </Button>
          <Button
            size="sm"
            variant={by === 'longevity' ? 'default' : 'outline'}
            onClick={() => setBy('longevity')}
          >
            Longevidade
          </Button>
          <Button
            size="sm"
            variant={by === 'salary' ? 'default' : 'outline'}
            onClick={() => setBy('salary')}
          >
            Maior salário
          </Button>
        </div>
      </div>

      {loading && (
        <p className="font-mono text-sm text-[var(--muted)]">Carregando...</p>
      )}
      {error && (
        <p className="font-mono text-sm text-[var(--danger)]">{error}</p>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="font-mono text-sm text-[var(--muted)]">
          Ninguém no ranking ainda. Seja o primeiro.
        </p>
      )}

      {!loading && entries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
                <th className="pb-2 pr-3 font-normal">#</th>
                <th className="pb-2 pr-3 font-normal">Dev</th>
                <th className="pb-2 pr-3 font-normal">
                  {by === 'wealth'
                    ? 'Patrimônio'
                    : by === 'salary'
                      ? 'Maior salário'
                      : 'Carreira'}
                </th>
                <th className="pb-2 pr-3 font-normal">
                  {by === 'longevity' ? 'Patrimônio' : 'Duração'}
                </th>
                <th className="pb-2 font-normal">Score</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const highlight = entry.gameId === highlightGameId;
                return (
                  <tr
                    key={entry.id}
                    className={cn(
                      'border-b border-[var(--border)]/60',
                      highlight && 'bg-[var(--accent-dim)] text-[var(--accent)]',
                    )}
                  >
                    <td className="py-2.5 pr-3">{entry.rank}</td>
                    <td className="max-w-[140px] truncate py-2.5 pr-3">
                      {entry.playerName}
                    </td>
                    <td className="py-2.5 pr-3">
                      {by === 'wealth'
                        ? formatMoney(entry.wealth)
                        : by === 'salary'
                          ? formatMoney(entry.peakSalary)
                          : formatCareerLength(entry.monthsPlayed)}
                    </td>
                    <td className="py-2.5 pr-3 text-[var(--muted)]">
                      {by === 'longevity'
                        ? formatMoney(entry.wealth)
                        : formatCareerLength(entry.monthsPlayed)}
                    </td>
                    <td className="py-2.5">{entry.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
