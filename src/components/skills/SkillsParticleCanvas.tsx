import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SkillParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  isBurst?: boolean;
  life?: number;
  maxLife?: number;
}

interface SkillsParticleCanvasProps {
  isVisible: boolean;
}

export function SkillsParticleCanvas({ isVisible }: SkillsParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<SkillParticle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const prefersReducedMotion = useReducedMotion();

  // Listen for custom skill card burst events
  useEffect(() => {
    const handleBurst = (e: CustomEvent<{ x: number; y: number }>) => {
      if (prefersReducedMotion || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const burstX = e.detail.x - rect.left;
      const burstY = e.detail.y - rect.top;

      const burstCount = 18;
      const burstColors = ['#E50914', '#B81D24', '#FFFFFF', '#FF4D5A'];

      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = 1.2 + Math.random() * 2.8;
        particlesRef.current.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.2 + Math.random() * 2.2,
          color: burstColors[Math.floor(Math.random() * burstColors.length)]!,
          alpha: 1,
          targetAlpha: 0,
          isBurst: true,
          life: 0,
          maxLife: 35 + Math.floor(Math.random() * 20),
        });
      }
    };

    window.addEventListener('skill-particle-burst' as any, handleBurst as any);
    return () => {
      window.removeEventListener('skill-particle-burst' as any, handleBurst as any);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 800);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || 800;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse over section
    const parent = canvas.parentElement;
    const handleMouseMove = (e: MouseEvent) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    parent?.addEventListener('mousemove', handleMouseMove);
    parent?.addEventListener('mouseleave', handleMouseLeave);

    // Initialize gentle background drifting particles (28-32 particles)
    const particleCount = 28;
    const palette = ['#E50914', '#8B0000', 'rgba(255, 255, 255, 0.85)', '#B81D24'];
    const particles: SkillParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: 1.2 + Math.random() * 1.8,
        color: palette[Math.floor(Math.random() * palette.length)]!,
        alpha: 0.15 + Math.random() * 0.45,
        targetAlpha: 0.2 + Math.random() * 0.45,
      });
    }

    particlesRef.current = particles;

    // Animation Loop
    const lineThreshold = 65;

    const tick = () => {
      if (!isVisible) {
        // Pause animation when offscreen
        animFrameRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const list = particlesRef.current;
      const mouse = mouseRef.current;

      // 1. Draw fine connecting lines between nearby ambient particles
      for (let i = 0; i < list.length; i++) {
        const p1 = list[i];
        if (!p1 || p1.isBurst || p1.alpha <= 0.05) continue;

        for (let j = i + 1; j < list.length; j++) {
          const p2 = list[j];
          if (!p2 || p2.isBurst || p2.alpha <= 0.05) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < lineThreshold) {
            const lineAlpha = Math.min(p1.alpha, p2.alpha) * (1 - dist / lineThreshold) * 0.22;
            ctx.strokeStyle = `rgba(229, 9, 20, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 2. Update and draw particles
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]!;

        if (p.isBurst) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.life = (p.life || 0) + 1;
          p.alpha = Math.max(0, 1 - p.life / (p.maxLife || 40));

          if (p.alpha <= 0.01) {
            list.splice(i, 1);
            continue;
          }
        } else {
          // Ambient drifting
          p.x += p.vx;
          p.y += p.vy;

          // Gentle cursor interaction
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 110 && dist > 1) {
              const force = (1 - dist / 110) * 0.6;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }

          // Screen wrap-around
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        // Draw particle dot
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow for burst or red particles
        if (p.isBurst || p.color === '#E50914') {
          ctx.shadowColor = '#E50914';
          ctx.shadowBlur = 4;
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    if (isVisible) {
      animFrameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      parent?.removeEventListener('mousemove', handleMouseMove);
      parent?.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isVisible, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="skills-particle-canvas"
      aria-hidden="true"
    />
  );
}

/** Helper function to dispatch a particle burst at specified viewport coordinates */
export function emitSkillParticleBurst(clientX: number, clientY: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('skill-particle-burst', {
        detail: { x: clientX, y: clientY },
      })
    );
  }
}

