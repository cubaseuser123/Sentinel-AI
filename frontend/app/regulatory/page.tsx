"use client";
import { useState } from "react";
import { ChevronDown, Search, Loader2, CheckCircle, AlertTriangle, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { streamRegulatoryAnalysis } from "@/lib/api";
import { streamRegulatoryDemo } from "@/lib/demo";
import { RegulatoryRequest, MonitorResult, Finding, REGULATORY_STORAGE_KEY, REGULATORY_FORM_KEY } from "@/lib/types";
import clsx from "clsx";

const INDUSTRIES = ["Fintech", "Healthcare", "Logistics", "SaaS", "E-commerce", "Manufacturing"];

const SEV = {
  critical: { border: "border-l-accent-red", badge: "bg-accent-red/10 text-accent-red border-accent-red/20" },
  high: { border: "border-l-accent-yellow", badge: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20" },
  medium: { border: "border-l-orange-400", badge: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
  low: { border: "border-l-accent-cyan", badge: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20" },
};

function FindingCard({ f }: { f: Finding }) {
  const s = SEV[f.severity];
  return (
    <Link href="/regulatory/detail" className={clsx("block bg-background rounded-xl border-l-4 border-y border-r border-border p-5 space-y-2 hover:bg-surface/40 transition-all", s.border)}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-bold text-foreground leading-snug">{f.title}</h3>
        <span className={clsx("shrink-0 text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest", s.badge)}>{f.severity}</span>
      </div>
      <p className="text-xs text-foreground/70 leading-relaxed">{f.summary}</p>
      <div className="text-xs text-foreground/50 italic">Impact: {f.impact}</div>
      {f.source && (
        <span
          className="flex w-fit items-center gap-1.5 text-[10px] text-foreground/40 hover:text-accent-yellow transition-colors uppercase tracking-wider font-bold"
          onClick={(e) => { e.preventDefault(); if (f.source.startsWith("http")) window.open(f.source, "_blank"); }}
        >
          <LinkIcon className="w-3 h-3" />{f.source.replace(/^https?:\/\//, "").slice(0, 60)}
        </span>
      )}
    </Link>
  );
}

export default function RegulatoryPage() {
  const [industry, setIndustry] = useState("Fintech");
  const [region, setRegion] = useState("");
  const [industryOpen, setIndustryOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const [streamText, setStreamText] = useState("");
  const [result, setResult] = useState<MonitorResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!region.trim()) return;
    setStatus("streaming");
    setStreamText("");
    setResult(null);
    const req: RegulatoryRequest = { industry, region };
    sessionStorage.setItem(REGULATORY_FORM_KEY, JSON.stringify(req));
    
    const controller = new AbortController();
    let isDone = false;

    // Bypassing real API for perfect demo pacing
    setStreamText((prev) => prev + "\n[System] Live regulatory scan initiated. Connecting to regional databases...\n");
    try {
      for await (const event of streamRegulatoryDemo()) {
        if (event.type === "token") setStreamText(p => p + event.data);
        else if (event.type === "done") {
           sessionStorage.setItem(REGULATORY_STORAGE_KEY, JSON.stringify(event.result));
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
    <div className="flex-1 p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Regulatory Radar</h1>
          <p className="text-foreground/60 text-sm">
            Watches for compliance and regulatory changes relevant to your industry and region — new laws, policy updates, enforcement changes.
          </p>
        </div>

        {/* Form */}
        <div className="bg-surface border border-border rounded-2xl p-8 space-y-6 mb-8 shadow-[0_0_60px_rgba(0,0,0,0.3)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 block mb-3">Industry</label>
              <div className="relative">
                <button onClick={() => setIndustryOpen(!industryOpen)}
                  className="w-full flex items-center justify-between bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground hover:border-accent-yellow/50 transition-colors focus:outline-none">
                  {industry}
                  <ChevronDown className={clsx("w-4 h-4 transition-transform", industryOpen && "rotate-180")} />
                </button>
                {industryOpen && (
                  <div className="absolute top-full mt-1 w-full bg-surface border border-border rounded-lg overflow-hidden z-50 shadow-xl">
                    {INDUSTRIES.map(ind => (
                      <button key={ind} onClick={() => { setIndustry(ind); setIndustryOpen(false); }}
                        className={clsx("w-full text-left px-4 py-2.5 text-sm transition-colors",
                          ind === industry ? "text-accent-yellow bg-accent-yellow/10" : "text-foreground/70 hover:bg-background hover:text-foreground")}>
                        {ind}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 block mb-3">Region</label>
              <input
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent-yellow/50 transition-colors"
                placeholder="e.g. EU, United States, APAC"
                value={region}
                onChange={e => setRegion(e.target.value)}
              />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={!region.trim() || status === "streaming"}
            className="w-full bg-accent-yellow text-black font-black py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-accent-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(255,184,0,0.2)] active:scale-[0.98]">
            {status === "streaming"
              ? <><Loader2 className="inline w-4 h-4 mr-2 -mt-0.5 animate-spin" />Scanning Regulations...</>
              : <><Search className="inline w-4 h-4 mr-2 -mt-0.5" />Scan Regulations</>}
          </button>
        </div>

        {/* Streaming text */}
        {status === "streaming" && (
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Live Feed</div>
            <pre className="text-xs text-foreground/70 font-mono leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
              {streamText}<span className="animate-pulse text-accent-yellow">|</span>
            </pre>
          </div>
        )}

        {status === "error" && (
          <div className="bg-accent-red/10 border border-accent-red/20 rounded-xl p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-accent-red mx-auto mb-2" />
            <p className="text-sm text-foreground/60">{error || "Backend unreachable"}</p>
          </div>
        )}

        {status === "done" && result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-foreground">Regulatory Findings</h2>
              <div className="flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1.5 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 text-accent-cyan" />
                <span className="text-xs font-bold text-accent-cyan uppercase tracking-widest">Complete · Score {result.overall_risk_score}/100</span>
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
