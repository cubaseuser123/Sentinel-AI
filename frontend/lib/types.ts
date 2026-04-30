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

export interface VendorRequest {
  vendors: string[];
  industry: string;
}

export interface RegulatoryRequest {
  industry: string;
  region: string;
}

export interface KnowledgeRequest {
  drive_folder_url: string;
}

export const VENDOR_STORAGE_KEY = "sentinel_vendor_result";
export const VENDOR_FORM_KEY = "sentinel_vendor_form";
export const REGULATORY_STORAGE_KEY = "sentinel_regulatory_result";
export const REGULATORY_FORM_KEY = "sentinel_regulatory_form";
export const KNOWLEDGE_STORAGE_KEY = "sentinel_knowledge_result";

// Legacy keys kept for backwards compatibility
export const SENTINEL_STORAGE_KEY = "sentinel_last_digest";
export const SENTINEL_FORM_KEY = "sentinel_last_form";

// Legacy types for backwards compatibility
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
