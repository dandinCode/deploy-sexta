import { Button } from '@/components/ui/button';
import type { GameEvent } from '@/types/game';

interface Props {
  event: GameEvent;
  loading: boolean;
  onChoose: (optionId: string) => void;
}

export function EventPanel({ event, loading, onChoose }: Props) {
  return (
    <section className="animate-fade-in flex flex-1 flex-col border border-[var(--border)] bg-[var(--panel)] p-6">
      <div className="mb-2 font-mono text-xs tracking-widest text-[var(--accent)]">
        EVENTO DO MÊS
      </div>
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight">
        {event.title}
      </h2>
      <p className="mb-8 max-w-2xl text-[var(--muted)]">{event.description}</p>

      <div className="mt-auto flex flex-col gap-3">
        {event.options.map((opt) => (
          <Button
            key={opt.id}
            variant="outline"
            size="lg"
            className="justify-start text-left"
            disabled={loading}
            onClick={() => onChoose(opt.id)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
