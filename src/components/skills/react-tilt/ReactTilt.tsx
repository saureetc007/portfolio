import { useState, useRef, useCallback, useEffect, type MouseEvent, type ReactNode, type CSSProperties } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ReactTiltProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number; // max tilt rotation (deg)
  perspective?: number; // transform perspective (px)
  scale?: number; // 2D scale on hover
  speed?: number; // transition speed on leave (ms)
  reverse?: boolean; // reverse tilt direction
  axis?: 'x' | 'y' | null; // limit tilt to axis
  onHoverChange?: (isHovered: boolean) => void;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  role?: string;
  tabIndex?: number;
  'aria-haspopup'?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | boolean;
  'aria-label'?: string;
}

/**
 * ReactTilt inspired by gfazioli/react-tilt
 * High-performance, zero-re-render 3D tilt with smooth rAF synchronization and spring reset.
 */
export function ReactTilt({
  children,
  className = '',
  style = {},
  max = 4.2,
  perspective = 1000,
  scale = 1.012,
  speed = 400,
  reverse = false,
  axis = null,
  onHoverChange,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  'aria-haspopup': ariaHasPopup,
  'aria-label': ariaLabel,
}: ReactTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !containerRef.current || !isHoveredRef.current) return;
      const el = containerRef.current;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const multiplier = reverse ? -1 : 1;
      let tiltX = -((y - centerY) / centerY) * max * multiplier;
      let tiltY = ((x - centerX) / centerX) * max * multiplier;

      if (axis === 'x') tiltY = 0;
      if (axis === 'y') tiltX = 0;

      const dx = xPercent - 50;
      const dy = yPercent - 50;
      const holoAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 135;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
        if (!el || !isHoveredRef.current) return;
        el.style.setProperty('--spotlight-x', `${x}px`);
        el.style.setProperty('--spotlight-y', `${y}px`);
        el.style.setProperty('--glare-x', `${xPercent.toFixed(1)}%`);
        el.style.setProperty('--glare-y', `${yPercent.toFixed(1)}%`);
        el.style.setProperty('--holo-angle', `${holoAngle.toFixed(1)}deg`);
        el.style.transform = `perspective(${perspective}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`;
      });
    },
    [prefersReducedMotion, max, reverse, axis, perspective, scale]
  );

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    setIsHovered(true);
    onHoverChange?.(true);

    if (containerRef.current && !prefersReducedMotion) {
      containerRef.current.style.transition = 'transform 0.08s ease-out';
    }
  }, [prefersReducedMotion, onHoverChange]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    setIsHovered(false);
    onHoverChange?.(false);

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (containerRef.current && !prefersReducedMotion) {
      containerRef.current.style.transition = `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      containerRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  }, [prefersReducedMotion, speed, perspective, onHoverChange]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`react-tilt-container ${isHovered ? 'is-tilt-active' : ''} ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      aria-haspopup={ariaHasPopup}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

export interface TiltParallaxLayerProps {
  children: ReactNode;
  depth?: number; // translateZ in pixels (e.g. 0, 4, 8)
  className?: string;
  style?: CSSProperties;
}

/**
 * TiltParallaxLayer component with restrained translateZ to eliminate 3D clipping pops
 */
export function TiltParallaxLayer({
  children,
  depth = 0,
  className = '',
  style = {},
}: TiltParallaxLayerProps) {
  const prefersReducedMotion = useReducedMotion();

  // Clamp depth to 6px max to prevent 3D clipping issues with rounded overflow
  const clampedDepth = Math.min(depth, 6);
  const layerTransform = prefersReducedMotion || clampedDepth === 0
    ? undefined
    : `translateZ(${clampedDepth}px)`;

  return (
    <div
      className={`tilt-parallax-layer ${className}`}
      style={{
        ...style,
        transform: layerTransform,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
