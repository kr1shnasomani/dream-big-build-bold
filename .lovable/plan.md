

# AEGIS Full Feature Build — 18-Part Implementation Plan

This is a massive additive build. No existing visuals or working functionality will be changed. All new data extends `demoData.ts`. Implementation is organized into 5 batches.

---

## Batch 1 — Foundation & Context Infrastructure

### Part 1 — Sign Out Button
**File:** `DashboardSidebar.tsx`
- Add a "Sign Out" button at the very bottom of the sidebar, below the user avatar section, pinned to the bottom
- Icon: `LogOut` from lucide. Text: "Sign Out" (visible when expanded, icon-only when collapsed)
- onClick: `localStorage.removeItem('aegis-auth')` then `navigate('/landing')`. Do NOT clear `aegis-onboarded`
- Confirm `Navbar.tsx` already has "Sign In → /login" button (it does — verified)

### Part 2 — Scan Selector Context + Interactive DataContextBadge
**New file:** `src/contexts/SelectedScanContext.tsx`
- Shared context: `selectedScanId` (default: `SCN-007`), `setSelectedScanId`, `selectedScan` (resolved entry), `selectedAssets` (filtered from `scanAssetMap`), `isHistorical` (true if not SCN-007)
- All dashboard pages read from this context to scope their data

**Modified file:** `DataContextBadge.tsx`
- Convert the static badge into a dropdown button using `DropdownMenu` (shadcn)
- Lists all 7 scan history entries in reverse chronological order with radio-style indicators
- When a non-latest scan is selected, render an amber "HISTORICAL VIEW" banner strip below with "Switch to Latest →" link
- The dropdown shows: scan ID, target, date, "(current)" label for SCN-007

**Data additions to `demoData.ts`:**
- Add `scanSnapshots: Record<string, { qScore: number; assetIds: string[] }>` mapping each scan to its Q-Score and asset list. SCN-007 = full 21 assets / 370. SCN-003 = 3 assets / 24. SCN-005 = 6 assets (netbanking subset) / 410. Others = full set with Q-Scores from scanHistory entries.

### Part 4 — DataContextBadge on All Relevant Pages
**Modified files:** AssetDiscovery, AssetInventory, CBOMOverview, CBOMPerAsset, PQCCompliance, PQCHndl, PQCQuantumDebt, CyberRatingEnterprise, CyberRatingPerAsset, RemediationActionPlan, RemediationAIPatch, RemediationRoadmap
- Import and render `<DataContextBadge />` at top of each page
- Pages should read `selectedScanId` from context and filter displayed data accordingly (assets from `scanSnapshots[selectedScanId].assetIds`)

### Part 18 — Small Fixes (Batch 1 items)
- **ScanReport.tsx:** Add "View in Dashboard" button in header → navigates to `/dashboard` and sets `selectedScanId` to that scan
- **CyberRatingPerAsset.tsx:** Make asset names clickable → `navigate(/dashboard/assets/${id})`
- **CBOMExport.tsx:** Replace "No scheduled exports" static text with link to `/dashboard/reporting/scheduled`
- **NotFound.tsx:** Already has AEGIS branding — verify and confirm
- **CommandPalette.tsx:** Add scan report entries under new "Scans" group, one per scanHistory entry navigating to `/dashboard/scans/SCN-XXX`. Verify "Scan History" entry exists (it does)

---

## Batch 2 — Multi-Scan Queue & Scan Console

### Part 3 — Multi-Target Scan Input + Queue Wiring
**Modified file:** `DashboardLayout.tsx`
- Replace the pre-scan `ScanPromptBox` with a multi-target interface:
  - `<textarea>` with monospace font, placeholder for multiple domains, min-h 120px
  - Example domain chips below: `vpn.pnb.co.in`, `netbanking.pnb.co.in`, `auth.pnb.co.in`, `pnb.co.in` — click appends to textarea
  - "Upload File" button (accepts .txt/.csv, parses lines, populates textarea, shows "Loaded N targets" toast)
  - Scan profile segmented control: Quick | Standard | Deep | PQC Focus (default Standard)
  - "Run Demo Scan" button — sets `pnb.co.in` in queue, starts immediately
  - "Start Scan Queue" primary button — parses textarea lines, deduplicates, calls `startQueue()`

