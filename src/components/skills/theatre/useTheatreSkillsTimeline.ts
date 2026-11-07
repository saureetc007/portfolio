import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  THEATRE_SKILLS_TRACKS,
  THEATRE_SEQUENCE_TOTAL_DURATION,
  computeTrackState,
  type TrackState,
} from './TheatreSkillsTimeline';

export interface TheatreSkillsTimelineResult {
  hasStarted: boolean;
  isComplete: boolean;
  sequenceTime: number;
  trackStates: {
    stage: TrackState;
    heading: TrackState;
    particles: TrackState;
    cardCode: TrackState;
    cardAi: TrackState;
    cardWeb: TrackState;
    cardDesign: TrackState;
    cardMobile: TrackState;
    philosophy: TrackState;
  };
  play: () => void;
  reset: () => void;
}

const DEFAULT_COMPLETE_STATE: TrackState = {
  progress: 1,
  opacity: 1,
  translate3d: { x: 0, y: 0, z: 0 },
  rotate: 0,
  scale: 1,
  isComplete: true,
};

export function useTheatreSkillsTimeline(shouldTrigger: boolean = false): TheatreSkillsTimelineResult {
  const prefersReducedMotion = useReducedMotion();
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sequenceTime, setSequenceTime] = useState(0);

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);

  const startTimeline = useCallback(() => {
    if (hasTriggeredRef.current || prefersReducedMotion) return;
    hasTriggeredRef.current = true;
    setHasStarted(true);

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      setSequenceTime(elapsed);

      if (elapsed < THEATRE_SEQUENCE_TOTAL_DURATION) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsComplete(true);
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (shouldTrigger && !hasTriggeredRef.current) {
      startTimeline();
    }
  }, [shouldTrigger, startTimeline]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  if (prefersReducedMotion || (hasTriggeredRef.current && isComplete)) {
    return {
      hasStarted: true,
      isComplete: true,
      sequenceTime: THEATRE_SEQUENCE_TOTAL_DURATION,
      trackStates: {
        stage: DEFAULT_COMPLETE_STATE,
        heading: DEFAULT_COMPLETE_STATE,
        particles: DEFAULT_COMPLETE_STATE,
        cardCode: DEFAULT_COMPLETE_STATE,
        cardAi: DEFAULT_COMPLETE_STATE,
        cardWeb: DEFAULT_COMPLETE_STATE,
        cardDesign: DEFAULT_COMPLETE_STATE,
        cardMobile: DEFAULT_COMPLETE_STATE,
        philosophy: DEFAULT_COMPLETE_STATE,
      },
      play: () => {},
      reset: () => {},
    };
  }

  const trackStates = {
    stage: computeTrackState(THEATRE_SKILLS_TRACKS.stage!, sequenceTime, 'fade'),
    heading: computeTrackState(THEATRE_SKILLS_TRACKS.heading!, sequenceTime, 'up'),
    particles: computeTrackState(THEATRE_SKILLS_TRACKS.particles!, sequenceTime, 'fade'),
    cardCode: computeTrackState(THEATRE_SKILLS_TRACKS.cardCode!, sequenceTime, 'left'),
    cardAi: computeTrackState(THEATRE_SKILLS_TRACKS.cardAi!, sequenceTime, 'right'),
    cardWeb: computeTrackState(THEATRE_SKILLS_TRACKS.cardWeb!, sequenceTime, 'left'),
    cardDesign: computeTrackState(THEATRE_SKILLS_TRACKS.cardDesign!, sequenceTime, 'right'),
    cardMobile: computeTrackState(THEATRE_SKILLS_TRACKS.cardMobile!, sequenceTime, 'left'),
    philosophy: computeTrackState(THEATRE_SKILLS_TRACKS.philosophy!, sequenceTime, 'up'),
  };

  return {
    hasStarted,
    isComplete,
    sequenceTime,
    trackStates,
    play: startTimeline,
    reset: () => {
      hasTriggeredRef.current = false;
      startTimeRef.current = null;
      setHasStarted(false);
      setIsComplete(false);
      setSequenceTime(0);
    },
  };
}

