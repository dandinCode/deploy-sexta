import { formatMoney } from '@/lib/utils';
import type { GameState } from '@/types/game';

interface Props {
  game: GameState;
}

export function StatusBar({ game }: Props) {
  const { player, career, market } = game;

  return (
    <aside className="flex flex-col gap-4 border border-[var(--border)] bg-[var(--panel)] p-4">
      <div>
        <div className="font-[family-name:var(--font-display)] text-xl font-bold">
          {player.name}
        </div>
        <div className="font-mono text-xs text-[var(--muted)]">{player.title}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <Stat label="Idade" value={`${player.age}`} />
        <Stat label="Data" value={`${career.currentMonth}/${career.currentYear}`} />
        <Stat label="Salário" value={formatMoney(player.salary)} />
        <Stat label="Patrimônio" value={formatMoney(player.wealth)} />
        <Stat label="Caminho" value={player.careerPath} />
        <Stat label="Saúde" value={`${player.attributes.mentalHealth}`} />
      </div>

      {market && (
        <div className="border-t border-[var(--border)] pt-3">
          <div className="mb-1 font-mono text-xs text-[var(--accent)]">MERCADO</div>
          <div className="text-sm font-semibold">{market.label}</div>
          <p className="mt-1 text-xs text-[var(--muted)]">{market.description}</p>
        </div>
      )}

      <div className="border-t border-[var(--border)] pt-3">
        <div className="mb-2 font-mono text-xs text-[var(--accent)]">ATRIBUTOS-CHAVE</div>
        <div className="space-y-1">
          {(
            [
              ['logic', 'Lógica'],
              ['reputation', 'Reputação'],
              ['architecture', 'Arquitetura'],
              ['mentalHealth', 'Saúde Mental'],
              ['business', 'Negócios'],
            ] as const
          ).map(([key, label]) => (
            <Bar key={key} label={label} value={player.attributes[key]} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[var(--muted)]">{label}</div>
      <div className="text-[var(--text)]">{value}</div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-0.5 flex justify-between font-mono text-[10px]">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 bg-[var(--bg)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}
