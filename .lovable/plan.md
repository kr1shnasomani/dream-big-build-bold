

# AEGIS — Build Plan
## Quantum Cryptographic Intelligence Platform

This is a large build: a polished landing page (10 sections) + a functional demo dashboard, all with a custom design system inspired by Skiff/Linear/Vercel aesthetics.

---

## What Gets Built

**Landing Page (`/`)** — 10 sections scrolling vertically:
1. Fixed navbar with AEGIS branding + nav links + CTA buttons
2. Split hero (dark left / light right with live "Risk Matrix" card)
3. Trust/affiliation strip (PNB, IIT Kanpur, Govt of India)
4. "Why This Matters" problem statement with stat callouts
5. 5-Phase CBOM Pipeline horizontal timeline
6. 6-card capabilities grid with hover effects
7. Interactive mini-dashboard product preview
8. NIST Standards reference (3 large cards)
9. Final CTA section (dark, centered)
10. Footer

**Dashboard (`/dashboard`)** — Functional demo with simulated data:
- Fixed sidebar (240px) + top bar with domain input
- Tab strip (Overview active)
- 6 KPI cards with count-up animation
- Network graph (SVG force-directed approximation)
- Cyber Rating panel with score gauge
- Asset Inventory table (21 rows of demo data)
- Slide-over detail panel on row click
- Q-Score overview + Enterprise Intelligence panels

---

## Technical Approach

### Design System Setup
- Add CSS variables for the full color palette (brand-primary `#1E1535`, accent-amber `#E8A020`, status colors, etc.)
- Extend `tailwind.config.ts` with custom colors mapped to CSS vars
- Import Google Fonts: **Instrument Serif**, **DM Sans**, **JetBrains Mono** via `index.html`
- Define font-family utilities in Tailwind config
- Add custom keyframe animations (fade-up, float, pulse-dot, count-up)

### New Dependencies
- `framer-motion` — subtle scroll animations and page transitions

### File Structure
```text
src/
├── data/
│   └── demoData.ts              # All 21 assets + scores + enterprise data
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx              # Split hero with LiveRiskMatrix
│   │   ├── LiveRiskMatrix.tsx    # Interactive card in hero right
│   │   ├── TrustStrip.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── PipelineSection.tsx   # 5-phase horizontal timeline
│   │   ├── CapabilitiesGrid.tsx
│   │   ├── DashboardPreview.tsx  # Mini interactive dashboard
│   │   ├── NistStandards.tsx
│   │   ├── FinalCTA.tsx
│   │   └── Footer.tsx
│   └── dashboard/
│       ├── DashboardLayout.tsx   # Sidebar + topbar shell
│       ├── DashboardSidebar.tsx
│       ├── DashboardTopBar.tsx
│       ├── KPIStrip.tsx
│       ├── NetworkGraph.tsx      # SVG force-directed approximation
│       ├── CyberRating.tsx       # Score gauge + tier
│       ├── AssetTable.tsx        # Full inventory table
│       ├── AssetSlideOver.tsx    # Detail panel
│       ├── QScoreOverview.tsx    # Circular gauge + bar breakdown
│       └── EnterpriseIntel.tsx
├── pages/
│   ├── Index.tsx                 # Landing page (all sections composed)
│   └── Dashboard.tsx             # Dashboard page
└── App.tsx                       # Add /dashboard route
```

### Key Implementation Details

- **Split Hero**: CSS grid `grid-cols-[45%_55%]`, left column `bg-[#1E1535]`, right column `bg-[#F7F8FA]` with the LiveRiskMatrix floating card (white, `rounded-2xl`, large shadow, gentle float animation)
- **Pipeline Timeline**: Horizontal flex with a 2px connecting line, alternating colored circle nodes, vertical connectors to content blocks below
- **Network Graph**: Pure SVG with pre-positioned nodes (no D3 dependency needed). 15 nodes colored by status, edges as lines, labels on nodes
- **Q-Score Gauge**: SVG circle with `stroke-dasharray` / `stroke-dashoffset`, color interpolated by score
- **Asset Table**: Built on shadcn Table, sortable columns, status badges with tinted backgrounds
- **Slide-over Panel**: shadcn Sheet component sliding from right, 400px wide
- **Count-up Animation**: `useEffect` with `requestAnimationFrame` for KPI numbers
- **Scroll Animations**: Framer Motion `whileInView` with `opacity: 0→1`, `y: 20→0`, staggered children

### Build Sequence (13 steps)

1. Design tokens + Tailwind config + font imports
2. Landing: Navbar + Hero with LiveRiskMatrix
3. Landing: Trust Strip + Problem Section
4. Landing: Pipeline Section (5-phase timeline)
5. Landing: Capabilities Grid
6. Landing: Dashboard Preview (mini interactive dashboard)
7. Landing: NIST Standards + Final CTA + Footer
8. Demo data file (all 21 assets)
9. Dashboard: Layout shell (sidebar + topbar)
10. Dashboard: KPI strip + Network Graph + Cyber Rating
11. Dashboard: Asset Inventory table + Slide-over
12. Dashboard: Q-Score Overview + Enterprise Intelligence
13. Routing, scroll behaviors, final polish

---

## Design Priorities

- **Whitespace-heavy** — every section breathes, Skiff-style
- **Editorial typography** — Instrument Serif italic creates unexpected elegance for a security product
- **Light mode dominant** — `#F7F8FA` base, white cards, NOT dark/hacker aesthetic
- **Status colors only on data elements** — badges, chart segments, progress fills — never as section backgrounds
- **Subtle animations** — no bouncing, no dramatic reveals. Framer Motion with 0.4s duration, custom easing

