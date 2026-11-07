import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface HoloSheenOverlayProps {
  isHovered: boolean;
  accentColor?: string;
  isHero?: boolean;
}

/**
 * HoloSheenOverlay inspired by PoloGarcia/spin-card-react-web
 * High-performance holographic foil and specular glare sheen driven by inherited CSS custom properties.
 */
export function HoloSheenOverlay({
  isHovered,
  accentColor = '#E50914',
  isHero = false,
}: HoloSheenOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div
      className={`spin-card-holo-container ${isHero ? 'is-hero-holo' : ''} ${isHovered ? 'is-holo-active' : ''}`}
      style={{
        '--card-accent-rgb': accentColor === '#E50914' ? '229, 9, 20' : '220, 38, 38',
      } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* 1. Multi-Stop Holographic Foil Diffraction Sheen */}
      <div className="spin-card-holo__foil" />

      {/* 2. Specular Light Glare Hotspot */}
      <div className="spin-card-holo__glare" />

      {/* 3. Subtle Dimensional Card Edge Refraction */}
      <div className="spin-card-holo__edge" />
    </div>
  );
}
