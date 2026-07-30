import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/utils';
import type { EventOption, GameEvent, OfferedCompany } from '@/types/game';

interface Props {
  event: GameEvent;
  loading: boolean;
  onChoose: (optionId: string) => void;
}

const COMPANY_TYPE_LABELS: Record<string, string> = {
  bigtech: 'Big Tech',
  startup: 'Startup',
  software_house: 'Software House',
  agency: 'Agência',
  bank: 'Banco',
  own: 'Própria',
};

export function EventPanel({ event, loading, onChoose }: Props) {
  const hasVacancyOffer = event.options.some((opt) => opt.offeredCompany);

  return (
    <section className="animate-fade-in flex h-[calc(100dvh-7rem)] max-h-[820px] min-h-[480px] flex-col overflow-hidden border border-[var(--border)] bg-[var(--panel)] p-5 md:p-6">
      <div className="shrink-0">
        <div className="mb-2 font-mono text-xs tracking-widest text-[var(--accent)]">
          {hasVacancyOffer ? 'PROPOSTA / VAGA' : 'EVENTO DO MÊS'}
        </div>
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight md:text-3xl">
          {event.title}
        </h2>
        <p className="mb-4 max-h-20 overflow-y-auto text-sm text-[var(--muted)] md:max-h-24 md:text-base">
          {event.description}
        </p>
      </div>

      <div className="mt-auto flex max-h-[58%] min-h-0 flex-col gap-2 overflow-y-auto pr-1">
        {event.options.map((opt) => (
          <OptionButton
            key={opt.id}
            option={opt}
            loading={loading}
            onChoose={onChoose}
          />
        ))}
      </div>
    </section>
  );
}

function OptionButton({
  option,
  loading,
  onChoose,
}: {
  option: EventOption;
  loading: boolean;
  onChoose: (optionId: string) => void;
}) {
  const company = option.offeredCompany;

  return (
    <Button
      variant="outline"
      size="lg"
      className="h-auto min-h-11 shrink-0 flex-col items-stretch justify-start gap-1.5 py-2.5 text-left"
      disabled={loading}
      onClick={() => onChoose(option.id)}
    >
      <span className="font-semibold leading-snug">{option.label}</span>
      {company && (
        <VacancyDetails company={company} salary={option.projectedSalary} />
      )}
      {option.description && !company && (
        <span className="font-normal text-xs text-[var(--muted)]">
          {option.description}
        </span>
      )}
    </Button>
  );
}

function VacancyDetails({
  company,
  salary,
}: {
  company: OfferedCompany;
  salary?: number;
}) {
  const typeLabel = COMPANY_TYPE_LABELS[company.type] ?? company.type;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--border)] pt-1.5 font-mono text-[11px] font-normal text-[var(--muted)]">
      <span className="text-[var(--text)]">{company.name}</span>
      <span>{typeLabel}</span>
      <span>Prestígio {company.prestige}</span>
      {typeof salary === 'number' && (
        <span className="text-[var(--accent)]">~{formatMoney(salary)}/mês</span>
      )}
    </div>
  );
}
