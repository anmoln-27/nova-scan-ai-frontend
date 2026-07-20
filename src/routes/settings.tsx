import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    setApiUrl(localStorage.getItem("nova.apiBase") || (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000");
  }, []);

  const save = () => {
    localStorage.setItem("nova.apiBase", apiUrl);
    toast.success("Saved", { description: "Reload the page for the new API base URL to take effect." });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-8">
      <PageHeader eyebrow="Configuration" title="Settings" description="Configure how the frontend connects to the novaRAG X backend." />

      <div className="rounded-2xl glass p-6 space-y-5">
        <div>
          <label className="text-xs uppercase tracking-widest text-nova-purple">Backend API Base URL</label>
          <input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="mt-2 w-full rounded-xl glass px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-nova-purple/50"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            The frontend calls <code className="font-mono text-foreground/80">/api/run</code>, <code className="font-mono text-foreground/80">/api/report</code>, <code className="font-mono text-foreground/80">/api/history</code>, and <code className="font-mono text-foreground/80">/api/strategy</code> against this base.
          </p>
        </div>

        <button
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-purple to-nova-blue px-5 py-2 text-sm text-white glow-purple"
        >
          Save
        </button>
      </div>

      <div className="mt-4 rounded-2xl glass p-6 text-sm text-muted-foreground">
        <div className="text-xs uppercase tracking-widest text-nova-purple mb-2">About</div>
        novaRAG X orchestrates a multi-agent pipeline (Discovery → Strategy → Hacker → Executor → Critic → Report) powered by Gemini AI, exposed via 4 REST endpoints.
      </div>
    </div>
  );
}
