import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  isBurst?: boolean;
  life?: number;
}

const PARTICLE_COLORS = [
  '#FFFFFF',
  '#E50914',
  '#B20710',
  '#D1D5DB',
];

export function GlobalParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animId: number;
    let isTabVisible = !document.hidden;

    // Mouse coordinates
    let mouseX = -9999;
    let mouseY = -9999;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onPointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    // Pool configuration
    const isMobile = window.innerWidth < 768;
    const baseCount = isMobile ? 18 : 36;
    const particles: Particle[] = [];
    const burstParticles: Particle[] = [];

    const createParticle = (): Particle => {
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const baseAlpha = color === '#E50914' ? 0.35 : Math.random() * 0.25 + 0.15;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.3 + 0.8,
        color,
        alpha: baseAlpha,
        baseAlpha,
      };
    };

    for (let i = 0; i < baseCount; i++) {
      particles.push(createParticle());
    }

    const spawnBurst = (x: number, y: number, count = 10) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.8 + 1.2;
        const color = i % 2 === 0 ? '#E50914' : '#FFFFFF';
        burstParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 1.8 + 1,
          color,
          alpha: 0.85,
          baseAlpha: 0.85,
          isBurst: true,
          life: 1.0,
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      spawnBurst(e.clientX, e.clientY, 8);
    };

    const handleCustomBurst = (e: Event) => {
      const custom = e as CustomEvent<{ x: number; y: number; count?: number }>;
      if (custom.detail?.x && custom.detail?.y) {
        spawnBurst(custom.detail.x, custom.detail.y, custom.detail.count || 12);
      }
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('emit-global-burst', handleCustomBurst);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Render loop
    const render = () => {
      if (!isTabVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 0. Soft radial cursor ambient keylight glow
      if (mouseX > 0 && mouseY > 0) {
        const glowRadius = isMobile ? 120 : 180;
        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
        grad.addColorStop(0, 'rgba(229, 9, 20, 0.055)');
        grad.addColorStop(0.5, 'rgba(229, 9, 20, 0.015)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 1. Draw connections between close ambient particles
      const maxDist = 75;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(229, 9, 20, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 2. Update and draw ambient particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle mouse interaction
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100 && mdist > 0) {
          const force = (1 - mdist / 100) * 0.45;
          p.x += (mdx / mdist) * force;
          p.y += (mdy / mdist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      // 3. Update and draw burst particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vx *= 0.94;
        bp.vy *= 0.94;

        if (bp.life !== undefined) {
          bp.life -= 0.035;
          bp.alpha = bp.baseAlpha * Math.max(0, bp.life);
        }

        if (bp.life !== undefined && bp.life <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
        ctx.fillStyle = bp.color;
        ctx.globalAlpha = Math.max(0, bp.alpha);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('emit-global-burst', handleCustomBurst);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="global-particle-canvas"
      aria-hidden="true"
    />
  );
}

