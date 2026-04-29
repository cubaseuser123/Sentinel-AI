"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, TrendingDown, FileText, Server, ArrowLeft,
  CheckCircle, Clock, Loader2, Wifi, Link as LinkIcon,
} from "lucide-react";
import { streamAnalysis, StreamEvent } from "@/lib/api";
import {
  AnalyzeRequest, Finding, MonitorResult,
  SENTINEL_FORM_KEY, SENTINEL_STORAGE_KEY,
} from "@/lib/types";
import clsx from "clsx";

const SEVERITY_CONFIG = {
  critical: { color: "text-accent-red", border: "border-l-accent-red", badge: "bg-accent-red/10 text-accent-red border-accent-red/20", bar: "bg-accent-red" },
  high: { color: "text-accent-yellow", border: "border-l-accent-yellow", badge: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20", bar: "bg-accent-yellow" },
  medium: { color: "text-orange-400", border: "border-l-orange-400", badge: "bg-orange-400/10 text-orange-400 border-orange-400/20", bar: "bg-orange-400" },
  low: { color: "text-accent-cyan", border: "border-l-accent-cyan", badge: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20", bar: "bg-accent-cyan" },
};

function ScoreGauge({ score }: { score: number }) {
  const risk = 100 - score;
  const r = 28, circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);
  const color = score < 40 ? "#ef4444" : score < 60 ? "#f59e0b" : "#00d9fc";
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1c1c1c" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 36 36)" className="transition-all duration-1000" />
      <text x="36" y="36" textAnchor="middle" dy="0.35em" className="fill-white text-sm font-black" style={{ fontSize: 14, fontWeight: 900 }}>
        {score}
      </text>
    </svg>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const s = SEVERITY_CONFIG[finding.severity];
  return (
    <div className={clsx("bg-background rounded-xl border-l-4 border-y border-r border-border p-6 space-y-3 hover:bg-surface/40 transition-all", s.border)}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-bold text-foreground leading-snug">{finding.title}</h3>
        <span className={clsx("shrink-0 text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest", s.badge)}>
          {finding.severity}
        </span>
      </div>
      <p className="text-xs text-foreground/70 leading-relaxed">{finding.summary}</p>
      <div className="bg-surface rounded-lg px-4 py-2 text-xs text-foreground/60 italic border border-border">
        Impact: {finding.impact}
      </div>
      {finding.source && (
        <a href={finding.source.startsWith("http") ? finding.source : undefined}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] text-foreground/50 hover:text-accent-yellow transition-colors uppercase tracking-wider font-bold">
          <LinkIcon className="w-3 h-3" />{finding.source.replace(/^https?:\/\//, "").slice(0, 60)}
        </a>
      )}
    </div>
  );
}

function MonitorSection({ result }: { result: MonitorResult }) {
  const critCount = result.findings.filter(f => f.severity === "critical" || f.severity === "high").length;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border">
        <ScoreGauge score={result.overall_risk_score} />
        <div>
          <div className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Overall Risk Score</div>
          <div className="text-2xl font-black text-foreground">{result.overall_risk_score}<span className="text-sm font-normal text-foreground/50">/100</span></div>
          <div className="text-xs text-foreground/60 mt-1">{critCount} high/critical findings</div>
        </div>
      </div>
      {result.executive_summary && (
        <div className="p-4 bg-surface rounded-xl border border-border text-sm text-foreground/70 leading-relaxed italic">
          {result.executive_summary}
        </div>
      )}
      <div className="space-y-3">
        {result.findings.map((f, i) => <FindingCard key={i} finding={f} />)}
      </div>
    </div>
  );
}

export default function SignalsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const [streamText, setStreamText] = useState("");
  const [vendorResult, setVendorResult] = useState<MonitorResult | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<AnalyzeRequest | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const raw = sessionStorage.getItem(SENTINEL_FORM_KEY);
    if (!raw) { router.push("/network"); return; }
    const req: AnalyzeRequest = JSON.parse(raw);
    setForm(req);
    runAnalysis(req);
  }, []);

  async function runAnalysis(req: AnalyzeRequest) {
    setStatus("streaming");
    setStreamText("");
    try {
      for await (const event of streamAnalysis(req)) {
        if (event.type === "token") {
          setStreamText(prev => prev + event.data);
        } else if (event.type === "done") {
          const digest = event.digest;
          sessionStorage.setItem(SENTINEL_STORAGE_KEY, JSON.stringify(digest));
          setVendorResult(digest.vendor_risk);
          setStatus("done");
        } else {
          setError(event.error);
          setStatus("error");
        }
      }
    } catch (e: any) {
      setError(e.message);
      setStatus("error");
    }
  }

  return (
    <div className="flex-1 p-6 md:p-10 pb-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <button onClick={() => router.push("/network")} className="flex items-center gap-2 text-xs text-foreground/50 hover:text-foreground transition-colors mb-6 uppercase tracking-widest font-bold">
          <ArrowLeft className="w-4 h-4" /> New Search
        </button>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground mb-1">Active Risk Signals</h1>
            <p className="text-sm text-foreground/60">
              {form ? `Monitoring ${form.vendors.join(", ")} · ${form.industry} · ${form.region}` : "Loading..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {status === "streaming" && (
              <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-accent-yellow" />
                <span className="text-xs font-bold text-foreground/70 uppercase tracking-widest">Analyzing</span>
              </div>
            )}
            {status === "done" && (
              <div className="flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/20 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4 text-accent-cyan" />
                <span className="text-xs font-bold text-accent-cyan uppercase tracking-widest">Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Vendor chips */}
        {form && (
          <div className="mt-4 flex flex-wrap gap-2">
            {form.vendors.map(v => (
              <span key={v} className="text-[10px] font-black px-3 py-1.5 bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow rounded-full uppercase tracking-wider">
                {v}
              </span>
            ))}
            <span className="text-[10px] font-black px-3 py-1.5 bg-surface border border-border text-foreground/60 rounded-full uppercase tracking-wider">
              {form.industry}
            </span>
            <span className="text-[10px] font-black px-3 py-1.5 bg-surface border border-border text-foreground/60 rounded-full uppercase tracking-wider">
              {form.region}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Streaming phase */}
        {status === "streaming" && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wifi className="w-4 h-4 text-accent-yellow animate-pulse" />
                <span className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Live Stream</span>
              </div>
              <pre className="text-xs text-foreground/70 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {streamText}
                <span className="animate-pulse text-accent-yellow">|</span>
              </pre>
            </div>
            {/* Skeleton cards */}
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface border border-border rounded-xl p-6 animate-pulse space-y-3">
                <div className="h-4 bg-border rounded w-3/4" />
                <div className="h-3 bg-border rounded w-full" />
                <div className="h-3 bg-border rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="bg-accent-red/10 border border-accent-red/20 rounded-xl p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-accent-red mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-2">Analysis Failed</h3>
            <p className="text-sm text-foreground/60 mb-6">{error || "Backend unreachable — make sure the Sentinel API is running on :8000"}</p>
            <button onClick={() => { ran.current = false; const raw = sessionStorage.getItem(SENTINEL_FORM_KEY); if (raw) runAnalysis(JSON.parse(raw)); }}
              className="bg-accent-yellow text-black font-black px-6 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-accent-yellow/90 transition-all">
              Retry
            </button>
          </div>
        )}

        {/* Results */}
        {status === "done" && vendorResult && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-lg font-bold text-foreground">Vendor Risk Findings</h2>
              <span className="text-xs font-normal text-foreground/50 bg-surface border border-border px-2 py-0.5 rounded-full">
                {vendorResult.findings.length} signals
              </span>
            </div>
            <MonitorSection result={vendorResult} />
            <div className="mt-8 p-6 border border-dashed border-border rounded-2xl text-center">
              <p className="text-xs text-foreground/50 mb-3">Regulatory and Knowledge Health findings are available in the Knowledge Health page.</p>
              <a href="/knowledge" className="text-xs font-bold text-accent-yellow hover:underline uppercase tracking-widest">
                View Knowledge Health →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
