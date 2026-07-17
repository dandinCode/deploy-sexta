import { ATTRIBUTE_LABELS, cn } from '@/lib/utils';
import type { PersonalityCard } from '@/types/game';

interface Props {
  card: PersonalityCard;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function DraftCard({ card, selected, disabled, onToggle }: Props) {
  const bonuses = Object.entries(card.bonuses).filter(([, v]) => v !== undefined);

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled && !selected}
      className={cn(
        'group relative w-full border p-4 text-left transition-all duration-200',
        'hover:-translate-y-0.5',
        selected
          ? 'border-[var(--accent)] bg-[var(--accent-dim)] shadow-[0_0_0_1px_var(--accent)]'
          : 'border-[var(--border)] bg-[var(--panel)] hover:border-[var(--muted)]',
        disabled && !selected && 'opacity-40',
      )}
    >
      <div className="mb-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
        {card.name}
      </div>
      <div className="mb-2 font-mono text-xs text-[var(--accent)]">{card.title}</div>
      <p className="mb-3 text-sm text-[var(--muted)]">{card.description}</p>
      <ul className="space-y-1 font-mono text-xs">
        {bonuses.map(([key, value]) => (
          <li key={key} className={value! >= 0 ? 'text-[var(--ok)]' : 'text-[var(--danger)]'}>
            {value! >= 0 ? '+' : ''}
            {value} {ATTRIBUTE_LABELS[key] ?? key}
          </li>
        ))}
      </ul>
      {selected && (
        <span className="absolute right-2 top-2 font-mono text-xs text-[var(--accent)]">
          SELECTED
        </span>
      )}
    </button>
  );
}
