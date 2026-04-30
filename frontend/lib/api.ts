import { VendorRequest, RegulatoryRequest, KnowledgeRequest, MonitorResult } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type StreamEvent =
  | { type: "token"; data: string }
  | { type: "done"; result: MonitorResult }
  | { type: "error"; error: string };

async function* streamEndpoint(endpoint: string, body: object, signal?: AbortSignal): AsyncGenerator<StreamEvent> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok || !response.body) {
    yield { type: "error", error: `HTTP ${response.status}` };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let lastEvent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        lastEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (lastEvent === "done") {
          try { yield { type: "done", result: JSON.parse(data) as MonitorResult }; }
          catch { yield { type: "error", error: "Failed to parse result" }; }
          lastEvent = "";
        } else if (lastEvent === "error") {
          try { yield { type: "error", error: JSON.parse(data).error }; }
          catch { yield { type: "error", error: data }; }
          lastEvent = "";
        } else {
          yield { type: "token", data: data.replace(/\\n/g, "\n") };
        }
      } else if (line === "") {
        lastEvent = "";
      }
    }
  }
}

export const streamVendorAnalysis = (req: VendorRequest, signal?: AbortSignal) =>
  streamEndpoint("/analyze/vendor", req, signal);

export const streamRegulatoryAnalysis = (req: RegulatoryRequest, signal?: AbortSignal) =>
  streamEndpoint("/analyze/regulatory", req, signal);

export const streamKnowledgeAnalysis = (req: KnowledgeRequest, signal?: AbortSignal) =>
  streamEndpoint("/analyze/knowledge", req, signal);
