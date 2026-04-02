# AEGIS Frontend - Current Project Inventory

This README documents the frontend exactly as it exists right now in this repository.

It focuses on:

- the latest route structure
- what pages and subpages exist
- what information each screen shows
- the format that information is shown in
- representative examples from the current demo data

This is a current-state reference, not a future roadmap.

## 1. What This Project Is Right Now

AEGIS is currently a React + TypeScript frontend for a quantum-readiness / cryptographic-posture product aimed at banking infrastructure.

The current app includes:

- a login page
- protected dashboard routing
- a landing page
- discovery, inventory, CBOM, PQC, cyber rating, remediation, reporting, scan console, scan history, and settings sections
- a large amount of hardcoded demo data in `src/data/demoData.ts`

Important current implementation notes:

- authentication is demo auth backed by `localStorage`
- most business data is still demo data
- many actions are UI-only
- some flows are simulated rather than connected to real backend services

## 2. Current Stack

- Vite
- React 18
- TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui + Radix UI
- Framer Motion
- Recharts

## 3. Authentication And Routing Behavior

### Auth behavior

- Demo login state is stored in `localStorage` under `aegis-auth`
- Protected routes are wrapped in `ProtectedRoute`
- If `aegis-auth !== 'true'`, the app redirects to `/login`

### Demo credentials

- Username/email example: `demo@aegis.bank`
- Password: `aegis2026`

Login validation logic currently accepts:

- an email/username containing `aegis` or `pnb`
- password exactly equal to `aegis2026`

### Root routing behavior

- `/` redirects to `/dashboard` when authenticated
- `/` redirects to `/login` when not authenticated
- `/landing` is the public marketing/landing page

## 4. Current Route Map

### Top-level routes

```text
/
/login
/landing
/dashboard
/*
```

### Dashboard routes

```text
/dashboard
/dashboard/discovery
/dashboard/inventory
/dashboard/assets/:id
/dashboard/cbom
/dashboard/cbom/per-asset
/dashboard/cbom/export
/dashboard/pqc/compliance
/dashboard/pqc/hndl
/dashboard/pqc/quantum-debt
/dashboard/rating/enterprise
/dashboard/rating/per-asset
/dashboard/rating/tiers
/dashboard/remediation/action-plan
/dashboard/remediation/ai-patch
/dashboard/remediation/roadmap
/dashboard/reporting/executive
/dashboard/reporting/scheduled
/dashboard/reporting/on-demand
/dashboard/scan-console
/dashboard/history
/dashboard/settings
/dashboard/settings/scan-config
/dashboard/settings/notifications
/dashboard/settings/integrations
```

### Discovery subtabs

These are implemented via query params inside `/dashboard/discovery`:

```text
/dashboard/discovery?tab=domains
/dashboard/discovery?tab=ssl
/dashboard/discovery?tab=ip
/dashboard/discovery?tab=software
/dashboard/discovery?tab=network
/dashboard/discovery?tab=shadow
```

## 5. Shared App Behavior

### Scan flow

The dashboard home starts in a pre-scan state with:

- a large scan prompt
- example domain chips
- a "Run Demo Scan" action

Current behavior:

- entering a domain sets the scanned domain in `ScanContext`
- it does not trigger a real backend scan
- the UI switches into its post-scan/dashboard state

Examples:

- `vpn.pnb.co.in`
- `netbanking.pnb.co.in`
- `auth.pnb.co.in`
- demo scan target: `pnb.co.in`

### Scan context

`src/contexts/ScanContext.tsx` stores:

- `scannedDomain`
- `rootDomain`
- `orgLabel`

Examples:

- `vpn.pnb.co.in` -> root domain `pnb.co.in`
- `pnb.co.in` -> org label `PNB`

### Dashboard shell

The protected dashboard includes:

- left sidebar navigation with submenu flyouts
- pin-to-dock support
- bottom glass dock with pinned pages and compact scan box
- command palette via `Ctrl+K` / `Cmd+K`
- top-right export menu
- top-right NIST reference panel
- top-right notification popover

### Current navigation groups

- Dashboard
- Asset Discovery
- Asset Inventory
- CBOM
- PQC Posture
- Cyber Rating
- Remediation Center
- Reporting
- Scan Console
- Scan History
- Settings

### Export dropdown options

- Export PDF
- Export CBOM
- Export CDXA

### NIST reference panel content

