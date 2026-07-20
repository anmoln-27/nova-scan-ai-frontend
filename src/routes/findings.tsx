import { createFileRoute } from "@tanstack/react-router";
import { useReport } from "@/hooks/useNovaData";
import { PageHeader } from "@/components/common/PageHeader";
import { severityMeta } from "@/lib/severity";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Finding } from "@/lib/api";

export const Route = createFileRoute("/findings")({
  component: FindingsPage,
});

function FindingsPage() {
  const { data: report, isLoading } = useReport();
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<string>("all");
  const [selected, setSelected] = useState<Finding | null>(null);

  const findings = report?.findings ?? [];
  const filtered = useMemo(() => {
    return findings.filter((f) => {
      const matchQ =
        !query ||
        `${f.endpoint} ${f.method} ${f.owasp_category ?? ""}`.toLowerCase().includes(query.toLowerCase());
      const matchS = severity === "all" || (f.severity || "").toLowerCase() === severity;
      return matchQ && matchS;
    });
  }, [findings, query, severity]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-8">
      <PageHeader
        eyebrow="Vulnerabilities"
        title="Findings"
        description="OWASP-classified vulnerabilities discovered by the AI critic across every scanned endpoint."
      />

      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search endpoint, method, OWASP…"
            className="w-full rounded-xl glass px-10 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-nova-purple/50"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl glass p-1">
          {["all", "critical", "high", "medium", "low"].map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-colors ${
                severity === s ? "bg-gradient-to-r from-nova-purple to-nova-blue text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl glass overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-white/5">
          <div className="col-span-4">Endpoint</div>
          <div className="col-span-1">Method</div>
          <div className="col-span-2">Severity</div>
          <div className="col-span-1">Confidence</div>
          <div className="col-span-3">OWASP</div>
          <div className="col-span-1">Status</div>
        </div>
        {isLoading && <SkeletonRows />}
        {!isLoading && filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">No findings yet. Run a scan.</div>
        )}
        {filtered.map((f, i) => {
          const sev = severityMeta(f.severity);
          const conf = f.confidence ?? 0;
          const confPct = Math.round(conf <= 1 ? conf * 100 : conf);
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setSelected(f)}
              className="w-full text-left grid grid-cols-12 items-center px-5 py-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors"
            >
              <div className="col-span-4 font-mono text-sm truncate">{f.endpoint}</div>
              <div className="col-span-1">
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono">{f.method}</span>
              </div>
              <div className="col-span-2">
                <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-[11px] ${sev.bg} ${sev.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} /> {sev.label}
                </span>
              </div>
              <div className="col-span-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-1.5 w-14 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-nova-purple to-nova-blue" style={{ width: `${confPct}%` }} />
                  </div>
                  <span className="text-muted-foreground">{confPct}%</span>
                </div>
              </div>
              <div className="col-span-3 text-xs text-muted-foreground truncate">{f.owasp_category || "—"}</div>
              <div className="col-span-1 text-xs capitalize">{f.finding_status || "—"}</div>
            </motion.button>
          );
        })}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-card/95 backdrop-blur-xl border-l-white/10">
          {selected && <FindingDetail f={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FindingDetail({ f }: { f: Finding }) {
  const sev = severityMeta(f.severity);
  return (
    <div>
      <SheetHeader>
        <SheetTitle className="text-xl">
          <span className="font-mono">{f.method}</span> {f.endpoint}
        </SheetTitle>
      </SheetHeader>
      <div className="mt-4 flex items-center gap-2">
        <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-[11px] ${sev.bg} ${sev.color}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} /> {sev.label}
        </span>
        <span className="text-xs text-muted-foreground">{f.owasp_category}</span>
      </div>
      <Section title="Business Impact">{f.business_impact || "—"}</Section>
      <Section title="Recommendation">{f.recommendation || "—"}</Section>
      <Section title="Next Attack">{f.next_attack || "—"}</Section>
      <Section title="Payload">
        <pre className="text-xs font-mono whitespace-pre-wrap break-all">{safeJson(f.payload)}</pre>
      </Section>
      <Section title="Response">
        <pre className="text-xs font-mono whitespace-pre-wrap break-all">{safeJson(f.response)}</pre>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="text-[10px] uppercase tracking-widest text-nova-purple mb-1.5">{title}</div>
      <div className="rounded-xl glass p-3 text-sm text-foreground/90">{children}</div>
    </div>
  );
}

function safeJson(v: unknown) {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
}

function SkeletonRows() {
  return (
    <div className="p-5 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}
