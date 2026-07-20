import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NovaApi } from "@/lib/api";

export const qk = {
  report: ["nova", "report"] as const,
  history: ["nova", "history"] as const,
  strategy: ["nova", "strategy"] as const,
};

export function useReport() {
  return useQuery({ queryKey: qk.report, queryFn: NovaApi.getReport, retry: 0 });
}
export function useHistory() {
  return useQuery({ queryKey: qk.history, queryFn: NovaApi.getHistory, retry: 0 });
}
export function useStrategy() {
  return useQuery({ queryKey: qk.strategy, queryFn: NovaApi.getStrategy, retry: 0 });
}
export function useRunScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: NovaApi.runScan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.report });
      qc.invalidateQueries({ queryKey: qk.history });
      qc.invalidateQueries({ queryKey: qk.strategy });
    },
  });
}
