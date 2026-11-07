import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';
import { DecryptedText } from '@/components/skills/react-bits/DecryptedText';
import { WordReveal } from './WordReveal';

interface SectionHeadingProps {
  /** id placed on the <h2>; the parent <section> references it via aria-labelledby. */
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ id, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal>
      <header className="section-heading stack">
        <Eyebrow>
          <DecryptedText text={eyebrow} speed={25} maxIterations={8} animateOn="mount" />
        </Eyebrow>
        <h2 id={id} className="section-heading__title">
          <WordReveal text={title} wordDelay={0.06} />
        </h2>
        {description ? <p className="section-heading__description">{description}</p> : null}
      </header>
    </Reveal>
  );
}
