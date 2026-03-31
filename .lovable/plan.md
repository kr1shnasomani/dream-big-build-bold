

# Implementation Plan — AEGIS Dashboard Pages (Phase 1)

## What the Spec Contains

The spec defines **9 major sections** with **25+ sub-pages**, all with detailed tables, charts, and interactions. Currently only the Dashboard home view exists. Every sidebar menu item and submenu needs a real page.

## Approach

Rather than building all 25+ pages at once, we'll implement in **3 phases** following the spec's priority order. This plan covers **Phase 1 (P0 pages)** — the most critical pages judges will evaluate.

---

## Phase 1 Scope (This Implementation)

### 1. Routing & Layout Architecture
- Convert from single `Dashboard.tsx` state-switching to proper routes: `/dashboard`, `/dashboard/discovery/domains`, `/dashboard/inventory`, `/dashboard/cbom`, `/dashboard/pqc/compliance`, etc.
- Create a shared `DashboardLayout.tsx` wrapper (sidebar + top-right actions + glass tab bar) used by all dashboard sub-routes
- Update `App.tsx` with nested routes under `/dashboard/*`
- Update sidebar `onItemClick` to use `react-router-dom` navigation instead of state

### 2. Expanded Demo Data (`demoData.ts`)
- Extend the `Asset` interface to match the spec's `AssetScanResult` (add certificate details, TLS versions array, cipher suites, HNDL break year, dimension scores, software detected, remediation actions)
- Add domain discovery data (registration dates, registrars, WHOIS)
- Add SSL certificate data (fingerprints, chain, CA, expiry)
- Add IP/subnet data (ports, ASN, geolocation)
- Add CBOM component data per asset

### 3. Asset Discovery Page (4 tabs + Network Graph + Shadow IT)

**Route:** `/dashboard/discovery`

- **Domains tab:** Table with Detection Date, Domain Name, Registration/Expiry dates, Registrar, Status, Risk Score. Sub-filters (New/Confirmed/All). Smart Insights panel on right.
- **SSL Certificates tab:** Table with fingerprint, CN, SANs, validity, days remaining (color-coded progress bar), signature algorithm (quantum-assessed), key length. Aggregate charts above (CA distribution donut, algo distribution bar).
- **IP / Subnets tab:** Table with IP, open ports, subnet, ASN, geolocation, reverse DNS, risk. Intelligence callouts.
- **Software & Services tab:** Table with product, version, type, EOL status, CVE count, PQC support indicator.
- **Network Graph tab:** Already exists — wire it into the tabbed view.
- **Shadow IT tab:** Table with discovery date, asset, type, detection method, risk, recommended actions. Action buttons per row.

### 4. Asset Inventory Page

**Route:** `/dashboard/inventory`

- Summary bar (total assets, breakdown by type, filter chips)
- Full inventory table with all columns from spec (asset name, URL, IPv4/6, type, owner, criticality, risk, PQC status, cert status, key length, cipher, TLS version)
- Bulk actions toolbar
- Add Asset side drawer (form with validation)

### 5. CBOM Pages (3 sub-pages)

**Route:** `/dashboard/cbom`, `/dashboard/cbom/per-asset`, `/dashboard/cbom/export`

- **Overview:** 6 KPI cards, Key Length Distribution bar chart, Cipher Usage horizontal bar, Top CAs bar chart, Encryption Protocols donut, Per-Application CBOM table
- **Per-Asset CBOM:** Expandable rows showing full CBOM tree structure (TLS cert → Key Exchange → Cipher Suite → TLS Protocol) with quantum vulnerability annotations
- **Export Center:** Export format cards (CycloneDX JSON/XML, CSV, PDF, HTML), filters, scheduled export config

### 6. PQC Posture Pages (3 sub-pages)

**Route:** `/dashboard/pqc/compliance`, `/dashboard/pqc/hndl`, `/dashboard/pqc/quantum-debt`

- **Compliance Dashboard:** Classification bar chart, Application Status pie, Risk Overview 3x3 heatmap, PQC Support table, Improvement Recommendations panel, Tier Criteria table
- **HNDL Intelligence:** Explanatory header with timeline visualization, HNDL Risk by Asset table (with break year, countdown), HNDL Timeline area chart, Qubit Roadmap panel, HNDL Exposure heatmap
- **Quantum Debt Tracker:** Hero metric (0-1000 gauge), Debt Breakdown stacked bar, Debt Reduction Simulator (slider + projection lines), Migration Progress tracker

### 7. Cyber Rating Pages (3 sub-pages)

**Route:** `/dashboard/rating/enterprise`, `/dashboard/rating/per-asset`, `/dashboard/rating/tiers`

- **Enterprise Score:** Hero score display (755/1000), Tier badge, Score Breakdown radar chart (6 dimensions), Score History line chart, Tier Thresholds table, Benchmark comparison gauges
- **Per-Asset Ratings:** Table with Q-Score, per-dimension scores, trend arrows, tier labels. Formula tooltip.
- **Tier Classification:** 4 collapsible tier cards (Elite-PQC, Standard, Legacy, Critical) with criteria, actions, example configs, and asset lists

### 8. Update Sidebar Navigation
- Add missing submenu items: Discovery gets Software & Services, Network Graph, Shadow IT. Cyber Rating gets Enterprise Score, Per-Asset, Tier Classification. Remediation gets Action Plan, AI Patch, Migration Roadmap. Reporting gets Executive, Scheduled, On-Demand.
- Settings gets Scan Config, Notifications, Integrations submenus.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/DashboardLayout.tsx` | Shared layout wrapper with sidebar, top actions, glass bar |
| `src/pages/AssetDiscovery.tsx` | 6-tab discovery page |
| `src/pages/AssetInventory.tsx` | Full inventory with table + add drawer |
| `src/pages/CBOMOverview.tsx` | CBOM overview with charts |
| `src/pages/CBOMPerAsset.tsx` | Per-asset expandable CBOM |
| `src/pages/CBOMExport.tsx` | Export center |
| `src/pages/PQCCompliance.tsx` | Compliance dashboard |
| `src/pages/PQCHndl.tsx` | HNDL intelligence |
| `src/pages/PQCQuantumDebt.tsx` | Quantum debt tracker |
| `src/pages/CyberRatingEnterprise.tsx` | Enterprise score page |
| `src/pages/CyberRatingPerAsset.tsx` | Per-asset ratings |
| `src/pages/CyberRatingTiers.tsx` | Tier classification |
| `src/data/demoData.ts` | Expanded with full asset scan result data |

## Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Add nested routes under `/dashboard/*` |
| `src/components/dashboard/DashboardSidebar.tsx` | Add missing submenus, use router navigation |
| `src/pages/Dashboard.tsx` | Refactor into layout + home view |

---

## Phase 2 (Next, not in this plan)
- Remediation Center (Action Plan, AI Patch Generator, Migration Roadmap)
- Reporting (Executive, Scheduled, On-Demand)
- Scan Console (real-time terminal)

## Phase 3 (Later)
- Settings pages
- Asset Detail slide-over panel
- Global search (Cmd+K)
- Certificate chain analyzer modals

