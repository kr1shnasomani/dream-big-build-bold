import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Terminal, Server, Globe, Shield, ClipboardList, Sparkles, Map } from 'lucide-react';
import { useScanContext } from '@/contexts/ScanContext';
import SectionTabBar from '@/components/dashboard/SectionTabBar';

const remediationTabs = [
  { id: 'action-plan', label: 'Action Plan', icon: ClipboardList, route: '/dashboard/remediation/action-plan' },
  { id: 'ai-patch', label: 'AI Patch Generator', icon: Sparkles, route: '/dashboard/remediation/ai-patch' },
  { id: 'roadmap', label: 'Migration Roadmap', icon: Map, route: '/dashboard/remediation/roadmap' },
];

const patchConfigs: Record<string, { title: string; icon: React.ElementType; patches: { label: string; description: string; code: string }[] }> = {
  nginx: {
    title: 'nginx',
    icon: Server,
    patches: [
      {
        label: 'Disable Legacy TLS',
        description: 'Remove TLS 1.0 and 1.1 support, enforce TLS 1.2+ with strong ciphers',
        code: `# /etc/nginx/conf.d/tls-hardening.conf
# AEGIS PQC Patch — Generated 2026-03-31

ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305';
ssl_prefer_server_ciphers on;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;

# HSTS (31536000 seconds = 1 year)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;`,
      },
      {
        label: 'Enable PQC Hybrid Key Exchange',
        description: 'Configure ML-KEM-768 hybrid key exchange using OQS-OpenSSL provider',
        code: `# /etc/nginx/conf.d/pqc-hybrid.conf
# AEGIS PQC Patch — Hybrid ML-KEM-768 + X25519

ssl_ecdh_curve X25519MLKEM768:X25519:secp384r1;

# Requires: nginx compiled with OQS-OpenSSL 3.2+
# Install: apt install liboqs-openssl-provider
# Verify: openssl list -kem-algorithms | grep -i mlkem`,
      },
      {
        label: 'Certificate Upgrade to ECDSA',
        description: 'Replace RSA-2048 certificates with ECDSA P-384',
        code: `# Generate ECDSA P-384 key and CSR
openssl ecparam -genkey -name secp384r1 -out /etc/ssl/private/target-ecdsa.key
openssl req -new -key /etc/ssl/private/target-ecdsa.key \\
  -out /etc/ssl/certs/target-ecdsa.csr \\
  -subj "/CN=*.{DOMAIN}/O={ORG}/C=XX"

# nginx config
ssl_certificate /etc/ssl/certs/target-ecdsa-fullchain.pem;
ssl_certificate_key /etc/ssl/private/target-ecdsa.key;`,
      },
    ],
  },
  apache: {
    title: 'Apache',
    icon: Globe,
    patches: [
      {
        label: 'Disable Legacy TLS',
        description: 'Enforce TLS 1.2+ with strong cipher suites on Apache',
        code: `# /etc/apache2/conf-available/ssl-hardening.conf
# AEGIS PQC Patch — Generated 2026-03-31

SSLProtocol -all +TLSv1.2 +TLSv1.3
SSLCipherSuite ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
SSLHonorCipherOrder on
SSLCompression off
SSLSessionTickets off

Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"`,
      },
      {
        label: 'Enable PQC Hybrid',
        description: 'Configure ML-KEM hybrid key exchange on Apache with OQS module',
        code: `# /etc/apache2/mods-available/ssl.conf
# Requires: mod_ssl compiled with OQS-OpenSSL 3.2+

SSLOpenSSLConfCmd Groups X25519MLKEM768:X25519:secp384r1
SSLOpenSSLConfCmd SignatureAlgorithms MLDSA65:ed25519:ecdsa_secp384r1_sha384`,
      },
    ],
  },
  iis: {
    title: 'IIS',
    icon: Shield,
    patches: [
      {
        label: 'Disable Legacy TLS (PowerShell)',
        description: 'Disable TLS 1.0/1.1 and weak ciphers on Windows Server / IIS',
        code: `# AEGIS PQC Patch — IIS TLS Hardening
# Run as Administrator in PowerShell

# Disable TLS 1.0
New-Item 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.0\\Server' -Force
Set-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.0\\Server' -Name 'Enabled' -Value 0 -Type DWord
Set-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.0\\Server' -Name 'DisabledByDefault' -Value 1 -Type DWord

# Disable TLS 1.1
New-Item 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.1\\Server' -Force
Set-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.1\\Server' -Name 'Enabled' -Value 0 -Type DWord
Set-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.1\\Server' -Name 'DisabledByDefault' -Value 1 -Type DWord

# Enable HSTS in IIS
Import-Module WebAdministration
Set-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST' \\
  -filter "system.webServer/httpProtocol/customHeaders" \\
  -name "." -value @{name='Strict-Transport-Security';value='max-age=31536000; includeSubDomains; preload'}

Write-Host "Restart IIS: iisreset /restart"`,
      },
    ],
  },
};

const RemediationAIPatch = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="font-body text-2xl font-bold text-foreground">AI Patch Generator</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Auto-generated configuration patches for PQC migration across your infrastructure</p>
      </div>
      <SectionTabBar tabs={remediationTabs} />

      <Card className="bg-surface border-border">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-accent-amber" />
            <div>
              <p className="font-body text-sm font-medium text-foreground">Configuration patches are generated based on your scan results</p>
              <p className="font-body text-xs text-muted-foreground">These patches are tailored to the vulnerabilities found in your scanned infrastructure. Review carefully before applying.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="nginx" className="w-full">
        <TabsList className="bg-sunken">
          {Object.entries(patchConfigs).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <TabsTrigger key={key} value={key} className="gap-1.5 font-mono text-xs">
                <Icon className="w-3.5 h-3.5" />
                {config.title}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(patchConfigs).map(([key, config]) => (
          <TabsContent key={key} value={key} className="space-y-4 mt-4">
            {config.patches.map((patch, i) => {
              const copyKey = `${key}-${i}`;
              return (
                <Card key={i} className="bg-surface border-border overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-body text-sm">{patch.label}</CardTitle>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">{patch.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs h-7"
                        onClick={() => handleCopy(patch.code, copyKey)}
                      >
                        {copiedIndex === copyKey ? (
                          <><Check className="w-3 h-3 text-status-safe" /> Copied</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy</>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="bg-brand-primary text-accent-amber-light font-mono text-xs p-4 overflow-x-auto leading-relaxed">
                      <code>{patch.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
};

export default RemediationAIPatch;
