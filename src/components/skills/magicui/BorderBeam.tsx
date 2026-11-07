import { useReducedMotion } from '@/hooks/useReducedMotion';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

/**
 * BorderBeam inspired by magicuidesign/magicui
 * Smooth animated beam of light traveling around the border perimeter.
 */
export function BorderBeam({
  className = '',
  size = 200,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = '#E50914',
  colorTo = '#FFFFFF',
}: BorderBeamProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div
      style={
        {
          '--size': `${size}px`,
          '--duration': `${duration}s`,
          '--border-width': `${borderWidth}px`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
        } as React.CSSProperties
      }
      className={`border-beam ${className}`}
      aria-hidden="true"
    />
  );
}
