import { useState } from 'react';
import { motion } from 'motion/react';
import { profile, socialLinks } from '@/data';
import { Section } from '@/components/layout/Section';
import { ContactForm } from './ContactForm';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ease, dur, stagger as staggerTokens } from '@/lib/motion-presets';

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="contact-social-glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="contact-social-glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.37a1.64 1.64 0 1 0 1.64 1.63c0-.9-.73-1.63-1.64-1.63Z" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg className="contact-social-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const emailAddress = profile.email || 'saureetc007@gmail.com';
  const [contactRef, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailAddress);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = emailAddress;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback display
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const githubUrl =
    socialLinks.find((s) => s.id === 'github')?.href || 'https://github.com/saureetc007';
  const linkedinUrl =
    socialLinks.find((s) => s.id === 'linkedin')?.href ||
    'https://www.linkedin.com/in/saureet-chakrabarti-140a59238/';

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerTokens.sm,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur.slow, ease: ease.cinematic },
    },
  };

  return (
    <Section id="contact" labelledBy="contact-title" tone="alt">
      <div
        ref={contactRef}
        className="contact-section"
        onMouseMove={handleMouseMove}
        style={{
          '--contact-mouse-x': `${mousePos.x}%`,
          '--contact-mouse-y': `${mousePos.y}%`,
        } as React.CSSProperties}
      >
        <div
          className="contact-section__ambient-atmosphere"
          style={{
            background: `radial-gradient(ellipse 65% 45% at var(--contact-mouse-x, 50%) var(--contact-mouse-y, 0%), rgba(229, 9, 20, 0.10) 0%, rgba(139, 0, 0, 0.03) 45%, transparent 75%)`,
            transition: 'background 0.2s ease-out',
          }}
          aria-hidden="true"
        />

        <div className="contact-grid">
          {/* ==============================================================
              LEFT COLUMN: INVITATION & DIRECT CHANNELS (Staggered motion)
              ============================================================== */}
          <motion.div
            className="contact-info-col"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
          >
            <motion.div variants={itemVariants}>
              <div className="contact-eyebrow">
                <span className="contact-eyebrow-dash" aria-hidden="true" />
                <span>Get In Touch</span>
              </div>
              <h2 id="contact-title" className="contact-headline">
                Have an idea worth building?
              </h2>
            </motion.div>

            <motion.p className="contact-narrative" variants={itemVariants}>
              Whether it&apos;s exploring an applied AI challenge, discussing open-source software,
              hackathons, or creative tech collaborations—I&apos;d love to connect.
            </motion.p>

            {/* Restrained Availability Indicator */}
            <motion.div className="contact-availability-badge" variants={itemVariants}>
              <span className="contact-availability-dot" aria-hidden="true" />
              <span>Open to select technical collaborations &amp; engineering discussions</span>
            </motion.div>

            {/* Clickable Email Card with Copy Interaction */}
            <motion.div className="contact-direct-card" variants={itemVariants}>
              <div className="contact-direct-main">
                <div className="contact-direct-icon-wrap" aria-hidden="true">
                  <MailIcon />
                </div>
                <div className="contact-direct-meta">
                  <span className="contact-direct-label">Direct Inbox</span>
                  <a
                    href={`mailto:${emailAddress}`}
                    className="contact-direct-email-link"
                    title="Click to write email via your default mail client"
                  >
                    {emailAddress}
                  </a>
                </div>
              </div>

              <button
                type="button"
                className={`contact-copy-btn ${copied ? 'is-copied' : ''}`}
                onClick={handleCopyEmail}
                aria-label={copied ? 'Email address copied' : 'Copy email address to clipboard'}
              >
                {copied ? (
                  <>
                    <CheckIcon />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* Social Network Access Cards */}
            <motion.div
              className="contact-social-grid"
              aria-label="Social and developer profiles"
              variants={itemVariants}
            >
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-card"
                aria-label="GitHub Profile — opens in a new tab"
              >
                <div className="contact-social-lead">
                  <GithubIcon />
                  <div className="contact-social-text">
                    <span className="contact-social-title">GitHub</span>
                    <span className="contact-social-handle">@saureetc007</span>
                  </div>
                </div>
                <ExternalArrowIcon />
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-card"
                aria-label="LinkedIn Network — opens in a new tab"
              >
                <div className="contact-social-lead">
                  <LinkedInIcon />
                  <div className="contact-social-text">
                    <span className="contact-social-title">LinkedIn</span>
                    <span className="contact-social-handle">Saureet Chakrabarti</span>
                  </div>
                </div>
                <ExternalArrowIcon />
              </a>
            </motion.div>

            {/* Alternative Direct Option */}
            <motion.p className="contact-alt-note" variants={itemVariants}>
              Prefer direct email? Send a message anytime to{' '}
              <a href={`mailto:${emailAddress}`} className="contact-alt-link">
                {emailAddress}
              </a>
            </motion.p>
          </motion.div>

          {/* ==============================================================
              RIGHT COLUMN: FUNCTIONAL CONTACT FORM (Animated reveal)
              ============================================================== */}
          <motion.div
            className="contact-form-col"
            initial={{ opacity: 0, y: 32 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: dur.cinematic, ease: ease.cinematic, delay: 0.15 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