The help panel currently shows a reference table for:

- FIPS 203
- FIPS 204
- FIPS 205
- legacy algorithms like RSA-2048 and ECDH/ECDSA

It includes columns for:

- Standard
- Algorithm
- Security Level
- Replaces
- Quantum Safe

Example recommendation shown:

- `ML-KEM-768 (key exchange) + ML-DSA-65 (signatures)`

### Demo notifications currently shown

- `AEGIS Scanner completed scan for vpn.pnb.co.in`
- `System generated CBOM Report v2.1`
- `PQC Engine flagged vulnerability in TLS 1.2 RSA-2048`
- `AEGIS Scanner queued scan for netbanking.pnb.co.in`
- `System updated NIST compliance matrix`
- `System alert: Certificate expiry in 30 days`

## 6. Current Demo Data Snapshot

The UI is primarily powered by `src/data/demoData.ts`.

### Main demo datasets

- `assets`
- `domainRecords`
- `ipRecords`
- `softwareRecords`
- `shadowITAlerts`
- `scanHistory`
- aggregate enterprise metrics

### Core counts used across the app

- total assets: `21`
- enterprise score: `370 / 1000`
- fully quantum safe assets: `2`
- critical assets: `3`
- unknown assets: `1`

### Representative asset examples

- `vpn.pnb.co.in`
  - TLS `1.2`
  - key exchange `RSA`
  - certificate `RSA-2048`
  - Q-Score `24`
  - status `critical`
  - HNDL break year `2031`

- `auth.pnb.co.in`
  - TLS `1.3`
  - key exchange `X25519`
  - certificate `ECDSA-P256`
  - Q-Score `82`
  - status `safe`

- `pqc-api.pnb.co.in`
  - TLS `1.3+`
  - key exchange `ML-KEM-768`
  - certificate `ML-DSA-65`
  - Q-Score `100`
  - status `elite-pqc`

### Representative scan history entries

- `SCN-007`
  - target `pnb.co.in`
  - started `Apr 1 2026, 09:14`
  - duration `4m 22s`
  - assets found `21`
  - Q-Score `370`
  - critical findings `3`

- `SCN-001`
  - target `pnb.co.in`
  - started `Feb 14 2026, 09:00`
  - duration `4m 10s`
  - assets found `17`
  - Q-Score `210`
  - critical findings `7`

## 7. Page And Subpage Inventory

### `/login` - Login

Purpose:

- Demo sign-in screen for the dashboard

What is displayed:

- animated floating crypto fragments on the left panel
- product branding and PQC messaging
- email / username input
- password input with show/hide toggle
- remember-me switch
- forgot-password button
- sign-in button
- demo credentials panel
- institution strip and hackathon footer text

Format:

- split-screen auth layout
- animated decorative background
- form
- helper credential card

Examples:

- left-panel crypto fragments include:
  - `ML-KEM-768`
  - `RSA-2048`
  - `TLS 1.3`
  - `FIPS 203`
- demo credentials shown:
  - `demo@aegis.bank / aegis2026`

### `/landing` - Landing Page

Purpose:

- public marketing / storytelling page for AEGIS

Sections rendered:

- Navbar
- Hero
- Trust strip
- Problem section
- Pipeline section
- Capabilities grid
- Dashboard preview
- NIST standards
- Final CTA
- Footer

What is displayed:

- marketing headline and pitch
- threat framing around HNDL
- 5-phase pipeline narrative
- feature cards
- mini dashboard preview
- final NIST standards summary

Format:

- marketing sections
- stat blocks
- feature cards
- process timeline
- preview mockup

Examples:

- hero headline:
  - `Scan.`
  - `Classify.`
  - `Go Quantum-Safe.`
- bottom hero stats:
  - `21+ Assets Scanned`
  - `5-Phase CBOM Pipeline`
  - `NIST FIPS 203/204/205`

### `/` - Root Redirect

Purpose:

- redirector route

Current behavior:

- authenticated users go to `/dashboard`
- unauthenticated users go to `/login`

### `/dashboard` - Dashboard Home

Purpose:

- primary application home

Pre-scan state:

- large scan prompt
- example domains
- animated raining-letter background

Post-scan state currently shows:

- KPI Strip
- Asset Discovery Network Graph
- Cyber Rating widget
- Asset Inventory table
- Q-Score Overview
- Enterprise Intelligence Dashboard
- Certificate Expiry Timeline
- Asset Risk Distribution
- Crypto & Security Overview
- Recent Activity

