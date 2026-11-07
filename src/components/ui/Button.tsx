import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  /** Renders a link when provided, otherwise a <button>. */
  href?: string;
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  href,
  external = false,
  onClick,
  className,
  children,
}: ButtonProps) {
  const classes = cx('btn', `btn--${variant}`, className);

  if (href !== undefined) {
    return (
      <a
        className={classes}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
