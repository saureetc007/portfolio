import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Returns [ref, isVisible] — drives Motion animate props from scroll state.
 * Respects prefers-reduced-motion: immediately returns true if reduced motion.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.12, rootMargin = '0px 0px -6% 0px', once = true } = options;
  const ref = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion, threshold, rootMargin, once]);

  return [ref, isVisible] as const;
}

