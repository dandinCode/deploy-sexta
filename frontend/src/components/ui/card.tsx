import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border border-[var(--border)] bg-[var(--panel)] p-4',
        className,
      )}
      {...props}
    />
  );
}
