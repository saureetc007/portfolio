import { skillRows } from '@/data';

/**
 * Readable alternative to the 3D skills map. It is the permanent accessible /
 * no-WebGL fallback required by the spec, and it is already complete.
 */
export function SkillsList() {
  return (
    <div className="skills-list">
      {skillRows.map((row) => (
        <div key={row.id} className="skills-list__group">
          <h3 className="skills-list__title">{row.title}</h3>
          <ul className="cluster" aria-label={`${row.title} skills`}>
            {row.skills.map((skill) => (
              <li key={skill.id} className="chip">
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