Format:

- KPI cards
- charts
- graph visualization
- interactive table
- activity feed

Examples:

- KPI strip values:
  - Total Assets `21`
  - Fully Quantum Safe `2`
  - PQC Transition `4`
  - Quantum Vulnerable `11`
  - Critically Vulnerable `3`
  - Unknown `1`

- recent activity examples:
  - `Scan completed: 21 assets scanned for pnb.co.in`
  - `Shadow IT asset discovered: dev-api.pnb.co.in`
  - `CBOM generated: aegis-cbom-20260401.json`

#### Dashboard Home widget details

##### KPI Strip

Shows six KPI cards:

- Total Assets
- Fully Quantum Safe
- PQC Transition
- Quantum Vulnerable
- Critically Vulnerable
- Unknown

##### Network Graph

Shows:

- nodes for main domain and sub-assets
- filters:
  - All
  - Elite-PQC
  - Standard
  - Vulnerable

Example nodes:

- `pnb.co.in`
- `vpn`
- `netbanking`
- `auth`
- `pqc-api`

##### Cyber Rating widget

Shows:

- circular score gauge
- tier label
- top asset scores
- tier reference legend

Examples:

- enterprise score `370 / 1000`
- tier `Legacy`
- top asset examples:
  - `auth.pnb.co.in`
  - `pqc-api.pnb.co.in`
  - `vpn.pnb.co.in`

##### Asset Inventory widget

Shows a compact table with columns:

- Asset
- Type
- TLS
- Cipher Suite
- Key Exchange
- Certificate
- Q-Score
- Status

Interaction:

- clicking a row opens the side `AssetDetailPanel`

##### Q-Score Overview

Shows:

- circular average Q-score gauge
- status breakdown bars

Breakdown labels:

- Quantum Safe
- PQC Transition
- Vulnerable
- Critical
- Unknown

##### Enterprise Intelligence Dashboard

Shows two grouped stat lists:

- Home Summary
- Cyber Rating & PQC Intelligence

Examples:

- Home Summary:
  - Domains `8`
  - IPs `21`
  - SSL Certs `18`
- Cyber Rating & PQC Intelligence:
  - Enterprise Score `370 / 1000`
  - Tier `Legacy`
  - PQC Heatmap `14% coverage`

##### Certificate Expiry Timeline

Shows a horizontal bar chart of certificate counts by expiry range:

- `0-30 days`
- `30-60 days`
- `60-90 days`
- `>90 days`

Current values:

- `3`
- `4`
- `2`
- `12`

##### Asset Risk Distribution

Shows a bar chart of asset counts by risk level:

- Critical `3`
- High `5`
- Medium `8`
- Low `5`

##### Crypto & Security Overview

Shows a compact table with columns:

- Asset
- Key
- Cipher Suite
- TLS
- CA

It visually distinguishes:

- weak rows using critical styling
- PQC rows using a safe left border

##### Recent Activity

Shows clickable activity items with timestamps.

Examples:

- `Weak cipher detected: vpn.pnb.co.in (TLS_RSA_WITH_AES_128_CBC_SHA)`
- `Certificate expiring in 1 day: vpn.pnb.co.in`
- `PQC label issued: pqc-api.pnb.co.in - Fully Quantum Safe`

### `/dashboard/discovery` - Asset Discovery

Purpose:

- discovery and attack-surface exploration

Subpages/tabs:

- Domains
- SSL Certificates
- IP / Subnets
- Software & Services
- Network Graph
- Shadow IT

Common controls:

- search input
- filter button
- horizontal tab strip

#### `Domains`

Table columns:

- Detection
- Domain
- Registered
- Expiry
- Registrar
- Status
- Risk

Additional smart insight cards:

- `3 newly discovered domains`
- `2 domains expiring soon`
- `9 domains confirmed safe`

Examples:

- `dev-api.pnb.co.in`
- `staging.pnb.co.in`
- `test-portal.pnb.co.in`

#### `SSL Certificates`

Table columns:

- CN
- SANs
- CA
- Algo
- Key
- Valid Until
- Days Left

Examples:

- `auth.pnb.co.in`
- CA `DigiCert`
- key `ECDSA-256`

#### `IP / Subnets`

Shows two alert cards plus a table.

Alert examples:

- `Port 3389 open on staging...`
- `Port 22 open on vpn...`

