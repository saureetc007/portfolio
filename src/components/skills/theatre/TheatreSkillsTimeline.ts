/**
 * TheatreSkillsTimeline.ts
 * Inspired by theatre-js/theatre (Core runtime — Apache-2.0 License).
 * Coordinates multi-track cinematic animation sequencing for the Skills section.
 */

export interface TimelineTrackConfig {
  name: string;
  startTime: number; // in seconds
  duration: number;  // in seconds
  easing?: (t: number) => number;
}

export interface TrackState {
  progress: number; // 0 to 1
  opacity: number;
  translate3d: { x: number; y: number; z: number };
  rotate: number; // in deg
  scale: number;
  isComplete: boolean;
}

// Cubic bezier approximation (0.16, 1, 0.3, 1) — smooth spring settling
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export const THEATRE_SKILLS_TRACKS: Record<string, TimelineTrackConfig> = {
  stage: { name: 'stage', startTime: 0.0, duration: 0.45, easing: easeOutCubic },
  heading: { name: 'heading', startTime: 0.12, duration: 0.55, easing: easeOutQuart },
  particles: { name: 'particles', startTime: 0.22, duration: 0.65, easing: easeOutCubic },
  cardCode: { name: 'cardCode', startTime: 0.35, duration: 0.72, easing: easeOutQuart },
  cardAi: { name: 'cardAi', startTime: 0.50, duration: 0.70, easing: easeOutQuart },
  cardWeb: { name: 'cardWeb', startTime: 0.65, duration: 0.68, easing: easeOutQuart },
  cardDesign: { name: 'cardDesign', startTime: 0.80, duration: 0.68, easing: easeOutQuart },
  cardMobile: { name: 'cardMobile', startTime: 0.95, duration: 0.65, easing: easeOutQuart },
  philosophy: { name: 'philosophy', startTime: 1.10, duration: 0.65, easing: easeOutQuart },
};

export const THEATRE_SEQUENCE_TOTAL_DURATION = 1.95; // seconds

/**
 * Computes the instantaneous track state given the current sequence time (in seconds).
 */
export function computeTrackState(
  config: TimelineTrackConfig,
  currentTime: number,
  type: 'left' | 'right' | 'up' | 'fade' = 'up'
): TrackState {
  if (currentTime < config.startTime) {
    // Before track starts
    const initialOffset = type === 'left' ? -38 : type === 'right' ? 38 : 24;
    const initialRot = type === 'left' ? -1.5 : type === 'right' ? 1.5 : 0;
    return {
      progress: 0,
      opacity: 0,
      translate3d: {
        x: type === 'left' || type === 'right' ? initialOffset : 0,
        y: type === 'up' ? initialOffset : 0,
        z: 0,
      },
      rotate: initialRot,
      scale: type === 'up' ? 0.97 : 0.99,
      isComplete: false,
    };
  }

  const rawProgress = Math.min(1, (currentTime - config.startTime) / config.duration);
  const easingFn = config.easing || easeOutQuart;
  const eased = easingFn(rawProgress);

  const initialOffset = type === 'left' ? -38 : type === 'right' ? 38 : 24;
  const initialRot = type === 'left' ? -1.5 : type === 'right' ? 1.5 : 0;

  return {
    progress: eased,
    opacity: eased,
    translate3d: {
      x: (type === 'left' || type === 'right') ? initialOffset * (1 - eased) : 0,
      y: type === 'up' ? initialOffset * (1 - eased) : 0,
      z: 0,
    },
    rotate: initialRot * (1 - eased),
    scale: 0.98 + 0.02 * eased,
    isComplete: rawProgress >= 1,
  };
}

