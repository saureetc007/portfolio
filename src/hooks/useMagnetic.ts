import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface MagneticOptions {
  strength?: number; // 0 to 1, default 0.35
  radius?: number;   // Max distance in px, default 16
}

/**
 * useMagnetic — Smooth magnetic button attraction.
 * Gently pulls the element toward the cursor when hovering near its center,
 * then springs smoothly back to resting position on mouse leave.
 * Respects prefers-reduced-motion and pointer: coarse.
 */
export function useMagnetic<T extends HTMLElement>(options: MagneticOptions = {}) {
  const { strength = 0.35, radius = 18 } = options;
  const ref = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const loop = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Smooth spring-like lerp with friction
    posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.22;
    posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.22;

    const { x, y } = posRef.current;
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

    // Keep ticking while moving
    const dist = Math.hypot(targetRef.current.x - x, targetRef.current.y - y);
    if (dist > 0.1 || Math.hypot(x, y) > 0.1) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      el.style.transform = '';
      rafRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el || prefersReducedMotion) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Bound within maximum radius
      const pullX = Math.max(-radius, Math.min(radius, deltaX * strength));
      const pullY = Math.max(-radius, Math.min(radius, deltaY * strength));

      targetRef.current = { x: pullX, y: pullY };

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    },
    [strength, radius, prefersReducedMotion, loop]
  );

  const handleMouseLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(loop);
    }
  }, [loop]);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion, handleMouseMove, handleMouseLeave]);

  return ref;
}
