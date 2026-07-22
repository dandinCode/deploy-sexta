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
    <section className="animate-fade-in flex flex-1 flex-col border border-[var(--border)] bg-[var(--panel)] p-6">
      <div className="mb-2 font-mono text-xs tracking-widest text-[var(--accent)]">
        {hasVacancyOffer ? 'PROPOSTA / VAGA' : 'EVENTO DO MÊS'}
      </div>
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight">
        {event.title}
      </h2>
      <p className="mb-8 max-w-2xl text-[var(--muted)]">{event.description}</p>

      <div className="mt-auto flex flex-col gap-3">
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
      className="h-auto min-h-12 flex-col items-stretch justify-start gap-2 py-3 text-left"
      disabled={loading}
      onClick={() => onChoose(option.id)}
    >
      <span className="font-semibold">{option.label}</span>
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
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--border)] pt-2 font-mono text-[11px] font-normal text-[var(--muted)]">
      <span className="text-[var(--text)]">{company.name}</span>
      <span>{typeLabel}</span>
      <span>Prestígio {company.prestige}</span>
      {typeof salary === 'number' && (
        <span className="text-[var(--accent)]">~{formatMoney(salary)}/mês</span>
      )}
    </div>
  );
}
