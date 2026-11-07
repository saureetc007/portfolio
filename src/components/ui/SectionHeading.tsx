import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';

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
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="section-heading__title">
          {title}
        </h2>
        {description ? <p className="section-heading__description">{description}</p> : null}
      </header>
    </Reveal>
  );
}
