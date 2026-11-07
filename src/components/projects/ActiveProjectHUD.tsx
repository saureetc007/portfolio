import type { Project } from '@/types/content';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface ActiveProjectHUDProps {
  project: Project;
  onOpenModal: (project: Project) => void;
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
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

/**
 * ActiveProjectHUD — Cinematic details and actions for the currently active Coverflow card
 */
export function ActiveProjectHUD({ project, onOpenModal }: ActiveProjectHUDProps) {
  const formattedRank = project.rank < 10 ? `0${project.rank}` : `${project.rank}`;

  return (
    <aside className="coverflow-hud" aria-label={`Active project: ${project.title}`}>
      {/* Top Row: Rank, Title & Status */}
      <div className="coverflow-hud__top-row">
        <div className="coverflow-hud__title-group">
          <span className="coverflow-hud__rank">#{formattedRank} IN PORTFOLIO</span>
          <h3 className="coverflow-hud__title">{project.title}</h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Summary Description */}
      <p className="coverflow-hud__summary">{project.summary}</p>

      {/* Bottom Row: Tech Chips & Action CTAs */}
      <div className="coverflow-hud__bottom-row">
        <div className="coverflow-hud__tech-list" aria-label="Core technologies">
          {project.technologies.map((tech) => (
            <span key={tech} className="coverflow-hud__tech-chip">
              {tech}
            </span>
          ))}
        </div>

        <div className="coverflow-hud__actions">
          <button
            type="button"
            className="coverflow-hud__cta-btn coverflow-hud__cta-btn--primary"
            onClick={() => onOpenModal(project)}
            title={`View full engineering architecture for ${project.title}`}
          >
            <InfoIcon />
            <span>More Info</span>
          </button>

          {project.links.repo ? (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="coverflow-hud__cta-btn coverflow-hud__cta-btn--secondary"
              title="Open GitHub repository"
            >
              <GithubIcon />
              <span>GitHub</span>
            </a>
          ) : (
            <button
              type="button"
              className="coverflow-hud__cta-btn coverflow-hud__cta-btn--secondary"
              onClick={() => onOpenModal(project)}
              title="Inspect project details"
            >
              <span>Explore Architecture →</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

