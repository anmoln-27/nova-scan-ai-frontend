export function severityMeta(sev?: string) {
  const s = (sev || "").toLowerCase();
  if (s === "critical")
    return { label: "Critical", color: "text-rose-300", bg: "bg-rose-500/15 border-rose-500/30", dot: "bg-rose-400" };
  if (s === "high")
    return { label: "High", color: "text-orange-300", bg: "bg-orange-500/15 border-orange-500/30", dot: "bg-orange-400" };
  if (s === "medium")
    return { label: "Medium", color: "text-amber-300", bg: "bg-amber-500/15 border-amber-500/30", dot: "bg-amber-400" };
  if (s === "low")
    return { label: "Low", color: "text-sky-300", bg: "bg-sky-500/15 border-sky-500/30", dot: "bg-sky-400" };
  return { label: sev || "Info", color: "text-muted-foreground", bg: "bg-white/5 border-white/10", dot: "bg-muted-foreground" };
}

export function severityWeight(sev?: string) {
  const s = (sev || "").toLowerCase();
  return { critical: 4, high: 3, medium: 2, low: 1 }[s] ?? 0;
}
