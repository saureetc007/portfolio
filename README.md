# SAUREET — Cinematic Netflix-Inspired Developer Portfolio

A developer portfolio for **Saureet Chakrabarti** built with **React 19**, **TypeScript**, **Vite**, and **Three.js**, styled with a streaming platform aesthetic inspired by Netflix's dark interface.

---

## 🎨 Visual Identity & Color Palette

- **Primary Background**: `#141414` (Deep streaming black)
- **Secondary Background**: `#181818` (Dark charcoal)
- **Card Surfaces**: `#232323` (Elevated card panels)
- **Primary Accent**: `#E50914` (Netflix Red)
- **Secondary Accent**: `#B20710` (Dark crimson)
- **Primary Typography**: `#FFFFFF` (Headings, titles, active controls)
- **Secondary Typography**: `#B3B3B3` (Body descriptions and metadata)
- **Muted Typography**: `#808080` (Captions and timestamps)
- **Borders & Dividers**: `rgba(255, 255, 255, 0.12)`

All cyan glows, electric-blue lighting, floating cubes, and generic AI startup decorations have been replaced with a streaming interface with directional scrims, horizontal card carousels, and atmospheric lighting.

---

## 🎬 Core Features

1. **Netflix-Inspired Navigation Bar**
   - Brand logo: `SAUREET.` with a geometric crimson accent mark.
   - Transparent gradient overlay at top of page, transitions to solid `#141414` with backdrop blur on scroll.
   - Mobile responsive drawer with accessible Escape key handler and focus trapping.

2. **Hero: Cinematic Featured-Content Slideshow**
   - 3 distinct slides with exact specified copy:
     - **Slide 1**: Introducing Saureet — *"Building ideas into reality."*
     - **Slide 2**: Featured Project — DecisionVault / DecisionTrace — *"Engineering decisions, recovered."*
     - **Slide 3**: Technical Journey — *"Learning by building."*
   - Auto-transitions every ~8 seconds with Netflix-style segment progress bars.
   - Pauses on hover, focus, and when the browser tab is hidden (`visibilitychange`).
   - Manual previous / next chevron buttons and direct indicator selection.
   - Respects `prefers-reduced-motion`.
   - Distinct cinematic background artwork for each slide.

3. **Horizontal Skills Browsing (5 Rows)**
   - **Row 1**: Explore My Technical Skills
   - **Row 2**: Artificial Intelligence & Data
   - **Row 3**: Web Development
   - **Row 4**: Creative Development
   - **Row 5**: Currently Exploring
   - Netflix-style horizontal scrolling with touch gestures and chevron navigation buttons.
   - Smooth hover scaling on cards with red accent borders.
   - Clear distinction between applied skills and currently exploring skills (`EXPLORING` badge).

4. **Top 10 Numbered Projects Showcase & Detail Modal**
   - Oversized numbers (1 through 10) in Netflix display typography partially overlapping cards.
   - 10 verified project entries with honest statuses:
     - `DecisionVault / DecisionTrace` (In Progress)
     - `AI-Powered Cognitive Support Platform` (In Progress)
     - `Spotify-Inspired Music Player` (Completed)
     - `Simon Memory Game` (Completed)
     - `Personal Developer Portfolio` (In Progress)
     - `Python Problem-Solving Collection` (Experiment)
     - `JavaScript Interactive Projects` (Experiment)
     - `Responsive Web Interfaces` (Learning Project)
     - `AI and Machine Learning Experiments` (Experiment)
     - `Creative Video Projects` (Learning Project)
   - Unique, project-specific artwork for each thumbnail.
   - Working detail interaction: click any card to open a full Netflix modal with Problem, Approach, Tech Choices, Implementation, Key Learnings, and verified GitHub profile link.

5. **Continue Building Queue**
   - Netflix-inspired "Continue Watching" row showing current learning pursuits with red progress playback bars.

6. **Editorial About Section**
   - Personal narrative of studying CS & AI at Rishihood University (Newton School of Technology).
   - Milestone trajectory and academic facts card.

7. **Three.js Interactive Skills Universe**
   - Interactive 3D WebGL scene with dark charcoal background.
   - Central node: `Saureet Chakrabarti` (crimson core with glowing halo ring).
   - Category nodes orbiting center with red laser filaments.
   - Technology nodes orbiting categories.
   - Raycasting hover highlighting and click selection.
   - Interactive HUD panel with node details and "Reset View" camera button.
   - Orbit drag and mousewheel zoom.
   - Accessible categorized text directory fallback.

8. **Contact & Minimalist Footer**
   - Closing headline: *"Have an idea worth building?"*
   - GitHub: [https://github.com/saureetc007](https://github.com/saureetc007)
   - LinkedIn: [https://www.linkedin.com/in/saureet-chakrabarti-140a59238/](https://www.linkedin.com/in/saureet-chakrabarti-140a59238/)
   - Editable email placeholder in `src/data/profile.ts`.

---

## 🚀 How to Run the Website

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Run strict TypeScript check
npm run typecheck

# 4. Create production build
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
├── public/
│   └── assets/
│       ├── hero/          # SVG slide backgrounds (slide-1..3 wide & tall)
│       └── projects/      # 10 individual project SVG artworks (project-1..10)
├── scripts/
│   ├── generate-assets.js # Node asset generator for hero slides & thumbnails
│   └── verify-build.js    # Integrity verification script
├── src/
│   ├── components/
│   │   ├── hero/          # Hero slideshow component
│   │   ├── skills/        # Horizontal browsing carousels & cards
│   │   ├── projects/      # Top 10 numbered cards & ProjectModal dialog
│   │   ├── journey/       # Continue building queue
│   │   ├── universe/      # Three.js WebGL scene & accessible list
│   │   ├── about/         # Editorial about & milestones
│   │   ├── contact/       # Contact section & social buttons
│   │   ├── layout/        # Navbar, Footer, Section, Container
│   │   └── ui/            # Buttons, Badges, Section headings, Icons
│   ├── data/              # Central data layer (profile, hero, skills, projects, journey)
│   ├── hooks/             # useActiveSection, useReducedMotion, useReveal
│   ├── styles/            # CSS tokens, layout, ui, motion, hero, sections, footer
│   └── types/             # TypeScript interfaces for all site content
├── package.json
└── vite.config.ts
```

---

## 📝 Assets to Supply

1. **Email Address**: Set `email` in [`src/data/profile.ts`](file:///Users/zidan/Downloads/saureet-portfolio%203/src/data/profile.ts#L11) when ready.
2. **GitHub Repositories**: Update `repo` URLs in [`src/data/projects.ts`](file:///Users/zidan/Downloads/saureet-portfolio%203/src/data/projects.ts) as individual project repositories are published publicly.
3. **Screenshots (Optional)**: If you'd like to replace the generated vector SVGs with real application screenshots in the future, drop image files into `public/assets/projects/` and update the `thumbnail` paths in `src/data/projects.ts`.
