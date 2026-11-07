import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Guard against touch devices and reduced motion
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let isVisible = false;
    let isClicking = false;
    let animFrameId: number;

    const dot = dotRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;
    const ripple = rippleRef.current;

    if (!dot || !follower) return;

    // Direct pointer tracking
    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        follower.style.opacity = '1';
        followerX = mouseX;
        followerY = mouseY;
      }
    };

    const onPointerLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      follower.style.opacity = '0';
    };

    const onPointerDown = (e: PointerEvent) => {
      isClicking = true;
      if (ripple) {
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        ripple.style.transform = 'translate(-50%, -50%) scale(0.2)';
        ripple.style.opacity = '0.8';

        // Trigger CSS animation reflow
        void ripple.offsetWidth;
        ripple.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease-out';
        ripple.style.transform = 'translate(-50%, -50%) scale(2.4)';
        ripple.style.opacity = '0';
      }
    };

    const onPointerUp = () => {
      isClicking = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // Context analysis cache to avoid DOM thrashing
    let lastTarget: Element | null = null;
    let currentMode = 'default'; // 'default' | 'hover' | 'explore' | 'inspect' | 'drag' | 'external' | 'hidden'
    let magneticCenterX: number | null = null;
    let magneticCenterY: number | null = null;

    // High performance RAF loop
    const render = () => {
      // Smooth lerp
      let targetFollowerX = mouseX;
      let targetFollowerY = mouseY;

      // Subtle magnetic pull if hovering a primary interactive target
      if (magneticCenterX !== null && magneticCenterY !== null) {
        targetFollowerX += (magneticCenterX - mouseX) * 0.28;
        targetFollowerY += (magneticCenterY - mouseY) * 0.28;
      }

      followerX += (targetFollowerX - followerX) * 0.18;
      followerY += (targetFollowerY - followerY) * 0.18;

      // Position dot directly
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Position follower smoothly
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

      // Perform element inspection only periodically or on movement
      const target = document.elementFromPoint(mouseX, mouseY);
      if (target && target !== lastTarget) {
        lastTarget = target;
        magneticCenterX = null;
        magneticCenterY = null;

        // Check if text input or selectable text area
        const isTextInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.getAttribute('contenteditable') === 'true' ||
          target.closest('.is-text-selectable');

        if (isTextInput) {
          currentMode = 'hidden';
          follower.dataset.mode = currentMode;
          dot.style.opacity = '0';
          follower.style.opacity = '0';
        } else {
          dot.style.opacity = '1';
          follower.style.opacity = '1';

          // Check custom cursor attributes
          const exploreEl = target.closest('[data-cursor="explore"], .coverflow-card');
          const inspectEl = target.closest('[data-cursor="inspect"], .bento-card');
          const dragEl = target.closest('[data-cursor="drag"], .universe-canvas-container, .coverflow-stage');
          const externalEl = target.closest('a[target="_blank"], [data-cursor="external"]');
          const interactiveEl = target.closest(
            'button, a, input, select, [role="button"], .interactive-target'
          );

          if (exploreEl) {
            currentMode = 'explore';
            follower.className = 'custom-cursor-follower is-explore';
            if (label) label.textContent = 'EXPLORE';
          } else if (inspectEl) {
            currentMode = 'inspect';
            follower.className = 'custom-cursor-follower is-inspect';
            if (label) label.textContent = 'INSPECT';
          } else if (dragEl) {
            currentMode = 'drag';
            follower.className = 'custom-cursor-follower is-drag';
            if (label) label.textContent = 'DRAG';
          } else if (externalEl) {
            currentMode = 'external';
            follower.className = 'custom-cursor-follower is-external';
            if (label) label.textContent = '↗';
          } else if (interactiveEl) {
            currentMode = 'hover';
            follower.className = 'custom-cursor-follower is-hover';
            if (label) label.textContent = '';

            // Check if magnetic button
            if (interactiveEl.classList.contains('btn--primary') || interactiveEl.classList.contains('hero__btn')) {
              const rect = interactiveEl.getBoundingClientRect();
              magneticCenterX = rect.left + rect.width / 2;
              magneticCenterY = rect.top + rect.height / 2;
            }
          } else {
            currentMode = 'default';
            follower.className = 'custom-cursor-follower';
            if (label) label.textContent = '';
          }

          follower.dataset.mode = currentMode;
        }
      }

      if (isClicking) {
        follower.classList.add('is-clicking');
      } else {
        follower.classList.remove('is-clicking');
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
      <div ref={followerRef} className="custom-cursor-follower" aria-hidden="true">
        <span ref={labelRef} className="custom-cursor-label" />
      </div>
      <div ref={rippleRef} className="custom-cursor-ripple" aria-hidden="true" />
    </>
  );
}
