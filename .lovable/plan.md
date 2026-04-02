
# AEGIS Gap Resolution Build Plan

This is a large build with 12 distinct features. All additions are additive — no existing pages are redesigned. All new data extends `src/data/demoData.ts`.

---

## 1. Login Page (`/login`)

**New files:**
- `src/pages/Login.tsx` — Full-screen split layout. Left: dark animated background with floating crypto text fragments (hex values, cipher names drifting upward via CSS keyframes). Right: dark card with AEGIS wordmark, shield badge, tagline, institution strip, email/password inputs, remember-me toggle, deep red login button with gold text, forgot password link, demo credentials box, bottom compliance strip.

**Changes:**
- `src/App.tsx` — Add `/login` route. Change `/` from `<Index />` to redirect logic: if "authenticated" (localStorage flag), go to `/dashboard`; otherwise go to `/login`. Keep landing at `/landing` or similar if needed.
- Auth is fake: hardcoded check — email contains "aegis" or "pnb" AND password is "aegis2026" → set localStorage flag, navigate to `/dashboard`. Otherwise show inline error.

---

## 2. Scan History Page (`/dashboard/history`)

**New files:**
- `src/pages/ScanHistory.tsx` — "Run New Scan" button linking to scan-console. Table with 7 hardcoded scan entries (SCN-001 through SCN-007 with exact values from spec). Status pills. Eye/Compare action icons. Score Trend line chart (recharts) with horizontal threshold lines at 400 and 700. "Compare Two Scans" panel with two dropdowns, compare button, side-by-side diff.

**Changes:**
- `src/data/demoData.ts` — Add `scanHistory` array with 7 entries.
- `src/App.tsx` — Add route `/dashboard/history`.
- `src/components/dashboard/DashboardSidebar.tsx` — Add "Scan History" nav item with Clock icon.
- `src/pages/DashboardLayout.tsx` — Add `history` to `getActiveNav` and `handleNavClick`.

---

## 3. Asset Detail Full Page (`/dashboard/assets/:id`)

**New files:**
- `src/pages/AssetDetail.tsx` — Full page with breadcrumb header, Q-Score circular gauge, PQC tier badge, "Scan Now" button. Six stacked card sections:
  1. Identity (two-column key-value grid)
  2. TLS Profile (protocol matrix, cipher list with colored badges, FS/HSTS/pinning status)
  3. Certificate Chain (vertical visual chain: Leaf → Intermediate → Root with quantum vulnerability badges)
  4. PQC Assessment (Q-Score gauge + radar chart via recharts RadarChart, HNDL risk callout)
  5. Score History (line chart with 5 data points and event markers)
  6. Remediation (filtered action list + "Generate Patch" button linking to ai-patch)

**Changes:**
- `src/data/demoData.ts` — Add `assetDetailData` map with extended data for vpn-pnb-co-in, auth-pnb-co-in, pqc-api-pnb-co-in, netbanking-pnb-co-in (score history, cert chain, DNS records, etc.)
- `src/App.tsx` — Add route `assets/:id` under dashboard.
- `src/pages/AssetInventory.tsx` — Make asset name cells clickable links to `/dashboard/assets/[id]`.
- `src/pages/AssetDiscovery.tsx` — Make domain cells in tables clickable.

---

## 4. Dashboard Home — Add Missing Panels

**Changes to `src/components/dashboard/KPIStrip.tsx`:**
- Add 2 more KPI cards: "Expiring Certs (≤30d)" showing 2 with amber icon, "High Risk Assets" showing 5 with pulsing red dot.

**New components (or inline in DashboardHome):**
- `src/components/dashboard/CertExpiryTimeline.tsx` — Horizontal grouped bar chart (4 rows: 0-30d, 30-60d, 60-90d, >90d). Clickable rows navigate to discovery?tab=ssl.
- `src/components/dashboard/AssetRiskDistribution.tsx` — Vertical bar chart (Critical/High/Medium/Low).
- `src/components/dashboard/CryptoSecurityOverview.tsx` — Compact table (5 rows) with Asset/Key Length/Cipher/TLS/CA. Red highlight for weak ciphers, emerald border for PQC rows.
- `src/components/dashboard/RecentActivityFeed.tsx` — Scrollable list with 6 hardcoded entries, icons, relative timestamps, clickable links.

**Changes to `src/pages/DashboardHome.tsx`:**
- Import and render new panels below existing content.

---

## 5. Discovery Tab Detail Modals

**New files:**
- `src/components/dashboard/DiscoveryDetailPanel.tsx` — A sheet/slide-over component that renders different content based on tab type (domains/ssl/ip/software). Each variant has specific sections per spec: WHOIS, DNS records, risk assessment for domains; cert details, chain, quantum assessment for SSL; network info, open ports for IP; software info, CVEs, PQC migration path for software.

