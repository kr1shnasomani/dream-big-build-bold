import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';

interface Phase {
  id: number;
  name: string;
  timeline: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  tasks: { task: string; status: 'done' | 'in_progress' | 'pending' }[];
}

const phases: Phase[] = [
  {
    id: 1,
    name: 'Discovery & Assessment',
    timeline: 'Jan 2026 – Mar 2026',
    status: 'completed',
    progress: 100,
    tasks: [
      { task: 'Complete asset inventory scan', status: 'done' },
      { task: 'Generate Cryptographic Bill of Materials', status: 'done' },
      { task: 'HNDL risk assessment for all assets', status: 'done' },
      { task: 'Quantum Debt baseline measurement', status: 'done' },
    ],
  },
  {
    id: 2,
    name: 'Quick Wins — TLS Hardening',
    timeline: 'Apr 2026 – Jun 2026',
    status: 'in_progress',
    progress: 35,
    tasks: [
      { task: 'Disable TLS 1.0/1.1 across all assets', status: 'in_progress' },
      { task: 'Replace RSA key exchange with ECDHE', status: 'in_progress' },
      { task: 'Enable HSTS on all web endpoints', status: 'pending' },
      { task: 'Upgrade certificates to ECDSA P-384', status: 'pending' },
    ],
  },
  {
    id: 3,
    name: 'PQC Hybrid Deployment',
    timeline: 'Jul 2026 – Dec 2026',
    status: 'upcoming',
    progress: 0,
    tasks: [
      { task: 'Deploy OQS-OpenSSL 3.2+ on critical assets', status: 'pending' },
      { task: 'Enable ML-KEM-768 hybrid key exchange', status: 'pending' },
      { task: 'Test PQC compatibility with client applications', status: 'pending' },
      { task: 'Update SWIFT gateway to PQC hybrid', status: 'pending' },
    ],
  },
  {
    id: 4,
    name: 'Full PQC Migration',
    timeline: 'Jan 2027 – Jun 2027',
    status: 'upcoming',
    progress: 0,
    tasks: [
      { task: 'Replace all RSA-2048 certificates with ML-DSA-65', status: 'pending' },
      { task: 'Migrate VPN gateways to pure PQC', status: 'pending' },
      { task: 'Deploy SLH-DSA for code signing', status: 'pending' },
      { task: 'Update all API endpoints to TLS 1.3 + PQC', status: 'pending' },
    ],
  },
  {
    id: 5,
    name: 'Validation & Certification',
    timeline: 'Jul 2027 – Sep 2027',
    status: 'upcoming',
    progress: 0,
    tasks: [
      { task: 'Third-party quantum readiness audit', status: 'pending' },
      { task: 'NIST FIPS 203/204/205 compliance verification', status: 'pending' },
      { task: 'Achieve Q-Score 900+ (Elite-PQC tier)', status: 'pending' },
      { task: 'Publish quantum readiness attestation', status: 'pending' },
    ],
  },
];

const statusColors: Record<string, string> = {
  completed: 'bg-status-safe text-white',
  in_progress: 'bg-status-warn text-white',
  upcoming: 'bg-muted text-muted-foreground',
};

const taskIcon: Record<string, React.ReactNode> = {
  done: <CheckCircle2 className="w-3.5 h-3.5 text-status-safe flex-shrink-0" />,
  in_progress: <Clock className="w-3.5 h-3.5 text-status-warn flex-shrink-0" />,
  pending: <Circle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />,
};

const RemediationRoadmap = () => {
  const overallProgress = Math.round(phases.reduce((sum, p) => sum + p.progress, 0) / phases.length);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="font-body text-2xl font-bold text-foreground">Migration Roadmap</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">5-phase quantum-safe migration plan for Punjab National Bank infrastructure</p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-surface border-border">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">OVERALL MIGRATION PROGRESS</span>
            <span className="font-mono text-sm font-bold text-foreground">{overallProgress}%</span>
          </div>
          <div className="h-3 bg-sunken rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-status-safe to-accent-amber rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-body text-xs text-muted-foreground">Target: Sep 2027</span>
            <span className="font-body text-xs text-muted-foreground">{phases.filter(p => p.status === 'completed').length} of {phases.length} phases complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Gantt-style Timeline */}
      <div className="hidden lg:block">
        <Card className="bg-surface border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-body text-base">Timeline View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {phases.map((phase) => (
                <div key={phase.id} className="flex items-center gap-4">
                  <div className="w-48 flex-shrink-0">
                    <p className="font-body text-xs font-medium text-foreground truncate">{phase.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{phase.timeline}</p>
                  </div>
                  <div className="flex-1 h-8 bg-sunken rounded-lg overflow-hidden relative">
                    <motion.div
                      className={`h-full rounded-lg ${
                        phase.status === 'completed' ? 'bg-status-safe/80' :
                        phase.status === 'in_progress' ? 'bg-status-warn/80' :
                        'bg-muted-foreground/20'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(phase.progress, 5)}%` }}
                      transition={{ duration: 0.8, delay: phase.id * 0.1 }}
                    />
                    <span className="absolute inset-0 flex items-center px-3 font-mono text-[10px] text-foreground">
                      {phase.progress}%
                    </span>
                  </div>
                  <Badge className={`${statusColors[phase.status]} text-[10px] font-mono flex-shrink-0 capitalize`}>
                    {phase.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Cards */}
      <div className="space-y-4">
        {phases.map((phase, idx) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <Card className="bg-surface border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold ${
                      phase.status === 'completed' ? 'bg-status-safe/10 text-status-safe' :
                      phase.status === 'in_progress' ? 'bg-status-warn/10 text-status-warn' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {phase.id}
                    </div>
                    <div>
                      <CardTitle className="font-body text-sm">{phase.name}</CardTitle>
                      <p className="font-mono text-[10px] text-muted-foreground">{phase.timeline}</p>
                    </div>
                  </div>
                  <Badge className={`${statusColors[phase.status]} text-[10px] font-mono capitalize`}>
                    {phase.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {phase.tasks.map((t, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {taskIcon[t.status]}
                      <span className={`font-body text-xs ${t.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {t.task}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {idx < phases.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RemediationRoadmap;
