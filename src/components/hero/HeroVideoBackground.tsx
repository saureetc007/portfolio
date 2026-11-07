import { useState, useRef, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroVideoBackgroundProps {
  /** Optional video source file; falls back gracefully to dark atmospheric artwork if absent */
  src?: string;
  poster?: string;
}

/**
 * HeroVideoBackground
 * Inspired by seha22/aethera-cinematic-hero.
 *
 * Provides a full-bleed, cinematic atmospheric background for the hero section:
 * - Muted, looped video playback with responsive object-fit
 * - Smooth opacity fade-in when video data loads
 * - Graceful fallback to dark atmospheric poster & CSS keylights on load failure or reduced motion
 * - Multi-layer Netflix-style scrims (darkened left quadrant for headline readability,
 *   bottom vignette bleeding into #141414, and restrained crimson ambient keylight)
 */
export function HeroVideoBackground({
  src = '/assets/hero/hero-bg.mp4',
  poster = '/assets/hero/hero-wide.webp',
}: HeroVideoBackgroundProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [prefersReducedMotion]);

  const handleLoadedData = () => {
    setVideoLoaded(true);
  };

  const handleError = () => {
    // When video is not present or cannot be decoded, smoothly activate fallback
    setVideoFailed(true);
  };

  return (
    <div className="hero__video-layer" aria-hidden="true">
      {/* 1. Static / CSS Ambient Atmospheric Fallback (always rendered as foundation) */}
      <div
        className="hero__video-fallback"
        style={{
          backgroundImage: `url(${poster})`,
        }}
      />

      {/* 2. Looping Cinematic Video (Aethera style) */}
      {!prefersReducedMotion && !videoFailed && (
        <video
          ref={videoRef}
          className={`hero__video ${videoLoaded ? 'is-loaded' : ''}`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          onLoadedData={handleLoadedData}
          onError={handleError}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* 3. Restrained Netflix Crimson Keylight */}
      <div className="hero__video-keylight" />

      {/* 4. Left Scrim: Darkens left quadrant to protect text readability */}
      <div className="hero__video-text-scrim" />

      {/* 5. Edge & Bottom Vignette: Blends smoothly into #141414 base */}
      <div className="hero__video-vignette" />

      {/* 6. Subtle Cinematic Scanline Texture */}
      <div className="hero__video-scanlines" />
    </div>
  );
}

