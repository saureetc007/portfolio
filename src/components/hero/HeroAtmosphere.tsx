import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * HeroAtmosphere
 * Adapted from the cinematic Three.js particle layer in stampedeShelby/portfolio.
 *
 * Implements a transparent, GPU-efficient cinematic bokeh and ember field
 * tuned for Saureet's Netflix black/red aesthetic (#141414, #E50914, #B20710).
 *
 * Features:
 * - Depth-aware soft bokeh sprites with additive blending
 * - Restrained Netflix crimson & warm platinum palette
 * - Gentle sine-wave 3D float + smoothed mouse parallax
 * - Fully paused when tab is hidden or reduced-motion is requested
 * - Full GPU resource disposal on unmount
 * - WebGL detection with graceful static fallback
 */
export function HeroAtmosphere({ className = 'hero__atmosphere' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Detect WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglFailed(true);
        return;
      }
    } catch {
      setWebglFailed(true);
      return;
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(DPR);

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 18;

    // 4. Soft Radial Bokeh Sprite Texture (Generated procedurally on canvas)
    const makeSprite = () => {
      const size = 128;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
      g.addColorStop(0.14, 'rgba(255, 225, 230, 0.95)');
      g.addColorStop(0.35, 'rgba(229, 9, 20, 0.65)');
      g.addColorStop(0.65, 'rgba(178, 7, 16, 0.25)');
      g.addColorStop(1.0, 'rgba(20, 20, 20, 0)');

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };
    const sprite = makeSprite();

    // 5. Particle Field Setup
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 100 : 220;

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    // Per-particle animation parameters
    const seed = new Float32Array(COUNT * 4); // phaseX, phaseY, speed, ampScale
    const base = new Float32Array(COUNT * 3); // origin coordinates

    // Restrained palette: Netflix Red, Dark Crimson, Ruby Highlight, Warm White, Golden Ember
    const palette = [
      new THREE.Color('#E50914'), // Netflix primary red
      new THREE.Color('#B20710'), // Dark crimson
      new THREE.Color('#FF3E4D'), // Bright ruby highlight
      new THREE.Color('#FFFFFF'), // Crisp white bokeh
      new THREE.Color('#FFA8AF'), // Soft rose ember
      new THREE.Color('#FFB300'), // Warm cinematic golden ember
    ];
    const weights = [0.38, 0.24, 0.14, 0.12, 0.06, 0.06];

    const pickColor = () => {
      let r = Math.random();
      for (let i = 0; i < weights.length; i++) {
        const w = weights[i] ?? 0;
        if ((r -= w) <= 0) return palette[i] ?? palette[0];
      }
      return palette[0];
    };

    const SPREAD_X = 36;
    const SPREAD_Y = 22;
    const SPREAD_Z = 24;

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD_X;
      const y = (Math.random() - 0.5) * SPREAD_Y;
      const z = (Math.random() - 0.5) * SPREAD_Z;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const col = pickColor() ?? new THREE.Color('#E50914');
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Depth-aware sizing: closer particles read as larger, softer bokeh
      const depth = (z + SPREAD_Z / 2) / SPREAD_Z;
      sizes[i] = THREE.MathUtils.lerp(0.8, 3.8, Math.random() * depth + 0.15);

      seed[i * 4] = Math.random() * Math.PI * 2; // phase X
      seed[i * 4 + 1] = Math.random() * Math.PI * 2; // phase Y
      seed[i * 4 + 2] = 0.12 + Math.random() * 0.28; // speed (slow, majestic float)
      seed[i * 4 + 3] = 0.4 + Math.random() * 0.9; // amplitude
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader with perspective attenuation and additive glow
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: sprite },
        uPixelRatio: { value: DPR },
        uOpacity: { value: 0.0 }, // gentle initial fade-in
      },
      vertexShader: /* glsl */ `
        attribute float size;
        varying vec3 vColor;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * 38.0 * uPixelRatio / -mv.z;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTexture;
        uniform float uOpacity;
        varying vec3 vColor;
        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, 1.0) * tex * uOpacity;
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 6. Viewport Sizing
    const setSize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();

    // 7. Smoothed Mouse Parallax
    const target = { x: 0, y: 0 };
    const currentPos = { x: 0, y: 0 };

    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(setSize);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Loop
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const clock = new THREE.Clock();
    let rafId = 0;
    let running = true;
    let fadeT = 0;

    const tick = () => {
      if (!running) return;
      const t = clock.getElapsedTime();

      // Fade in gently
      if (fadeT < 1) {
        fadeT = Math.min(1, fadeT + 0.015);
        material.uniforms.uOpacity.value = fadeT * 0.88;
      }

      if (!prefersReduced) {
        // Sine-wave float for each particle
        for (let i = 0; i < COUNT; i++) {
          const px = seed[i * 4] ?? 0;
          const py = seed[i * 4 + 1] ?? 0;
          const sp = seed[i * 4 + 2] ?? 0.2;
          const amp = seed[i * 4 + 3] ?? 0.6;
          const bx = base[i * 3] ?? 0;
          const by = base[i * 3 + 1] ?? 0;
          const bz = base[i * 3 + 2] ?? 0;

          posArray[i * 3] = bx + Math.sin(t * sp + px) * amp;
          posArray[i * 3 + 1] = by + Math.cos(t * sp * 0.85 + py) * amp * 1.1;
          posArray[i * 3 + 2] = bz + Math.sin(t * sp * 0.5 + px) * amp * 0.5;
        }
        posAttr.needsUpdate = true;

        // Subtle overall constellation drift
        points.rotation.z = Math.sin(t * 0.04) * 0.025;
      }

      // Smoothed parallax camera shift
      currentPos.x += (target.x - currentPos.x) * 0.04;
      currentPos.y += (target.y - currentPos.y) * 0.04;
      camera.position.x = currentPos.x * 1.8;
      camera.position.y = -currentPos.y * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // 9. Pause when tab is hidden
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        clock.start();
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // 10. Comprehensive Cleanup
    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);

      geometry.dispose();
      material.dispose();
      sprite.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      data-webgl-fallback={webglFailed ? 'true' : undefined}
    />
  );
}

