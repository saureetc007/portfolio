import type { Project } from '@/types/content';
import { StatusBadge } from '@/components/ui/StatusBadge';

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function Top10Card({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) {
  return (
    <div
      className="top10-card"
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
      aria-label={`View details for #${project.rank}: ${project.title}`}
    >
      {/* Oversized Number (Netflix Style) */}
      <div className="top10-card__rank-wrapper" aria-hidden="true">
        <span className="top10-card__rank-number">{project.rank}</span>
      </div>

      {/* Main Thumbnail Card */}
      <div className="top10-card__surface">
        <div className="top10-card__media">
          <img
            src={project.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="top10-card__img"
          />
          <div className="top10-card__media-scrim" />
          <div className="top10-card__badge-pos">
            <StatusBadge status={project.status} />
          </div>
        </div>

        <div className="top10-card__content">
          <h4 className="top10-card__title">{project.title}</h4>
          <p className="top10-card__summary">{project.summary}</p>

          <div className="top10-card__tags">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="top10-card__tag">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="top10-card__tag top10-card__tag--more">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          <div className="top10-card__actions">
            <button
              type="button"
              className="top10-card__info-btn"
              tabIndex={-1}
              aria-hidden="true"
            >
              <InfoIcon />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

