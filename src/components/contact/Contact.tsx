import { useState } from 'react';
import { profile, socialLinks } from '@/data';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

function GithubIcon() {
  return (
    <svg className="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.37a1.64 1.64 0 1 0 1.64 1.63c0-.9-.73-1.63-1.64-1.63Z" />
    </svg>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handlePlaceholderCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <Section id="contact" labelledBy="contact-title" tone="alt">
      <div className="contact-cinema-card">
        <div className="contact-cinema-card__bg-glow" aria-hidden="true" />

        <div className="contact-cinema-card__inner">
          <SectionHeading
            id="contact-title"
            eyebrow="Get In Touch"
            title="Have an idea worth building?"
            description="Whether it's exploring an applied AI challenge, discussing open-source software, hackathons, or creative tech collaborations—I'd love to connect."
          />

          <Reveal delay={120}>
            <div className="contact-cinema-card__actions">
              {/* GitHub */}
              <a
                href={socialLinks.find((s) => s.id === 'github')?.href || 'https://github.com/saureetc007'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                <GithubIcon />
                <span>GitHub Profile</span>
              </a>

              {/* LinkedIn */}
              <a
                href={socialLinks.find((s) => s.id === 'linkedin')?.href || 'https://www.linkedin.com/in/saureet-chakrabarti-140a59238/'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary"
              >
                <LinkedInIcon />
                <span>LinkedIn Network</span>
              </a>

              {/* Email Button or Honest Placeholder */}
              {profile.email ? (
                <Button href={`mailto:${profile.email}`} variant="secondary">
                  Email Me
                </Button>
              ) : (
                <button
                  type="button"
                  className="btn btn--ghost contact__placeholder-btn"
                  onClick={handlePlaceholderCopy}
                  title="Click to copy notice: placeholder in src/data/profile.ts"
                >
                  <span>{copied ? '✓ Placeholder Noted' : 'Email: Add in profile.ts'}</span>
                </button>
              )}
            </div>

            <div className="contact__meta-hint">
              <span className="contact__meta-dot" />
              <span>Direct inquiries welcome via GitHub issues and LinkedIn messaging.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
