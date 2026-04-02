

# AEGIS Gap Resolution Build Plan

This is a large build with 12 distinct features. All additions are additive — no existing pages are redesigned. All new data extends `src/data/demoData.ts`.

---

## 1. Login Page (`/login`)

**New file:** `src/pages/Login.tsx` — Full-screen split layout. Left half: dark animated background with floating cryptographic text fragments (hex values, cipher names like "ML-KEM-768", "RSA-2048" drifting upward via CSS keyframes). Right half: dark card with AEGIS wordmark + shield badge, tagline, institution strip (PNB / IIT Kanpur / DFS), email + password fields, remember-me toggle, deep red sign-in button with gold text, forgot password link, demo credentials box, bottom compliance strip.

**Routing changes in `App.tsx`:** Add `/login` route. Root `/` redirects to `/dashboard` if authenticated (localStorage flag) or `/login` if not. Fake auth: email contains "aegis" or "pnb" + password "aegis2026" sets flag and navigates to `/dashboard`.

---

## 2. Scan History Page (`/dashboard/history`)

**New file:** `src/pages/ScanHistory.tsx` — "Run New Scan" button, table with 7 hardcoded scan entries (SCN-001 to SCN-007 with exact values from spec), status pills, eye/compare action icons. Score Trend line chart (recharts) with threshold lines at 400 and 700. "Compare Two Scans" panel with dropdowns and side-by-side diff.

**Changes:** Add `scanHistory` data to `demoData.ts`. Add route in `App.tsx`. Add "Scan History" to sidebar and layout nav mapping.

---

## 3. Asset Detail Full Page (`/dashboard/assets/:id`)

**New file:** `src/pages/AssetDetail.tsx` — Breadcrumb header, Q-Score circular gauge, PQC tier badge, "Scan Now" button. Six stacked card sections: Identity, TLS Profile (protocol matrix + cipher badges), Certificate Chain (vertical visual chain with quantum vulnerability labels), PQC Assessment (gauge + radar chart + HNDL callout), Score History (line chart with event markers), Remediation (filtered action list + "Generate Patch" button).

**Changes:** Add extended asset detail data to `demoData.ts`. Add route `assets/:id` in `App.tsx`. Make asset name cells clickable in `AssetInventory.tsx` and `AssetDiscovery.tsx`.

---

## 4. Dashboard Home — Add Missing Panels

**New components:**
- `CertExpiryTimeline.tsx` — Horizontal bar chart (0-30d / 30-60d / 60-90d / >90d), clickable rows
- `AssetRiskDistribution.tsx` — Vertical bar chart (Critical/High/Medium/Low)
- `CryptoSecurityOverview.tsx` — Compact table (5 rows, weak cipher highlighting, PQC row borders)
- `RecentActivityFeed.tsx` — Scrollable list, 6 entries with icons and relative timestamps, clickable

**Changes:** Add 2 more KPI cards to `KPIStrip.tsx` ("Expiring Certs <=30d" and "High Risk Assets"). Import and render all new panels in `DashboardHome.tsx`.

---

## 5. Discovery Tab Detail Modals

**New file:** `src/components/dashboard/DiscoveryDetailPanel.tsx` — Sheet slide-over with different content per tab type: Domains (WHOIS, DNS records, risk assessment, action buttons), SSL (cert details, chain, quantum assessment), IP (network info, open ports with risk badges), Software (info, CVEs, PQC migration path).

**Changes:** Add `dnsRecords` and `cveData` to `demoData.ts`. Add onClick handlers to all discovery table rows.

---

## 6. AI Patch Generator — Make Asset-Aware

**Changes to `RemediationAIPatch.tsx`:** Add Asset/Finding/Server Type dropdowns at top. Filter patches by selected asset. Add Q-Score Impact badge, Testing Command, and NIST Reference to each patch card. Special "already quantum safe" state for pqc-api. Cumulative impact summary at bottom.

---

## 7. CBOM — Add Attestation UI

**Changes to `CBOMPerAsset.tsx`:** Add attestation section in each expanded card (SHA-256 hash, Ed25519 badge, timestamp, "Verify Attestation" button opening a modal with full attestation block and "SIGNATURE VALID" banner).

**Changes to `CBOMExport.tsx`:** Add "CDXA Attestation Document" export card.

---

## 8. Remediation Action Plan — Add Columns

**Changes to `RemediationActionPlan.tsx`:** Add "Deadline" column (date chips based on priority: P1=30d, P2=90d, P3=180d, P4=365d, colored by urgency). Add "Assignee" column with functional dropdown (IT Security / DevOps / Infrastructure / Compliance), pre-assigned by priority.

---

## 9. Remediation Roadmap — Effort/Impact Matrix

**Changes to `RemediationRoadmap.tsx`:** Add 2x2 "Quick Wins Matrix" with colored quadrants and item chips. Add "Resource Estimator" card with team size input, hours/week select, and reactive completion date calculation.

---

## 10. Per-Asset Ratings — Trend Column

**Changes to `CyberRatingPerAsset.tsx`:** Add "7d Trend" column with directional arrows and delta values (specific values for named assets, plausible values for others).

---

## 11. HNDL Page — Exposure Heatmap

**Changes to `PQCHndl.tsx`:** Add 4x4 "HNDL Exposure by Sensitivity x Vulnerability" heatmap grid with cell counts, color intensity, and hover tooltips.

---

## 12. NIST Reference Panel — Global

**New file:** `src/components/dashboard/NistReferencePanel.tsx` — Sheet with reference table (FIPS 203/204/205 algorithms + legacy entries) and recommendation note.

**Changes to `DashboardTopBar.tsx`:** Add HelpCircle icon button that opens the NIST reference sheet.

---

## Technical Summary

- **New files:** ~8 (Login, ScanHistory, AssetDetail, 4 dashboard panel components, NistReferencePanel, DiscoveryDetailPanel)
- **Modified files:** ~14 (App.tsx, demoData.ts, DashboardHome, KPIStrip, DashboardLayout, DashboardSidebar, DashboardTopBar, AssetDiscovery, AssetInventory, RemediationAIPatch, RemediationActionPlan, RemediationRoadmap, CyberRatingPerAsset, PQCHndl, CBOMPerAsset, CBOMExport)
- **Charts:** All use recharts (already installed)
- **Modals:** Use existing shadcn Sheet/Dialog components
- **No backend:** Login uses localStorage, all data from demoData.ts

