import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RankingBoard } from '@/components/RankingBoard';
import { shareResultOnWhatsApp } from '@/lib/share';
import { formatCareerLength, formatMoney } from '@/lib/utils';
import type { GameState, PlayerRanks } from '@/types/game';

interface Props {
  game: GameState;
  ranks?: PlayerRanks | null;
  skillLabels?: Record<string, string>;
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

export function EndScreen({ game, ranks, skillLabels = {}, onRestart }: Props) {
  const { player, career, score } = game;
  const recent = [...career.timeline].slice(-12).reverse();
  const technologies = player.technologiesUsed ?? [];
  const [showRanking, setShowRanking] = useState(true);
  const [localRanks, setLocalRanks] = useState(ranks);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    setLocalRanks(ranks);
  }, [ranks]);

  async function handleWhatsAppShare() {
    if (sharing) return;
    setSharing(true);
    setShareError(null);
    try {
      await shareResultOnWhatsApp(game, localRanks);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível abrir o compartilhamento.';
      setShareError(message);
    } finally {
      setSharing(false);
    }
  }

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

        {localRanks &&
          (localRanks.wealth || localRanks.longevity || localRanks.salary) && (
          <div className="mb-6 border border-[var(--accent)]/40 bg-[var(--accent-dim)] p-3 font-mono text-sm">
            <div className="mb-1 text-xs text-[var(--accent)]">SUA POSIÇÃO MUNDIAL</div>
            {localRanks.wealth != null && (
              <div>#{localRanks.wealth} em patrimônio</div>
            )}
            {localRanks.longevity != null && (
              <div>#{localRanks.longevity} em longevidade</div>
            )}
            {localRanks.salary != null && (
              <div>#{localRanks.salary} em maior salário</div>
            )}
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4 font-mono text-sm">
          <Metric label="Maior salário" value={formatMoney(career.peakSalary)} />
          <Metric label="Patrimônio" value={formatMoney(player.wealth)} />
          <Metric label="Empresas" value={`${player.companyHistory.length}`} />
          <Metric label="Projetos" value={`${player.projects.length}`} />
          <Metric label="Tecnologias" value={`${technologies.length}`} />
        </div>

        {technologies.length > 0 && (
          <div className="mb-8">
            <div className="mb-2 font-mono text-xs text-[var(--accent)]">
              TECNOLOGIAS DA CARREIRA
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="border border-[var(--border)] bg-[var(--bg)] px-2 py-1 font-mono text-xs"
                >
                  {skillLabels[technology] ?? technology}
                </span>
              ))}
            </div>
          </div>
        )}

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

        <div className="mb-6">
          <button
            type="button"
            disabled={sharing}
            onClick={() => void handleWhatsAppShare()}
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#25D366] px-5 font-mono text-sm font-semibold text-[#05301a] shadow-[0_0_24px_rgba(37,211,102,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_32px_rgba(37,211,102,0.5)] disabled:opacity-60"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#128C7E] text-white transition-transform group-hover:scale-105">
              <WhatsAppIcon className="h-4 w-4" />
            </span>
            {sharing ? 'Gerando imagem...' : 'Encaminhar no WhatsApp'}
          </button>
          {shareError && (
            <p className="mt-3 max-w-md font-mono text-xs text-[var(--danger)]">
              {shareError}
            </p>
          )}
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}
