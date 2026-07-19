import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DraftCard } from '@/components/DraftCard';
import { StatusBar } from '@/components/StatusBar';
import { EventPanel } from '@/components/EventPanel';
import { EndScreen } from '@/components/EndScreen';
import { RankingBoard } from '@/components/RankingBoard';
import { useGameStore } from '@/store/gameStore';
import { Github } from 'lucide-react';

export default function App() {
  const {
    game,
    meta,
    selectedCards,
    loading,
    error,
    playerRanks,
    loadMeta,
    startGame,
    toggleCard,
    confirmDraft,
    choose,
    reset,
  } = useGameStore();

  const [name, setName] = useState('Dev Anônimo');

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  const pickLimit = meta?.config.draft.pick ?? 3;

  if (!game) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-dim),_transparent_55%),linear-gradient(180deg,_#0b1210_0%,_#07100e_50%,_#050a09_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px]" />

        <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="mb-4 font-mono text-xs tracking-[0.3em] text-[var(--accent)]">
                CARREIRA ROGUELIKE · TECH
              </p>
              <h1 className="mb-4 font-[family-name:var(--font-display)] text-6xl font-extrabold leading-none tracking-tight md:text-7xl">
                Deploy
                <br />
                Sexta
              </h1>
              <p className="mb-10 max-w-md text-lg text-[var(--muted)]">
                Monte sua identidade com cartas de lendas da computação. Sobreviva ao
                mercado. Entre no ranking mundial.
              </p>

              <label className="mb-2 font-mono text-xs text-[var(--muted)]">
                NOME DO PERSONAGEM
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="mb-6 h-12 w-full max-w-md border border-[var(--border)] bg-[var(--panel)] px-4 font-mono text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />

              <Button
                size="lg"
                disabled={loading || !name.trim()}
                onClick={() => void startGame(name.trim())}
                className="w-fit"
              >
                {loading ? 'Iniciando...' : 'Começar draft'}
              </Button>

              {error && (
                <p className="mt-4 font-mono text-sm text-[var(--danger)]">{error}</p>
              )}
            </div>

            <RankingBoard compact className="animate-fade-in" />
          </div>
        </main>
        <footer className="relative z-10 border-t border-[var(--border)] px-6 py-5 text-center">
          <a
            href="https://github.com/dandinCode/deploy-sexta"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            <Github size={16} aria-hidden="true" />
            Código aberto no GitHub
          </a>
        </footer>
      </div>
    );
  }

  if (game.status === 'draft') {
    return (
      <div className="min-h-screen bg-[var(--bg)] px-4 py-8 md:px-8">
        <header className="mx-auto mb-8 max-w-6xl">
          <div className="mb-2 font-mono text-xs text-[var(--accent)]">DRAFT INICIAL</div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold">
            Escolha {pickLimit} entre {game.draftCards.length}
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Cada combinação cria uma carreira diferente. Selecionadas:{' '}
            <span className="text-[var(--accent)]">
              {selectedCards.length}/{pickLimit}
            </span>
          </p>
        </header>

        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {game.draftCards.map((card) => (
            <DraftCard
              key={card.id}
              card={card}
              selected={selectedCards.includes(card.id)}
              disabled={selectedCards.length >= pickLimit}
              onToggle={() => toggleCard(card.id)}
            />
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl items-center gap-4">
          <Button
            size="lg"
            disabled={loading || selectedCards.length !== pickLimit}
            onClick={() => void confirmDraft()}
          >
            {loading ? 'Gerando carreira...' : 'Confirmar draft'}
          </Button>
          <Button variant="ghost" onClick={reset}>
            Voltar
          </Button>
          {error && <p className="font-mono text-sm text-[var(--danger)]">{error}</p>}
        </div>
      </div>
    );
  }

  if (game.status === 'finished') {
    return (
      <div className="min-h-screen bg-[var(--bg)] px-4 py-10 md:px-8">
        <EndScreen
          game={game}
          ranks={playerRanks}
          skillLabels={meta?.skills}
          onRestart={reset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-6 md:px-8">
      <header className="mx-auto mb-6 flex max-w-6xl items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs tracking-widest text-[var(--accent)]">
            DEPLOY SEXTA
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
            Mês {game.career.monthsPlayed + 1}
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          Abandonar
        </Button>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[280px_1fr]">
        <StatusBar game={game} skillLabels={meta?.skills} />
        {game.currentEvent ? (
          <EventPanel
            event={game.currentEvent}
            loading={loading}
            onChoose={(id) => void choose(id)}
          />
        ) : (
          <div className="border border-[var(--border)] bg-[var(--panel)] p-6 font-mono text-sm text-[var(--muted)]">
            Aguardando evento...
          </div>
        )}
      </div>

      {error && (
        <p className="mx-auto mt-4 max-w-6xl font-mono text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
