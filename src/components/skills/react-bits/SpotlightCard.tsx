import { type ReactNode, type CSSProperties } from 'react';

export interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  borderColor?: string;
  isHero?: boolean;
  style?: CSSProperties;
}

/**
 * SpotlightCard inspired by DavidHDev/react-bits
 * Provides cursor-following radial spotlight and ambient card glow.
 * Reads --spotlight-x and --spotlight-y from parent card.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(229, 9, 20, 0.22)',
  spotlightSize = 420,
  borderColor = 'rgba(229, 9, 20, 0.45)',
  isHero = false,
  style = {},
}: SpotlightCardProps) {
  return (
    <div
      className={`react-bits-spotlight-card ${isHero ? 'is-hero-card' : ''} ${className}`}
      style={{
        ...style,
        '--spotlight-color': spotlightColor,
        '--spotlight-size': `${spotlightSize}px`,
        '--spotlight-border': borderColor,
      } as CSSProperties}
    >
      {/* React Bits Cursor Spotlight Radial Gradient */}
      <div className="react-bits-spotlight-card__spotlight" aria-hidden="true" />

      {/* Card Content */}
      {children}
    </div>
  );
}
