

# AEGIS Gap Resolution — Full Build Plan

This is a large additive build across 14 parts. No existing visuals or pages are redesigned. All new data extends `demoData.ts`.

---

## Part 1 — Restore Landing Page as Default

**Changes:**
- `App.tsx`: Change `/` route to show `<Index />` when not authenticated (instead of redirecting to `/login`). Keep `/login` as a separate route.
- `src/components/landing/Navbar.tsx`: Change "Launch Scanner" button to "Sign In" linking to `/login`. Update CTA buttons in `FinalCTA.tsx` to link to `/login`.

**Files:** App.tsx, Navbar.tsx, FinalCTA.tsx

---

## Part 2 — Scan Report Page (`/dashboard/scans/:scanId`)

**New file:** `src/pages/ScanReport.tsx`

Full-page scan report with header (scan ID badge, target, timestamp, duration, status chip, breadcrumb, "Download Report" + "Compare with Previous" buttons).

Four sections:
1. **Summary cards row** (5 cards): Assets Discovered, New Assets, Critical Findings, Q-Score, PQC-Ready assets
2. **Tabbed panel** with 4 tabs:
   - **Assets** — table of assets scoped to this scan (use `scanHistory` entry's `target` to filter `assets` by domain match). Links to `/dashboard/assets/:id`.
   - **Findings** — all remediation items from scoped assets, sorted by severity. "Fix This" button links to AI Patch.
   - **CBOM Snapshot** — key length + cipher charts scoped to scan assets, attestation block.
   - **Delta vs Previous** — compare against previous scan of same target from `scanHistory`. Q-Score change, assets added/removed, findings resolved/new.

**Data:** Add `scanAssetMap` to `demoData.ts` mapping scan IDs to asset IDs (e.g., SCN-007 → all 21 assets, SCN-003 → [a1, a2, a4] for vpn.pnb.co.in scope).

**Wiring:** Route `scans/:scanId` in App.tsx. Import lazy. Wire "View" button in ScanHistory to `navigate(/dashboard/scans/${s.id})`.

---

## Part 3 — Multi-Scan Queue with Live Progress

**New context:** `src/contexts/ScanQueueContext.tsx`
- State: `queue: Array<{ target, status, scanId, progress, currentPhase }>`, `isRunning`, `minimized`
- Actions: `startQueue(targets, profile)`, `cancelQueue()`, `toggleMinimize()`
- Simulated progression: each target runs through 5 phases (2s each) via `setInterval`, then marks done and moves to next.
- On each completion, add notification via a `notifications` state array.

**Changes to DashboardLayout.tsx:**
- Replace the pre-scan `ScanPromptBox` with multi-target input: `<textarea>` for multiple domains, "Upload File" button (parses .txt/.csv), chip input for individual targets, scan profile selector (Quick/Standard/Deep/PQC Focus), "Start Scan Queue" button.
- Full-screen scan progress overlay (dismissible) showing queue list with phase progress for active target, terminal log window.
- Minimized floating widget (fixed bottom-right, above dock) showing "Scanning 2/4 · domain" with progress bar, Expand/Cancel buttons. Persists across route changes.
- On queue complete: flash "Scan Queue Complete ✓" for 4s, then fade.

**Changes to notification popover:** Accept notifications from ScanQueueContext.

---

## Part 4 — Data Context Badge

**New component:** `src/components/dashboard/DataContextBadge.tsx`
- Shows: "📡 Data from: SCN-007 · pnb.co.in · Apr 1 2026, 09:14 · [Refresh]"
- Uses latest `scanHistory[0]` entry + `scannedDomain` from ScanContext.
- "Refresh" triggers a new scan of same target.

**Add to pages:** DashboardHome, AssetDiscovery, AssetInventory, CBOMOverview, CBOMPerAsset, PQCCompliance, PQCHndl, PQCQuantumDebt, CyberRatingEnterprise, CyberRatingPerAsset, RemediationActionPlan, RemediationAIPatch, RemediationRoadmap. (Not on Settings, Reporting, ScanHistory.)

---

## Part 5 — Dashboard Home Delta-First Redesign

**New component:** `src/components/dashboard/SinceLastScanStrip.tsx`
- Horizontal alert bar: "🔄 Since SCN-006 (Mar 25): +2 new assets · 1 new critical finding · Q-Score +45 · 1 cert expiring <7d"
- Each item clickable (links to relevant pages).

**New component:** `src/components/dashboard/ViewRoleToggle.tsx`
- Three buttons: Executive | Analyst | Compliance. Defaults to Analyst.
- Controls which panels are visible in DashboardHome.

**Changes to DashboardHome.tsx:**
- Add SinceLastScanStrip below KPIStrip.
- Add ViewRoleToggle in top-right.
- Wrap panels in conditional rendering based on active role.
- Executive: KPI + SinceLastScan + CyberRating (large) + CertExpiry + RecentActivity. Relabel technical terms.
- Analyst: Full current layout.
- Compliance: KPI + compliance table (asset + PQC status + cert validity) + "Generate Compliance Evidence Package" button + RecentActivity.

**New component:** `src/components/dashboard/CompliancePackageModal.tsx`
- Modal with scope selector, standards checkboxes, date range, generate button with 2s progress → "Package Ready" with download button and manifest.

---

## Part 6 — PQC Certificate Download

**New component:** `src/components/dashboard/PQCCertificateModal.tsx`
- Formal certificate preview: AEGIS logo, title based on tier, asset details, issue/expiry dates, cert ID, NIST standards met, Ed25519 hash, shield watermark, verify URL.
- "Download as PDF" + "Copy Certificate ID" buttons.

**Changes to AssetDetail.tsx:**
- Add "Download Certificate" button next to PQC badge in header. Active only for elite-pqc or safe (pqc-transitioning) assets. Greyed out with tooltip for others.

---

## Part 7 — Remediation Feedback Loop

**Changes to RemediationActionPlan.tsx:**
- Add "Status" dropdown to every row: Not Started / In Progress / Resolved / Verified.
- Resolved rows get green left border + "Resolved in SCN-XXX · X days after detection" annotation.
- Pre-populate 2 demo items as Resolved/Verified (add to demoData remediation entries).
- Add "Resolved Findings" collapsible section at bottom.
- Add "Remediation Progress" summary card at top: "3 of 14 resolved · 21% · Est. full: Sep 2027".

---

## Part 8 — Scan-Scoped Asset Discovery

**Changes to AssetDiscovery.tsx:**
- Add scope toggle after page title: [This Scan: SCN-007] [All Time]. Default "This Scan".
- When scoped: filter domain/SSL/IP/software records to only assets matching latest scan's target domain. Shadow IT tab always shows all-time.
- Show scoping label under tab strip.

---

## Part 9 — Tier Classification as Modal

**Changes to CyberRatingEnterprise.tsx:**
- Add "About these tiers ?" link that opens a Sheet slide-over with tier criteria table content (currently in CyberRatingTiers page).
- Remove `rating/tiers` from sidebar nav items in DashboardSidebar.
- Remove route from App.tsx (or keep as redirect to enterprise).

**Changes to CommandPalette.tsx:**
- Replace "Tier Classification" entry with "View PQC Tier Criteria" that could open the same slide-over (or navigate to enterprise page with a query param).

---

## Part 10 — Scan History Wiring & Command Palette Fix

**Changes to CommandPalette.tsx:**
- Add `{ label: 'Scan History', path: '/dashboard/history', icon: History, group: 'Navigation', keywords: ['scan', 'history', 'past'] }`.

**Changes to ScanHistory.tsx:**
- Wire "View" button: `onClick={() => navigate('/dashboard/scans/' + s.id)}`.
- Wire "Compare" button: pre-select that scan as Scan A and scroll to compare section.

---

## Part 11 — Predictive Score Projection

**Changes to CyberRatingEnterprise.tsx:**
- Below existing score history chart, add "Projected Trajectory" section.
- Extended line chart: solid line for historical (12 weeks), dashed line for projected (12 months forward).
- Calculate avg monthly improvement from scanHistory (~26 pts/month), project forward.
- Horizontal reference lines at 400 (Standard) and 700 (Elite-PQC).
- Annotation labels at threshold crossings.
- Callout box below with improvement narrative.

---

## Part 12 — First-Use Onboarding Wizard

**New component:** `src/components/dashboard/OnboardingWizard.tsx`
- 3-step modal overlay. Checks `aegis-onboarded` in localStorage.
- Step 1: Welcome with logo and description.
- Step 2: Scan input (reuse multi-target from Part 3 or simple single input), "Run Demo Scan" shortcut, "Skip" link.
- Step 3: Mini summary of scan results with quick-action buttons.
- Sets `aegis-onboarded = true` on dismiss.

**Changes to DashboardLayout.tsx:**
- Render OnboardingWizard conditionally when `!localStorage.getItem('aegis-onboarded')`.

---

## Part 13 — Prototype Requirements Compliance Check

Audit existing pages against hackathon spec. Based on codebase review:
- **Asset Discovery tabs** — already have Detection Date, Domain, Registration, Registrar columns. SSL tab has CN, CA, Algo, Key, Valid Until. IP tab has Detection, IP, Ports, Subnet, ASN, Location. Software tab has Detection, Product, Version, Type, Host. Missing: Company column on Domains tab (already has it via `company` field, just need to add column). Add SHA Fingerprint to SSL tab.
- **CBOM** — has KPI cards, key length chart, cipher chart, CA chart, TLS chart, per-app table. Looks complete.
- **PQC Compliance** — has tier bar, pie chart. Need to verify 3x3 risk heatmap exists (check PQCCompliance page more deeply). Add improvement recommendations if missing.
- **Cyber Rating** — has enterprise score, tier label, threshold table. Per-asset table exists.
- **Quantum-Safe label** — shield badge exists on asset detail. Add to AssetInventory status column and CBOM per-asset view.
- **Reporting** — all three modes exist. Verify content completeness.

**Changes:** Minor column additions to discovery tabs, shield badge additions to inventory/CBOM tables.

---

## Part 14 — Small Fixes

1. **Dashboard.tsx** — Check if unused; delete if not referenced.
2. **ScanHistory Compare button** — Pre-select row as Scan A, scroll to compare section.
3. **CBOMExport** — "No scheduled exports" text → link to `/dashboard/reporting/scheduled`.
4. **RemediationActionPlan Deadline** — Already implemented with relative dates. Refine: show red if <14d, amber if 14-30d.
5. **AssetDetail "Generate Patch"** — Navigate with query param `?asset=vpn-pnb-co-in` and pre-select in RemediationAIPatch.
6. **Command Palette** — Add Scan History (covered in Part 10).
7. **NotFound** — Add AEGIS logo, shield icon, styled 404 with links to Dashboard and Landing.

---

## Implementation Order

Given the massive scope, implementation will be batched:

**Batch 1 — Foundation:** Parts 1, 10, 14 (routing fixes, command palette, small fixes)
**Batch 2 — Core new pages:** Parts 2, 3 (ScanReport, ScanQueueContext)
**Batch 3 — Dashboard enhancements:** Parts 4, 5, 12 (DataContextBadge, delta strip, onboarding)
**Batch 4 — Feature upgrades:** Parts 6, 7, 8, 9, 11 (PQC cert, remediation loop, scoping, tiers modal, projection)
**Batch 5 — Compliance audit:** Part 13

---

## New Files (~8)
- `src/pages/ScanReport.tsx`
- `src/contexts/ScanQueueContext.tsx`
- `src/components/dashboard/DataContextBadge.tsx`
- `src/components/dashboard/SinceLastScanStrip.tsx`
- `src/components/dashboard/ViewRoleToggle.tsx`
- `src/components/dashboard/CompliancePackageModal.tsx`
- `src/components/dashboard/PQCCertificateModal.tsx`
- `src/components/dashboard/OnboardingWizard.tsx`

## Modified Files (~15+)
- App.tsx, demoData.ts, DashboardLayout.tsx, DashboardHome.tsx, ScanHistory.tsx, AssetDiscovery.tsx, AssetDetail.tsx, RemediationActionPlan.tsx, CyberRatingEnterprise.tsx, CommandPalette.tsx, NotFound.tsx, CBOMExport.tsx, Navbar.tsx, FinalCTA.tsx, DashboardSidebar.tsx, AssetInventory.tsx, CBOMPerAsset.tsx

