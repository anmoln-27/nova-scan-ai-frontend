import { createFileRoute } from "@tanstack/react-router";
import { useReport, useHistory } from "@/hooks/useNovaData";
import { PageHeader } from "@/components/common/PageHeader";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { motion } from "framer-motion";
import { Activity, Bug, ShieldCheck, Zap, Target, AlertTriangle } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { severityMeta } from "@/lib/severity";
import { useMemo } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: report, isLoading, error } = useReport();
  const { data: history } = useHistory();

  const summary = report?.executive_summary ?? {};
  const findings = report?.findings ?? [];

  const stats = [
    {
      label: "Endpoints Tested",
      value: Number(summary.endpoints_tested ?? 0),
      icon: Target,
      color: "from-nova-blue to-nova-purple",
    },
    {
      label: "Attacks Executed",
      value: Number(summary.attacks_executed ?? history?.length ?? 0),
      icon: Zap,
      color: "from-nova-purple to-nova-pink",
    },
    {
      label: "Confirmed Findings",
      value: Number(summary.confirmed_findings ?? findings.filter((f) => f.finding_status === "confirmed").length),
      icon: ShieldCheck,
      color: "from-emerald-400 to-nova-blue",
    },
    {
      label: "Potential Findings",
      value: Number(summary.potential_findings ?? findings.filter((f) => f.finding_status !== "confirmed").length),
      icon: Bug,
      color: "from-amber-400 to-rose-400",
    },
  ];

  const severityData = useMemo(() => {
    const counts: Record<string, number> = {};
    findings.forEach((f) => {
      const k = (f.severity || "info").toLowerCase();
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [findings]);

  const endpointData = useMemo(() => {
    const map: Record<string, number> = {};
    findings.forEach((f) => {
      const k = `${f.method} ${f.endpoint}`;
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [findings]);

  const timeline = useMemo(() => {
    return (history || []).map((h, i) => ({
      round: i + 1,
      severity: sevScore(h.analysis?.severity),
      confidence: Math.round((h.analysis?.confidence ?? 0) * (h.analysis?.confidence && h.analysis.confidence <= 1 ? 100 : 1)),
    }));
  }, [history]);

  const radarData = useMemo(() => {
    const groups: Record<string, { total: number; count: number }> = {};
    findings.forEach((f) => {
      const k = f.owasp_category || "Uncategorized";
      const c = f.confidence ?? 0;
      const val = c <= 1 ? c * 100 : c;
      groups[k] = groups[k] || { total: 0, count: 0 };
      groups[k].total += val;
      groups[k].count += 1;
    });
    return Object.entries(groups)
      .slice(0, 6)
      .map(([category, v]) => ({ category, value: Math.round(v.total / Math.max(v.count, 1)) }));
  }, [findings]);

  const risk = String(summary.overall_risk ?? "Unknown");

  return (
    <div className="mx-auto max-w-[1500px] px-4 sm:px-6 pt-8">
      <PageHeader
        eyebrow="Overview"
        title="Security Dashboard"
        description="Real-time view of the autonomous pentesting engine across your target APIs."
        actions={<OverallRiskBadge risk={risk} />}
      />

      {error && <ErrorBanner />}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-2xl glass p-5"
          >
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${s.color} opacity-25 blur-2xl`} />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${s.color} grid place-items-center text-white`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">
              {isLoading ? "—" : <AnimatedCounter value={s.value} />}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Severity Distribution" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={55} paddingAngle={4}>
                {severityData.map((entry, idx) => (
                  <Cell key={idx} fill={sevColor(entry.name)} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <Legend items={severityData.map((d) => ({ label: d.name, color: sevColor(d.name), value: d.value }))} />
        </ChartCard>

        <ChartCard title="Findings by Endpoint" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={endpointData}>
              <defs>
                <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.75 0.24 300)" />
                  <stop offset="100%" stopColor="oklch(0.55 0.22 260)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Attack Timeline" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timeline}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
              <XAxis dataKey="round" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="severity" stroke="oklch(0.75 0.24 300)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="confidence" stroke="oklch(0.7 0.2 250)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Confidence by OWASP">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} outerRadius={90}>
              <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
              <PolarRadiusAxis stroke="transparent" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
              <Radar dataKey="value" stroke="oklch(0.75 0.24 300)" fill="oklch(0.75 0.24 300)" fillOpacity={0.35} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function OverallRiskBadge({ risk }: { risk: string }) {
  const meta = severityMeta(risk);
  return (
    <div className={`inline-flex items-center gap-3 rounded-2xl glass px-4 py-3 border ${meta.bg}`}>
      <Activity className="h-4 w-4 text-nova-purple" />
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Overall Risk</div>
        <div className={`text-sm font-semibold ${meta.color}`}>{risk}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl glass p-5 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-foreground/90">{title}</div>
      </div>
      {children}
    </div>
  );
}

function Legend({ items }: { items: { label: string; color: string; value: number }[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((i) => (
        <div key={i.label} className="inline-flex items-center gap-2 rounded-full glass px-2.5 py-1 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ background: i.color }} />
          <span className="capitalize text-muted-foreground">{i.label}</span>
          <span className="text-foreground/90">{i.value}</span>
        </div>
      ))}
    </div>
  );
}

function ErrorBanner() {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-2xl glass border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
      <AlertTriangle className="h-4 w-4" />
      Backend not reachable. Start the novaRAG X backend and set VITE_API_BASE_URL. Displaying empty state.
    </div>
  );
}

const tooltipStyle = {
  background: "rgba(20,18,32,0.9)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  fontSize: 12,
  backdropFilter: "blur(8px)",
};

function sevColor(name: string) {
  const map: Record<string, string> = {
    critical: "oklch(0.65 0.24 20)",
    high: "oklch(0.72 0.2 45)",
    medium: "oklch(0.8 0.18 85)",
    low: "oklch(0.7 0.18 220)",
    info: "oklch(0.65 0.06 260)",
  };
  return map[name.toLowerCase()] || "oklch(0.7 0.2 300)";
}
function sevScore(s?: string) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[String(s || "").toLowerCase()] ?? 0;
}