Table columns:

- IP
- Ports
- Subnet
- ASN
- Location
- rDNS
- Risk

Examples:

- `14.140.82.13`
- ports `443, 80, 22, 3389`
- risk `critical`

#### `Software & Services`

Table columns:

- Product
- Version
- Type
- Host
- EOL Status
- CVEs
- PQC

Examples:

- `OpenSSL 1.1.1w`
- `OQS-OpenSSL 3.2.0-oqs`
- `Cisco ASA 9.16.3`

#### `Network Graph`

Shows the same graph-style visual used on the dashboard home.

#### `Shadow IT`

Shows:

- summary warning banner
- shadow asset table

Table columns:

- Discovered
- Asset
- Type
- Detection
- Risk
- Actions

Examples:

- `dev-api.pnb.co.in`
- `test-portal.pnb.co.in`
- `14.140.82.99`

### `/dashboard/inventory` - Asset Inventory

Purpose:

- complete asset listing

What is displayed:

- total assets count
- filter chips
- search box
- "Add Asset" side sheet
- full inventory table

Filter chips:

- All
- Web Apps
- APIs
- VPNs
- Mail

Table columns:

- Asset
- IP
- Type
- Owner
- Criticality
- TLS
- Cipher
- Key
- Status
- Q-Score
- Cert Expiry

Interactions:

- clicking the asset name navigates to `/dashboard/assets/:id`
- the Add Asset sheet contains a demo form

Examples:

- `pqc-api.pnb.co.in` -> Q-Score `100`, status `ELITE-PQC`
- `vpn.pnb.co.in` -> Q-Score `24`, status `CRITICAL`

Add Asset form fields:

- Asset Name
- URL / Domain
- Asset Type
- Owner Team
- Business Criticality

### `/dashboard/assets/:id` - Asset Detail

Purpose:

- full-page detailed asset profile

What is displayed:

- breadcrumb
- large Q-Score gauge
- badges for tier, status, and type
- Identity section
- TLS Profile section
- Certificate Chain section
- PQC Assessment section
- Score History section
- Remediation Actions section

#### Identity section

Fields shown:

- Asset Name
- URL
- IPv4
- IPv6
- Type
- Owner
- Criticality
- Tags
- First Seen
- Last Scanned

#### TLS Profile section

Shows:

- support cards for:
  - TLS 1.0
  - TLS 1.1
  - TLS 1.2
  - TLS 1.3
- cipher suite badge
- forward secrecy status
- HSTS status

#### Certificate Chain section

Shows chain nodes:

- Leaf
- Intermediate
- Root

Fields per node:

- CN
- Issuer
- Algorithm
- Key

Example vulnerability logic:

- RSA / ECDSA chains are marked quantum vulnerable unless the asset is PQC-safe

#### PQC Assessment section

Shows:

- radar chart across six dimensions
- HNDL risk card when applicable
- quantum-safe callout for PQC assets

Radar dimensions:

- TLS Version
- Key Exchange
- Cipher
- Certificate
- Fwd Secrecy
- PQC Ready

#### Score History section

Shows a per-asset line chart over time.

Example hardcoded histories:

- `vpn-pnb-co-in`
- `auth-pnb-co-in`
- `pqc-api-pnb-co-in`
- `netbanking-pnb-co-in`

Example events:

- `Cipher downgrade detected`
- `TLS 1.0 disabled on port 8443`
- `TLS 1.3 enabled`
- `ML-KEM-768 deployed`

#### Remediation section

Shows:

- one remediation row per action
- priority badge
- finding text
- action text
- status badge
- `Generate Patch` button

Examples:

- `TLS 1.0/1.1 enabled`
- `Disable legacy TLS versions`
- `Implement ML-KEM-768 hybrid`

### `/dashboard/cbom` - CBOM Overview

Purpose:

- summary of the cryptographic bill of materials

Subpages:

- Overview
- Per-Asset
- Export Center

What the overview page shows:

- KPI cards
- Key Length Distribution chart
- Encryption Protocols chart
- Top Certificate Authorities chart
- Cipher Usage chart
- Per-Application CBOM table

KPI card labels:

- Applications Covered
- Sites Surveyed
- Active Certificates
- Weak Crypto Instances
- Certificate Issues
- PQC-Ready (%)

Per-application table columns:

- Asset
- Key Length
- Cipher Suite
- TLS
- CA
- Q-Score
- Status

