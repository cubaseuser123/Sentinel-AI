"use client";
import { useEffect, useState } from "react";
import { Cloud, FileText, TrendingUp, Calendar, Folder, AlertTriangle, Link as LinkIcon, Activity, X, RefreshCw, Loader2, CheckCircle } from "lucide-react";
import { SentinelDigest, MonitorResult, Finding, SENTINEL_STORAGE_KEY } from "@/lib/types";
import clsx from "clsx";

const SEVERITY_CONFIG = {
  critical: { border: "border-l-accent-red", badge: "bg-accent-red/10 text-accent-red", dot: "bg-accent-red" },
  high: { border: "border-l-accent-yellow", badge: "bg-accent-yellow/20 text-accent-yellow", dot: "bg-accent-yellow" },
  medium: { border: "border-l-orange-400", badge: "bg-orange-400/10 text-orange-400", dot: "bg-orange-400" },
  low: { border: "border-l-border", badge: "bg-foreground/10 text-foreground/50", dot: "bg-foreground/30" },
};

function FindingRow({ finding }: { finding: Finding }) {
  const s = SEVERITY_CONFIG[finding.severity];
  return (
    <div className={clsx("bg-background p-5 rounded-xl border-l-4 border-y border-r border-border hover:bg-surface/40 transition-all flex items-center gap-6 group", s.border)}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-bold text-foreground tracking-tight">{finding.title}</span>
          <span className={clsx("text-[10px] font-black px-2 py-0.5 rounded uppercase", s.badge)}>
            {finding.severity}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-foreground/60">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> {finding.summary.slice(0, 80)}{finding.summary.length > 80 ? "..." : ""}
          </span>
          {finding.source && (
            <span className="flex items-center gap-1">
              <Folder className="w-3.5 h-3.5" /> {finding.source.replace(/^https?:\/\//, "").slice(0, 40)}
            </span>
          )}
        </div>
        <div className="mt-1.5 text-xs text-foreground/50 italic">{finding.impact}</div>
      </div>
      <button className="shrink-0 bg-background border border-border px-4 py-2 rounded-lg text-[10px] font-bold text-foreground uppercase tracking-widest hover:bg-border transition-all opacity-0 group-hover:opacity-100">
        Details
      </button>
    </div>
  );
}

export default function KnowledgeHealthPage() {
  const [digest, setDigest] = useState<SentinelDigest | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(SENTINEL_STORAGE_KEY);
    if (raw) {
      try { setDigest(JSON.parse(raw)); } catch {}
    }
    setLoaded(true);
  }, []);

  const kh = digest?.knowledge_health;
  const hasData = !!kh && kh.findings.length > 0;
  const critCount = kh?.findings.filter(f => f.severity === "critical" || f.severity === "high").length ?? 0;

  return (
    <div className="flex-1 p-8 min-h-screen relative">
      {/* Header */}
      <div className="mb-10 max-w-6xl mx-auto flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Knowledge Health</h1>
          <p className="text-foreground/70 text-sm">Monitoring structural integrity and contextual decay across connected intelligence sources.</p>
        </div>
        <div className="flex gap-3">
          {hasData ? (
            <div className="bg-surface px-4 py-2 rounded-lg flex items-center gap-3 border border-border">
              <CheckCircle className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Last Scan Complete</span>
            </div>
          ) : (
            <div className="bg-surface px-4 py-2 rounded-lg flex items-center gap-3 border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Awaiting Scan</span>
            </div>
          )}
        </div>
      </div>

      {/* Connection Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        {/* Sync Card 1 */}
        <div className="bg-surface p-6 rounded-xl border border-border hover:border-border/80 transition-all">
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
            <div className="flex items-center gap-2 px-2 py-1 bg-accent-cyan/10 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              <span className="text-[10px] font-bold text-accent-cyan uppercase">{hasData ? "Synced" : "Pending"}</span>
            </div>
          </div>
          <div className="h-1 bg-background rounded-full overflow-hidden">
            <div className={clsx("h-full bg-accent-cyan rounded-full transition-all duration-1000", hasData ? "w-full" : "w-0")} />
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-foreground/70 uppercase font-medium">
            <span>{hasData ? `${kh!.findings.length} Issues Detected` : "Not scanned"}</span>
            <span>{hasData ? "100% Complete" : "Run analysis first"}</span>
          </div>
        </div>

        {/* Sync Card 2 */}
        <div className="bg-surface p-6 rounded-xl border border-border hover:border-border/80 transition-all">
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
            <div className="flex items-center gap-2 px-2 py-1 bg-accent-yellow/10 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
              <span className="text-[10px] font-bold text-accent-yellow uppercase">Connected</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black text-foreground">
              {hasData ? kh!.overall_risk_score : "--"}
              <span className="text-sm font-normal text-foreground/50 ml-1">{hasData ? "/100" : ""}</span>
            </div>
            {hasData && (
              <div className={clsx("text-[10px] font-bold uppercase px-2 py-1 rounded",
                kh!.overall_risk_score > 70 ? "text-accent-cyan bg-accent-cyan/10" : "text-accent-red bg-accent-red/10"
              )}>
                {kh!.overall_risk_score > 70 ? "Healthy" : "At Risk"}
              </div>
            )}
          </div>
          <div className="mt-3 text-[10px] text-foreground/70 uppercase font-medium">
            {hasData ? `Score: ${kh!.overall_risk_score > 70 ? "Verified" : "Needs Attention"}` : "No data yet"}
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-surface p-6 rounded-xl border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent-yellow/20 transition-all" />
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Global Context Rot</div>
            <div className="text-4xl font-black text-accent-yellow mb-2 tracking-tighter">
              {hasData ? `${100 - kh!.overall_risk_score}%` : "--"}
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/70">
              <TrendingUp className={clsx("w-4 h-4", critCount > 0 ? "text-accent-red" : "text-accent-cyan")} />
              <span>{hasData ? `${critCount} critical issues found` : "Run analysis to see data"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Findings */}
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Audit Findings
            {hasData && (
              <span className="text-xs font-normal text-foreground/70 bg-surface px-2 py-0.5 rounded-full border border-border">
                {critCount} Critical Issues
              </span>
            )}
          </h2>
          {hasData && (
            <div className="flex gap-2">
              <button className="bg-surface border border-border text-foreground text-xs font-medium px-4 py-2 rounded-lg hover:bg-border transition-all">Filter: All</button>
              <button className="bg-surface border border-border text-foreground text-xs font-medium px-4 py-2 rounded-lg hover:bg-border transition-all">Sort: Severity</button>
            </div>
          )}
        </div>

        {!loaded && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-accent-yellow" />
          </div>
        )}

        {loaded && !hasData && (
          <div className="p-12 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-border">
              <Activity className="text-foreground/40 w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-2">No Scan Data Yet</h3>
            <p className="text-xs text-foreground/50 max-w-xs mb-6">
              Run a Network Search analysis with your Google Drive URL to generate Knowledge Health findings.
            </p>
            <a href="/network" className="bg-accent-yellow text-black font-black px-6 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-accent-yellow/90 transition-all">
              Run Analysis
            </a>
          </div>
        )}

        {loaded && hasData && (
          <div className="space-y-3">
            {kh!.findings.map((finding, i) => (
              <FindingRow key={i} finding={finding} />
            ))}
          </div>
        )}

        {/* Scan summary */}
        {loaded && hasData && (
          <div className="mt-12 p-8 bg-surface border border-border rounded-2xl">
            <h3 className="text-sm font-bold text-foreground mb-2">Scan Summary</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">{kh!.executive_summary}</p>
          </div>
        )}

        {/* Glassmorphism Panel */}
        {hasData && (
          <div className="fixed bottom-8 right-8 w-80 bg-surface/80 backdrop-blur-xl p-6 rounded-xl border border-border shadow-2xl z-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-accent-yellow">Real-time Health</h4>
              <X className="w-4 h-4 text-foreground/50 cursor-pointer hover:text-foreground transition-colors" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider">Risk Score</span>
                <span className="text-xs font-bold text-foreground">{kh!.overall_risk_score} / 100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider">Contextual Entropy</span>
                <span className={clsx("text-xs font-bold", critCount > 2 ? "text-accent-red" : "text-accent-cyan")}>
                  {critCount > 2 ? "Critical" : critCount > 0 ? "Moderate" : "Nominal"}
                </span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="text-[9px] text-foreground/50 uppercase mb-2 font-bold tracking-wider">Severity Distribution</div>
                <div className="flex gap-1">
                  {(["low", "medium", "high", "critical"] as const).map(sev => {
                    const count = kh!.findings.filter(f => f.severity === sev).length;
                    const total = kh!.findings.length;
                    return (
                      <div key={sev} style={{ flex: count || 0.5 }}
                        className={clsx("h-1 rounded-full transition-all", SEVERITY_CONFIG[sev].dot,
                          sev === "high" || sev === "critical" ? "animate-pulse" : "")} />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
