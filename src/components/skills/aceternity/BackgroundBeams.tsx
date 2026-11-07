import { useReducedMotion } from '@/hooks/useReducedMotion';

interface BackgroundBeamsProps {
  className?: string;
}

/**
 * BackgroundBeams inspired by aceternity/aceternity-ui
 * Ambient cinematic beam paths that softly illuminate neural & data elements.
 */
export function BackgroundBeams({ className = '' }: BackgroundBeamsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className={`aceternity-beams ${className}`} aria-hidden="true">
      <svg
        className="beams-svg"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="beam-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E50914" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="beam-path-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E50914" stopOpacity="0" />
            <stop offset="50%" stopColor="#E50914" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Beams */}
        <path
          d="M -50,180 Q 150,20 450,160"
          stroke="url(#beam-path-1)"
          strokeWidth="1.5"
          className="beam-line beam-line--1"
        />
        <path
          d="M -30,40 Q 200,190 430,30"
          stroke="url(#beam-path-1)"
          strokeWidth="1.2"
          className="beam-line beam-line--2"
        />
        <circle cx="200" cy="100" r="90" fill="url(#beam-glow)" />
      </svg>
    </div>
  );
}
