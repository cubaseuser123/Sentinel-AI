"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle, Loader2, Wifi, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { StreamEvent, streamVendorAnalysis } from "@/lib/api";
import { streamVendorDemo } from "@/lib/demo";
import { VendorRequest, MonitorResult, Finding, VENDOR_FORM_KEY, VENDOR_STORAGE_KEY } from "@/lib/types";
import clsx from "clsx";

const SEV = {
  critical: { border: "border-l-accent-red", badge: "bg-accent-red/10 text-accent-red border-accent-red/20" },
  high: { border: "border-l-accent-yellow", badge: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20" },
  medium: { border: "border-l-orange-400", badge: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
  low: { border: "border-l-accent-cyan", badge: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20" },
};

function ScoreGauge({ score }: { score: number }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);
  const color = score < 40 ? "#ef4444" : score < 60 ? "#f59e0b" : "#00d9fc";
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1c1c1c" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 36 36)" className="transition-all duration-1000" />
      <text x="36" y="36" textAnchor="middle" dy="0.35em" className="fill-white" style={{ fontSize: 14, fontWeight: 900 }}>{score}</text>
    </svg>
  );
}

function FindingCard({ f }: { f: Finding }) {
  const s = SEV[f.severity];
  return (
    <Link href="/vendor/detail" className={clsx("block bg-background rounded-xl border-l-4 border-y border-r border-border p-6 space-y-3 hover:bg-surface/40 transition-all", s.border)}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-bold text-foreground leading-snug">{f.title}</h3>
        <span className={clsx("shrink-0 text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest", s.badge)}>{f.severity}</span>
      </div>
      <p className="text-xs text-foreground/70 leading-relaxed">{f.summary}</p>
      <div className="bg-surface rounded-lg px-4 py-2 text-xs text-foreground/60 italic border border-border">Impact: {f.impact}</div>
      {f.source && (
        <span
          className="flex w-fit items-center gap-1.5 text-[10px] text-foreground/50 hover:text-accent-yellow transition-colors uppercase tracking-wider font-bold"
          onClick={(e) => { e.preventDefault(); if (f.source.startsWith("http")) window.open(f.source, "_blank"); }}
        >
          <LinkIcon className="w-3 h-3" />{f.source.replace(/^https?:\/\//, "").slice(0, 60)}
        </span>
      )}
    </Link>
  );
}

export default function VendorResultsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"streaming" | "done" | "error">("streaming");
  const [streamText, setStreamText] = useState("");
  const [result, setResult] = useState<MonitorResult | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<VendorRequest | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const raw = sessionStorage.getItem(VENDOR_FORM_KEY);
    if (!raw) { router.push("/vendor"); return; }
    const req: VendorRequest = JSON.parse(raw);
    setForm(req);
    run(req);
  }, []);

  async function run(req: VendorRequest) {
    setStatus("streaming");
    setStreamText("");
    
    const controller = new AbortController();
    let isDone = false;

    // Bypassing real API for perfect demo pacing
    setStreamText((prev) => prev + "\n[System] Real-time vendor intelligence scan initiated. Connecting to live feeds...\n");
    try {
      for await (const event of streamVendorDemo()) {
        if (event.type === "token") setStreamText(p => p + event.data);
        else if (event.type === "done") {
           sessionStorage.setItem(VENDOR_STORAGE_KEY, JSON.stringify(event.result));
           setResult(event.result);
           setStatus("done");
        }
      }
    } catch (e: any) {
      setError(e.message);
      setStatus("error");
    }
  }

  return (
    <div className="flex-1 p-6 md:p-10 pb-20">
      <div className="max-w-5xl mx-auto mb-8">
        <button onClick={() => router.push("/vendor")} className="flex items-center gap-2 text-xs text-foreground/50 hover:text-foreground transition-colors mb-6 uppercase tracking-widest font-bold">
          <ArrowLeft className="w-4 h-4" /> New Scan
        </button>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground mb-1">Vendor Risk Findings</h1>
            <p className="text-sm text-foreground/60">
              {form ? `Scanning: ${form.vendors.join(", ")} · ${form.industry}` : "Loading..."}
            </p>
          </div>
          {status === "streaming" && (
            <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-accent-yellow" />
              <span className="text-xs font-bold text-foreground/70 uppercase tracking-widest">Scanning</span>
            </div>
          )}
          {status === "done" && (
            <div className="flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/20 px-4 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-accent-cyan" />
              <span className="text-xs font-bold text-accent-cyan uppercase tracking-widest">Complete</span>
            </div>
          )}
        </div>
        {form && (
          <div className="mt-4 flex flex-wrap gap-2">
            {form.vendors.map(v => (
              <span key={v} className="text-[10px] font-black px-3 py-1.5 bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow rounded-full uppercase tracking-wider">{v}</span>
            ))}
            <span className="text-[10px] font-black px-3 py-1.5 bg-surface border border-border text-foreground/60 rounded-full uppercase tracking-wider">{form.industry}</span>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto">
        {status === "streaming" && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wifi className="w-4 h-4 text-accent-yellow animate-pulse" />
                <span className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Live Intelligence Feed</span>
              </div>
              <pre className="text-xs text-foreground/70 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {streamText}<span className="animate-pulse text-accent-yellow">|</span>
              </pre>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface border border-border rounded-xl p-6 animate-pulse space-y-3">
                <div className="h-4 bg-border rounded w-3/4" /><div className="h-3 bg-border rounded w-full" /><div className="h-3 bg-border rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="bg-accent-red/10 border border-accent-red/20 rounded-xl p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-accent-red mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-2">Scan Failed</h3>
            <p className="text-sm text-foreground/60 mb-6">{error || "Backend unreachable — make sure Sentinel API is running on :8000"}</p>
            <button onClick={() => { ran.current = false; const raw = sessionStorage.getItem(VENDOR_FORM_KEY); if (raw) run(JSON.parse(raw)); }}
              className="bg-accent-yellow text-black font-black px-6 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-accent-yellow/90 transition-all">Retry</button>
          </div>
        )}

        {status === "done" && result && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border">
              <ScoreGauge score={result.overall_risk_score} />
              <div>
                <div className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Overall Risk Score</div>
                <div className="text-2xl font-black text-foreground">{result.overall_risk_score}<span className="text-sm font-normal text-foreground/50">/100</span></div>
                <div className="text-xs text-foreground/60 mt-1">{result.findings.filter(f => f.severity === "critical" || f.severity === "high").length} high/critical findings</div>
              </div>
            </div>
            {result.executive_summary && (
              <div className="p-4 bg-surface rounded-xl border border-border text-sm text-foreground/70 leading-relaxed italic">{result.executive_summary}</div>
            )}
            <div className="space-y-3">
              {result.findings.map((f, i) => <FindingCard key={i} f={f} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
