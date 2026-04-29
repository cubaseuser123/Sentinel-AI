import { AnalyzeRequest, SentinelDigest } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type StreamEvent =
  | { type: "token"; data: string }
  | { type: "done"; digest: SentinelDigest }
  | { type: "error"; error: string };

export async function* streamAnalysis(
  request: AnalyzeRequest
): AsyncGenerator<StreamEvent> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
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
          try {
            const digest = JSON.parse(data) as SentinelDigest;
            yield { type: "done", digest };
          } catch {
            yield { type: "error", error: "Failed to parse digest" };
          }
          lastEvent = "";
        } else if (lastEvent === "error") {
          try {
            const { error } = JSON.parse(data);
            yield { type: "error", error };
          } catch {
            yield { type: "error", error: data };
          }
          lastEvent = "";
        } else {
          // regular token
          yield { type: "token", data: data.replace(/\\n/g, "\n") };
        }
      } else if (line === "") {
        lastEvent = "";
      }
    }
  }
}
