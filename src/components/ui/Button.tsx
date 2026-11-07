import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { useMagnetic } from '@/hooks/useMagnetic';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  /** Renders a link when provided, otherwise a <button>. */
  href?: string;
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  children: ReactNode;
  magnetic?: boolean;
}

export function Button({
  variant = 'primary',
  href,
  external = false,
  onClick,
  className,
  children,
  magnetic = true,
}: ButtonProps) {
  const magneticRef = useMagnetic<HTMLAnchorElement & HTMLButtonElement>({
    strength: variant === 'primary' ? 0.35 : 0.22,
    radius: 14,
  });

  const classes = cx('btn', `btn--${variant}`, className);

  if (href !== undefined) {
    return (
      <a
        ref={magnetic ? magneticRef : undefined}
        className={classes}
        href={href}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={magnetic ? magneticRef : undefined}
      type="button"
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
