import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  onBack: () => void;
}

const ENDINGS = [
  {
    id: 'retirement',
    title: 'Aposentadoria',
    detail: 'Você chega aos 60 anos. Carreira longa e estável — o fim clássico.',
  },
  {
    id: 'burnout',
    title: 'Burnout',
    detail: 'Saúde mental chega a zero. O Slack venceu.',
  },
  {
    id: 'bankruptcy',
    title: 'Falência',
    detail: 'Patrimônio abaixo de −R$ 50.000. Contas não fecham.',
  },
  {
    id: 'billionaire',
    title: 'Bilionário',
    detail: 'Patrimônio atinge R$ 1 bilhão. Exit lendário.',
  },
  {
    id: 'company_sale',
    title: 'Venda da empresa',
    detail: 'Evento de aquisição: você vende a startup/SaaS e encerra em alta.',
  },
  {
    id: 'death',
    title: 'Fim inesperado',
    detail: 'Evento raro. A carreira termina de forma abrupta.',
  },
] as const;

export function HowToPlay({ onBack }: Props) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-dim),_transparent_55%),linear-gradient(180deg,_#0b1210_0%,_#07100e_50%,_#050a09_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px]" />

      <main className="relative mx-auto max-w-3xl px-6 py-14 md:py-20">
        <header className="mb-12 animate-fade-in">
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-[var(--accent)]">
            MANUAL · DEPLOY SEXTA
          </p>
          <h1 className="mb-4 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-none tracking-tight md:text-6xl">
            Como jogar
          </h1>
          <p className="max-w-xl text-lg text-[var(--muted)]">
            Simulação de carreira tech em formato roguelike. Cada mês traz um
            evento. Suas escolhas moldam salário, saúde mental, reputação e o
            fim da história.
          </p>
        </header>

        <div className="flex flex-col gap-8">
          <Section title="Objetivo">
            <p>
              Construir a carreira mais memorável possível: crescer de estágio a
              cargos altos, trocar de empresa, aprender stacks e entrar no
              ranking mundial por patrimônio, longevidade ou maior salário.
            </p>
            <p className="mt-3 text-[var(--muted)]">
              Não existe um único “certo”. Burnout aos 28 com score baixo e
              aposentadoria aos 60 com exit são finais válidos — o ranking
              mede o quanto a carreira foi marcante.
            </p>
          </Section>

          <Section title="1. Draft inicial">
            <p>
              Você começa em <strong className="text-[var(--text)]">2016</strong>
              , com cerca de 20 anos, em um estágio e patrimônio simbólico.
            </p>
            <ul className="mt-4 list-none space-y-2">
              <li className="border-l-2 border-[var(--accent)] pl-3">
                O jogo oferece cartas de personalidade inspiradas em lendas da
                computação.
              </li>
              <li className="border-l-2 border-[var(--accent)] pl-3">
                Escolha exatamente <strong className="text-[var(--text)]">3</strong>
                . Cada carta altera atributos e skills iniciais.
              </li>
              <li className="border-l-2 border-[var(--accent)] pl-3">
                Combinações diferentes geram carreiras bem distintas.
              </li>
            </ul>
          </Section>

          <Section title="2. Dinâmica mensal">
            <p>Cada turno é um mês de carreira:</p>
            <ol className="mt-4 list-none space-y-3">
              <Step n="01" text="O motor sorteia um evento elegível (peso, era do mercado, cooldowns)." />
              <Step n="02" text="Você escolhe uma resposta. Efeitos mudam atributos, skills, dinheiro, empresa ou cargo." />
              <Step n="03" text="O jogo verifica se a carreira acabou. Se não, passa o mês: custo de vida, poupança e oscilação de saúde mental." />
              <Step n="04" text="Em janeiro a idade sobe e o salário pode realinhar à faixa do cargo e da empresa." />
            </ol>
          </Section>

          <Section title="3. O que acompanhar">
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard
                label="Atributos"
                body="Lógica, reputação, arquitetura, saúde mental, negócio e outros (0–100). Abrem ou fecham opções de eventos."
              />
              <StatCard
                label="Skills"
                body="Tecnologias (React, AWS, Java…). Vêm de eventos e entram no histórico da carreira."
              />
              <StatCard
                label="Senioridade"
                body="Estágio → Júnior → Pleno → Sênior → Staff → Tech Lead → Principal → CTO. Promoções vêm de eventos."
              />
              <StatCard
                label="Empresa e salário"
                body="Cada empresa tem prestígio e multiplicador. Propostas da empresa atual não voltam a aparecer."
              />
            </div>
            <p className="mt-4 text-[var(--muted)]">
              O mercado muda com o tempo (eras): stacks “quentes”, salários e
              frequência de certos eventos acompanham o ano da carreira.
            </p>
          </Section>

          <Section title="4. Eventos e escolhas">
            <p>
              Nem toda opção aparece sempre: algumas exigem reputação,
              liderança, ano mínimo, etc. Em geral há pelo menos duas saídas
              possíveis — exceto situações forçadas (como um layoff).
            </p>
            <p className="mt-3 text-[var(--muted)]">
              Deploy na sexta, incidentes, ofertas de big tech, conferências e
              ondas de IA são exemplos do que o catálogo pode jogar no seu mês.
            </p>
          </Section>

          <Section title="5. Formas de encerrar">
            <p className="mb-4">
              A carreira termina quando uma destas condições é atingida:
            </p>
            <div className="space-y-3">
              {ENDINGS.map((ending) => (
                <div
                  key={ending.id}
                  className="border border-[var(--border)] bg-[var(--bg)]/60 p-4"
                >
                  <div className="mb-1 font-[family-name:var(--font-display)] text-lg font-bold">
                    {ending.title}
                  </div>
                  <p className="text-sm text-[var(--muted)]">{ending.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="6. Score e ranking">
            <p>
              Ao terminar, o score considera patrimônio, pico salarial,
              reputação, projetos, conquistas, meses jogados e empresas
              visitadas — com bônus ou penalidade conforme o tipo de fim.
            </p>
            <p className="mt-3 text-[var(--muted)]">
              A carreira entra no ranking mundial (patrimônio, longevidade e
              maior salário). Dá para comparar com outras runs na tela inicial.
            </p>
          </Section>

          <Section title="Dicas rápidas">
            <ul className="space-y-2 text-[var(--muted)]">
              <li>· Saúde mental baixa acelera eventos de crise.</li>
              <li>· Reputação alta abre mais oportunidades e big tech.</li>
              <li>· Recusar deploy na sexta costuma ser mais saudável que aceitar.</li>
              <li>· Trocar de empresa muda faixa salarial e prestígio de uma vez.</li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-8">
          <Button size="lg" onClick={onBack}>
            Voltar ao início
          </Button>
          <p className="font-mono text-xs text-[var(--muted)]">
            Pronto para o draft? O mercado não espera.
          </p>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="animate-fade-in border border-[var(--border)] bg-[var(--panel)] p-6 md:p-8">
      <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-bold">
        {title}
      </h2>
      <div className="text-[15px] leading-relaxed text-[var(--text)]/90">
        {children}
      </div>
    </section>
  );
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="font-mono text-xs text-[var(--accent)]">{n}</span>
      <span>{text}</span>
    </li>
  );
}

function StatCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--bg)]/50 p-4">
      <div className="mb-2 font-mono text-xs tracking-wider text-[var(--accent)]">
        {label.toUpperCase()}
      </div>
      <p className="text-sm text-[var(--muted)]">{body}</p>
    </div>
  );
}
