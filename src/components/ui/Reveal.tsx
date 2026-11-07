import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds. */
  delay?: number;
}

/** Fades and lifts its children into view once. A no-op under reduced motion. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties;
  return (
    <div ref={ref} className={cx('reveal', className)} style={style}>
      {children}
    </div>
  );
}
