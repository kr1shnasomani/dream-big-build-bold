

# AEGIS — 3 Fixes Implementation Plan

## FIX 1 — DataContextBadge on All Data Pages

Add `import DataContextBadge from '@/components/dashboard/DataContextBadge'` and `import { useSelectedScan } from '@/contexts/SelectedScanContext'` to 13 pages. Insert `<DataContextBadge />` as the first child inside the root wrapper div, before the page title.

For pages with per-asset tables, replace direct `assets` import usage with `const { selectedAssets } = useSelectedScan()` for table rendering:

**Pages getting badge + selectedAssets for tables:**
- `AssetDiscovery.tsx` — badge before `<h1>`, use `selectedAssets` for domain/SSL/IP/software table rows
- `AssetInventory.tsx` — badge before `<h1>`, use `selectedAssets` for filtered table + type counts
- `CBOMOverview.tsx` — badge before `<h1>`, keep `assets` for charts, use `selectedAssets` for KPI card counts
- `CBOMPerAsset.tsx` — badge before `<h1>`, use `selectedAssets` for accordion list
- `RemediationActionPlan.tsx` — badge before `<h1>`, use `selectedAssets` for action items filtering

**Pages getting badge only (charts/aggregate use full dataset):**
- `CBOMExport.tsx` — badge before `<h1>`
- `PQCCompliance.tsx` — badge before `<h1>`
- `PQCHndl.tsx` — badge before `<h1>`
- `PQCQuantumDebt.tsx` — badge before `<h1>`
- `CyberRatingEnterprise.tsx` — badge before `<h1>`
- `CyberRatingPerAsset.tsx` — badge before `<h1>`
- `RemediationAIPatch.tsx` — badge before `<h1>`
- `RemediationRoadmap.tsx` — badge before `<h1>`

---

## FIX 2 — Multi-Target Scan Input

Replace lines 111-131 in `DashboardLayout.tsx` (the prompt content inside `showPrompt` block). Keep the `RainingLetters`, headline, and `motion.div` wrapper. Replace the `ScanPromptBox` and chip buttons with:

- `targets` state (string), `scanProfile` state (default `'Standard'`), `fileMsg` state for upload feedback
- `<textarea>` with monospace font, 4 rows, placeholder for multi-domain input
- Row of 4 example chips (`pnb.co.in`, `vpn.pnb.co.in`, `netbanking.pnb.co.in`, `auth.pnb.co.in`) — click appends to textarea (skip duplicates)
- Hidden `<input type="file">` with styled label trigger for .txt/.csv upload — FileReader reads text, splits by newline, populates textarea, shows "Loaded N targets" for 3s
- 4-option scan profile segmented control (Quick/Standard/Deep/PQC Focus) with amber accent on active
- "Run Demo Scan" outline button → sets `pnb.co.in`, calls `startQueue(['pnb.co.in'], 'Standard')` + `handleScan('pnb.co.in')`
- "Start Scan Queue" primary button → parses textarea, deduplicates, calls `startQueue(parsed, scanProfile)` + `handleScan(parsed[0])`

No changes to `handleScan`, `handleDemoScan`, sidebar, topbar, or any other part of the layout.

---

## FIX 3 — Executive View Language Substitutions

**KPIStrip.tsx:** Add optional `execMode?: boolean` prop. When true, relabel KPI items:
- "Fully Quantum Safe" → "Protected Assets"
- "Critically Vulnerable" → "At Risk"
- "Unknown" → "Pending Assessment"
- "PQC Transition" → "Upgrading"
- "Quantum Vulnerable" → "Needs Upgrade"

**CyberRating.tsx:** Add optional `execMode?: boolean` prop. When true, substitute label strings in the tier reference and header:
- "Elite-PQC" → "Fully Quantum-Safe"
- "Cyber Rating" → "Security Rating"
- "Asset Scores" → "Asset Security Ratings"

**RecentActivityFeed.tsx:** Add optional `execMode?: boolean` prop. When true, apply string substitutions to entry text:
- "Fully Quantum Safe" → "Fully Quantum-Safe"
- "Weak cipher" → "Weak encryption method"
- "PQC label" → "Security certification"

**DashboardHome.tsx:** In the executive view block (lines 62-69), pass `execMode={true}` to `CyberRating` and `RecentActivityFeed`. Pass `execMode={activeRole === 'executive'}` to `KPIStrip` (line 35).

---

## Files Modified

| File | Fix |
|------|-----|
| 13 page files (AssetDiscovery, AssetInventory, CBOMOverview, CBOMPerAsset, CBOMExport, PQCCompliance, PQCHndl, PQCQuantumDebt, CyberRatingEnterprise, CyberRatingPerAsset, RemediationActionPlan, RemediationAIPatch, RemediationRoadmap) | FIX 1 |
| DashboardLayout.tsx | FIX 2 |
| KPIStrip.tsx, CyberRating.tsx, RecentActivityFeed.tsx, DashboardHome.tsx | FIX 3 |

No new files created. No visual or color changes. All changes backward compatible.

