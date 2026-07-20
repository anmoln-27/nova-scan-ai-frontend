import { createFileRoute } from "@tanstack/react-router";
import { useStrategy } from "@/hooks/useNovaData";
import { PageHeader } from "@/components/common/PageHeader";
import { Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/strategy")({
  component: StrategyPage,
});

function StrategyPage() {
  const { data: strategy, isLoading } = useStrategy();

  const goals: string[] = (strategy?.goals as string[]) ?? [];
  const endpoints = strategy?.prioritized_endpoints ?? [];

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-8">
      <PageHeader
        eyebrow="AI Planner"
        title="Attack Strategy"
        description="Gemini-generated goals and prioritized endpoints that drive the autonomous engine."
      />

      {isLoading && (
        <div className="rounded-2xl glass p-10 text-center text-muted-foreground">Loading strategy…</div>
      )}

      {!isLoading && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 rounded-2xl glass p-5">
            <div className="flex items-center gap-2 text-nova-purple text-xs uppercase tracking-widest">
              <Sparkles className="h-3 w-3" /> Goals
            </div>
            <ul className="mt-4 space-y-2">
              {goals.length > 0 ? goals.map((g, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-sm"
                >
                  {g}
                </motion.li>
              )) : <li className="text-sm text-muted-foreground">No goals yet.</li>}
            </ul>
          </div>

          <div className="lg:col-span-2 rounded-2xl glass p-5">
            <div className="flex items-center gap-2 text-nova-purple text-xs uppercase tracking-widest">
              <Target className="h-3 w-3" /> Prioritized Endpoints
            </div>
            <div className="mt-4 space-y-2">
              {endpoints.length > 0 ? endpoints.map((e: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-nova-purple to-nova-blue grid place-items-center text-xs font-semibold text-white">
                    {e.priority ?? i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono">{e.method}</span>
                      <span className="font-mono text-sm truncate">{e.endpoint}</span>
                    </div>
                    {e.goal && <div className="text-xs text-muted-foreground mt-0.5">{e.goal}</div>}
                  </div>
                </motion.div>
              )) : <div className="text-sm text-muted-foreground">No prioritized endpoints.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
