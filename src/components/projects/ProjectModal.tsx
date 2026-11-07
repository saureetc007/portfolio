import { useEffect, useRef } from 'react';
import type { Project } from '@/types/content';
import { StatusBadge } from '@/components/ui/StatusBadge';

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    // Save previous focus
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector<HTMLButtonElement>('.project-modal__close-btn');
      closeBtn?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(timer);
      // Restore previous focus
      previousFocusRef.current?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  const formattedRank = project.rank < 10 ? `0${project.rank}` : `${project.rank}`;

  return (
    <div
      className="project-modal-backdrop"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-project-title"
    >
      <div
        className="project-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          className="project-modal__close-btn"
          onClick={onClose}
          aria-label="Close project modal (Escape)"
          title="Close modal (Escape)"
        >
          <CloseIcon />
        </button>

        {/* Modal Media Banner */}
        <div className="project-modal__header-media">
          <img
            src={project.thumbnail}
            alt=""
            className="project-modal__header-img"
          />
          <div className="project-modal__header-scrim" />

          <div className="project-modal__header-overlay">
            <div className="project-modal__rank-badge">
              <span>TOP 10 · #{formattedRank} IN PORTFOLIO</span>
            </div>
            <h2 id="modal-project-title" className="project-modal__title">
              {project.title}
            </h2>
            <p className="project-modal__tagline">{project.tagline}</p>
          </div>
        </div>

        {/* Modal Content Details */}
        <div className="project-modal__body">
          <div className="project-modal__meta-bar">
            <StatusBadge status={project.status} />

            <div className="project-modal__actions">
              {project.links.repo ? (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary btn--sm"
                >
                  <GithubIcon />
                  <span>View Repository</span>
                </a>
              ) : (
                <span
                  className="btn btn--disabled btn--sm"
                  aria-disabled="true"
                  title="Repository not publicly linked yet"
                >
                  <GithubIcon />
                  <span>Repo: Unverified / Private</span>
                </span>
              )}
            </div>
          </div>

          <div className="project-modal__grid">
            {/* Left Column: Architectural Details */}
            <div className="project-modal__details-column">
              <div className="project-modal__section">
                <h3 className="project-modal__heading">The Problem</h3>
                <p className="project-modal__text">
                  {project.detail.problem ||
                    'Project problem space and technical constraints currently in development.'}
                </p>
              </div>

              <div className="project-modal__section">
                <h3 className="project-modal__heading">The Approach</h3>
                <p className="project-modal__text">
                  {project.detail.approach ||
                    'Architectural approach and exploratory solution design.'}
                </p>
              </div>

              {project.detail.techChoices && (
                <div className="project-modal__section">
                  <h3 className="project-modal__heading">Technical Choices</h3>
                  <p className="project-modal__text">{project.detail.techChoices}</p>
                </div>
              )}

              {project.detail.implementation && (
                <div className="project-modal__section">
                  <h3 className="project-modal__heading">Implementation</h3>
                  <p className="project-modal__text">{project.detail.implementation}</p>
                </div>
              )}

              {project.detail.lessons && (
                <div className="project-modal__section">
                  <h3 className="project-modal__heading">Key Learnings</h3>
                  <p className="project-modal__text">{project.detail.lessons}</p>
                </div>
              )}
            </div>

            {/* Right Column: Stack & Metadata */}
            <div className="project-modal__sidebar">
              <div className="project-modal__sidebar-box">
                <h4 className="project-modal__sidebar-label">Technologies</h4>
                <div className="project-modal__tech-chips">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="project-modal__sidebar-box">
                <h4 className="project-modal__sidebar-label">GitHub Profile</h4>
                <p className="project-modal__sidebar-text">
                  Verify repositories and open-source contributions directly:
                </p>
                <a
                  href="https://github.com/saureetc007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal__link"
                >
                  github.com/saureetc007 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
