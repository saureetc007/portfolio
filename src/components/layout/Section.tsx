import type { ReactNode } from 'react';
import { Container } from './Container';
import { cx } from '@/lib/cx';

interface SectionProps {
  /** Anchor id used by navigation and the scroll-spy. */
  id: string;
  /** id of the heading element that names this section. */
  labelledBy: string;
  tone?: 'base' | 'alt';
  children: ReactNode;
}

export function Section({ id, labelledBy, tone = 'base', children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx('section', tone === 'alt' && 'section--alt')}>
      <Container>{children}</Container>
    </section>
  );
}