Examples:

- `vpn.pnb.co.in | RSA-2048 | TLS_RSA_WITH_AES_128_CBC_SHA | TLS 1.2`
- `pqc-api.pnb.co.in | ML-DSA-65 | TLS_AES_256_GCM_SHA384+MLKEM | TLS 1.3+`

### `/dashboard/cbom/per-asset` - Per-Asset CBOM

Purpose:

- expandable cryptographic breakdown for each asset

What is displayed:

- asset cards with:
  - domain
  - TLS badge
  - Q-score chip
- expandable technical breakdown

Expanded sections:

- TLS Certificate
- Key Exchange
- Cipher Suite
- TLS Protocol

Examples:

- `vpn.pnb.co.in` shows TLS 1.0 / 1.1 warnings
- `pqc-api.pnb.co.in` shows quantum-safe ML-KEM / ML-DSA details

### `/dashboard/cbom/export` - CBOM Export Center

Purpose:

- export options for CBOM outputs

Formats currently shown:

- CycloneDX 1.6 JSON
- CycloneDX XML
- CSV Export
- PDF Report
- HTML Report

Also shown:

- Scheduled Exports card

Example export labels:

- `Generate .json`
- `Generate .xml`
- `Generate .pdf`

### `/dashboard/pqc/compliance` - PQC Compliance Dashboard

Purpose:

- classification and compliance overview

Subpages:

- Compliance
- HNDL Intel
- Quantum Debt

What this page shows:

- top classification percentage cards
- Assets by Classification bar chart
- Application Status pie chart
- Risk Overview Heatmap
- Improvement Recommendations
- Tier Compliance Criteria table

Example recommendations:

- `Upgrade to TLS 1.3 with PQC extensions`
- `Implement ML-KEM-768 for Key Exchange`
- `Update Cryptographic Libraries to OQS-enabled versions`

### `/dashboard/pqc/hndl` - HNDL Intelligence

Purpose:

- Harvest Now, Decrypt Later risk analysis

What is displayed:

- HNDL explanation card
- HNDL timeline chart
- HNDL Risk by Asset table
- Qubit Roadmap Sources

Table columns:

- Asset
- Algorithm
- Key Size
- Break Year
- Sensitivity
- HNDL Risk
- Days Until Risk

Examples:

- `vpn.pnb.co.in` -> break year `2031`
- `netbanking.pnb.co.in` -> break year `2034`

### `/dashboard/pqc/quantum-debt` - Quantum Debt Tracker

Purpose:

- high-level debt score plus migration simulator

What is displayed:

- hero debt gauge
- Debt by Asset Type chart
- Migration Progress card
- Debt Reduction Simulator

Examples:

- debt score `742 / 1000`
- growth rate `~42 units/month`
- debt by type:
  - Web Apps `280 current / 340 projected`
  - APIs `220 current / 290 projected`
  - VPNs `180 current / 240 projected`

### `/dashboard/rating/enterprise` - Enterprise Cyber Rating

Purpose:

- enterprise-wide rating summary

Subpages:

- Enterprise Score
- Per-Asset
- Tier Classification

What is displayed:

- hero score gauge
- radar chart
- score history chart
- tier thresholds table
- benchmark comparison bars

Examples:

- enterprise score `370 / 1000`
- tier `Legacy`
- score history caption:
  - `Week 8: Removed TLS 1.0 from 3 assets (+45 points)`

### `/dashboard/rating/per-asset` - Per-Asset Ratings

Purpose:

- row-by-row dimensional scoring for each asset

What is displayed:

- Q-Score table
- dimension chips
- scoring formula tooltip

Table columns:

- Asset
- Q-Score
- TLS
- Cert
- Key Ex.
- Cipher
- PQC
- Tier
- Label

Examples:

- dimension chips show numeric scores like `20`, `65`, `100`
- tiers shown include:
  - `Critical`
  - `Standard`
  - `Elite-PQC`

### `/dashboard/rating/tiers` - Tier Classification

Purpose:

- explain each cyber-rating tier

What is displayed:

- expandable card per tier
- compliance criteria list
- required action callout
- sample config snippets for some tiers
- asset chips belonging to each tier

Tiers shown:

- Tier 1 - Elite-PQC
- Tier 2 - Standard
- Tier 3 - Legacy
- Critical

Example config values:

