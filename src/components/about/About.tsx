import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AcademicJourney } from './AcademicJourney';

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeading
        id="about-title"
        eyebrow="Academic Journey"
        title="Engineering by Building"
        description="Every engineer has a starting point. This is mine — from academic foundations to building technology."
      />

      <AcademicJourney />
    </Section>
  );
}
