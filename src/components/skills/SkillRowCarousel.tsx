import { useRef } from 'react';
import type { SkillRow } from '@/types/content';
import { SkillCard } from './SkillCard';

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function SkillRowCarousel({ row }: { row: SkillRow }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="skills-row">
      <div className="skills-row__header">
        <div>
          <h3 className="skills-row__title">{row.title}</h3>
          <p className="skills-row__tagline">{row.tagline}</p>
        </div>
        <div className="skills-row__controls" aria-label={`${row.title} navigation`}>
          <button
            type="button"
            className="skills-row__arrow skills-row__arrow--prev"
            onClick={scrollLeft}
            aria-label={`Scroll ${row.title} left`}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="skills-row__arrow skills-row__arrow--next"
            onClick={scrollRight}
            aria-label={`Scroll ${row.title} right`}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="skills-row__track-wrapper">
        <div className="skills-row__track" ref={trackRef}>
          {row.skills.map((skill) => (
            <div key={skill.id} className="skills-row__item">
              <SkillCard skill={skill} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

