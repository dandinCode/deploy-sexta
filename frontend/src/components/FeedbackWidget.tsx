import { useEffect, useId, useState, type FormEvent } from 'react';
import { MessageSquarePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/api/client';

interface Props {
  defaultAuthor?: string;
  gameId?: string | null;
  onOpenBoard: () => void;
}

export function FeedbackWidget({
  defaultAuthor = '',
  gameId,
  onOpenBoard,
}: Props) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [authorName, setAuthorName] = useState(defaultAuthor);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setAuthorName(defaultAuthor || 'Anônimo');
      setError(null);
      setSent(false);
    }
  }, [open, defaultAuthor]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.submitFeedback({
        authorName: authorName.trim() || 'Anônimo',
        message: message.trim(),
        gameId: gameId ?? undefined,
      });
      setSent(true);
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Enviar feedback ou sugestão"
        title="Feedback"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center border border-[var(--accent)] bg-[var(--panel)] text-[var(--accent)] shadow-[0_0_24px_var(--accent-dim)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <MessageSquarePlus size={22} strokeWidth={2.25} aria-hidden="true" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="animate-fade-in w-full max-w-md border border-[var(--border)] bg-[var(--panel)] p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)]">
                  FEEDBACK
                </p>
                <h2
                  id={titleId}
                  className="font-[family-name:var(--font-display)] text-2xl font-bold"
                >
                  Conta pra gente
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                <X size={20} />
              </button>
            </div>

            {sent ? (
              <div className="space-y-4">
                <p className="text-sm text-[var(--muted)]">
                  Obrigado! Seu feedback já está na página pública.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      setOpen(false);
                      onOpenBoard();
                    }}
                  >
                    Ver feedbacks
                  </Button>
                  <Button variant="ghost" onClick={() => setSent(false)}>
                    Enviar outro
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
                <div>
                  <label className="mb-1 block font-mono text-[10px] text-[var(--muted)]">
                    SEU NOME
                  </label>
                  <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    maxLength={40}
                    required
                    className="h-10 w-full border border-[var(--border)] bg-[var(--bg)] px-3 font-mono text-sm outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[10px] text-[var(--muted)]">
                    MENSAGEM
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    minLength={3}
                    maxLength={1000}
                    rows={4}
                    placeholder="Ideia, elogio, crítica — o que quiser dizer..."
                    className="w-full resize-y border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--accent)]"
                  />
                </div>

                {error && (
                  <p className="font-mono text-xs text-[var(--danger)]">{error}</p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="submit" disabled={loading || message.trim().length < 3}>
                    {loading ? 'Enviando...' : 'Enviar'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setOpen(false);
                      onOpenBoard();
                    }}
                  >
                    Ver página pública
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
