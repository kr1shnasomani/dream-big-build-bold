

# Dashboard Modernization Plan

## Summary
Major redesign of the `/dashboard` page with modern UI patterns: remove collaboration references, add Skiff-inspired top bar, replace old sidebar/topbar with modern components (glass tab bar, floating action menus, AI-style prompt box), and smart export placement.

---

## 1. Remove Collaboration References (3 files)

- **TrustStrip.tsx**: Remove "In Collaboration With" label, remove "IIT Kanpur" and "Dept. of Financial Services" items. Keep only "Punjab National Bank" and NIST reference.
- **FinalCTA.tsx**: Remove "IIT Kanpur" from the bottom compliance strip.
- **Footer.tsx**: Remove "In collaboration with IIT Kanpur" line.

---

## 2. Skiff-Style Top Bar (Navbar for Dashboard)

Replace the current dark `DashboardTopBar` with a clean, minimal top bar inspired by the Skiff screenshot — dark rounded pill in center with navigation items, light background:

- Light background (`bg-surface`), thin bottom border
- Left: AEGIS logo + "Dashboard" breadcrumb
- Center: A dark rounded pill container (like Skiff's `Product / Resources` bar) holding key nav shortcuts
- Right: Minimal user actions

---

## 3. Dashboard Layout Overhaul

### 3.1 Glass Bottom Tab Bar
Move the tab strip (Overview, PQC Assessment, Remediation Plan, etc.) from top to **bottom** of the viewport. Implement as a frosted-glass floating bar:
- Create `src/components/ui/liquid-glass.tsx` with the glass effect component (SVG filter blur, layered backgrounds)
- Fixed to bottom, centered, `backdrop-blur`, translucent background, rounded-3xl
- Tabs rendered as pills inside the glass bar
- Active tab gets subtle glow/highlight
- Add the `moveBackground` keyframe to `index.css`

### 3.2 Floating Action Menu for Sidebar
Replace the fixed 240px sidebar with a **floating action menu** (FAB):
- Create `src/components/ui/floating-action-menu.tsx` with the motion-animated expanding menu
- Position fixed bottom-left, above the glass tab bar
- Contains the sidebar nav items (Dashboard, Discovery, Inventory, CBOM, PQC Posture, etc.)
- Expands upward on click with staggered animation
- Sub-items (CBOM > Overview/Per-Asset/Export, PQC > Compliance/HNDL/Quantum Debt) shown inline

### 3.3 Gradient Text Accents
- Create `src/components/ui/gradient-text.tsx` for animated gradient text
- Add CSS variables (`--color-1` through `--color-5`) and gradient keyframes to `tailwind.config.ts` and `index.css`
- Apply to key dashboard headings: "Asset Discovery Network Graph", "Cyber Rating", section titles in KPI strip

### 3.4 AI-Style Domain Scanner Prompt
Replace the inline domain input with a centered, AI-landing-page-style prompt box:
- Create `src/components/ui/ai-prompt-box.tsx` (adapted from the provided component — light theme, AEGIS-branded)
- **Initial state**: Prompt box centered in the dashboard content area, large and prominent, with "Enter domain to scan" placeholder
- **Post-scan state**: Prompt box collapses to a compact version in the bottom glass bar (next to tabs), acting as a quick-access scanner
- Remove voice/canvas/think toggles — replace with "Scan Domain" and "Run Demo Scan" action buttons
- Keep the attachment button for uploading domain lists

### 3.5 Smart Export Placement
Remove export buttons from the top bar. Instead:
- Add a floating "Export" dropdown in the **top-right corner** of the dashboard content area
- Appears only after scan data is loaded
- Contains: Export PDF, Export CBOM (CycloneDX 1.7), Export CDXA
- Styled as a clean dropdown with document-type icons
- Each option shows a brief description (e.g., "Executive summary report", "Cryptographic Bill of Materials")

---

## 4. Updated Dashboard.tsx Structure

```text
┌─────────────────────────────────────────────┐
│  Top Bar (light, Skiff-style, minimal)      │
├─────────────────────────────────────────────┤
│                                             │
│  [Export ▾]                    (top-right)   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │   Center: AI Prompt Box             │    │ ← Before scan
│  │   "Enter domain to scan..."         │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  KPI Strip / Network Graph / etc.           │ ← After scan
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│  [FAB]  ┃  ░░ Glass Tab Bar (bottom) ░░    │
│         ┃  Overview · PQC · Remediation...  │
└─────────────────────────────────────────────┘
```

---

## 5. Files to Create/Modify

**New files:**
- `src/components/ui/liquid-glass.tsx` — Glass effect wrapper + SVG filter
- `src/components/ui/floating-action-menu.tsx` — FAB with expanding menu
- `src/components/ui/gradient-text.tsx` — Animated gradient text
- `src/components/ui/ai-prompt-box.tsx` — Domain scanner prompt (adapted, light theme)
- `src/components/dashboard/ExportDropdown.tsx` — Export button with dropdown
- `src/components/dashboard/GlassTabBar.tsx` — Bottom glass tab strip
- `src/components/dashboard/ScanPrompt.tsx` — Wrapper managing scan state transitions

**Modified files:**
- `src/pages/Dashboard.tsx` — Remove sidebar, move tabs to bottom, add prompt + export
- `src/components/dashboard/DashboardTopBar.tsx` — Redesign to Skiff-style light bar
- `src/components/dashboard/DashboardSidebar.tsx` — Remove (replaced by FAB)
- `src/components/landing/TrustStrip.tsx` — Remove collaboration references
- `src/components/landing/FinalCTA.tsx` — Remove IIT Kanpur reference
- `src/components/landing/Footer.tsx` — Remove collaboration reference
- `src/index.css` — Add gradient color vars, moveBackground keyframe
- `tailwind.config.ts` — Add gradient keyframes and color tokens

**Dependencies needed:** `motion` (already have `framer-motion`)

