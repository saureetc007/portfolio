import type { Skill } from '@/types/content';
import { cx } from '@/lib/cx';

export function SkillCard({ skill }: { skill: Skill }) {
  const isExploring = skill.status === 'exploring';

  return (
    <div className={cx('skill-card', isExploring && 'skill-card--exploring')}>
      <div className="skill-card__inner">
        <div className="skill-card__top">
          <div className="skill-card__mark" aria-hidden="true">
            <span className="skill-card__mark-glow" />
            <span className="skill-card__mark-symbol">&lt;/&gt;</span>
          </div>
          {isExploring && (
            <span className="skill-card__badge">EXPLORING</span>
          )}
        </div>

        <div className="skill-card__body">
          <h4 className="skill-card__name">{skill.name}</h4>
          {skill.description && (
            <p className="skill-card__desc">{skill.description}</p>
          )}
        </div>

        <div className="skill-card__footer">
          <span className="skill-card__status-dot" aria-hidden="true" />
          <span className="skill-card__status-text">
            {isExploring ? 'Active Study' : 'Applied Skill'}
          </span>
        </div>
      </div>
    </div>
  );
}

