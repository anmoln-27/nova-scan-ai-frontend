import { createFileRoute } from "@tanstack/react-router";
import { useRunScan } from "@/hooks/useNovaData";
import { PageHeader } from "@/components/common/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PlayCircle, Check, Loader2, Search, Brain, Swords, Zap, Gavel, FileText, PartyPopper } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/scan")({
  component: RunScanPage,
});

const stages = [
  { key: "discover", label: "Discovering APIs", icon: Search },
  { key: "strategy", label: "Generating Strategy", icon: Brain },
  { key: "attacks", label: "Generating Attacks", icon: Swords },
  { key: "execute", label: "Executing", icon: Zap },
  { key: "critic", label: "AI Critic", icon: Gavel },
  { key: "report", label: "Generating Report", icon: FileText },
  { key: "done", label: "Completed", icon: PartyPopper },
];

function RunScanPage() {
  const runScan = useRunScan();
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    if (!runScan.isPending) return;
    setStage(0);
    const id = setInterval(() => {
      setStage((s) => (s < stages.length - 2 ? s + 1 : s));
    }, 1400);
    return () => clearInterval(id);
  }, [runScan.isPending]);

  useEffect(() => {
    if (runScan.isSuccess) {
      setStage(stages.length - 1);
      toast.success("Scan complete", { description: "Dashboard, findings, and reports refreshed." });
    }
    if (runScan.isError) {
      toast.error("Scan failed", { description: (runScan.error as Error)?.message });
      setStage(-1);
    }
  }, [runScan.isSuccess, runScan.isError, runScan.error]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8">
      <PageHeader
        eyebrow="Autonomous Engine"
        title="Run Scan"
        description="Kick off the full multi-agent pipeline. The engine discovers endpoints, plans attacks, executes them, and critiques results."
      />

      <div className="rounded-3xl glass p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{
          background:
            "radial-gradient(600px circle at 20% 0%, oklch(0.55 0.22 300 / 0.3), transparent 60%), radial-gradient(500px circle at 80% 100%, oklch(0.5 0.22 260 / 0.25), transparent 60%)",
        }} />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm text-muted-foreground">Target</div>
            <div className="text-xl font-semibold">Vulnerable Banking API</div>
            <div className="text-xs text-muted-foreground mt-1">GET / · POST /login · POST /transfer</div>
          </div>
          <motion.button
            whileHover={{ scale: runScan.isPending ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={runScan.isPending}
            onClick={() => runScan.mutate()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-purple via-nova-pink to-nova-blue px-6 py-3 text-sm font-medium text-white glow-purple disabled:opacity-70"
          >
            {runScan.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
            {runScan.isPending ? "Scanning…" : "Run Autonomous Scan"}
          </motion.button>
        </div>
      </div>

      <div className="mt-8 rounded-3xl glass p-6 md:p-10">
        <div className="grid gap-3">
          <AnimatePresence>
            {stages.map((s, i) => {
              const state =
                stage === -1 ? "idle" : i < stage ? "done" : i === stage ? (i === stages.length - 1 ? "done" : "active") : "pending";
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                    state === "active"
                      ? "border-nova-purple/50 bg-nova-purple/10"
                      : state === "done"
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-xl grid place-items-center ${
                      state === "active"
                        ? "bg-gradient-to-br from-nova-purple to-nova-blue text-white"
                        : state === "done"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {state === "done" ? <Check className="h-4 w-4" /> : state === "active" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {state === "active"
                        ? "In progress…"
                        : state === "done"
                        ? "Completed"
                        : "Waiting"}
                    </div>
                  </div>
                  {state === "active" && (
                    <motion.div
                      layoutId="stage-glow"
                      className="h-1.5 w-24 rounded-full bg-gradient-to-r from-nova-purple to-nova-blue"
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