**Modified file:** `ScanQueueContext.tsx`
- Adjust phase timing: each phase ~2s (current) is fine for demo. On queue complete, call `setScannedDomain` on the ScanContext with last target, and push notification per completed target
- Expose `scanProfile` in context

**DashboardLayout.tsx** — floating widget:
- Already implemented with `position: fixed`. Verify z-index is 9999 (currently z-[90] — change to z-[9999])
- Ensure widget persists across routes (already does via DashboardLayout wrapper)

### Part 13 — Scan Console "What Next" Panel
**Modified file:** `ScanConsole.tsx`
- After scan completes (all phases 100%), replace control area with 3 action cards:
  1. "Open in Dashboard →" → `/dashboard`
  2. "View Scan Report →" → `/dashboard/scans/SCN-007`
  3. "Go to Remediation →" → `/dashboard/remediation/action-plan`
- "Run Another Scan" button resets console to initial state

---

## Batch 3 — Feature Upgrades

### Part 5 — Tier Classification as Slide-Over
**Modified file:** `CyberRatingEnterprise.tsx`
- Add "About these tiers ?" muted text link next to tier label
- Opens a `Sheet` (right-side) with tier criteria content from CyberRatingTiers page
- Remove "Tier Classification" from `ratingTabs` array in `CyberRatingPerAsset.tsx` and `CyberRatingEnterprise.tsx`

**Modified file:** `DashboardSidebar.tsx`
- Remove `{ label: 'Tier Classification', ... }` from the rating sub-menu

**Modified file:** `App.tsx`
- Add redirect: `/dashboard/rating/tiers` → `/dashboard/rating/enterprise`

**Modified file:** `CommandPalette.tsx`
- Replace "Tier Classification" entry with "View PQC Tier Criteria" → navigates to `/dashboard/rating/enterprise?tiers=open`

### Part 6 — Predictive Score Projection
**Modified file:** `CyberRatingEnterprise.tsx`
- Already has projection data and chart (lines 35-43). Verify it renders correctly
- Add threshold crossing annotations as dot markers with tooltip labels
- Add callout card below chart with improvement narrative and "View Roadmap →" link
- Use ~23 pts/month (recalculate from actual scan history data)

### Part 7 — AI Patch Generator Asset-Aware
**Modified file:** `RemediationAIPatch.tsx`
- Already has asset selector, finding selector, server type (lines 41-48). Already asset-aware
- Add `?asset=` query param reading with `useSearchParams` to pre-select asset
- Add special "already quantum safe" state for pqc-api (already exists at line 48)
- Add Q-Score Impact badge, Testing Command, NIST Reference to each patch card (partially done — nistRef exists in templates)
- Add cumulative impact summary at bottom

### Part 8 — Remediation Action Plan Enhancements
**Modified file:** `RemediationActionPlan.tsx`
- Already has Deadline column (line 41 `priorityDays`) and Assignee column (line 42 `defaultAssignee`)
- Add Progress summary card at top: "3 of 14 resolved (21%) · Est. full remediation: Sep 2027"
- Refine Deadline to show red/amber/muted coloring based on days remaining relative to Apr 1 2026
- Add Status dropdown per row (Not Started/In Progress/Resolved/Verified) with green left border for resolved
- Pre-populate 2 resolved findings in demoData
- Add collapsible "Previously Resolved" section at bottom

### Part 10 — Per-Asset Ratings Trend Column
**File:** `CyberRatingPerAsset.tsx`
- Already has 7d Trend column (line 35) and uses `assetTrends` data. Already implemented
- Make asset names clickable → navigate to `/dashboard/assets/:id`

### Part 11 — Scan-Scoped Asset Discovery Toggle
**Modified file:** `AssetDiscovery.tsx`
- Add segmented control after page title: `[📡 SCN-007 — This Scan]` `[🕐 All Time]`
- Default to "This Scan". Filter domains/SSL/IP/software to assets in `scanAssetMap['SCN-007']`
- Update tab count labels dynamically
- Shadow IT tab always shows all-time
- Show scoping label below tab strip in scoped mode

---

## Batch 4 — Discovery Modals, CBOM, HNDL, Roadmap