- `ssl_protocols TLSv1.3;`
- `ssl_ecdh_curve X25519MLKEM768;`

### `/dashboard/remediation/action-plan` - Remediation Action Plan

Purpose:

- flattened remediation backlog across all assets

Subpages:

- Action Plan
- AI Patch Generator
- Migration Roadmap

What is displayed:

- KPI cards
- overall remediation progress
- filter dropdown
- action table

Action table columns:

- Priority
- Asset
- Finding
- Action
- Effort
- Status

Examples:

- `TLS 1.0/1.1 enabled`
- `Disable legacy TLS versions`
- `Certificate expiring in 1 day`
- `Implement ML-KEM-768 hybrid`

### `/dashboard/remediation/ai-patch` - AI Patch Generator

Purpose:

- generated remediation config snippets

What is displayed:

- intro callout
- tabs for:
  - nginx
  - Apache
  - IIS
- code cards with copy buttons

Patch examples:

- Disable Legacy TLS
- Enable PQC Hybrid Key Exchange
- Certificate Upgrade to ECDSA
- IIS PowerShell hardening script

### `/dashboard/remediation/roadmap` - Migration Roadmap

Purpose:

- multi-phase PQC migration plan

What is displayed:

- overall migration progress
- timeline view
- phase cards

Phases:

- Discovery & Assessment
- Quick Wins - TLS Hardening
- PQC Hybrid Deployment
- Full PQC Migration
- Validation & Certification

Example values:

- current in-progress phase: `Quick Wins - TLS Hardening`
- progress `35%`
- target date `Sep 2027`

### `/dashboard/reporting/executive` - Executive Reports

Purpose:

- prebuilt report gallery

Subpages:

- Executive Reports
- Scheduled Reports
- On-Demand Builder

What is displayed:

- report template cards
- Recent Reports table

Templates shown:

- Executive Summary
- NIST Compliance Report
- Quantum Risk Assessment
- CBOM Inventory Report

Recent report examples:

- `Executive_Summary_Q1_2026.pdf`
- `CBOM_CycloneDX_20260331.json`
- `NIST_Compliance_Mar2026.pdf`

### `/dashboard/reporting/scheduled` - Scheduled Reports

Purpose:

- recurring report schedule management

What is displayed:

- New Schedule button
- KPI summary cards
- schedules table with enable switches

Table fields:

- Enabled
- Report Name
- Template
- Frequency
- Next Run
- Recipients

Examples:

- `Weekly Executive Summary`
- `Monthly NIST Compliance`
- `Bi-Weekly CBOM Export`
- recipients:
  - `ciso@target.com`
  - `audit@target.com`

### `/dashboard/reporting/on-demand` - On-Demand Report Builder

Purpose:

- wizard for custom report generation

What is displayed:

- stepper
- template selection
- section selection
- format selection
- generate/download state

Steps:

- Select Template
- Choose Scope
- Configure Options
- Generate

Templates:

- Custom Report
- Executive Summary
- Technical Deep-Dive
- Audit Trail

Sections:

- Q-Score Overview
- Tier Classification
- Asset Inventory
- CBOM Details
- HNDL Risk Analysis
- Quantum Debt Score
- Remediation Plan
- Migration Roadmap
- NIST Compliance Matrix
- Recommended Patches

Formats:

- PDF Report
- HTML Report
- CSV Data Export
- JSON (CycloneDX)

### `/dashboard/scan-console` - Scan Console

Purpose:

- simulated real-time scanner terminal

What is displayed:

- Start Scan / Reset controls
- five phase status cards
- progress bar
- animated terminal output

Five phases:

- Discovery
- TLS Probing
- PQC Classification
- CBOM Generation
- Certification

Example log lines:

- `Found: vpn.pnb.co.in`
- `Shadow IT: dev-api.pnb.co.in`
- `TLS 1.0, 1.1 enabled`
- `PQC hybrid key exchange detected`
- `CBOM generated: aegis-cbom-20260331.json`

Important note:

- this is a simulated scan experience, not a real scan execution pipeline

### `/dashboard/history` - Scan History

Purpose:

- dedicated history page for past scans

What is displayed:

- history table
- enterprise Q-Score trend chart
- compare-two-scans module

History table columns:

- Scan ID
- Target Domain
- Started
- Duration
- Assets
- Q-Score
- Critical
- Status
- Actions

Examples:

