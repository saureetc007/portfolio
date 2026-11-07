import { useEffect, useState } from 'react';
import type { EducationData } from '@/data/education';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SchoolChapterProps {
  data: EducationData['school'];
  isActive: boolean;
}

export function SchoolChapter({ data, isActive }: SchoolChapterProps) {
  const prefersReducedMotion = useReducedMotion();

  // Animated counters for the two scores
  const [classXVal, setClassXVal] = useState<number>(() => (prefersReducedMotion ? 93.2 : 0));
  const [classXIIVal, setClassXIIVal] = useState<number>(() => (prefersReducedMotion ? 80 : 0));
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setClassXVal(93.2);
      setClassXIIVal(80);
      return;
    }

    if (isActive && !hasAnimated) {
      setHasAnimated(true);
      const startTime = performance.now();
      const duration = 1200;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Smooth cubic ease-out
        const ease = 1 - Math.pow(1 - progress, 3);

        setClassXVal(Number((ease * 93.2).toFixed(1)));
        setClassXIIVal(Math.round(ease * 80));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setClassXVal(93.2);
          setClassXIIVal(80);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isActive, hasAnimated, prefersReducedMotion]);

  const scoreX = data.scores[0];
  const scoreXII = data.scores[1];

  return (
    <article className="academic-chapter-card academic-chapter-card--school">
      {/* Chapter Kicker & Metadata */}
      <div className="academic-chapter-header">
        <div className="academic-chapter-meta">
          <span className="academic-chapter-kicker">CHAPTER 01 // SCHOOL EDUCATION</span>
          <span className="academic-status-badge academic-status-badge--completed">
            <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10" aria-hidden="true">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
            <span>{data.status}</span>
          </span>
        </div>

        <div className="academic-institution-group">
          <h3 className="academic-institution-title">{data.institution}</h3>
          <p className="academic-institution-location">
            <span className="location-dot" />
            <span>{data.location}</span>
          </p>
        </div>
      </div>

      {/* Prominent Typographic Score Displays */}
      <div className="academic-scores-container">
        <div className="academic-score-block">
          <div className="academic-score-number">
            <span>{classXVal.toFixed(1)}</span>
            <span className="academic-score-pct">%</span>
          </div>
          <div className="academic-score-info">
            <h4 className="academic-score-label">{scoreX?.label}</h4>
            <p className="academic-score-exam">{scoreX?.examination}</p>
            {scoreX?.streamOrDetails && (
              <span className="academic-score-sub">{scoreX.streamOrDetails}</span>
            )}
          </div>
        </div>

        <div className="academic-scores-divider" aria-hidden="true" />

        <div className="academic-score-block">
          <div className="academic-score-number">
            <span>{Math.round(classXIIVal)}</span>
            <span className="academic-score-pct">%</span>
          </div>
          <div className="academic-score-info">
            <h4 className="academic-score-label">{scoreXII?.label}</h4>
            <p className="academic-score-exam">{scoreXII?.examination}</p>
            {scoreXII?.streamOrDetails && (
              <span className="academic-score-sub">{scoreXII.streamOrDetails}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

