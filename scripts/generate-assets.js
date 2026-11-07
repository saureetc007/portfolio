import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const HERO_DIR = path.join(ROOT, 'public', 'assets', 'hero');
const PROJECTS_DIR = path.join(ROOT, 'public', 'assets', 'projects');

fs.mkdirSync(HERO_DIR, { recursive: true });
fs.mkdirSync(PROJECTS_DIR, { recursive: true });

// ==========================================
// 1. HERO SLIDE 1: INTRODUCING SAUREET
// Architectural monoliths, dark crimson light blade, perspective grid
// ==========================================
function renderSlide1(w, h, isWide) {
  const cx = isWide ? w * 0.72 : w * 0.5;
  const cy = isWide ? h * 0.48 : h * 0.35;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <radialGradient id="s1-glow" cx="${cx / w * 100}%" cy="${cy / h * 100}%" r="60%">
      <stop offset="0%" stop-color="#E50914" stop-opacity="0.45" />
      <stop offset="40%" stop-color="#B20710" stop-opacity="0.2" />
      <stop offset="70%" stop-color="#141414" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#141414" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="s1-core" cx="${cx / w * 100}%" cy="${cy / h * 100}%" r="18%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
      <stop offset="25%" stop-color="#FF3333" stop-opacity="0.6" />
      <stop offset="60%" stop-color="#E50914" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#141414" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="s1-blade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E50914" stop-opacity="0" />
      <stop offset="35%" stop-color="#FF4D4D" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="1" />
      <stop offset="65%" stop-color="#E50914" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#E50914" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="s1-slab-l" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#232323" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#101010" stop-opacity="0.98" />
    </linearGradient>
    <linearGradient id="s1-slab-r" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#232323" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#101010" stop-opacity="0.98" />
    </linearGradient>
  </defs>

  <rect width="${w}" height="${h}" fill="#141414" />
  <rect width="${w}" height="${h}" fill="url(#s1-glow)" />

  <!-- Monolithic architectural corridor converging on right focal point -->
  <g opacity="0.85">
    <!-- Left monoliths -->
    <polygon points="${cx - 180},${cy - 220} ${cx - 50},${cy - 80} ${cx - 50},${cy + 240} ${cx - 180},${cy + 340}" fill="url(#s1-slab-l)" stroke="#E50914" stroke-opacity="0.25" stroke-width="1.5" />
    <polygon points="${cx - 420},${cy - 380} ${cx - 240},${cy - 240} ${cx - 240},${cy + 380} ${cx - 420},${cy + 520}" fill="url(#s1-slab-l)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
    <polygon points="${cx - 780},${cy - 520} ${cx - 500},${cy - 380} ${cx - 500},${cy + 520} ${cx - 780},${cy + 700}" fill="#111111" stroke="rgba(255,255,255,0.08)" stroke-width="1" />

    <!-- Right monoliths -->
    <polygon points="${cx + 50},${cy - 80} ${cx + 180},${cy - 220} ${cx + 180},${cy + 340} ${cx + 50},${cy + 240}" fill="url(#s1-slab-r)" stroke="#E50914" stroke-opacity="0.25" stroke-width="1.5" />
    <polygon points="${cx + 240},${cy - 240} ${cx + 420},${cy - 380} ${cx + 420},${cy + 520} ${cx + 240},${cy + 380}" fill="url(#s1-slab-r)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
    <polygon points="${cx + 500},${cy - 380} ${cx + 780},${cy - 520} ${cx + 780},${cy + 700} ${cx + 500},${cy + 520}" fill="#111111" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  </g>

  <!-- Dramatic vertical light blade -->
  <line x1="${cx}" y1="${cy - 380}" x2="${cx}" y2="${cy + 420}" stroke="url(#s1-blade)" stroke-width="4" stroke-linecap="round" />
  <circle cx="${cx}" cy="${cy}" r="120" fill="url(#s1-core)" />

  <!-- Floor perspective lines reflecting red glow -->
  <g opacity="0.4" stroke="#E50914" stroke-width="1">
    <line x1="${cx}" y1="${cy + 240}" x2="${cx - 550}" y2="${h}" stroke-opacity="0.4" />
    <line x1="${cx}" y1="${cy + 240}" x2="${cx - 280}" y2="${h}" stroke-opacity="0.6" />
    <line x1="${cx}" y1="${cy + 240}" x2="${cx}" y2="${h}" stroke-opacity="0.8" stroke-width="2" />
    <line x1="${cx}" y1="${cy + 240}" x2="${cx + 280}" y2="${h}" stroke-opacity="0.6" />
    <line x1="${cx}" y1="${cy + 240}" x2="${cx + 550}" y2="${h}" stroke-opacity="0.4" />
  </g>

  <!-- Subtle glowing dust particles -->
  <g fill="#FFFFFF" opacity="0.7">
    <circle cx="${cx - 60}" cy="${cy - 120}" r="2" fill="#E50914" />
    <circle cx="${cx + 80}" cy="${cy - 90}" r="1.5" />
    <circle cx="${cx - 120}" cy="${cy + 80}" r="2.5" fill="#FF5555" />
    <circle cx="${cx + 140}" cy="${cy + 150}" r="1.5" />
    <circle cx="${cx - 30}" cy="${cy + 180}" r="2" fill="#E50914" />
    <circle cx="${cx + 50}" cy="${cy - 210}" r="2" />
  </g>
</svg>`;
}

// ==========================================
// 2. HERO SLIDE 2: FEATURED PROJECT (DECISIONTRACE)
// Git DAG tree, evidence recovery nodes, laser traces, dark code architecture
// ==========================================
function renderSlide2(w, h, isWide) {
  const cx = isWide ? w * 0.72 : w * 0.5;
  const cy = isWide ? h * 0.48 : h * 0.35;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <radialGradient id="s2-glow" cx="${cx / w * 100}%" cy="${cy / h * 100}%" r="55%">
      <stop offset="0%" stop-color="#E50914" stop-opacity="0.4" />
      <stop offset="50%" stop-color="#670005" stop-opacity="0.25" />
      <stop offset="85%" stop-color="#141414" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#141414" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="s2-line" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E50914" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.3" />
    </linearGradient>
  </defs>

  <rect width="${w}" height="${h}" fill="#141414" />
  <rect width="${w}" height="${h}" fill="url(#s2-glow)" />

  <!-- Background code matrix grid pattern -->
  <g opacity="0.12" stroke="#FFFFFF" stroke-width="1">
    <line x1="${cx - 450}" y1="${cy - 300}" x2="${cx + 450}" y2="${cy - 300}" stroke-dasharray="6,6" />
    <line x1="${cx - 450}" y1="${cy - 150}" x2="${cx + 450}" y2="${cy - 150}" stroke-dasharray="6,6" />
    <line x1="${cx - 450}" y1="${cy}" x2="${cx + 450}" y2="${cy}" stroke-dasharray="6,6" />
    <line x1="${cx - 450}" y1="${cy + 150}" x2="${cx + 450}" y2="${cy + 150}" stroke-dasharray="6,6" />
    <line x1="${cx - 450}" y1="${cy + 300}" x2="${cx + 450}" y2="${cy + 300}" stroke-dasharray="6,6" />
    <line x1="${cx - 300}" y1="${cy - 350}" x2="${cx - 300}" y2="${cy + 350}" stroke-dasharray="6,6" />
    <line x1="${cx}" y1="${cy - 350}" x2="${cx}" y2="${cy + 350}" stroke-dasharray="6,6" />
    <line x1="${cx + 300}" y1="${cy - 350}" x2="${cx + 300}" y2="${cy + 350}" stroke-dasharray="6,6" />
  </g>

  <!-- Git DAG commit tree / DecisionTrace structure -->
  <g stroke-linecap="round">
    <!-- Branch traces -->
    <path d="M${cx - 280},${cy + 180} C${cx - 150},${cy + 160} ${cx - 100},${cy + 50} ${cx - 50},${cy - 20}" fill="none" stroke="#E50914" stroke-width="3" opacity="0.9" />
    <path d="M${cx - 50},${cy - 20} C${cx + 20},${cy - 80} ${cx + 120},${cy - 140} ${cx + 240},${cy - 180}" fill="none" stroke="#E50914" stroke-width="3" opacity="0.9" />
    <path d="M${cx - 240},${cy + 220} C${cx - 120},${cy + 220} ${cx - 20},${cy + 180} ${cx + 80},${cy + 120}" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-dasharray="4,4" />
    <path d="M${cx + 80},${cy + 120} C${cx + 180},${cy + 60} ${cx + 210},${cy - 60} ${cx + 240},${cy - 180}" fill="none" stroke="#E50914" stroke-width="2.5" opacity="0.8" />
    <path d="M${cx - 50},${cy - 20} C${cx - 20},${cy - 150} ${cx + 60},${cy - 210} ${cx + 160},${cy - 240}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" />
    <path d="M${cx - 280},${cy + 180} C${cx - 220},${cy + 40} ${cx - 160},${cy - 60} ${cx - 50},${cy - 20}" fill="none" stroke="url(#s2-line)" stroke-width="2" opacity="0.7" />

    <!-- Decision Nodes (Evidence markers) -->
    <!-- Root commit -->
    <circle cx="${cx - 280}" cy="${cy + 180}" r="14" fill="#232323" stroke="#E50914" stroke-width="3" />
    <circle cx="${cx - 280}" cy="${cy + 180}" r="6" fill="#E50914" />

    <!-- Decision Junction -->
    <circle cx="${cx - 50}" cy="${cy - 20}" r="22" fill="#181818" stroke="#E50914" stroke-width="4" />
    <circle cx="${cx - 50}" cy="${cy - 20}" r="10" fill="#FFFFFF" />
    <!-- Pulse ring -->
    <circle cx="${cx - 50}" cy="${cy - 20}" r="38" fill="none" stroke="#E50914" stroke-width="1.5" opacity="0.5" stroke-dasharray="4,4" />

    <!-- Evidence recovery cards / node tags -->
    <g transform="translate(${cx - 30}, ${cy - 100})">
      <rect x="0" y="0" width="130" height="34" rx="4" fill="#232323" stroke="#E50914" stroke-width="1.5" opacity="0.9" />
      <text x="12" y="22" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold"># DECISION_01</text>
    </g>

    <g transform="translate(${cx + 110}, ${cy + 60})">
      <rect x="0" y="0" width="120" height="34" rx="4" fill="#232323" stroke="rgba(255,255,255,0.3)" stroke-width="1" opacity="0.9" />
      <text x="12" y="22" fill="#B3B3B3" font-family="monospace" font-size="11">REJECTED_ALT</text>
    </g>

    <!-- Sub nodes -->
    <circle cx="${cx + 80}" cy="${cy + 120}" r="12" fill="#232323" stroke="#B3B3B3" stroke-width="2" />
    <circle cx="${cx + 160}" cy="${cy - 240}" r="14" fill="#232323" stroke="#E50914" stroke-width="3" />
    <circle cx="${cx + 160}" cy="${cy - 240}" r="5" fill="#E50914" />
    <circle cx="${cx + 240}" cy="${cy - 180}" r="18" fill="#181818" stroke="#FFFFFF" stroke-width="3" />
    <circle cx="${cx + 240}" cy="${cy - 180}" r="8" fill="#E50914" />
  </g>
</svg>`;
}