**Changes:**
- `src/data/demoData.ts` — Add `dnsRecords`, `cveData` maps for enriched detail data.
- `src/pages/AssetDiscovery.tsx` — Add onClick handlers to all table rows in all 4 tabs. Open the DiscoveryDetailPanel sheet with the clicked item's data.

---

## 6. AI Patch Generator — Make Asset-Aware

**Changes to `src/pages/RemediationAIPatch.tsx`:**
- Add Asset dropdown (populated from demoData assets), Finding dropdown (filters by selected asset's remediation items), Server Type dropdown (auto-selects from asset's software).
- Filter patch cards to show only relevant patches for selected asset's findings.
- Add "Q-Score Impact" badge on each patch card.
- Add "Testing Command" section in expanded patches.
- Add "NIST Reference" line per patch.
- Special state for pqc-api.pnb.co.in: emerald checkmark, "already quantum safe" message, download button.
- Cumulative impact summary at bottom.

---

## 7. CBOM — Add Attestation UI

**Changes to `src/pages/CBOMPerAsset.tsx`:**
- Add "Cryptographic Attestation" section at bottom of each expanded card: CBOM Hash (fake SHA-256), "Signed with Ed25519" badge, timestamp, "Verify Attestation" button opening a dialog/modal with full attestation block and "SIGNATURE VALID" banner.

**Changes to `src/pages/CBOMExport.tsx`:**
- Add new export card: "CDXA Attestation Document" with description and "Generate CDXA" button.

---

## 8. Remediation Action Plan — Add Columns

**Changes to `src/pages/RemediationActionPlan.tsx`:**
- Add "Deadline" column: calculate dates based on priority (P1=+30d, P2=+90d, P3=+180d, P4=+365d from today). Show relative chips with color coding.
- Add "Assignee" column: editable dropdown (IT Security / DevOps / Infrastructure / Compliance). Pre-assigned based on priority. State managed with useState.

---

## 9. Remediation Roadmap — Effort/Impact Matrix

**Changes to `src/pages/RemediationRoadmap.tsx`:**
- Add "Quick Wins Matrix" section below phase cards: 2x2 grid with colored quadrants and chip items placed in correct quadrants.
- Add "Resource Estimator" card: team size input, hours/week select, calculated completion date using the formula `baseMonths = 18, adjusted = 18 × (40 / (teamSize × hours))`.

---

## 10. Per-Asset Ratings — Trend Column

**Changes to `src/pages/CyberRatingPerAsset.tsx`:**
- Add "7d Trend" column after Q-Score. Show directional arrows and delta values with colors per spec. Hardcode specific values for named assets, generate plausible values for others.

---

## 11. HNDL Page — Exposure Heatmap

**Changes to `src/pages/PQCHndl.tsx`:**
- Add "HNDL Exposure by Sensitivity x Vulnerability" section below the area chart. 4x4 grid with cell counts and color intensity. Tooltip on hover showing asset count and recommendation text.

---

## 12. NIST Reference Panel — Global

**New files:**
- `src/components/dashboard/NistReferencePanel.tsx` — Sheet component with reference table (11 rows: FIPS 203/204/205 algorithms + legacy). Recommendation note at bottom.

**Changes to `src/components/dashboard/DashboardTopBar.tsx`:**
- Add `?` (HelpCircle) icon button next to notification bell. Clicking opens the NistReferencePanel sheet.

---

## Technical Details

- **Routing:** 3 new routes added to App.tsx: `/login`, `/dashboard/history`, `/dashboard/assets/:id`
- **Data:** All new demo data added to `demoData.ts` (scan history, asset detail enrichments, CVE data, DNS records)
- **Charts:** All charts use recharts (already installed): LineChart, BarChart, RadarChart, AreaChart
- **Modals/Sheets:** Use existing shadcn Sheet component for slide-overs
- **State:** Login uses localStorage. Assignee dropdowns use local component state. No backend.
- **New files count:** ~6 new page/component files
- **Modified files:** ~12 existing files touched

## Execution Order

1. Extend `demoData.ts` with all new data structures
2. Create Login page + auth routing
3. Create Scan History page + sidebar entry
4. Create Asset Detail page + link existing tables
5. Add Dashboard Home panels (KPI, charts, activity feed)
6. Add Discovery detail modals
7. Rework AI Patch Generator
8. Add CBOM attestation UI
9. Add Remediation Action Plan columns
10. Add Remediation Roadmap matrix
11. Add Per-Asset Ratings trend column
12. Add HNDL heatmap
13. Add NIST Reference panel
