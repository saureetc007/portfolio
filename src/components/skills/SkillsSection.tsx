import { useState, useRef, useEffect } from 'react';
import { bentoSkillCategories } from '@/data';
import type { BentoSkillCategory } from '@/data/skills';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BentoCardWrapper } from './BentoCardWrapper';
import { CodeEngineeringCardContent } from './CodeEngineeringCardContent';
import { WebDevelopmentCardContent } from './WebDevelopmentCardContent';
import { AIDataIntelligenceCardContent } from './AIDataIntelligenceCardContent';
import { DesignDigitalCreationCardContent } from './DesignDigitalCreationCardContent';
import { MobileDevelopmentCardContent } from './MobileDevelopmentCardContent';
import { SkillsParticleCanvas } from './SkillsParticleCanvas';
import { SkillDetailsModal } from './SkillDetailsModal';
import { useTheatreSkillsTimeline } from './theatre/useTheatreSkillsTimeline';
import { useLenis } from './lenis/LenisSmoothScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<BentoSkillCategory | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionInnerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Lenis smooth scroll tracking for cinematic parallax synchronization
  const lenisData = useLenis();

  // Theatre.js coordinated cinematic timeline
  const theatre = useTheatreSkillsTimeline(hasEntered);

  // Trigger entrance sequence once upon entering viewport; pause background canvas when offscreen
  useEffect(() => {
    const el = sectionInnerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true);
            setIsSectionVisible(true);
          } else {
            setIsSectionVisible(false);
          }
        });
      },
      { threshold: 0.08, rootMargin: '60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const codeCat = bentoSkillCategories.find((c) => c.id === 'code-engineering')!;
  const aiCat = bentoSkillCategories.find((c) => c.id === 'ai-data-intelligence')!;
  const webCat = bentoSkillCategories.find((c) => c.id === 'web-development')!;
  const designCat = bentoSkillCategories.find((c) => c.id === 'design-digital-creation')!;
  const mobileCat = bentoSkillCategories.find((c) => c.id === 'mobile-development')!;

  const philosophyEntranceClasses = prefersReducedMotion
    ? ''
    : `skill-card-enter ${hasEntered ? 'has-entered' : ''} enter-up`;

  return (
    <Section id="skills" labelledBy="skills-title">
      <div
        ref={sectionInnerRef}
        className="skills-section-wrapper"
        style={{
          // Synchronize subtle ambient depth with Lenis scroll velocity
          '--scroll-velocity': `${lenisData.velocity.toFixed(2)}px`,
        } as React.CSSProperties}
      >
        {/* 1. Netflix-Inspired Cinematic Vignette & Ambient Darkness */}
        <div
          className="skills-cinematic-vignette"
          style={{
            opacity: prefersReducedMotion ? 0.85 : 0.65 + theatre.trackStates.stage.opacity * 0.25,
          }}
          aria-hidden="true"
        />

        {/* 2. Fine Film Grain Texture Overlay */}
        <div className="skills-film-grain" aria-hidden="true" />

        {/* 3. Subtle 2D Canvas Drifting Particles (React Bits inspired) */}
        <SkillsParticleCanvas isVisible={isSectionVisible} />

        {/* 4. Section Heading with Theatre.js Choreographed Reveal */}
        <div
          className="skills-heading-container"
          style={{
            opacity: prefersReducedMotion ? 1 : theatre.trackStates.heading.opacity,
            transform: prefersReducedMotion
              ? undefined
              : `translate3d(0, ${theatre.trackStates.heading.translate3d.y}px, 0)`,
          }}
        >
          <SectionHeading
            id="skills-title"
            eyebrow="05 Core Engineering Disciplines"
            title="Technical Skills & Competencies"
            description="An asymmetric command center structured by core engineering priority. From algorithmic foundations and local neural pipelines to responsive browser systems, creative workflows, and mobile runtimes."
          />
        </div>

        {/* 5. Asymmetric 12-Column Bento Grid Structured by Priority Hierarchy */}
        <div className="bento-skills-grid" role="region" aria-label="Technical Skills Bento Grid">
          {/* Priority 1: Code & Engineering (8 columns — largest & most visually prominent hero card) */}
          <BentoCardWrapper
            category={codeCat}
            onOpenModal={setSelectedCategory}
            entranceDirection="left"
            entranceDelay={80}
            hasEntered={hasEntered}
          >
            <CodeEngineeringCardContent />
          </BentoCardWrapper>

          {/* Priority 2: AI & Data Intelligence (4 columns — second most prominent) */}
          <BentoCardWrapper
            category={aiCat}
            onOpenModal={setSelectedCategory}
            entranceDirection="right"
            entranceDelay={180}
            hasEntered={hasEntered}
          >
            <AIDataIntelligenceCardContent />
          </BentoCardWrapper>

          {/* Priority 3: Web Development (7 columns — medium-sized browser preview) */}
          <BentoCardWrapper
            category={webCat}
            onOpenModal={setSelectedCategory}
            entranceDirection="left"
            entranceDelay={280}
            hasEntered={hasEntered}
          >
            <WebDevelopmentCardContent />
          </BentoCardWrapper>

          {/* Priority 4: Design & Digital Creation (5 columns — creative production timeline) */}
          <BentoCardWrapper
            category={designCat}
            onOpenModal={setSelectedCategory}
            entranceDirection="right"
            entranceDelay={380}
            hasEntered={hasEntered}
          >
            <DesignDigitalCreationCardContent />
          </BentoCardWrapper>

          {/* Priority 5: Mobile Development (4 columns — compact smartphone mockup) */}
          <BentoCardWrapper
            category={mobileCat}
            onOpenModal={setSelectedCategory}
            entranceDirection="left"
            entranceDelay={480}
            hasEntered={hasEntered}
          >
            <MobileDevelopmentCardContent />
          </BentoCardWrapper>

          {/* Supporting Development Philosophy Statement (8 columns — not a skill card) */}
          <div
            className={`bento-philosophy-card bento-grid__item--philosophy ${philosophyEntranceClasses}`}
            style={{
              animationDelay: !prefersReducedMotion ? '560ms' : undefined,
            }}
            role="region"
            aria-label="Development Philosophy Statement"
          >
            <div className="philosophy-header">
              <span className="philosophy-tag">
                <span className="philosophy-dot" />
                DEVELOPMENT PHILOSOPHY // CORE TENETS
              </span>
              <span className="philosophy-status">FIRST PRINCIPLES</span>
            </div>

            <div className="philosophy-body">
              <h3 className="philosophy-headline">
                Architecture Before Implementation.
                <br />
                <span className="philosophy-headline-accent">Evidence Before Assumption.</span>
              </h3>
              <p className="philosophy-narrative">
                Great software is deterministic, legible, and built to endure. My technical focus prioritizes low-level algorithmic foundations, rigorous typed contracts, localized privacy-preserving intelligence, and fluid 60 FPS interfaces — choosing depth, resilience, and user respect over transient framework churn.
              </p>
            </div>

            <div className="philosophy-pillars">
              <div className="philosophy-pillar">
                <span className="pillar-num">01</span>
                <div className="pillar-content">
                  <span className="pillar-title">Algorithmic Determinism</span>
                  <span className="pillar-desc">Clean abstraction boundaries, predictable state machines, and zero-leak memory lifecycles.</span>
                </div>
              </div>

              <div className="philosophy-pillar">
                <span className="pillar-num">02</span>
                <div className="pillar-content">
                  <span className="pillar-title">Local-First Intelligence</span>
                  <span className="pillar-desc">On-device neural inference and zero-telemetry workflows that respect data sovereignty.</span>
                </div>
              </div>

              <div className="philosophy-pillar">
                <span className="pillar-num">03</span>
                <div className="pillar-content">
                  <span className="pillar-title">Ergonomic Craft</span>
                  <span className="pillar-desc">High-contrast accessibility standards (WCAG AAA) and instantaneous user feedback loops.</span>
                </div>
              </div>
            </div>

            <div className="philosophy-footer">
              <div className="philosophy-signature">
                <span className="sig-name">SAUREET CHAKRABARTI</span>
                <span className="sig-role">CS & AI DEVELOPER</span>
              </div>
              <div className="philosophy-meta-badges">
                <span className="meta-badge">CITATION TRACEABILITY</span>
                <span className="meta-badge">60 FPS RUNTIME</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Expanded Cinematic Details Panel / Mobile Swipe-Up Sheet */}
      <SkillDetailsModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSelectCategory={setSelectedCategory}
      />
    </Section>
  );
}
