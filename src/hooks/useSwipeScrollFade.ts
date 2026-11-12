import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type SwipeDirection = 'down' | 'up';

export interface SwipeScrollFadeOptions {
  threshold?: number;
  rootMargin?: string;
  initialVisible?: boolean;
  once?: boolean;
}

/**
 * useSwipeScrollFade
 * Tracks scroll and swipe gestures (both touch and wheel) to trigger
 * fluid, directional fade animations as sections enter the viewport.
 * Uses a generous viewport threshold and persistent reveal state to prevent
 * jarring disappearing/re-fading during normal reading.
 */
export function useSwipeScrollFade<T extends HTMLElement = HTMLElement>(
  options: SwipeScrollFadeOptions = {}
) {
  const {
    threshold = 0.05,
    rootMargin = '0px 0px -4% 0px',
    initialVisible = false,
    once = true,
  } = options;
  const ref = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean>(prefersReducedMotion || initialVisible);
  const [direction, setDirection] = useState<SwipeDirection>('down');
  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);

  // Global scroll & touch swipe direction tracking
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) return;

    let touchStartY = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollYRef.current;
      if (Math.abs(diff) > 4) {
        setDirection(diff > 0 ? 'down' : 'up');
        lastScrollYRef.current = currentY;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || !e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const diff = touchStartY - currentY;
      if (Math.abs(diff) > 8) {
        setDirection(diff > 0 ? 'down' : 'up');
        touchStartY = currentY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [prefersReducedMotion]);

  // Viewport intersection observer for directional fade reveals
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
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          // Generous hysteresis buffer (1.5 screens away) so reading never flickers
          const rect = entry.boundingClientRect;
          if (rect.bottom < -window.innerHeight * 1.5 || rect.top > window.innerHeight * 2) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion, threshold, rootMargin, once]);

  return { ref, isVisible, direction };
}

