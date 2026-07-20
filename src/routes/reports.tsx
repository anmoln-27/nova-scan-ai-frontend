import { createFileRoute } from "@tanstack/react-router";
import { useReport } from "@/hooks/useNovaData";
import { PageHeader } from "@/components/common/PageHeader";
import { severityMeta } from "@/lib/severity";
import { Download, Printer } from "lucide-react";
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
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { data: report } = useReport();
  const summary = report?.executive_summary ?? {};
  const findings = report?.findings ?? [];

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

  const risk = String(summary.overall_risk ?? "Unknown");
  const meta = severityMeta(risk);

  const exportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `novaRAG-X-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-8 print:px-0">
      <PageHeader
        eyebrow="Executive"
        title="Security Report"
        description="Executive summary, overall risk, and full finding list — ready to share."
        actions={
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm hover:bg-white/10"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              onClick={exportJson}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-purple to-nova-blue px-4 py-2 text-sm text-white glow-purple"
            >
              <Download className="h-4 w-4" /> Export JSON
            </button>
          </div>
        }
      />

      <div className="rounded-2xl glass p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-nova-purple">Executive Summary</div>
            <div className="mt-1 text-lg font-semibold">Autonomous scan results</div>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${meta.bg} ${meta.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> Overall Risk · {risk}
          </span>
        </div>
        <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-4">
          <Stat label="Endpoints Tested" value={summary.endpoints_tested} />
          <Stat label="Attacks Executed" value={summary.attacks_executed} />
          <Stat label="Confirmed Findings" value={summary.confirmed_findings} />
          <Stat label="Potential Findings" value={summary.potential_findings} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl glass p-5">
          <div className="mb-3 text-sm font-medium">Severity Distribution</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={55}>
                {severityData.map((e, i) => (
                  <Cell key={i} fill={sevColor(e.name)} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl glass p-5">
          <div className="mb-3 text-sm font-medium">Findings by Endpoint</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={endpointData}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis allowDecimals={false} tick={{ fill: "#a1a1aa", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
              <Bar dataKey="count" fill="oklch(0.7 0.22 300)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 rounded-2xl glass p-5">
        <div className="mb-3 text-sm font-medium">All Findings</div>
        <div className="space-y-3">
          {findings.map((f, i) => {
            const sev = severityMeta(f.severity);
            return (
              <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono">{f.method}</span>
                    <span className="font-mono text-sm">{f.endpoint}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] ${sev.bg} ${sev.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} /> {sev.label}
                  </span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{f.owasp_category}</div>
                <div className="mt-2 grid gap-2 md:grid-cols-2 text-xs">
                  <div><span className="text-nova-purple">Impact: </span>{f.business_impact || "—"}</div>
                  <div><span className="text-nova-purple">Fix: </span>{f.recommendation || "—"}</div>
                </div>
              </div>
            );
          })}
          {findings.length === 0 && <div className="text-sm text-muted-foreground">No findings.</div>}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{Number(value ?? 0)}</div>
    </div>
  );
}

const tooltipStyle = {
  background: "rgba(20,18,32,0.9)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  fontSize: 12,
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
