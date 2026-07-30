import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/api/client';
import type { FeedbackEntry } from '@/types/game';

interface Props {
  onBack: () => void;
}

export function FeedbackBoard({ onBack }: Props) {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void api
      .getFeedback(50)
      .then((res) => {
        if (!cancelled) setEntries(res.entries);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-dim),_transparent_55%),linear-gradient(180deg,_#0b1210_0%,_#07100e_50%,_#050a09_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px]" />

      <main className="relative mx-auto max-w-3xl px-6 py-14 md:py-20">
        <header className="mb-10 animate-fade-in">
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-[var(--accent)]">
            COMUNIDADE · ABERTO
          </p>
          <h1 className="mb-3 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-none tracking-tight md:text-6xl">
            Feedbacks
          </h1>
          <p className="max-w-xl text-lg text-[var(--muted)]">
            Página pública com os feedbacks enviados pelos jogadores. Qualquer
            pessoa pode ler.
          </p>
        </header>

        {loading && (
          <p className="font-mono text-sm text-[var(--muted)]">Carregando...</p>
        )}
        {error && (
          <p className="font-mono text-sm text-[var(--danger)]">{error}</p>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="border border-[var(--border)] bg-[var(--panel)] p-6 text-[var(--muted)]">
            Ainda não há feedbacks. Seja o primeiro pelo ícone flutuante.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="animate-fade-in border border-[var(--border)] bg-[var(--panel)] p-5"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-[var(--text)]">
                  {entry.authorName}
                </span>
                <span className="font-mono text-[10px] text-[var(--muted)]">
                  · {formatDate(entry.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)]/90">
                {entry.message}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6">
          <Button size="lg" variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </main>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
