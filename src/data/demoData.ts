export interface Asset {
  domain: string;
  port: number;
  type: 'vpn' | 'web' | 'api' | 'mail' | 'iot';
  tls: string;
  cipher: string;
  keyExchange: string;
  certificate: string;
  qScore: number;
  status: 'critical' | 'vulnerable' | 'standard' | 'safe' | 'elite-pqc' | 'unknown';
  ip: string;
  hndlYears: number | null;
}

export const assets: Asset[] = [
  { domain: 'vpn.pnb.co.in', port: 443, type: 'vpn', tls: 'TLS 1.2', cipher: 'TLS_RSA_WITH_AES_128_CBC_SHA', keyExchange: 'RSA', certificate: 'RSA-2048', qScore: 24, status: 'critical', ip: '14.140.82.10', hndlYears: 5 },
  { domain: 'reporting.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_RSA_WITH_AES_128_CBC_SHA', keyExchange: 'RSA', certificate: 'RSA-2048', qScore: 24, status: 'critical', ip: '14.140.82.11', hndlYears: 5 },
  { domain: 'legacy.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_RSA_WITH_AES_128_CBC_SHA', keyExchange: 'RSA', certificate: 'RSA-2048', qScore: 24, status: 'critical', ip: '14.140.82.12', hndlYears: 5 },
  { domain: 'staging.pnb.co.in', port: 443, type: 'web', tls: '--', cipher: '--', keyExchange: '--', certificate: '--', qScore: 0, status: 'unknown', ip: '14.140.82.13', hndlYears: null },
  { domain: 'swift.pnb.co.in', port: 443, type: 'api', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.20', hndlYears: 8 },
  { domain: 'imps.pnb.co.in', port: 443, type: 'api', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.21', hndlYears: 8 },
  { domain: 'neft.pnb.co.in', port: 443, type: 'api', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.22', hndlYears: 8 },
  { domain: 'fx.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.23', hndlYears: 8 },
  { domain: 'trade.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.24', hndlYears: 8 },
  { domain: 'netbanking.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.25', hndlYears: 8 },
  { domain: 'mobileapi.pnb.co.in', port: 443, type: 'api', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.26', hndlYears: 8 },
  { domain: 'upi.pnb.co.in', port: 443, type: 'api', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.27', hndlYears: 8 },
  { domain: 'treasury.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.28', hndlYears: 8 },
  { domain: 'cards.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.29', hndlYears: 8 },
  { domain: 'loans.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.30', hndlYears: 8 },
  { domain: 'hr.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.31', hndlYears: 8 },
  { domain: 'mail.pnb.co.in', port: 443, type: 'mail', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.32', hndlYears: 8 },
  { domain: 'cdn.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.2', cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM', keyExchange: 'ECDHE', certificate: 'RSA-2048', qScore: 71, status: 'standard', ip: '14.140.82.33', hndlYears: 8 },
  { domain: 'auth.pnb.co.in', port: 443, type: 'web', tls: 'TLS 1.3', cipher: 'TLS_AES_256_GCM_SHA384', keyExchange: 'X25519', certificate: 'ECDSA-P256', qScore: 100, status: 'safe', ip: '14.140.82.40', hndlYears: 15 },
  { domain: 'pqc-api.pnb.co.in', port: 443, type: 'api', tls: 'TLS 1.3+', cipher: 'TLS_AES_256_GCM_SHA384+MLKEM', keyExchange: 'ML-KEM-768', certificate: 'ML-DSA-65', qScore: 100, status: 'elite-pqc', ip: '14.140.82.50', hndlYears: null },
  { domain: 'pqc-gateway.pnb.co.in', port: 443, type: 'api', tls: 'TLS 1.3+', cipher: 'TLS_AES_256_GCM_SHA384+MLKEM', keyExchange: 'ML-KEM-768', certificate: 'ML-DSA-65', qScore: 100, status: 'elite-pqc', ip: '14.140.82.51', hndlYears: null },
];

export const enterpriseScore = 370;
export const maxScore = 1000;
export const avgQScore = 37;

export const statusCounts = {
  total: assets.length,
  critical: assets.filter(a => a.status === 'critical').length,
  vulnerable: assets.filter(a => a.status === 'standard').length,  // "standard" mapped as vulnerable in context
  safe: assets.filter(a => a.status === 'safe').length,
  elitePqc: assets.filter(a => a.status === 'elite-pqc').length,
  unknown: assets.filter(a => a.status === 'unknown').length,
  pqcTransition: 4,
  quantumVulnerable: 11,
  fullySafe: 2,
  criticallVulnerable: 3,
};

export function getStatusColor(status: string): string {
  switch (status) {
    case 'critical': return 'hsl(var(--status-critical))';
    case 'vulnerable': return 'hsl(var(--status-vuln))';
    case 'standard': return 'hsl(var(--status-warn))';
    case 'safe': return 'hsl(var(--status-safe))';
    case 'elite-pqc': return 'hsl(var(--status-safe))';
    case 'unknown': return 'hsl(var(--status-unknown))';
    default: return 'hsl(var(--status-unknown))';
  }
}

export function getQScoreColor(score: number): string {
  if (score <= 40) return 'hsl(var(--status-critical))';
  if (score <= 70) return 'hsl(var(--accent-amber))';
  if (score <= 89) return 'hsl(210, 70%, 50%)';
  return 'hsl(var(--status-safe))';
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'critical': return 'CRITICAL';
    case 'vulnerable': return 'VULNERABLE';
    case 'standard': return 'STANDARD';
    case 'safe': return 'QUANTUM SAFE';
    case 'elite-pqc': return 'ELITE-PQC';
    case 'unknown': return 'UNKNOWN';
    default: return 'UNKNOWN';
  }
}

export function getTierLabel(score: number): string {
  if (score < 400) return 'Legacy';
  if (score <= 700) return 'Standard';
  return 'Elite-PQC';
}
