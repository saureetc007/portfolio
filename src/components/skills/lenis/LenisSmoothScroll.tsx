import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface LenisScrollData {
  scroll: number;
  velocity: number;
  direction: 1 | -1 | 0;
  progress: number;
}

type LenisListener = (data: LenisScrollData) => void;

class LenisController {
  private listeners: Set<LenisListener> = new Set();
  private targetScroll: number = 0;
  private currentScroll: number = 0;
  private velocity: number = 0;
  private isRunning: boolean = false;
  private animFrameId: number | null = null;
  private lerpFactor: number = 0.1;
  private isReducedMotion: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentScroll = window.scrollY;
      this.targetScroll = window.scrollY;
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  public subscribe(fn: LenisListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public start() {
    if (typeof window === 'undefined' || this.isRunning || this.isReducedMotion) return;
    this.isRunning = true;

    window.addEventListener('scroll', this.handleNativeScroll, { passive: true });
    window.addEventListener('click', this.handleAnchorClick);
  }

  public stop() {
    if (typeof window === 'undefined') return;
    this.isRunning = false;
    window.removeEventListener('scroll', this.handleNativeScroll);
    window.removeEventListener('click', this.handleAnchorClick);
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private handleNativeScroll = () => {
    this.targetScroll = window.scrollY;
    if (!this.animFrameId) {
      this.animFrameId = requestAnimationFrame(this.tick);
    }
  };

  private handleAnchorClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        this.scrollTo(el as HTMLElement);
      }
    }
  };

  public scrollTo(target: HTMLElement | number, duration: number = 800) {
    if (typeof window === 'undefined') return;
    const dest = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY - 40;

    if (this.isReducedMotion) {
      window.scrollTo({ top: dest, behavior: 'auto' });
      return;
    }

    const start = window.scrollY;
    const distance = dest - start;
    const startTime = performance.now();

    const animateScroll = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }

  private tick = () => {
    const diff = this.targetScroll - this.currentScroll;
    this.velocity = diff * this.lerpFactor;
    this.currentScroll += this.velocity;

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, this.currentScroll / maxScroll));
    const direction = this.velocity > 0.05 ? 1 : this.velocity < -0.05 ? -1 : 0;

    const data: LenisScrollData = {
      scroll: this.currentScroll,
      velocity: this.velocity,
      direction,
      progress,
    };

    this.listeners.forEach((listener) => listener(data));

    if (Math.abs(diff) > 0.3) {
      this.animFrameId = requestAnimationFrame(this.tick);
    } else {
      this.currentScroll = this.targetScroll;
      this.velocity = 0;
      this.animFrameId = null;
    }
  };
}

export const lenisGlobal = new LenisController();

/**
 * Hook to read Lenis scroll state, scroll velocity, and parallax factors
 */
export function useLenis(): LenisScrollData {
  const [scrollData, setScrollData] = useState<LenisScrollData>({
    scroll: typeof window !== 'undefined' ? window.scrollY : 0,
    velocity: 0,
    direction: 0,
    progress: 0,
  });

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    lenisGlobal.start();
    const unsubscribe = lenisGlobal.subscribe(setScrollData);
    return () => {
      unsubscribe();
    };
  }, [prefersReducedMotion]);

  return scrollData;
}
