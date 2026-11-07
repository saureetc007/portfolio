/**
 * motion-presets.ts
 * Shared animation presets for the portfolio.
 * Import these in components that use the `motion` library.
 */

// ---- Spring presets --------------------------------------------------------
export const spring = {
  gentle:  { type: 'spring' as const, stiffness: 120, damping: 20, mass: 1 },
  smooth:  { type: 'spring' as const, stiffness: 180, damping: 26, mass: 1 },
  bouncy:  { type: 'spring' as const, stiffness: 280, damping: 22, mass: 0.8 },
  stiff:   { type: 'spring' as const, stiffness: 400, damping: 32, mass: 1 },
  snappy:  { type: 'spring' as const, stiffness: 500, damping: 36, mass: 0.9 },
};

// ---- Easing presets --------------------------------------------------------
export const ease = {
  out:       [0.25, 1, 0.5, 1]  as [number, number, number, number],
  inOut:     [0.65, 0, 0.35, 1] as [number, number, number, number],
  cinematic: [0.16, 1, 0.3, 1]  as [number, number, number, number],
  sharp:     [0.4, 0, 0.2, 1]   as [number, number, number, number],
};

// ---- Duration tokens (seconds for motion) ----------------------------------
export const dur = {
  fast:      0.16,
  base:      0.28,
  slow:      0.50,
  cinematic: 0.70,
};

// ---- Stagger helpers -------------------------------------------------------
export const stagger = {
  xs:   0.04,
  sm:   0.07,
  base: 0.10,
  md:   0.14,
  lg:   0.20,
};

// ---- Common variant sets ---------------------------------------------------
/** Fade + lift reveal — pair with `useScrollReveal` */
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeLeft = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
};

export const fadeRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1 },
};

/** Container that staggers children */
export function staggerContainer(delayChildren = 0, childStagger = stagger.base) {
  return {
    hidden:  {},
    visible: {
      transition: { staggerChildren: childStagger, delayChildren },
    },
  };
}

