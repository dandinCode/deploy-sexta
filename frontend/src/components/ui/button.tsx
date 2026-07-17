import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-mono text-sm font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none',
        variant === 'default' &&
          'bg-[var(--accent)] text-[var(--bg)] hover:brightness-110',
        variant === 'outline' &&
          'border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
        variant === 'ghost' && 'text-[var(--muted)] hover:text-[var(--text)]',
        variant === 'danger' &&
          'bg-[var(--danger)] text-white hover:brightness-110',
        size === 'sm' && 'h-8 px-3',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-12 px-6 text-base',
        className,
      )}
      {...props}
    />
  );
}
