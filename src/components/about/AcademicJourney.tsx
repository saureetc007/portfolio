import { useState, useEffect, useRef } from 'react';
import { EDUCATION_DATA } from '@/data/education';
import { SchoolChapter } from './SchoolChapter';
import { EngineeringChapter } from './EngineeringChapter';
import { CommunitiesChapter } from './CommunitiesChapter';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function AcademicJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll visibility stage:
  // stage 0: not in view
  // stage 1: timeline initiated, School chapter revealed & percentages animate
  // stage 2: Engineering chapter revealed & illuminated
  // stage 3: Communities chapter revealed
  const [scrollStage, setScrollStage] = useState<number>(() => (prefersReducedMotion ? 3 : 0));

  useEffect(() => {
    if (prefersReducedMotion) {
      setScrollStage(3);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Sequential cinematic reveals
            setScrollStage((prev) => Math.max(prev, 1));
            const rect = entry.target.getBoundingClientRect();
            window.dispatchEvent(
              new CustomEvent('emit-global-burst', {
                detail: { x: rect.left + 22, y: Math.max(80, rect.top + 60), count: 10 },
              })
            );

            const t1 = setTimeout(() => {
              setScrollStage((prev) => Math.max(prev, 2));
              window.dispatchEvent(
                new CustomEvent('emit-global-burst', {
                  detail: { x: rect.left + 22, y: Math.max(160, rect.top + 280), count: 10 },
                })
              );
            }, 600);

            const t2 = setTimeout(() => {
              setScrollStage(3);
              window.dispatchEvent(
                new CustomEvent('emit-global-burst', {
                  detail: { x: rect.left + 22, y: Math.max(240, rect.top + 500), count: 10 },
                })
              );
            }, 1200);

            return () => {
              clearTimeout(t1);
              clearTimeout(t2);
            };
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Compute beam height based on stage
  const beamHeight =
    scrollStage >= 3 ? '100%' : scrollStage >= 2 ? '68%' : scrollStage >= 1 ? '32%' : '0%';

  return (
    <div
      ref={containerRef}
      className={`academic-journey-root stage-${scrollStage}`}
    >
      {/* ====================================================================
          1. CONTINUOUS VERTICAL ILLUMINATED TIMELINE
          ==================================================================== */}
      <div className="academic-journey-rail" aria-hidden="true">
        {/* Static Base Track */}
        <div className="academic-rail-track" />

        {/* Dynamic Glowing Red Progress Beam */}
        <div
          className="academic-rail-beam"
          style={{ height: beamHeight }}
        />

        {/* Active Laser Travelling Pulse */}
        {scrollStage >= 1 && (
          <div
            className={`academic-rail-pulse ${
              scrollStage >= 3 ? 'is-at-bottom' : scrollStage >= 2 ? 'is-at-mid' : 'is-at-top'
            }`}
          />
        )}
      </div>

      {/* ====================================================================
          2. THREE CONNECTED CHAPTERS
          ==================================================================== */}
      <div className="academic-chapters-flow">
        {/* CHAPTER 01: SCHOOL EDUCATION */}
        <div className={`academic-milestone-item ${scrollStage >= 1 ? 'is-revealed' : ''}`}>
          <div className="academic-milestone-marker" aria-hidden="true">
            <div className={`milestone-node ${scrollStage >= 1 ? 'is-active' : ''}`}>
              <span className="milestone-number">01</span>
            </div>
          </div>

          <div className="academic-milestone-body">
            <SchoolChapter
              data={EDUCATION_DATA.school}
              isActive={scrollStage >= 1}
            />
          </div>
        </div>

        {/* CHAPTER 02: HIGHER EDUCATION & ENGINEERING */}
        <div className={`academic-milestone-item ${scrollStage >= 2 ? 'is-revealed' : ''}`}>
          <div className="academic-milestone-marker" aria-hidden="true">
            <div className={`milestone-node ${scrollStage >= 2 ? 'is-active' : ''}`}>
              <span className="milestone-number">02</span>
            </div>
          </div>

          <div className="academic-milestone-body">
            <EngineeringChapter
              data={EDUCATION_DATA.engineering}
              isActive={scrollStage >= 2}
            />
          </div>
        </div>

        {/* CHAPTER 03: COLLEGE COMMUNITIES */}
        <div className={`academic-milestone-item ${scrollStage >= 3 ? 'is-revealed' : ''}`}>
          <div className="academic-milestone-marker" aria-hidden="true">
            <div className={`milestone-node ${scrollStage >= 3 ? 'is-active' : ''}`}>
              <span className="milestone-number">03</span>
            </div>
          </div>

          <div className="academic-milestone-body">
            <CommunitiesChapter
              data={EDUCATION_DATA.communities}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

