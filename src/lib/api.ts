import axios from "axios";

const baseURL =
  (typeof window !== "undefined" && window.localStorage?.getItem("nova.apiBase")) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:8000";

export const api = axios.create({
  baseURL,
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

// ===== Types (based on backend spec) =====
export interface Endpoint {
  path: string;
  method: string;
  summary?: string;
  request_fields?: Record<string, unknown>;
}

export interface Finding {
  endpoint: string;
  method: string;
  severity: "critical" | "high" | "medium" | "low" | "info" | string;
  confidence?: number;
  owasp_category?: string;
  business_impact?: string;
  recommendation?: string;
  next_attack?: string;
  finding_status?: string;
  payload?: unknown;
  response?: unknown;
  status_code?: number;
}

export interface ExecutiveSummary {
  overall_risk?: string;
  endpoints_tested?: number;
  attacks_executed?: number;
  confirmed_findings?: number;
  potential_findings?: number;
  [key: string]: unknown;
}

export interface Report {
  executive_summary: ExecutiveSummary;
  findings: Finding[];
}

export interface AttackRound {
  endpoint: string;
  method: string;
  payload?: unknown;
  status_code?: number;
  response?: unknown;
  response_time?: number;
  analysis?: {
    finding_status?: string;
    confidence?: number;
    severity?: string;
    owasp_category?: string;
    business_impact?: string;
    recommendation?: string;
    next_attack?: string;
  };
  timestamp?: string | number;
}

export interface Strategy {
  goals?: string[];
  prioritized_endpoints?: Array<{ endpoint: string; method: string; goal?: string; priority?: number }>;
  [key: string]: unknown;
}

// ===== API =====
export const NovaApi = {
  runScan: () => api.post("/api/run").then((r) => r.data),
  getReport: () => api.get<Report>("/api/report").then((r) => r.data),
  getHistory: () => api.get<AttackRound[]>("/api/history").then((r) => r.data),
  getStrategy: () => api.get<Strategy>("/api/strategy").then((r) => r.data),
};
