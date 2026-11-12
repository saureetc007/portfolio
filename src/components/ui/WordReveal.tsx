import { useMemo } from 'react';
import { motion, type Variants } from 'motion/react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ease } from '@/lib/motion-presets';

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  wordDelay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { delay: number; wordDelay: number }) => ({
    transition: {
      delayChildren: custom.delay,
      staggerChildren: custom.wordDelay,
    },
  }),
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: ease.cinematic,
    },
  },
};

/**
 * WordReveal — Cinematic word-by-word staggered typography animation
 * Features blur-to-focus transition and natural baseline lift.
 * Respects prefers-reduced-motion.
 */
export function WordReveal({
  text,
  className = '',
  delay = 0,
  wordDelay = 0.05,
  as: Tag = 'span',
}: WordRevealProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const words = useMemo(() => text.split(' '), [text]);

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[Tag as 'span'];

  return (
    <MotionTag
      ref={ref}
      className={`word-reveal-container ${className}`}
      variants={containerVariants}
      custom={{ delay, wordDelay }}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      style={{ display: 'inline-block' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          className="word-reveal-item"
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
