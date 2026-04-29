"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, ArrowRight, Activity, Shield } from "lucide-react";
import { SentinelDigest, SENTINEL_STORAGE_KEY } from "@/lib/types";
import clsx from "clsx";
import Link from "next/link";

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className={clsx("text-[10px] font-black uppercase tracking-widest mb-1", color)}>{label}</div>
      <div className="text-3xl font-black text-foreground tracking-tighter">{value}</div>
      <div className="text-xs text-foreground/50 mt-1">{sub}</div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [digest, setDigest] = useState<SentinelDigest | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(SENTINEL_STORAGE_KEY);
    if (raw) {
      try { setDigest(JSON.parse(raw)); } catch {}
    }
    setLoaded(true);
  }, []);

  const hasData = !!digest;
  const allFindings = hasData ? [
    ...digest.vendor_risk.findings,
    ...digest.regulatory.findings,
    ...digest.knowledge_health.findings,
  ] : [];
  const critCount = allFindings.filter(f => f.severity === "critical").length;
  const highCount = allFindings.filter(f => f.severity === "high").length;
  const avgScore = hasData ? Math.round(
    (digest.vendor_risk.overall_risk_score + digest.regulatory.overall_risk_score + digest.knowledge_health.overall_risk_score) / 3
  ) : null;

  return (
    <div className="flex-1 p-8 pb-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Dashboard</h1>
            <p className="text-foreground/60 text-sm">
              {hasData ? "Live intelligence digest across your ecosystem." : "No analysis run yet — start one from Network Search."}
            </p>
          </div>
          <Link href="/network"
            className="flex items-center gap-2 bg-accent-yellow text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest hover:bg-accent-yellow/90 transition-all shadow-[0_0_20px_rgba(255,184,0,0.2)]">
            <Search className="w-4 h-4" /> New Analysis
          </Link>
        </div>
      </div>

      {/* Empty state */}
      {loaded && !hasData && (
        <div className="max-w-6xl mx-auto">
          <div className="p-16 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-surface border border-border rounded-full flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-foreground/30" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Sentinel is ready</h2>
            <p className="text-sm text-foreground/50 max-w-sm mb-8">
              Run your first analysis from the Network Search page. Provide vendors, industry, region, and your Drive folder URL.
            </p>
            <Link href="/network"
              className="bg-accent-yellow text-black font-black px-8 py-3 rounded-xl text-sm uppercase tracking-widest hover:bg-accent-yellow/90 transition-all shadow-[0_0_30px_rgba(255,184,0,0.2)]">
              Start Analysis →
            </Link>
          </div>
        </div>
      )}

      {/* Data state */}
      {loaded && hasData && (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Executive Summary */}
          <div className="bg-surface border border-border rounded-xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-accent-yellow" />
              <h2 className="text-xs font-black uppercase tracking-widest text-foreground/60">Executive Summary</h2>
            </div>
            <p className="text-foreground leading-relaxed">{digest!.executive_summary || digest!.vendor_risk.executive_summary}</p>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Overall Score" value={`${avgScore}`} sub="Higher = safer" color="text-accent-cyan" />
            <MetricCard label="Critical Signals" value={`${critCount}`} sub="Immediate action required" color="text-accent-red" />
            <MetricCard label="High Severity" value={`${highCount}`} sub="Review within 24h" color="text-accent-yellow" />
            <MetricCard label="Total Findings" value={`${allFindings.length}`} sub="Across all monitors" color="text-foreground/60" />
          </div>

          {/* Monitor breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { result: digest!.vendor_risk, label: "Vendor Risk", href: "/network/signals" },
              { result: digest!.regulatory, label: "Regulatory", href: "/network/signals" },
              { result: digest!.knowledge_health, label: "Knowledge Health", href: "/knowledge" },
            ].map(({ result, label, href }) => {
              const crit = result.findings.filter(f => f.severity === "critical" || f.severity === "high").length;
              return (
                <Link key={label} href={href} className="bg-surface border border-border rounded-xl p-6 hover:border-accent-yellow/30 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-foreground">{label}</h3>
                    <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-accent-yellow transition-colors" />
                  </div>
                  <div className="text-3xl font-black text-foreground mb-1">{result.overall_risk_score}<span className="text-sm font-normal text-foreground/50">/100</span></div>
                  <div className="text-[10px] text-foreground/50 uppercase tracking-widest mb-4">{crit} critical/high findings</div>
                  <div className="h-1 bg-background rounded-full overflow-hidden">
                    <div className={clsx("h-full rounded-full transition-all",
                      result.overall_risk_score > 70 ? "bg-accent-cyan" : result.overall_risk_score > 40 ? "bg-accent-yellow" : "bg-accent-red"
                    )} style={{ width: `${result.overall_risk_score}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Top findings */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Top Critical Findings</h2>
            <div className="space-y-3">
              {allFindings
                .filter(f => f.severity === "critical" || f.severity === "high")
                .slice(0, 5)
                .map((f, i) => (
                  <div key={i} className={clsx(
                    "bg-surface border-l-4 border-y border-r border-border rounded-xl p-5",
                    f.severity === "critical" ? "border-l-accent-red" : "border-l-accent-yellow"
                  )}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-foreground mb-1">{f.title}</div>
                        <div className="text-xs text-foreground/60">{f.summary.slice(0, 120)}{f.summary.length > 120 ? "..." : ""}</div>
                      </div>
                      <span className={clsx(
                        "shrink-0 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                        f.severity === "critical" ? "bg-accent-red/10 text-accent-red" : "bg-accent-yellow/10 text-accent-yellow"
                      )}>{f.severity}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
