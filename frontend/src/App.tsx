import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { DraftCard } from '@/components/DraftCard';
import { StatusBar } from '@/components/StatusBar';
import { EventPanel } from '@/components/EventPanel';
import { EndScreen } from '@/components/EndScreen';
import { RankingBoard } from '@/components/RankingBoard';
import { HowToPlay } from '@/components/HowToPlay';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { FeedbackBoard } from '@/components/FeedbackBoard';
import { useGameStore } from '@/store/gameStore';
import { Github } from 'lucide-react';

type ShellView = 'main' | 'how-to-play' | 'feedback';

function readInitialShellView(): ShellView {
  if (typeof window === 'undefined') return 'main';
  const page = new URLSearchParams(window.location.search).get('page');
  if (page === 'feedback') return 'feedback';
  if (page === 'how-to-play') return 'how-to-play';
  return 'main';
}

function setPageQuery(view: ShellView) {
  const url = new URL(window.location.href);
  if (view === 'main') {
    url.searchParams.delete('page');
  } else {
    url.searchParams.set('page', view);
  }
  window.history.replaceState({}, '', url);
}

export default function App() {
  const {
    game,
    meta,
    selectedCards,
    loading,
    booting,
    error,
    playerRanks,
    loadMeta,
    resumeActiveGame,
    startGame,
    toggleCard,
    confirmDraft,
    choose,
    reset,
  } = useGameStore();

  const [name, setName] = useState('Dev Anônimo');
  const [shellView, setShellView] = useState<ShellView>(readInitialShellView);

  useEffect(() => {
    void (async () => {
      await loadMeta();
      await resumeActiveGame();
    })();
  }, [loadMeta, resumeActiveGame]);

  function goTo(view: ShellView) {
    setShellView(view);
    setPageQuery(view);
  }

  const pickLimit = meta?.config.draft.pick ?? 3;
  const feedbackAuthor = game?.player.name ?? name;

  let content: ReactNode;

  if (booting && shellView === 'main') {
    content = (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--bg)] px-6">
        <p className="font-mono text-sm text-[var(--muted)]">
          Carregando carreira...
        </p>
      </div>
    );
  } else if (shellView === 'feedback') {
    content = <FeedbackBoard onBack={() => goTo('main')} />;
  } else if (shellView === 'how-to-play' && !game) {
    content = <HowToPlay onBack={() => goTo('main')} />;
  } else if (!game) {
    content = (
      <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-dim),_transparent_55%),linear-gradient(180deg,_#0b1210_0%,_#07100e_50%,_#050a09_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px]" />

        <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
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

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  disabled={loading || !name.trim()}
                  onClick={() => void startGame(name.trim())}
                  className="w-fit"
                >
                  {loading ? 'Iniciando...' : 'Começar draft'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => goTo('how-to-play')}
                >
                  Como jogar
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => goTo('feedback')}
                >
                  Feedbacks
                </Button>
              </div>

              {error && (
                <p className="mt-4 font-mono text-sm text-[var(--danger)]">{error}</p>
              )}
            </div>

            <RankingBoard compact className="animate-fade-in" />
          </div>
        </main>
        <footer className="relative z-10 shrink-0 border-t border-[var(--border)] px-6 py-4 text-center">
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
  } else if (game.status === 'draft') {
    content = (
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
  } else if (game.status === 'finished') {
    content = (
      <div className="min-h-screen bg-[var(--bg)] px-4 py-10 md:px-8">
        <EndScreen
          game={game}
          ranks={playerRanks}
          skillLabels={meta?.skills}
          onRestart={reset}
        />
      </div>
    );
  } else {
    content = (
      <div className="min-h-dvh bg-[var(--bg)] px-3 pb-20 pt-4 sm:px-4 md:px-8 md:pb-8 md:py-6">
        <header className="mx-auto mb-4 flex max-w-6xl items-end justify-between gap-3 sm:mb-5 sm:gap-4">
          <div className="min-w-0">
            <div className="font-mono text-[10px] tracking-widest text-[var(--accent)] sm:text-xs">
              DEPLOY SEXTA
            </div>
            <h1 className="truncate font-[family-name:var(--font-display)] text-xl font-bold sm:text-2xl">
              Mês {game.career.monthsPlayed + 1}
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} className="shrink-0">
            Abandonar
          </Button>
        </header>

        <div className="mx-auto grid max-w-6xl gap-3 sm:gap-4 lg:grid-cols-[280px_1fr] lg:items-stretch">
          <div className="order-2 min-w-0 lg:order-1 lg:h-[calc(100dvh-7rem)] lg:max-h-[820px] lg:overflow-y-auto lg:border lg:border-[var(--border)] lg:bg-[var(--panel)]">
            <StatusBar game={game} skillLabels={meta?.skills} />
          </div>
          {game.currentEvent ? (
            <div className="order-1 min-w-0 lg:order-2">
              <EventPanel
                event={game.currentEvent}
                loading={loading}
                onChoose={(id) => void choose(id)}
              />
            </div>
          ) : (
            <div className="order-1 flex min-h-[280px] items-center border border-[var(--border)] bg-[var(--panel)] p-4 font-mono text-sm text-[var(--muted)] sm:min-h-[360px] sm:p-6 lg:order-2 lg:h-[calc(100dvh-7rem)] lg:max-h-[820px]">
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

  return (
    <>
      {content}
      <FeedbackWidget
        defaultAuthor={feedbackAuthor}
        gameId={game?.id}
        onOpenBoard={() => goTo('feedback')}
      />
    </>
  );
}
