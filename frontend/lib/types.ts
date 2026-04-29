export interface Finding {
  title: string;
  summary: string;
  impact: string;
  severity: "low" | "medium" | "high" | "critical";
  source: string;
}

export interface MonitorResult {
  monitor: "vendor_risk" | "regulatory" | "knowledge_health";
  findings: Finding[];
  overall_risk_score: number;
  executive_summary: string;
}

export interface AnalyzeRequest {
  vendors: string[];
  industry: string;
  region: string;
  drive_folder_url: string;
}

export interface SentinelDigest {
  vendor_risk: MonitorResult;
  regulatory: MonitorResult;
  knowledge_health: MonitorResult;
  executive_summary: string;
}

export const SENTINEL_STORAGE_KEY = "sentinel_last_digest";
export const SENTINEL_FORM_KEY = "sentinel_last_form";
