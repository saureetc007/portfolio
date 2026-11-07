import type { ReactNode, CSSProperties } from 'react';
import { motion, type TargetAndTransition, type Variants } from 'motion/react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ease, dur, stagger } from '@/lib/motion-presets';
import { cx } from '@/lib/cx';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  threshold?: number;
  /** When true, wraps children in a stagger container */
  stagger?: boolean;
  staggerDelay?: number;
}

const VARIANTS: Record<RevealDirection, { hidden: TargetAndTransition; visible: TargetAndTransition }> = {
  up:    { hidden: { opacity: 0, y: 28 },   visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -28 },  visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -36 },  visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 36 },   visible: { opacity: 1, x: 0 } },
  fade:  { hidden: { opacity: 0 },           visible: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
};

/**
 * MotionReveal — Wraps children in a scroll-triggered motion animation.
 * Respects prefers-reduced-motion by skipping animation state.
 */
export function MotionReveal({
  children,
  className,
  style,
  direction = 'up',
  delay = 0,
  duration = dur.slow,
  threshold = 0.12,
  stagger: useStagger = false,
  staggerDelay = stagger.base,
}: MotionRevealProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    // No animation — render as-is
    return (
      <div ref={ref} className={cx(className)} style={style}>
        {children}
      </div>
    );
  }

  const variants: Variants = useStagger
    ? {
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: delay },
        },
      }
    : {
        hidden: VARIANTS[direction].hidden,
        visible: {
          ...VARIANTS[direction].visible,
          transition: {
            duration,
            ease: ease.cinematic,
            delay,
          },
        },
      };

  return (
    <motion.div
      ref={ref}
      className={cx(className)}
      style={style}
      variants={variants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

/** Child item for use inside a stagger MotionReveal parent */
export function MotionItem({
  children,
  className,
  style,
  direction = 'up',
  duration = dur.slow,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  direction?: RevealDirection;
  duration?: number;
}) {
  const itemVariants: Variants = {
    hidden: VARIANTS[direction].hidden,
    visible: {
      ...VARIANTS[direction].visible,
      transition: { duration, ease: ease.cinematic },
    },
  };

  return (
    <motion.div
      className={cx(className)}
      style={style}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
}
