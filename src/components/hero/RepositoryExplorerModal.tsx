import { useEffect, useRef, useState } from 'react';
import { githubRepositories, developerTechStack } from '@/data/repositories';
import { TechIcon } from './TechIcons';
import { GitHubActivityCard } from './GitHubActivityCard';

interface RepositoryExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RepositoryExplorerModal({ isOpen, onClose }: RepositoryExplorerModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'repos' | 'tech' | 'activity'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredRepos = githubRepositories.filter((repo) => {
    const q = searchTerm.toLowerCase();
    return (
      repo.name.toLowerCase().includes(q) ||
      repo.description.toLowerCase().includes(q) ||
      repo.language.toLowerCase().includes(q) ||
      repo.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  const filteredTech = developerTechStack.filter((tech) => {
    const q = searchTerm.toLowerCase();
    return (
      tech.name.toLowerCase().includes(q) ||
      tech.role.toLowerCase().includes(q) ||
      tech.category.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="repo-explorer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="repo-explorer-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="repo-explorer-title"
      >
        {/* Header */}
        <div className="repo-explorer__header">
          <div className="repo-explorer__header-left">
            <span className="repo-explorer__badge-dot" aria-hidden="true" />
            <div>
              <h2 id="repo-explorer-title" className="repo-explorer__title">
                DEVELOPER COMMAND CENTER // REPOSITORY EXPLORER
              </h2>
              <div className="repo-explorer__meta">
                <a
                  href="https://github.com/saureetc007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-explorer__profile-link"
                >
                  GitHub: @saureetc007 ↗
                </a>
                <span>•</span>
                <span>{githubRepositories.length} Verified Repositories</span>
                <span>•</span>
                <span>{developerTechStack.length} Integrated Technologies</span>
              </div>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className="repo-explorer__close-btn"
            onClick={onClose}
            aria-label="Close repository explorer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Toolbar: Search & Filter Tabs */}
        <div className="repo-explorer__toolbar">
          <div className="repo-explorer__search-wrapper">
            <svg className="repo-explorer__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="repo-explorer__search-input"
              placeholder="Filter repositories or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search repositories and tools"
            />
            {searchTerm && (
              <button
                type="button"
                className="repo-explorer__clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="repo-explorer__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`repo-explorer__tab ${activeTab === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Items ({filteredRepos.length + filteredTech.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'repos'}
              className={`repo-explorer__tab ${activeTab === 'repos' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('repos')}
            >
              Repositories ({filteredRepos.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'tech'}
              className={`repo-explorer__tab ${activeTab === 'tech' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('tech')}
            >
              Technologies & Tools ({filteredTech.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'activity'}
              className={`repo-explorer__tab ${activeTab === 'activity' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity & Cadence
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="repo-explorer__body">
          {/* Section 0: Developer Activity Card */}
          {(activeTab === 'all' || activeTab === 'activity') && (
            <div className="repo-explorer__section repo-explorer__section--activity">
              <GitHubActivityCard />
            </div>
          )}

          {/* Section 1: Verified GitHub Repositories */}
          {(activeTab === 'all' || activeTab === 'repos') && (
            <div className="repo-explorer__section">
              <div className="repo-explorer__section-heading">
                <span className="repo-explorer__section-indicator" />
                <span>VERIFIED GITHUB REPOSITORIES</span>
                <span className="repo-explorer__count">({filteredRepos.length})</span>
              </div>

              <div className="repo-explorer__grid">
                {filteredRepos.map((repo) => (
                  <div key={repo.id} className="repo-card">
                    <div className="repo-card__top">
                      <div className="repo-card__title-group">
                        <span className="repo-card__icon" aria-hidden="true">📦</span>
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="repo-card__name"
                        >
                          {repo.name}
                        </a>
                      </div>
                      <span className={`repo-card__status-badge repo-card__status-badge--${repo.status}`}>
                        {repo.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="repo-card__desc">{repo.description}</p>

                    <div className="repo-card__tags">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="repo-card__tag">
                          #{topic}
                        </span>
                      ))}
                    </div>

                    <div className="repo-card__bottom">
                      <div className="repo-card__lang">
                        <span
                          className="repo-card__lang-dot"
                          style={{ backgroundColor: repo.languageColor }}
                          aria-hidden="true"
                        />
                        <span>{repo.language}</span>
                      </div>

                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-card__action-link"
                      >
                        View on GitHub ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Verified Core Technologies */}
          {(activeTab === 'all' || activeTab === 'tech') && (
            <div className="repo-explorer__section">
              <div className="repo-explorer__section-heading">
                <span className="repo-explorer__section-indicator" />
                <span>CORE TECHNOLOGIES & TOOLS</span>
                <span className="repo-explorer__count">({filteredTech.length})</span>
              </div>

              <div className="repo-explorer__grid repo-explorer__grid--tech">
                {filteredTech.map((tech) => (
                  <div key={tech.id} className="tech-card">
                    <div className="tech-card__header">
                      <div className="tech-card__icon-wrapper" style={{ borderColor: tech.color }}>
                        <TechIcon name={tech.iconName} size={22} />
                      </div>
                      <div className="tech-card__meta">
                        <h3 className="tech-card__name">{tech.name}</h3>
                        <span className="tech-card__category">{tech.category.toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="tech-card__role">{tech.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="repo-explorer__footer">
          <span className="repo-explorer__footer-note">
            All repositories linked to verified GitHub profile @saureetc007 • Zero placeholder star counts
          </span>
          <a
            href="https://github.com/saureetc007"
            target="_blank"
            rel="noopener noreferrer"
            className="repo-explorer__footer-btn"
          >
            Visit Full GitHub Profile ↗
          </a>
        </div>
      </div>
    </div>
  );
}

