"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Radio, BookOpen, ArrowRight, Shield } from "lucide-react";
import { MonitorResult, VENDOR_STORAGE_KEY, REGULATORY_STORAGE_KEY, KNOWLEDGE_STORAGE_KEY } from "@/lib/types";
import clsx from "clsx";
import Link from "next/link";

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="h-1 bg-background rounded-full overflow-hidden mt-3">
      <div className={clsx("h-full rounded-full transition-all",
        score > 70 ? "bg-accent-cyan" : score > 40 ? "bg-accent-yellow" : "bg-accent-red"
      )} style={{ width: `${score}%` }} />
    </div>
  );
}

function MonitorCard({ result, label, href, icon: Icon }: { result: MonitorResult; label: string; href: string; icon: any }) {
  const crit = result.findings.filter(f => f.severity === "critical" || f.severity === "high").length;
  return (
    <Link href={href} className="bg-surface border border-border rounded-xl p-6 hover:border-accent-yellow/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-foreground/40" />
          <h3 className="text-sm font-bold text-foreground">{label}</h3>
        </div>
        <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-accent-yellow transition-colors" />
      </div>
      <div className="text-3xl font-black text-foreground mb-1">{result.overall_risk_score}<span className="text-sm font-normal text-foreground/50">/100</span></div>
      <div className="text-[10px] text-foreground/50 uppercase tracking-widest">{crit} critical/high findings</div>
      <ScoreBar score={result.overall_risk_score} />
    </Link>
  );
}

function EmptyCard({ label, href, icon: Icon, description }: { label: string; href: string; icon: any; description: string }) {
  return (
    <Link href={href} className="bg-surface border border-dashed border-border rounded-xl p-6 hover:border-accent-yellow/30 transition-all group flex flex-col items-center justify-center text-center min-h-[160px]">
      <Icon className="w-6 h-6 text-foreground/20 mb-3 group-hover:text-accent-yellow/40 transition-colors" />
      <div className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-xs text-foreground/30">{description}</div>
      <div className="mt-3 text-[10px] font-black text-accent-yellow/60 uppercase tracking-widest group-hover:text-accent-yellow transition-colors">Run Now →</div>
    </Link>
  );
}

export default function DashboardPage() {
  const [vendor, setVendor] = useState<MonitorResult | null>(null);
  const [regulatory, setRegulatory] = useState<MonitorResult | null>(null);
  const [knowledge, setKnowledge] = useState<MonitorResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = sessionStorage.getItem(VENDOR_STORAGE_KEY);
    const r = sessionStorage.getItem(REGULATORY_STORAGE_KEY);
    const k = sessionStorage.getItem(KNOWLEDGE_STORAGE_KEY);
    if (v) try { setVendor(JSON.parse(v)); } catch {}
    if (r) try { setRegulatory(JSON.parse(r)); } catch {}
    if (k) try { setKnowledge(JSON.parse(k)); } catch {}
    setLoaded(true);
  }, []);

  const hasAny = !!(vendor || regulatory || knowledge);
  const allFindings = [
    ...(vendor?.findings ?? []),
    ...(regulatory?.findings ?? []),
    ...(knowledge?.findings ?? []),
  ];
  const critCount = allFindings.filter(f => f.severity === "critical").length;
  const highCount = allFindings.filter(f => f.severity === "high").length;
  const scores = [vendor, regulatory, knowledge].filter(Boolean).map(r => r!.overall_risk_score);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <div className="flex-1 p-8 pb-20">
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Dashboard</h1>
            <p className="text-foreground/60 text-sm">
              {hasAny ? "Live intelligence digest across your ecosystem." : "No scans run yet — start from any feature below."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Metrics */}
        {hasAny && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Avg Score", value: avgScore !== null ? `${avgScore}` : "--", sub: "Higher = safer", color: "text-accent-cyan" },
              { label: "Critical Signals", value: `${critCount}`, sub: "Immediate action required", color: "text-accent-red" },
              { label: "High Severity", value: `${highCount}`, sub: "Review within 24h", color: "text-accent-yellow" },
              { label: "Total Findings", value: `${allFindings.length}`, sub: "Across all monitors", color: "text-foreground/60" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="bg-surface border border-border rounded-xl p-6">
                <div className={clsx("text-[10px] font-black uppercase tracking-widest mb-1", color)}>{label}</div>
                <div className="text-3xl font-black text-foreground tracking-tighter">{value}</div>
                <div className="text-xs text-foreground/50 mt-1">{sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Monitor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendor
            ? <MonitorCard result={vendor} label="Vendor Risk" href="/vendor" icon={ShieldAlert} />
            : <EmptyCard label="Vendor Risk" href="/vendor" icon={ShieldAlert} description="Scan your vendors for breaches, layoffs, and outages" />
          }
          {regulatory
            ? <MonitorCard result={regulatory} label="Regulatory Radar" href="/regulatory" icon={Radio} />
            : <EmptyCard label="Regulatory Radar" href="/regulatory" icon={Radio} description="Monitor compliance changes for your industry and region" />
          }
          {knowledge
            ? <MonitorCard result={knowledge} label="Knowledge Health" href="/knowledge" icon={BookOpen} />
            : <EmptyCard label="Knowledge Health" href="/knowledge" icon={BookOpen} description="Audit your Google Drive for stale docs and missing SOPs" />
          }
        </div>

        {/* Top findings */}
        {hasAny && allFindings.filter(f => f.severity === "critical" || f.severity === "high").length > 0 && (
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
        )}

        {/* Empty state */}
        {loaded && !hasAny && (
          <div className="p-16 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-surface border border-border rounded-full flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-foreground/30" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Sentinel is ready</h2>
            <p className="text-sm text-foreground/50 max-w-sm mb-8">
              Run any of the three features independently. Each gives you a separate intelligence report.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "Vendor Risk", href: "/vendor" },
                { label: "Regulatory Radar", href: "/regulatory" },
                { label: "Knowledge Health", href: "/knowledge" },
              ].map(({ label, href }) => (
                <Link key={href} href={href}
                  className="bg-accent-yellow text-black font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest hover:bg-accent-yellow/90 transition-all">
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
