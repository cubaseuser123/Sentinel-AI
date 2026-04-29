import { Info, BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ThreatReviewPage() {
  return (
    <div className="flex-1 p-6 md:p-12 pb-32 h-full overflow-y-auto">
      {/* Page Header & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
            <span className="text-foreground/50 text-xs font-bold uppercase tracking-widest">
              INCIDENT #992-ALPHA
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            Review Threat
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface/40 backdrop-blur-md text-foreground hover:bg-surface border border-border px-6 py-2 rounded text-sm font-medium transition-colors">
            Ignore
          </button>
          <button className="bg-accent-yellow text-black hover:bg-accent-yellow/90 px-6 py-2 rounded text-sm font-bold transition-colors shadow-[0_0_20px_rgba(255,184,0,0.15)]">
            Isolate Entity
          </button>
          <button className="bg-accent-red/10 text-accent-red hover:bg-accent-red hover:text-black border border-accent-red/20 px-6 py-2 rounded text-sm font-bold transition-colors">
            Escalate
          </button>
        </div>
      </div>

      {/* Single Column Layout Focus */}
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        {/* Narrative & Status Panel */}
        <div className="bg-surface rounded-xl p-8 border border-border shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Info className="text-accent-yellow w-5 h-5" />
            Executive Summary
          </h3>
          <p className="text-foreground/70 text-sm leading-relaxed mb-8">
            Anomalous data exfiltration detected originating from Terminal 4, Level B. Pattern matches known signatures associated with external actor group "Gorgon". Volume of transfer exceeds standard operational parameters by 400%.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Origin</span>
              <span className="text-sm text-foreground font-medium">Verified - Internal</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Vector</span>
              <span className="text-sm text-accent-yellow font-medium">Uncontained</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Risk Level</span>
              <span className="text-sm text-accent-red font-medium">CRITICAL</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Time Detected</span>
              <span className="text-sm text-foreground font-medium">04:22:19 UTC</span>
            </div>
          </div>
        </div>

        {/* Simplified Personnel Intel Grid */}
        <div className="bg-background p-8 rounded-xl border border-border shadow-[0_4px_40px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BadgeCheck className="text-accent-yellow w-5 h-5" />
              Implicated Personnel
            </h3>
            <button className="text-sm font-medium text-foreground/50 hover:text-accent-yellow transition-colors flex items-center gap-1">
              View Full Logs <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider border-b border-border">
                  <th className="pb-4 pl-2">Subject ID</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Clearance</th>
                  <th className="pb-4">Current Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="py-4 pl-2 font-medium text-foreground">OP-882-K</td>
                  <td className="py-4 text-foreground/70">Systems Analyst</td>
                  <td className="py-4 text-foreground/70">Level 4</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
                      <span className="text-accent-yellow font-medium text-xs">Under Investigation</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="py-4 pl-2 font-medium text-foreground">OP-119-L</td>
                  <td className="py-4 text-foreground/70">Data Courier</td>
                  <td className="py-4 text-foreground/70">Level 2</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                      <span className="text-accent-cyan font-medium text-xs">Cleared</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