### Part 9 — Discovery Row Detail Slide-Overs
**New file:** `src/components/dashboard/DiscoveryDetailPanel.tsx`
- Four panel variants for Domains, SSL, IP, Software tabs
- Uses `Sheet` (right-side) with structured sections as described
- Domains: WHOIS, DNS records (from `dnsRecords`), risk assessment, action buttons
- SSL: cert details, chain visualization, quantum assessment callout, "Set Expiry Alert" button
- IP: network info, open ports with risk badges, "Add to Inventory" button
- Software: info, CVEs (from `cveData`), PQC migration path text, "Add to Remediation" button

**Modified file:** `AssetDiscovery.tsx`
- Add onClick to all table rows → open appropriate DiscoveryDetailPanel variant

### Part 14 — CBOM Attestation Per Asset
**File:** `CBOMPerAsset.tsx`
- Already has attestation section with hashes (line 19-25), verify modal (line 29). Already implemented
- Verify it renders correctly

**Modified file:** `CBOMExport.tsx`
- Add "CDXA Attestation Document" export card
- Add link from "Scheduled Exports" card to `/dashboard/reporting/scheduled`

### Part 15 — Effort/Impact Matrix + Resource Estimator on Roadmap
**Modified file:** `RemediationRoadmap.tsx`
- Add Quick Wins Matrix: 2x2 grid with colored quadrant backgrounds and clickable chips
- Add Resource Estimator card: team size input, hours/week select, reactive completion date using formula `baseMonths=18; adjusted = ceil(18 * 40/(team*hours))`

### Part 16 — HNDL Exposure Heatmap
**File:** `PQCHndl.tsx`
- Already has heatmap (lines 31-37) with correct data. Already implemented
- Verify tooltips and cell click navigation work

---

## Batch 5 — Command Palette, Executive Language

### Part 12 — Command Palette Query Syntax
**Modified file:** `CommandPalette.tsx`
- Detect query patterns: `cipher:`, `expiry:<`, `score:<`, `score:>`, `status:`, `type:`, `tls:`
- When detected, filter `assets` array and show compact result rows (hostname, IP, Q-Score chip, status badge)
- Click navigates to `/dashboard/assets/:id`
- Header: `Assets matching "cipher:DES" — 3 results`
- Empty state hint at bottom: `Try: cipher:DES · expiry:<30d · score:<50 · status:critical`

### Part 17 — Executive View Language Substitutions
**Modified file:** `DashboardHome.tsx`
- In the Executive role view, apply text substitutions via a wrapper/helper function
- Replace KPI strip labels: "Fully Quantum Safe" → "Protected Assets", "Critically Vulnerable" → "At Risk — Action Required", "Unknown" → "Pending Assessment"
- Apply terminology mapping throughout Executive view panels only

### Part 18 — Remaining Small Fixes
- **ScanHistory.tsx:** Wire "Compare" button to pre-select Scan A and scroll to compare section (already partially done — refine)
- **RemediationActionPlan Deadline:** Color coding: red <14d, amber 14-30d, muted >30d (relative to Apr 1 2026)
- **AssetDetail.tsx:** "Generate Patch" button → navigate to `/dashboard/remediation/ai-patch?asset=<hostname>`

---

## Summary

| Category | Files |
|----------|-------|
| **New files** | `SelectedScanContext.tsx`, `DiscoveryDetailPanel.tsx` |
| **Modified (major)** | `App.tsx`, `DashboardLayout.tsx`, `DashboardSidebar.tsx`, `DataContextBadge.tsx`, `CommandPalette.tsx`, `AssetDiscovery.tsx`, `RemediationActionPlan.tsx`, `RemediationRoadmap.tsx`, `CyberRatingEnterprise.tsx`, `ScanConsole.tsx`, `ScanReport.tsx`, `demoData.ts` |
| **Modified (minor)** | ~12 pages getting DataContextBadge import, `CBOMExport.tsx`, `CyberRatingPerAsset.tsx`, `RemediationAIPatch.tsx`, `ScanHistory.tsx`, `AssetDetail.tsx`, `NotFound.tsx` |

Several features are already partially or fully implemented from the previous build (heatmap, trend column, attestation, asset-aware patch generator, projection chart). These will be verified and refined rather than rebuilt.

