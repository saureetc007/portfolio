import { useState, useEffect, useRef, useCallback } from 'react';
import { bentoSkillCategories, type BentoSkillCategory } from '@/data/skills';
import { SkillIcon } from './SkillIcons';
import { CodeEngineeringCardContent } from './CodeEngineeringCardContent';
import { WebDevelopmentCardContent } from './WebDevelopmentCardContent';
import { AIDataIntelligenceCardContent } from './AIDataIntelligenceCardContent';
import { DesignDigitalCreationCardContent } from './DesignDigitalCreationCardContent';
import { MobileDevelopmentCardContent } from './MobileDevelopmentCardContent';

interface SkillDetailsModalProps {
  category: BentoSkillCategory | null;
  onClose: () => void;
  onSelectCategory?: (category: BentoSkillCategory) => void;
}

export function SkillDetailsModal({
  category,
  onClose,
  onSelectCategory,
}: SkillDetailsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [expandedTechId, setExpandedTechId] = useState<string | null>(null);

  // Mobile touch drag states for swipe-down to dismiss and horizontal swipe to navigate
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const currentIndex = category
    ? bentoSkillCategories.findIndex((c) => c.id === category.id)
    : -1;

  const goToNextCategory = useCallback(() => {
    if (currentIndex === -1 || !onSelectCategory) return;
    const nextIdx = (currentIndex + 1) % bentoSkillCategories.length;
    onSelectCategory(bentoSkillCategories[nextIdx]!);
  }, [currentIndex, onSelectCategory]);

  const goToPrevCategory = useCallback(() => {
    if (currentIndex === -1 || !onSelectCategory) return;
    const prevIdx = (currentIndex - 1 + bentoSkillCategories.length) % bentoSkillCategories.length;
    onSelectCategory(bentoSkillCategories[prevIdx]!);
  }, [currentIndex, onSelectCategory]);

  // Keyboard navigation: Escape closes, Left/Right arrows cycle categories
  useEffect(() => {
    if (!category) return;
    setExpandedTechId(null);
    setDragOffsetY(0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextCategory();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevCategory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [category, onClose, goToNextCategory, goToPrevCategory]);

  if (!category) return null;

  // Touch handlers for mobile bottom-sheet gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    if (!touch) return;

    const deltaY = touch.clientY - touchStart.y;
    const deltaX = touch.clientX - touchStart.x;

    // Check if body is scrolled to the top
    const bodyEl = dialogRef.current?.querySelector('.skill-modal__body');
    const isAtTop = bodyEl ? bodyEl.scrollTop <= 0 : true;

    // Only drag down if near top of modal and mostly vertical
    if (deltaY > 0 && isAtTop && Math.abs(deltaY) > Math.abs(deltaX)) {
      setDragOffsetY(deltaY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) {
      setIsDragging(false);
      setDragOffsetY(0);
      return;
    }

    const touch = e.changedTouches[0];
    if (touch) {
      const deltaY = touch.clientY - touchStart.y;
      const deltaX = touch.clientX - touchStart.x;

      // 1. Drag down dismissal threshold: > 70px
      if (deltaY > 70 && Math.abs(deltaY) > Math.abs(deltaX) * 1.1) {
        onClose();
        setIsDragging(false);
        setDragOffsetY(0);
        setTouchStart(null);
        return;
      }

      // 2. Horizontal swipe navigation between categories: > 50px
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        if (deltaX < 0) {
          // Swiped left -> Next category
          goToNextCategory();
        } else {
          // Swiped right -> Previous category
          goToPrevCategory();
        }
      }
    }

    setIsDragging(false);
    setDragOffsetY(0);
    setTouchStart(null);
  };

  const renderVisualPreview = () => {
    switch (category.id) {
      case 'code-engineering':
        return <CodeEngineeringCardContent />;
      case 'web-development':
        return <WebDevelopmentCardContent />;
      case 'ai-data-intelligence':
        return <AIDataIntelligenceCardContent />;
      case 'design-digital-creation':
        return <DesignDigitalCreationCardContent />;
      case 'mobile-development':
        return <MobileDevelopmentCardContent />;
      default:
        return null;
    }
  };

  const dialogTransform = dragOffsetY > 0 ? `translate3d(0, ${dragOffsetY}px, 0)` : undefined;

  return (
    <div
      className="skill-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="skill-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-details-title"
        aria-describedby="skill-details-desc"
        style={{
          transform: dialogTransform,
          transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Swipe-Down Handle */}
        <div className="skill-modal__drag-handle-wrapper" aria-hidden="true">
          <div className="skill-modal__drag-handle-pill" />
        </div>

        {/* Category Navigation Pills / Dots Header */}
        <div className="skill-modal__category-nav" role="tablist" aria-label="Switch Skill Category">
          {bentoSkillCategories.map((cat) => {
            const isActive = cat.id === category.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`category-nav-pill ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelectCategory?.(cat)}
                title={`Switch to ${cat.number} ${cat.title}`}
              >
                <span className="pill-dot" />
                <span className="pill-num">{cat.number}</span>
                <span className="pill-name">{cat.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Header */}
        <div className="skill-modal__header">
          <div className="skill-modal__header-left">
            <div className="skill-modal__badge-row">
              <span className="skill-modal__num">{category.number}</span>
              <span className="skill-modal__badge">{category.badge}</span>
            </div>
            <h2 id="skill-details-title" className="skill-modal__title">
              {category.title}
            </h2>
            <p className="skill-modal__subtitle">{category.subtitle}</p>
          </div>

          <div className="skill-modal__header-actions">
            {/* Quick Category Cycling Arrows */}
            {onSelectCategory && (
              <div className="skill-modal__nav-controls" aria-label="Cycle categories">
                <button
                  type="button"
                  className="skill-modal__nav-arrow-btn"
                  onClick={goToPrevCategory}
                  title="Previous Category (Left Arrow)"
                  aria-label="Previous Category"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span className="skill-modal__nav-counter">
                  {currentIndex + 1} / {bentoSkillCategories.length}
                </span>
                <button
                  type="button"
                  className="skill-modal__nav-arrow-btn"
                  onClick={goToNextCategory}
                  title="Next Category (Right Arrow)"
                  aria-label="Next Category"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              ref={closeBtnRef}
              type="button"
              className="skill-modal__close-btn"
              onClick={onClose}
              aria-label="Close skill details"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="skill-modal__body">
          {/* Detailed Architectural Overview */}
          <section className="skill-modal__section">
            <h3 className="section-title">ENGINEERING OVERVIEW</h3>
            <p id="skill-details-desc" className="section-p">
              {category.description}
            </p>
          </section>

          {/* Interactive Workspace Preview */}
          <section className="skill-modal__section">
            <h3 className="section-title">INTERACTIVE WORKSPACE PREVIEW</h3>
            <div className="skill-modal__preview-wrapper">
              {renderVisualPreview()}
            </div>
          </section>

          {/* Exact Technologies Grid with Expandable Chips */}
          <section className="skill-modal__section">
            <h3 className="section-title">
              VERIFIED TECHNOLOGIES ({category.technologies.length}) — Click chip to expand
            </h3>
            <div className="skill-modal__tech-grid">
              {category.technologies.map((tech) => {
                const isExpanded = expandedTechId === tech.id;
                return (
                  <div
                    key={tech.id}
                    className={`tech-spec-card ${isExpanded ? 'is-expanded' : ''}`}
                    onClick={() => setExpandedTechId(isExpanded ? null : tech.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedTechId(isExpanded ? null : tech.id);
                      }
                    }}
                    aria-expanded={isExpanded}
                  >
                    <div className="tech-spec-top">
                      <div className="tech-spec-icon-wrapper" aria-hidden="true">
                        <SkillIcon name={tech.icon} size={22} />
                      </div>
                      <div className="tech-spec-header-info">
                        <span className="tech-spec-name">{tech.name}</span>
                        <span className="tech-spec-expand-hint">
                          {isExpanded ? '▲ Less' : '▼ More'}
                        </span>
                      </div>
                    </div>
                    <p className="tech-spec-role">{tech.role}</p>
                    <div className="tech-spec-footer">
                      <span className="tech-status-dot" aria-hidden="true" />
                      <span className="tech-status-text">Production / Active Stack</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Related Projects and Verified Evidence */}
          {category.relatedProjects && category.relatedProjects.length > 0 && (
            <section className="skill-modal__section">
              <h3 className="section-title">RELATED REPOSITORIES & REAL PROJECTS</h3>
              <div className="skill-modal__projects-grid">
                {category.relatedProjects.map((proj) => (
                  <div key={proj.id} className="related-project-card">
                    <div className="related-project-top">
                      <span className="related-project-title">{proj.title}</span>
                      {proj.repoName && (
                        <span className="related-project-repo">{proj.repoName}</span>
                      )}
                    </div>
                    <p className="related-project-role">{proj.role}</p>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="related-project-link"
                      >
                        <span>View Repository</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" aria-hidden="true">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="skill-modal__footer">
          <div className="skill-modal__footer-meta">
            <span className="meta-dot" aria-hidden="true" />
            <span>Saureet Chakrabarti // CS & AI Portfolio</span>
          </div>
          <button
            type="button"
            className="skill-modal__done-btn"
            onClick={onClose}
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
