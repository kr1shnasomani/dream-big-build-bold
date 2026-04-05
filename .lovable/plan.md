

# 5 Fixes Implementation Plan

## FIX 1 — Wire DiscoveryDetailPanel into AssetDiscovery

**File:** `src/pages/AssetDiscovery.tsx`

- Import `DiscoveryDetailPanel` from `@/components/dashboard/DiscoveryDetailPanel`
- Import types `DomainRecord, IPRecord, SoftwareRecord, Asset` from `@/data/demoData` (Asset already available via selectedAssets; DomainRecord/IPRecord/SoftwareRecord need importing)
- Add state: `panelOpen`, `panelType`, `selectedDomain`, `selectedAssetForPanel`, `selectedIP`, `selectedSoftware`
- Add `onClick` + `cursor-pointer` to each `<tr>` in domains (line 85), SSL (line 138), IP (line 186), software (line 220) tabs
- Render `<DiscoveryDetailPanel ... />` before closing `</div>` at line 283

## FIX 2 — Fix scanAssetMap in demoData.ts

**File:** `src/data/demoData.ts` (lines 547-555)

Replace with corrected values:
- SCN-007: all 21 (unchanged)
- SCN-006: all 21 (add a4)
- SCN-005: 9 assets (unchanged)
- SCN-004: all 21
- SCN-003: `['a1','a5','a6']`
- SCN-002: 18 assets (all except a4, a20, a21)
- SCN-001: 17 assets (all except a4, a19, a20, a21)

## FIX 3 — DataContextBadge on CyberRatingPerAsset

**File:** `src/pages/CyberRatingPerAsset.tsx`

- Import `DataContextBadge` and `useSelectedScan`
- Add `const { selectedAssets } = useSelectedScan()`
- Replace `assets.map(...)` in table body with `selectedAssets.map(...)`
- Add `<DataContextBadge />` before the `<h1>` title

## FIX 4 — Discovery scope toggle

**File:** `src/pages/AssetDiscovery.tsx`

- Add `scopeMode` state (`'this-scan' | 'all-time'`, default `'this-scan'`)
- Import `assets` from demoData (for all-time mode)
- Add segmented control between `<DataContextBadge />` and tab strip: two buttons "📡 This Scan" / "🕐 All Time"
- Derive `displayAssets = scopeMode === 'this-scan' ? selectedAssets : assets`
- Replace `selectedAssets` usage in SSL tab with `displayAssets`
- Domain/IP/Software tabs use their own record arrays (always all-time) — add comments noting this
- Show scoping label below tab strip when `scopeMode === 'this-scan'`

## FIX 5 — Wire "View all notifications"

**File:** `src/components/ui/notification-inbox-popover.tsx`

- Import `useNavigate` from `react-router-dom`
- Add `const navigate = useNavigate()` inside component
- Add `onClick={() => navigate('/dashboard/history')}` to the "View all notifications" button (line 112)

---

## Files Modified

| File | Fix |
|------|-----|
| `src/pages/AssetDiscovery.tsx` | FIX 1, FIX 4 |
| `src/data/demoData.ts` | FIX 2 |
| `src/pages/CyberRatingPerAsset.tsx` | FIX 3 |
| `src/components/ui/notification-inbox-popover.tsx` | FIX 5 |

No new files. No visual changes.

