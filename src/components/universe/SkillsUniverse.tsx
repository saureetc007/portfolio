import { useState } from 'react';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { UniverseScene } from './UniverseScene';
import { SkillsList } from './SkillsList';

export function SkillsUniverse() {
  const [showList, setShowList] = useState(false);

  return (
    <Section id="universe" labelledBy="universe-title" tone="alt">
      <div className="universe-section-header">
        <SectionHeading
          id="universe-title"
          eyebrow="Spatial Architecture"
          title="Interactive 3D Skills Universe"
          description="Explore the connected network of technologies, foundational domains, and ongoing research areas. Node positions and line filaments reflect actual architectural relationships."
        />

        <div className="universe-view-toggle">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => setShowList((v) => !v)}
            aria-expanded={showList}
          >
            {showList ? 'Hide Text Index' : 'Show Accessible Text Index'}
          </button>
        </div>
      </div>

      {/* Interactive 3D WebGL Scene */}
      <UniverseScene />

      {/* Accessible Alternative List */}
      {showList && (
        <div className="universe-accessible-wrapper" id="skills-accessible-list">
          <h3 className="universe-accessible-heading">
            Categorized Skill Index (Accessible Architecture)
          </h3>
          <SkillsList />
        </div>
      )}
    </Section>
  );
}
