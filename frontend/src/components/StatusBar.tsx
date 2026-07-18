import { formatMoney } from '@/lib/utils';
import type { GameState } from '@/types/game';

const SENIORITY_SHORT = [
  'Estágio',
  'Júnior',
  'Pleno',
  'Sênior',
  'Staff',
  'Tech Lead',
  'Principal',
  'CTO',
];

interface Props {
  game: GameState;
}

export function StatusBar({ game }: Props) {
  const { player, career, market, currentCompany } = game;
  const currentProject =
    player.currentProject ?? player.projects[player.projects.length - 1] ?? null;

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
        <Stat label="Salário/mês" value={formatMoney(player.salary)} />
        <Stat label="Patrimônio" value={formatMoney(player.wealth)} />
        <Stat label="Nível" value={SENIORITY_SHORT[player.seniority] ?? '—'} />
        <Stat label="Saúde" value={`${player.attributes.mentalHealth}`} />
      </div>

      <div className="border-t border-[var(--border)] pt-3">
        <div className="mb-2 font-mono text-xs text-[var(--accent)]">
          ATUAÇÃO ATUAL
        </div>
        <div className="space-y-2">
          <CurrentWork
            label="Empresa"
            value={currentCompany?.name ?? 'Sem empresa'}
          />
          <CurrentWork
            label="Projeto"
            value={currentProject ?? 'Nenhum projeto em andamento'}
          />
        </div>
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

function CurrentWork({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
        {label}
      </div>
      <div className="text-sm font-semibold text-[var(--text)]">{value}</div>
    </div>
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
