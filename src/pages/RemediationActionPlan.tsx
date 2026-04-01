import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertTriangle, ArrowUpRight, Filter, ClipboardList, Sparkles, Map } from 'lucide-react';
import { assets } from '@/data/demoData';
import SectionTabBar from '@/components/dashboard/SectionTabBar';

const remediationTabs = [
  { id: 'action-plan', label: 'Action Plan', icon: ClipboardList, route: '/dashboard/remediation/action-plan' },
  { id: 'ai-patch', label: 'AI Patch Generator', icon: Sparkles, route: '/dashboard/remediation/ai-patch' },
  { id: 'roadmap', label: 'Migration Roadmap', icon: Map, route: '/dashboard/remediation/roadmap' },
];

const priorityColor: Record<string, string> = {
  P1: 'bg-status-critical text-white',
  P2: 'bg-status-vuln text-white',
  P3: 'bg-status-warn text-white',
  P4: 'bg-status-safe text-white',
};

const statusIcon: Record<string, React.ReactNode> = {
  not_started: <Clock className="w-3.5 h-3.5 text-muted-foreground" />,
  in_progress: <ArrowUpRight className="w-3.5 h-3.5 text-status-warn" />,
  done: <CheckCircle2 className="w-3.5 h-3.5 text-status-safe" />,
  verified: <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent" />,
};

const effortLabel: Record<string, string> = {
  low: '~1 hr',
  medium: '~4 hrs',
  high: '~2 wks',
};

const RemediationActionPlan = () => {
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Flatten all remediation actions with asset context
  const allActions = assets.flatMap(asset =>
    asset.remediation.map((r, i) => ({
      ...r,
      assetDomain: asset.domain,
      assetType: asset.type,
      qScore: asset.qScore,
      key: `${asset.id}-${i}`,
    }))
  );

  const filtered = filterPriority === 'all' ? allActions : allActions.filter(a => a.priority === filterPriority);

  const totalActions = allActions.length;
  const completedActions = allActions.filter(a => a.status === 'done' || a.status === 'verified').length;
  const p1Count = allActions.filter(a => a.priority === 'P1').length;
  const inProgressCount = allActions.filter(a => a.status === 'in_progress').length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="font-display text-2xl italic text-brand-primary">Remediation Action Plan</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Prioritized actions to improve your quantum readiness posture</p>
      </div>
      <SectionTabBar tabs={remediationTabs} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Actions', value: totalActions, sub: 'across all assets', color: 'text-foreground' },
          { label: 'P1 Critical', value: p1Count, sub: 'require immediate action', color: 'text-status-critical' },
          { label: 'In Progress', value: inProgressCount, sub: 'currently being addressed', color: 'text-status-warn' },
          { label: 'Completed', value: completedActions, sub: `${Math.round((completedActions / totalActions) * 100)}% completion rate`, color: 'text-status-safe' },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-surface border-border">
            <CardContent className="pt-4 pb-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
              <p className={`font-body text-2xl font-bold ${kpi.color} mt-1`}>{kpi.value}</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress */}
      <Card className="bg-surface border-border">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-muted-foreground">OVERALL REMEDIATION PROGRESS</span>
            <span className="font-mono text-xs text-foreground font-bold">{Math.round((completedActions / totalActions) * 100)}%</span>
          </div>
          <Progress value={(completedActions / totalActions) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Filters + Table */}
      <Card className="bg-surface border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-body text-base">Action Items</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="P1">P1 Only</SelectItem>
                  <SelectItem value="P2">P2 Only</SelectItem>
                  <SelectItem value="P3">P3 Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-mono text-[10px]">PRIORITY</TableHead>
                <TableHead className="font-mono text-[10px]">ASSET</TableHead>
                <TableHead className="font-mono text-[10px]">FINDING</TableHead>
                <TableHead className="font-mono text-[10px]">ACTION</TableHead>
                <TableHead className="font-mono text-[10px]">EFFORT</TableHead>
                <TableHead className="font-mono text-[10px]">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((action) => (
                <TableRow key={action.key} className="border-border hover:bg-sunken/50">
                  <TableCell>
                    <Badge className={`${priorityColor[action.priority]} text-[10px] font-mono`}>{action.priority}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{action.assetDomain}</TableCell>
                  <TableCell className="font-body text-xs max-w-[200px]">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-status-warn flex-shrink-0" />
                      {action.finding}
                    </div>
                  </TableCell>
                  <TableCell className="font-body text-xs max-w-[250px]">{action.action}</TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{effortLabel[action.effort]}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {statusIcon[action.status]}
                      <span className="font-mono text-[10px] capitalize">{action.status.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RemediationActionPlan;
