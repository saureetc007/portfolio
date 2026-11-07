import { useRef } from 'react';
import { learningActivities } from '@/data';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatusBadge } from '@/components/ui/StatusBadge';

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

export function ContinueExploring() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <Section id="exploring" labelledBy="exploring-title">
      <div className="continue-row__header">
        <SectionHeading
          id="exploring-title"
          eyebrow="Continue Building"
          title="Active Learning & Exploration Queue"
          description="A real-time snapshot of what I'm engineering, researching, and testing right now. Updated continuously as technical pursuits evolve."
        />

        <div className="continue-row__controls" aria-label="Continue building queue navigation">
          <button
            type="button"
            className="skills-row__arrow"
            onClick={scrollLeft}
            aria-label="Scroll queue left"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="skills-row__arrow"
            onClick={scrollRight}
            aria-label="Scroll queue right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="continue-track-wrapper">
        <div className="continue-track" ref={trackRef}>
          {learningActivities.map((activity) => (
            <div key={activity.id} className="continue-card">
              <div className="continue-card__surface">
                {/* Visual Header / Playback Area */}
                <div className="continue-card__header">
                  <div className="continue-card__play-icon" aria-hidden="true">
                    <span className="continue-card__play-triangle" />
                  </div>
                  <div className="continue-card__status">
                    <StatusBadge status={activity.status} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="continue-card__body">
                  <h4 className="continue-card__title">{activity.title}</h4>
                  <p className="continue-card__desc">{activity.description}</p>
                </div>

                {/* Tags */}
                {activity.tags && activity.tags.length > 0 && (
                  <div className="continue-card__tags">
                    {activity.tags.map((tag) => (
                      <span key={tag} className="continue-card__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Netflix Playback Progress Bar */}
                <div className="continue-card__progress-track" aria-hidden="true">
                  <div
                    className="continue-card__progress-bar"
                    style={{
                      width: activity.progress !== null ? `${activity.progress}%` : '45%',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
