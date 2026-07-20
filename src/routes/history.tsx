import { createFileRoute } from "@tanstack/react-router";
import { useHistory } from "@/hooks/useNovaData";
import { PageHeader } from "@/components/common/PageHeader";
import { severityMeta } from "@/lib/severity";
import { motion } from "framer-motion";
import { Code2, ArrowRight, Cpu, Gavel } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const { data: history, isLoading } = useHistory();

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-8">
      <PageHeader
        eyebrow="Timeline"
        title="Attack History"
        description="Every round from the autonomous engine: payload, execution result, and AI critic analysis."
      />

      {isLoading && <div className="rounded-2xl glass p-10 text-center text-muted-foreground">Loading history…</div>}
      {!isLoading && (!history || history.length === 0) && (
        <div className="rounded-2xl glass p-10 text-center text-muted-foreground">
          No attack rounds yet. Run a scan to begin.
        </div>
      )}

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-nova-purple/60 via-nova-blue/40 to-transparent" />
        <div className="space-y-4">
          {(history || []).map((h, i) => {
            const sev = severityMeta(h.analysis?.severity);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="relative pl-12"
              >
                <div className="absolute left-2 top-4 h-6 w-6 rounded-full bg-gradient-to-br from-nova-purple to-nova-blue grid place-items-center text-[10px] font-semibold text-white glow-purple">
                  {i + 1}
                </div>
                <div className="rounded-2xl glass p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono">{h.method}</span>
                      <span className="font-mono text-sm">{h.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] ${sev.bg} ${sev.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} /> {sev.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {h.status_code != null ? `HTTP ${h.status_code}` : ""}
                        {h.response_time ? ` · ${Math.round(h.response_time)}ms` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <Block icon={Code2} title="Payload">
                      <pre className="text-[11px] font-mono whitespace-pre-wrap break-all max-h-40 overflow-auto">{safeJson(h.payload)}</pre>
                    </Block>
                    <Block icon={Cpu} title="Response">
                      <pre className="text-[11px] font-mono whitespace-pre-wrap break-all max-h-40 overflow-auto">{safeJson(h.response)}</pre>
                    </Block>
                    <Block icon={Gavel} title="AI Critic">
                      <div className="text-xs space-y-1.5">
                        <div className="text-muted-foreground">{h.analysis?.finding_status ?? "—"}</div>
                        <div className="text-foreground/90">{h.analysis?.business_impact ?? "—"}</div>
                        {h.analysis?.next_attack && (
                          <div className="flex items-start gap-1 text-nova-purple text-[11px]">
                            <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" />
                            <span className="line-clamp-3">{h.analysis.next_attack}</span>
                          </div>
                        )}
                      </div>
                    </Block>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Block({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-nova-purple">
        <Icon className="h-3 w-3" /> {title}
      </div>
      {children}
    </div>
  );
}

function safeJson(v: unknown) {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
}