// ==========================================
// 3. HERO SLIDE 3: TECHNICAL JOURNEY
// AI neural constellations, learning vectors, computational grid
// ==========================================
function renderSlide3(w, h, isWide) {
  const cx = isWide ? w * 0.72 : w * 0.5;
  const cy = isWide ? h * 0.48 : h * 0.35;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <radialGradient id="s3-glow" cx="${cx / w * 100}%" cy="${cy / h * 100}%" r="60%">
      <stop offset="0%" stop-color="#E50914" stop-opacity="0.38" />
      <stop offset="45%" stop-color="#4a0004" stop-opacity="0.25" />
      <stop offset="85%" stop-color="#141414" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#141414" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="s3-laser" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E50914" stop-opacity="0" />
      <stop offset="50%" stop-color="#FF3333" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="${w}" height="${h}" fill="#141414" />
  <rect width="${w}" height="${h}" fill="url(#s3-glow)" />

  <!-- Dimensional orbital rings (Computation & AI) -->
  <g fill="none" stroke="#E50914" opacity="0.35">
    <ellipse cx="${cx}" cy="${cy}" rx="280" ry="110" stroke-width="1.5" transform="rotate(-25 ${cx} ${cy})" stroke-dasharray="8,4" />
    <ellipse cx="${cx}" cy="${cy}" rx="220" ry="85" stroke-width="1.5" transform="rotate(35 ${cx} ${cy})" stroke-opacity="0.6" />
    <ellipse cx="${cx}" cy="${cy}" rx="140" ry="50" stroke-width="2" transform="rotate(-5 ${cx} ${cy})" stroke-opacity="0.8" />
  </g>

  <!-- Neural Network Lattice -->
  <g stroke="#E50914" stroke-width="1.5" opacity="0.75">
    <line x1="${cx - 160}" y1="${cy - 120}" x2="${cx}" y2="${cy}" stroke-opacity="0.9" />
    <line x1="${cx - 160}" y1="${cy + 100}" x2="${cx}" y2="${cy}" stroke-opacity="0.8" />
    <line x1="${cx + 170}" y1="${cy - 90}" x2="${cx}" y2="${cy}" stroke-opacity="0.9" />
    <line x1="${cx + 150}" y1="${cy + 120}" x2="${cx}" y2="${cy}" stroke-opacity="0.8" />
    <line x1="${cx - 160}" y1="${cy - 120}" x2="${cx - 80}" y2="${cy - 220}" stroke-opacity="0.5" />
    <line x1="${cx + 170}" y1="${cy - 90}" x2="${cx + 240}" y2="${cy - 190}" stroke-opacity="0.5" />
    <line x1="${cx - 160}" y1="${cy + 100}" x2="${cx - 60}" y2="${cy + 220}" stroke-opacity="0.5" />
    <line x1="${cx + 150}" y1="${cy + 120}" x2="${cx + 80}" y2="${cy + 240}" stroke-opacity="0.5" />
    <line x1="${cx - 80}" y1="${cy - 220}" x2="${cx + 70}" y2="${cy - 200}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-dasharray="3,3" />
    <line x1="${cx - 60}" y1="${cy + 220}" x2="${cx + 80}" y2="${cy + 240}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-dasharray="3,3" />
  </g>

  <!-- Synaptic Nodes -->
  <circle cx="${cx}" cy="${cy}" r="26" fill="#232323" stroke="#E50914" stroke-width="4" />
  <circle cx="${cx}" cy="${cy}" r="12" fill="#FFFFFF" />

  <circle cx="${cx - 160}" cy="${cy - 120}" r="14" fill="#181818" stroke="#E50914" stroke-width="2.5" />
  <circle cx="${cx - 160}" cy="${cy - 120}" r="5" fill="#E50914" />

  <circle cx="${cx - 160}" cy="${cy + 100}" r="14" fill="#181818" stroke="#FFFFFF" stroke-width="2" />
  <circle cx="${cx - 160}" cy="${cy + 100}" r="4" fill="#FFFFFF" />

  <circle cx="${cx + 170}" cy="${cy - 90}" r="15" fill="#181818" stroke="#E50914" stroke-width="3" />
  <circle cx="${cx + 170}" cy="${cy - 90}" r="6" fill="#E50914" />

  <circle cx="${cx + 150}" cy="${cy + 120}" r="14" fill="#181818" stroke="#B3B3B3" stroke-width="2" />
  <circle cx="${cx + 150}" cy="${cy + 120}" r="4" fill="#E50914" />

  <circle cx="${cx - 80}" cy="${cy - 220}" r="8" fill="#E50914" opacity="0.8" />
  <circle cx="${cx + 240}" cy="${cy - 190}" r="9" fill="#FFFFFF" opacity="0.9" />
  <circle cx="${cx - 60}" cy="${cy + 220}" r="8" fill="#E50914" opacity="0.8" />
  <circle cx="${cx + 80}" cy="${cy + 240}" r="10" fill="#E50914" opacity="0.9" />

  <!-- Laser horizon sweep -->
  <line x1="${cx - 400}" y1="${cy}" x2="${cx + 400}" y2="${cy}" stroke="url(#s3-laser)" stroke-width="2" />
</svg>`;
}

// Generate Hero assets
fs.writeFileSync(path.join(HERO_DIR, 'slide-1-wide.svg'), renderSlide1(2400, 1350, true));
fs.writeFileSync(path.join(HERO_DIR, 'slide-1-tall.svg'), renderSlide1(1080, 1900, false));

fs.writeFileSync(path.join(HERO_DIR, 'slide-2-wide.svg'), renderSlide2(2400, 1350, true));
fs.writeFileSync(path.join(HERO_DIR, 'slide-2-tall.svg'), renderSlide2(1080, 1900, false));

fs.writeFileSync(path.join(HERO_DIR, 'slide-3-wide.svg'), renderSlide3(2400, 1350, true));
fs.writeFileSync(path.join(HERO_DIR, 'slide-3-tall.svg'), renderSlide3(1080, 1900, false));

console.log('Hero slide assets written to public/assets/hero/');

// ==========================================
// 4. PROJECT THUMBNAILS (10 UNIQUE ARTWORKS)
// 16:9 ratio (800x450), dark streaming card aesthetic with domain graphics
// ==========================================
const projectThumbnails = [
  // 1. DecisionVault / DecisionTrace
  {
    name: 'project-1.svg',
    title: 'DecisionTrace',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p1-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.35" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p1-g)" />
      <!-- Git Branch DAG -->
      <path d="M160,320 C240,320 280,225 360,225 L520,225 C600,225 640,140 700,140" fill="none" stroke="#E50914" stroke-width="5" />
      <path d="M360,225 C420,225 450,320 540,320 L680,320" fill="none" stroke="#B3B3B3" stroke-width="3" stroke-dasharray="6,6" />
      <!-- Commits -->
      <circle cx="160" cy="320" r="14" fill="#232323" stroke="#E50914" stroke-width="4" />
      <circle cx="360" cy="225" r="18" fill="#FFFFFF" stroke="#E50914" stroke-width="4" />
      <circle cx="520" cy="225" r="14" fill="#232323" stroke="#E50914" stroke-width="4" />
      <circle cx="700" cy="140" r="16" fill="#E50914" stroke="#FFFFFF" stroke-width="3" />
      <circle cx="540" cy="320" r="12" fill="#232323" stroke="#808080" stroke-width="3" />
      <!-- Badge label -->
      <rect x="290" y="80" width="220" height="42" rx="6" fill="#232323" stroke="#E50914" stroke-width="2" />
      <text x="400" y="106" fill="#FFFFFF" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">DECISION RECOVERY</text>
    </svg>`
  },

  // 2. AI-Powered Cognitive Support Platform
  {
    name: 'project-2.svg',
    title: 'Cognitive Support',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p2-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.3" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p2-g)" />
      <!-- Cognitive Synapse Waves -->
      <g stroke="#E50914" fill="none" opacity="0.8">
        <path d="M120,225 C200,120 280,330 360,225 C440,120 520,330 600,225 C640,170 680,280 720,225" stroke-width="4" />
        <path d="M140,225 C220,160 300,290 380,225 C460,160 540,290 620,225" stroke-width="2" stroke="#FFFFFF" opacity="0.4" />
      </g>
      <!-- Central Focus Ring -->
      <circle cx="360" cy="225" r="45" fill="#232323" stroke="#E50914" stroke-width="4" />
      <circle cx="360" cy="225" r="22" fill="#E50914" />
      <circle cx="600" cy="225" r="30" fill="#232323" stroke="#FFFFFF" stroke-width="3" />
      <rect x="270" y="80" width="260" height="42" rx="6" fill="#232323" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      <text x="400" y="106" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">COGNITIVE SUPPORT AI</text>
    </svg>`
  },

  // 3. Spotify-Inspired Music Player
  {
    name: 'project-3.svg',
    title: 'Music Player',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p3-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.32" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p3-g)" />
      <!-- Vinyl record / waveform -->
      <circle cx="320" cy="235" r="120" fill="#111111" stroke="#282828" stroke-width="8" />
      <circle cx="320" cy="235" r="85" fill="none" stroke="#222222" stroke-width="2" />
      <circle cx="320" cy="235" r="50" fill="#E50914" />
      <circle cx="320" cy="235" r="14" fill="#FFFFFF" />
      <!-- Audio Spectrum Bars -->
      <g fill="#E50914" opacity="0.9">
        <rect x="490" y="270" width="16" height="50" rx="3" />
        <rect x="515" y="230" width="16" height="90" rx="3" fill="#FFFFFF" />
        <rect x="540" y="180" width="16" height="140" rx="3" />
        <rect x="565" y="210" width="16" height="110" rx="3" />
        <rect x="590" y="150" width="16" height="170" rx="3" fill="#FFFFFF" />
        <rect x="615" y="220" width="16" height="100" rx="3" />
        <rect x="640" y="260" width="16" height="60" rx="3" />
      </g>
      <rect x="285" y="65" width="230" height="42" rx="6" fill="#232323" stroke="#E50914" stroke-width="2" />
      <text x="400" y="91" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">STREAMING AUDIO</text>
    </svg>`
  },

  // 4. Simon Memory Game
  {
    name: 'project-4.svg',
    title: 'Simon Game',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p4-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.3" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p4-g)" />
      <!-- 4 Quadrants Game Console -->
      <g transform="translate(400, 240)">
        <!-- Top Left: Red -->
        <path d="M-15,-15 L-110,-15 A120,120 0 0,1 -15,-110 Z" fill="#E50914" opacity="0.95" />
        <!-- Top Right: Yellow/Gold -->
        <path d="M15,-15 L15,-110 A120,120 0 0,1 110,-15 Z" fill="#d97706" opacity="0.9" />
        <!-- Bottom Left: Blue/Cyan -->
        <path d="M-15,15 L-110,15 A120,120 0 0,0 -15,110 Z" fill="#2563eb" opacity="0.9" />
        <!-- Bottom Right: Green -->
        <path d="M15,15 L110,15 A120,120 0 0,1 15,110 Z" fill="#16a34a" opacity="0.9" />
        <!-- Center Console Ring -->
        <circle cx="0" cy="0" r="32" fill="#232323" stroke="#FFFFFF" stroke-width="3" />
        <text x="0" y="6" fill="#FFFFFF" font-family="sans-serif" font-size="12" font-weight="900" text-anchor="middle">SIMON</text>
      </g>
      <rect x="275" y="65" width="250" height="42" rx="6" fill="#232323" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      <text x="400" y="91" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">MEMORY SEQUENCER</text>
    </svg>`
  },

  // 5. Personal Developer Portfolio
  {
    name: 'project-5.svg',
    title: 'Developer Portfolio',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p5-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.38" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p5-g)" />
      <!-- Cinema Screen Mockup with Play Icon -->
      <rect x="180" y="140" width="440" height="230" rx="10" fill="#181818" stroke="#E50914" stroke-width="3" />
      <!-- Red Play Button -->
      <polygon points="380,225 440,255 380,285" fill="#E50914" />
      <rect x="220" y="170" width="120" height="12" rx="3" fill="#FFFFFF" opacity="0.8" />
      <rect x="220" y="195" width="200" height="8" rx="2" fill="#B3B3B3" opacity="0.6" />
      <rect x="270" y="65" width="260" height="42" rx="6" fill="#232323" stroke="#E50914" stroke-width="2" />
      <text x="400" y="91" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">NETFLIX PORTFOLIO</text>
    </svg>`
  },

  // 6. Python Problem-Solving Collection
  {
    name: 'project-6.svg',
    title: 'Python Problem-Solving',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p6-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.28" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p6-g)" />
      <!-- Binary Tree / Algorithm Structure -->
      <g stroke="#E50914" stroke-width="3" opacity="0.85">
        <line x1="400" y1="160" x2="280" y2="240" />
        <line x1="400" y1="160" x2="520" y2="240" />
        <line x1="280" y1="240" x2="200" y2="330" />
        <line x1="280" y1="240" x2="340" y2="330" />
        <line x1="520" y1="240" x2="460" y2="330" />
        <line x1="520" y1="240" x2="600" y2="330" />
      </g>
      <!-- Tree Nodes -->
      <circle cx="400" cy="160" r="22" fill="#232323" stroke="#FFFFFF" stroke-width="3" />
      <text x="400" y="167" fill="#FFFFFF" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">O(1)</text>
      <circle cx="280" cy="240" r="18" fill="#E50914" stroke="#FFFFFF" stroke-width="2" />
      <circle cx="520" cy="240" r="18" fill="#232323" stroke="#E50914" stroke-width="3" />
      <circle cx="200" cy="330" r="14" fill="#232323" stroke="#808080" stroke-width="2" />
      <circle cx="340" cy="330" r="14" fill="#E50914" />
      <circle cx="460" cy="330" r="14" fill="#232323" stroke="#808080" stroke-width="2" />
      <circle cx="600" cy="330" r="14" fill="#FFFFFF" />
      <rect x="270" y="65" width="260" height="42" rx="6" fill="#232323" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      <text x="400" y="91" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">PYTHON ALGORITHMS</text>
    </svg>`
  },

  // 7. JavaScript Interactive Projects
  {
    name: 'project-7.svg',
    title: 'JavaScript Interactive',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p7-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.32" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p7-g)" />
      <!-- Interactive Cursor + Ripple Ripples -->
      <circle cx="380" cy="240" r="100" fill="none" stroke="#E50914" stroke-width="2" opacity="0.3" stroke-dasharray="6,6" />
      <circle cx="380" cy="240" r="60" fill="none" stroke="#E50914" stroke-width="3" opacity="0.6" />
      <circle cx="380" cy="240" r="24" fill="#E50914" opacity="0.8" />
      <!-- Sleek Pointer Arrow -->
      <polygon points="380,240 450,290 420,305 445,345 425,355 400,315 370,335" fill="#FFFFFF" stroke="#141414" stroke-width="2" />
      <rect x="260" y="65" width="280" height="42" rx="6" fill="#232323" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      <text x="400" y="91" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">JS DOM INTERACTIONS</text>
    </svg>`
  },

  // 8. Responsive Web Interfaces
  {
    name: 'project-8.svg',
    title: 'Responsive Web Interfaces',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p8-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.3" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p8-g)" />
      <!-- Multi-device layout wireframes (Desktop, Tablet, Mobile) -->
      <!-- Desktop Monitor -->
      <rect x="180" y="150" width="300" height="180" rx="6" fill="#232323" stroke="#808080" stroke-width="2" />
      <line x1="330" y1="330" x2="330" y2="360" stroke="#808080" stroke-width="4" />
      <line x1="280" y1="360" x2="380" y2="360" stroke="#808080" stroke-width="4" stroke-linecap="round" />
      <!-- Red accent header in desktop -->
      <rect x="195" y="165" width="270" height="24" rx="3" fill="#E50914" opacity="0.8" />
      <!-- Mobile Phone overlapping right -->
      <rect x="440" y="180" width="130" height="210" rx="14" fill="#181818" stroke="#E50914" stroke-width="3" />
      <circle cx="505" cy="192" r="3" fill="#808080" />
      <rect x="455" y="210" width="100" height="18" rx="2" fill="#E50914" />
      <rect x="455" y="240" width="100" height="40" rx="3" fill="#232323" />
      <rect x="260" y="65" width="280" height="42" rx="6" fill="#232323" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      <text x="400" y="91" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">RESPONSIVE DESIGN</text>
    </svg>`
  },

  // 9. AI and Machine Learning Experiments
  {
    name: 'project-9.svg',
    title: 'AI & ML Experiments',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p9-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.32" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p9-g)" />
      <!-- Scatter plot coordinate axes -->
      <line x1="220" y1="350" x2="620" y2="350" stroke="#808080" stroke-width="2" />
      <line x1="220" y1="350" x2="220" y2="150" stroke="#808080" stroke-width="2" />
      <!-- Linear Regression Trendline (Red) -->
      <line x1="240" y1="330" x2="600" y2="170" stroke="#E50914" stroke-width="4" stroke-linecap="round" />
      <!-- Data Scatter Points -->
      <circle cx="280" cy="300" r="7" fill="#FFFFFF" />
      <circle cx="320" cy="315" r="7" fill="#E50914" />
      <circle cx="360" cy="265" r="7" fill="#FFFFFF" />
      <circle cx="410" cy="275" r="7" fill="#FFFFFF" />
      <circle cx="450" cy="220" r="7" fill="#E50914" />
      <circle cx="500" cy="235" r="7" fill="#FFFFFF" />
      <circle cx="540" cy="180" r="7" fill="#FFFFFF" />
      <circle cx="580" cy="195" r="7" fill="#E50914" />
      <rect x="270" y="65" width="260" height="42" rx="6" fill="#232323" stroke="#E50914" stroke-width="2" />
      <text x="400" y="91" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">ML & REGRESSION LAB</text>
    </svg>`
  },

  // 10. Creative Video Projects
  {
    name: 'project-10.svg',
    title: 'Creative Video Projects',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <radialGradient id="p10-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#E50914" stop-opacity="0.35" />
          <stop offset="60%" stop-color="#181818" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#141414" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p10-g)" />
      <!-- Cinematic Filmstrip Strip -->
      <g fill="#232323" stroke="#E50914" stroke-width="2">
        <rect x="140" y="160" width="520" height="180" rx="8" />
        <!-- Film Sprockets Top -->
        <rect x="170" y="170" width="30" height="20" rx="3" fill="#141414" />
        <rect x="230" y="170" width="30" height="20" rx="3" fill="#141414" />
        <rect x="290" y="170" width="30" height="20" rx="3" fill="#141414" />
        <rect x="350" y="170" width="30" height="20" rx="3" fill="#141414" />
        <rect x="410" y="170" width="30" height="20" rx="3" fill="#141414" />
        <rect x="470" y="170" width="30" height="20" rx="3" fill="#141414" />
        <rect x="530" y="170" width="30" height="20" rx="3" fill="#141414" />
        <rect x="590" y="170" width="30" height="20" rx="3" fill="#141414" />
        <!-- Timeline Red Playhead -->
        <line x1="400" y1="160" x2="400" y2="340" stroke="#E50914" stroke-width="4" />
        <polygon points="390,160 410,160 400,175" fill="#E50914" stroke="none" />
      </g>
      <rect x="260" y="65" width="280" height="42" rx="6" fill="#232323" stroke="#E50914" stroke-width="2" />
      <text x="400" y="91" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">CINEMATIC EDITING</text>
    </svg>`
  }
];

projectThumbnails.forEach(p => {
  fs.writeFileSync(path.join(PROJECTS_DIR, p.name), p.svg);
});

console.log('Project thumbnails written to public/assets/projects/');

