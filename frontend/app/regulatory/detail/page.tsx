"use client";
import { Info, AlertCircle, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function RegulatoryDetailPage() {
  return (
    <div className="flex flex-col h-full bg-background p-8 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto space-y-6">
        
        <Link href="/regulatory" className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Radar
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent-red mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">REGULATORY ALERT #REG-RJ-2023</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Rajasthan Platform-Based Gig Workers Act
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium bg-surface hover:bg-surface/80 border border-border rounded transition-colors text-foreground">
              Ignore
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-accent-yellow text-black hover:bg-accent-yellow/90 rounded transition-colors shadow-[0_0_15px_rgba(255,204,0,0.15)]">
              Acknowledge
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30 rounded transition-colors">
              Escalate to Legal & Finance
            </button>
          </div>
        </div>

        {/* Deep Dive Panel */}
        <div className="bg-surface/50 border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-foreground/80">
            <Info className="w-5 h-5 text-accent-red" />
            <h2 className="text-lg font-semibold">Regulatory Analysis</h2>
          </div>
          <p className="text-foreground/70 leading-relaxed mb-8 max-w-4xl">
            The Rajasthan government has enacted the Platform-Based Gig Workers (Registration and Welfare) Act. This mandates all aggregators and delivery platforms to register their gig workers onto a state database and deduct a mandatory "welfare fee" (1-2% of the per-transaction value) at the source. This fee is automatically routed to fund state social security boards. Failure to comply can result in fines up to ₹50 Lakhs per violation and suspension of app operations within the state.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Jurisdiction</div>
              <div className="font-medium text-foreground">Rajasthan (State)</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Enforcement Status</div>
              <div className="font-medium text-accent-yellow">Active Enforcement</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Severity</div>
              <div className="font-medium text-red-400">CRITICAL</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Est. Cost Impact</div>
              <div className="font-medium text-foreground">-1.5% Per-Order Margin</div>
            </div>
          </div>
        </div>

        {/* Operational Impact Grid */}
        <div className="bg-surface/50 border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-foreground/80">
            <Building2 className="w-5 h-5 text-accent-yellow" />
            <h2 className="text-lg font-semibold">Operational Impact Matrix</h2>
          </div>
          
          <div className="w-full">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="pb-3 font-semibold w-1/4">Business Unit</th>
                  <th className="pb-3 font-semibold w-1/4">Affected Process</th>
                  <th className="pb-3 font-semibold w-1/4">Required Action</th>
                  <th className="pb-3 font-semibold w-1/4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="group hover:bg-surface/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">Finance / Payroll</td>
                  <td className="py-4 text-foreground/70">Payment Settlement Engine</td>
                  <td className="py-4 text-foreground/70">Implement 1-2% source deduction logic per order</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-red-400 font-medium text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Urgent Dev Priority
                    </span>
                  </td>
                </tr>
                <tr className="group hover:bg-surface/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">Operations / HR</td>
                  <td className="py-4 text-foreground/70">Driver Onboarding</td>
                  <td className="py-4 text-foreground/70">Integrate with state gig worker database API</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-accent-yellow font-medium text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
                      Planning
                    </span>
                  </td>
                </tr>
                <tr className="group hover:bg-surface/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">Legal</td>
                  <td className="py-4 text-foreground/70">Partner Agreements</td>
                  <td className="py-4 text-foreground/70">Update T&Cs regarding welfare fee deductions</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-accent-cyan font-medium text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                      In Review
                    </span>
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
