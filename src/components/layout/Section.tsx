import type { ReactNode } from 'react';
import { Container } from './Container';
import { cx } from '@/lib/cx';
import { useSwipeScrollFade } from '@/hooks/useSwipeScrollFade';

interface SectionProps {
  /** Anchor id used by navigation and the scroll-spy. */
  id: string;
  /** id of the heading element that names this section. */
  labelledBy: string;
  tone?: 'base' | 'alt';
  children: ReactNode;
}

export function Section({ id, labelledBy, tone = 'base', children }: SectionProps) {
  const { ref, isVisible, direction } = useSwipeScrollFade<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={cx(
        'section',
        'section--swipe-fade',
        direction === 'down' ? 'from-bottom' : 'from-top',
        isVisible && 'is-visible',
        tone === 'alt' && 'section--alt'
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