- `SCN-007 | pnb.co.in | Apr 1 2026, 09:14 | 4m 22s | 21 assets | 370 | 3 critical`
- `SCN-003 | vpn.pnb.co.in | Mar 3 2026, 10:00 | 0m 48s | 3 assets | 24 | 2 critical`

Compare module:

- lets you choose two scans
- shows each scan summary
- shows delta cards for:
  - Q-Score
  - Assets
  - Critical findings
- shows demo regression/resolution callouts

Example compare callouts:

- `TLS 1.0 re-enabled on staging.pnb.co.in (regression)`
- `Certificate renewed on auth.pnb.co.in`

### `/dashboard/settings` And Child Settings Pages

The settings section contains these subpages:

- Scan Config
- Notifications
- Integrations

### `/dashboard/settings/scan-config` - Scan Configuration

What is displayed:

- Scheduling section
- Scan Modules section
- Discovery Depth section
- Performance section

Controls shown:

- Automatic Scanning switch
- Scan Frequency select
- Connection Timeout select
- module toggles:
  - TLS/SSL Probing
  - PQC Readiness Check
  - CBOM Generation
  - Shadow IT Detection
- Subdomain Enumeration Depth slider
- Max Concurrent Connections select
- Rate Limit select

### `/dashboard/settings/notifications` - Notifications

What is displayed:

- notification channel cards
- alert type toggles

Channels:

- Email
- Slack
- Webhook

Alert types:

- Critical Vulnerabilities
- Scan Completion
- Certificate Expiry Warning
- Shadow IT Discovery
- Weekly Digest

Examples:

- email target `admin@target.com`
- Slack target `#aegis-alerts`
- webhook target `https://hooks.target.com/aegis`

### `/dashboard/settings/integrations` - Integrations

What is displayed:

- Active Integrations
- Available Integrations
- Coming Soon

Examples:

- Connected:
  - Jira
  - Slack
- Available:
  - ServiceNow
  - Splunk
  - Microsoft Sentinel
  - PagerDuty
- Coming Soon:
  - Tenable
  - CrowdStrike

### `/*` - Not Found

Purpose:

- fallback route for unmatched URLs

## 8. Additional Current UI Surfaces

### Asset detail side sheet on dashboard home

`src/components/dashboard/AssetDetailPanel.tsx` is still used by the dashboard home asset table.

It includes three tabs:

- Details
- Crypto
- Remediation

It shows:

- Q-Score mini gauge
- certificate details
- HNDL risk
- software details
- dimension scores
- remediation buttons

### Command palette

The command palette currently includes shortcuts for:

- Dashboard Home
- Asset Discovery
- Asset Inventory
- CBOM Overview
- CBOM Per-Asset
- CBOM Export
- PQC Compliance
- HNDL Intel
- Quantum Debt
- Enterprise Rating
- Per-Asset Rating
- Tier Classification
- Action Plan
- AI Patch Generator
- Migration Roadmap
- Executive Reports
- Scheduled Reports
- On-Demand Builder
- Scan Console
- Scan Configuration
- Notifications
- Integrations

Note:

- `Scan History` is present in the sidebar but not currently included in the command palette route list.

### Legacy non-routed page file

`src/pages/Dashboard.tsx` still exists in the repo, but it is not currently used by the active route tree in `src/App.tsx`.

## 9. What Is Real Vs Simulated

### Real in the frontend

- route structure
- protected-route behavior
- localStorage-based auth gate
- page layouts
- filtering/search UI
- chart rendering
- compare flows
- local component state interactions

### Still simulated / demo-backed

- most business data
- scans
- report generation
- exports
- schedule execution
- notifications delivery
- integrations
- remediation generation as a real backend service

## 10. Current Gaps / Not Yet Productionized

- real backend APIs
- server-side auth
- database persistence
- real scan execution engine integration
- job queueing
- tenant/user management
- live report generation pipeline
- live notification delivery
- live integrations
- true backend-backed export files

## 11. Bottom Line

This repository now contains a more complete frontend than the earlier demo-only version:

- it has a real login screen
- protected dashboard routing
- a dedicated asset detail page
- a dedicated scan history page

But it is still primarily a high-fidelity frontend backed by demo data and simulated flows.

The current UI coverage is strong and broad:

- auth
- landing
- dashboard
- discovery
- inventory
- asset detail
- CBOM
- PQC posture
- cyber rating
- remediation
- reporting
- scan console
- scan history
- settings
