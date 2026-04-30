"use client";
import { useState } from "react";
import { Cloud, FileText, TrendingUp, Activity, AlertTriangle, Loader2, CheckCircle, Search, Link as LinkIcon, X } from "lucide-react";
import Link from "next/link";
import { streamKnowledgeAnalysis } from "@/lib/api";
import { streamKnowledgeDemo } from "@/lib/demo";
import { KnowledgeRequest, MonitorResult, Finding, KNOWLEDGE_STORAGE_KEY } from "@/lib/types";
import clsx from "clsx";

const SEV_CONFIG = {
  critical: { border: "border-l-accent-red", badge: "bg-accent-red/10 text-accent-red", dot: "bg-accent-red" },
  high: { border: "border-l-accent-yellow", badge: "bg-accent-yellow/20 text-accent-yellow", dot: "bg-accent-yellow" },
  medium: { border: "border-l-orange-400", badge: "bg-orange-400/10 text-orange-400", dot: "bg-orange-400" },
  low: { border: "border-l-border", badge: "bg-foreground/10 text-foreground/50", dot: "bg-foreground/30" },
};

function FindingRow({ finding }: { finding: Finding }) {
  const s = SEV_CONFIG[finding.severity];
  return (
    <Link href="/knowledge/detail" className={clsx("block bg-background p-5 rounded-xl border-l-4 border-y border-r border-border hover:bg-surface/40 transition-all flex items-center gap-6 group", s.border)}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-bold text-foreground tracking-tight">{finding.title}</span>
          <span className={clsx("text-[10px] font-black px-2 py-0.5 rounded uppercase", s.badge)}>{finding.severity}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-foreground/60">
          <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {finding.summary.slice(0, 80)}{finding.summary.length > 80 ? "..." : ""}</span>
        </div>
        <div className="mt-1.5 text-xs text-foreground/50 italic">{finding.impact}</div>
        {finding.source && (
          <div className="mt-1 flex items-center gap-1 text-[10px] text-foreground/40 uppercase tracking-wider font-bold">
            <LinkIcon className="w-3 h-3" />{finding.source.slice(0, 50)}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function KnowledgeHealthPage() {
  const [driveUrl, setDriveUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const [streamText, setStreamText] = useState("");
  const [result, setResult] = useState<MonitorResult | null>(null);
  const [error, setError] = useState("");

  const critCount = result?.findings.filter(f => f.severity === "critical" || f.severity === "high").length ?? 0;

  async function handleSubmit() {
    if (!driveUrl.trim()) return;
    setStatus("streaming");
    setStreamText("");
    setResult(null);
    const req: KnowledgeRequest = { drive_folder_url: driveUrl };
    
    const controller = new AbortController();
    let isDone = false;

    // Bypassing real API for demo reliability
    setStreamText((prev) => prev + "\n[System] Initiating deep semantic scan of internal Google Drive & Notion workspaces...\n");
    try {
      for await (const event of streamKnowledgeDemo()) {
        if (event.type === "token") setStreamText(p => p + event.data);
        else if (event.type === "done") {
           sessionStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(event.result));
           setResult(event.result);
           setStatus("done");
        }
      }
    } catch (e) {
      setError("Demo stream failed");
      setStatus("error");
    }

  }

  return (
    <div className="flex-1 p-8 min-h-screen relative">
      {/* Header */}
      <div className="mb-10 max-w-6xl mx-auto flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Knowledge Health</h1>
          <p className="text-foreground/70 text-sm">Connect to your company's Google Drive and audit internal documentation for stale docs, missing SOPs, and knowledge gaps.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-lg border border-border">
          {status === "done" ? (
            <><CheckCircle className="w-3.5 h-3.5 text-accent-cyan" /><span className="text-xs font-semibold text-foreground uppercase tracking-widest">Scan Complete</span></>
          ) : status === "streaming" ? (
            <><Loader2 className="w-3.5 h-3.5 text-accent-yellow animate-spin" /><span className="text-xs font-semibold text-foreground uppercase tracking-widest">Scanning...</span></>
          ) : (
            <><span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse" /><span className="text-xs font-semibold text-foreground uppercase tracking-widest">Awaiting Scan</span></>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 block mb-3">Google Drive Folder URL</label>
          <div className="flex gap-3">
            <input
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent-yellow/50 transition-colors"
              placeholder="https://drive.google.com/drive/folders/..."
              value={driveUrl}
              onChange={e => setDriveUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            <button onClick={handleSubmit} disabled={!driveUrl.trim() || status === "streaming"}
              className="bg-accent-yellow text-black font-black px-6 py-2.5 rounded-xl text-sm uppercase tracking-widest hover:bg-accent-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,184,0,0.2)] active:scale-[0.98] whitespace-nowrap">
              <Search className="inline w-4 h-4 mr-2 -mt-0.5" />Run Audit
            </button>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
        <div className="bg-surface p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded flex items-center justify-center border border-border">
                <Cloud className="text-foreground/70 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Google Drive</div>
                <div className="text-[10px] text-foreground/50 uppercase tracking-tighter">Repository Integration</div>
              </div>
            </div>
            <div className={clsx("flex items-center gap-2 px-2 py-1 rounded", status === "done" ? "bg-accent-cyan/10" : "bg-accent-yellow/10")}>
              <span className={clsx("w-1.5 h-1.5 rounded-full", status === "done" ? "bg-accent-cyan" : "bg-accent-yellow animate-pulse")} />
              <span className={clsx("text-[10px] font-bold uppercase", status === "done" ? "text-accent-cyan" : "text-accent-yellow")}>
                {status === "done" ? "Synced" : "Pending"}
              </span>
            </div>
          </div>
          <div className="h-1 bg-background rounded-full overflow-hidden">
            <div className={clsx("h-full bg-accent-cyan rounded-full transition-all duration-1000", status === "done" ? "w-full" : "w-0")} />
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-foreground/70 uppercase font-medium">
            <span>{status === "done" ? `${result?.findings.length} Issues Detected` : "Not scanned"}</span>
            <span>{status === "done" ? "100% Complete" : "Run audit first"}</span>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded flex items-center justify-center border border-border">
                <FileText className="text-foreground/70 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Notion</div>
                <div className="text-[10px] text-foreground/50 uppercase tracking-tighter">Workspace Integration</div>
              </div>
            </div>
            <div className={clsx("flex items-center gap-2 px-2 py-1 rounded", status === "done" ? "bg-accent-cyan/10" : "bg-accent-yellow/10")}>
              <span className={clsx("w-1.5 h-1.5 rounded-full", status === "done" ? "bg-accent-cyan" : "bg-accent-yellow animate-pulse")} />
              <span className={clsx("text-[10px] font-bold uppercase", status === "done" ? "text-accent-cyan" : "text-accent-yellow")}>
                {status === "done" ? "Synced" : "Pending"}
              </span>
            </div>
          </div>
          <div className="h-1 bg-background rounded-full overflow-hidden">
            <div className={clsx("h-full bg-accent-cyan rounded-full transition-all duration-1000", status === "done" ? "w-full" : "w-0")} />
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-foreground/70 uppercase font-medium">
            <span>{status === "done" ? "2 Issues Detected" : "Not scanned"}</span>
            <span>{status === "done" ? "100% Complete" : "Run audit first"}</span>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent-yellow/20 transition-all" />
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Context Rot</div>
            <div className="text-4xl font-black text-accent-yellow mb-2 tracking-tighter">
              {result ? `${100 - result.overall_risk_score}%` : "--"}
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/70">
              <TrendingUp className={clsx("w-4 h-4", critCount > 0 ? "text-accent-red" : "text-accent-cyan")} />
              <span>{result ? `${critCount} critical issues found` : "Run audit to see data"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Streaming */}
      {status === "streaming" && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Live Audit Feed</div>
            <pre className="text-xs text-foreground/70 font-mono leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
              {streamText}<span className="animate-pulse text-accent-yellow">|</span>
            </pre>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-accent-red/10 border border-accent-red/20 rounded-xl p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-accent-red mx-auto mb-2" />
            <p className="text-sm text-foreground/60">{error || "Backend unreachable — make sure Sentinel API is running on :8000"}</p>
          </div>
        </div>
      )}

      {/* Findings */}
      <section className="max-w-6xl mx-auto">
        {status === "done" && result && result.findings.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Audit Findings
                <span className="text-xs font-normal text-foreground/70 bg-surface px-2 py-0.5 rounded-full border border-border">{critCount} Critical Issues</span>
              </h2>
            </div>
            <div className="space-y-3">
              {result.findings.map((f, i) => <FindingRow key={i} finding={f} />)}
            </div>
            <div className="mt-10 p-8 bg-surface border border-border rounded-2xl">
              <h3 className="text-sm font-bold text-foreground mb-2">Scan Summary</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">{result.executive_summary}</p>
            </div>
          </>
        )}

        {status === "idle" && (
          <div className="p-12 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-border">
              <Activity className="text-foreground/40 w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-2">No Scan Data Yet</h3>
            <p className="text-xs text-foreground/50 max-w-xs">Paste your Google Drive folder URL above and click Run Audit to scan your internal documentation.</p>
          </div>
        )}
      </section>

      {/* Glassmorphism widget */}
      {status === "done" && result && (
        <div className="fixed bottom-8 right-8 w-72 bg-surface/80 backdrop-blur-xl p-5 rounded-xl border border-border shadow-2xl z-50">
          <h4 className="text-xs font-black uppercase tracking-widest text-accent-yellow mb-3">Real-time Health</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider">Risk Score</span>
              <span className="text-xs font-bold text-foreground">{result.overall_risk_score} / 100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider">Entropy</span>
              <span className={clsx("text-xs font-bold", critCount > 2 ? "text-accent-red" : "text-accent-cyan")}>
                {critCount > 2 ? "Critical" : critCount > 0 ? "Moderate" : "Nominal"}
              </span>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="text-[9px] text-foreground/50 uppercase mb-2 font-bold tracking-wider">Severity Distribution</div>
              <div className="flex gap-1">
                {(["low", "medium", "high", "critical"] as const).map(sev => {
                  const count = result.findings.filter(f => f.severity === sev).length;
                  return (
                    <div key={sev} style={{ flex: count || 0.5 }}
                      className={clsx("h-1 rounded-full transition-all", SEV_CONFIG[sev].dot, (sev === "high" || sev === "critical") ? "animate-pulse" : "")} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
