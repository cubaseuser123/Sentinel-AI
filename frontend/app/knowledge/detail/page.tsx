"use client";
import { Info, AlertCircle, ArrowLeft, Building2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function KnowledgeDetailPage() {
  return (
    <div className="flex flex-col h-full bg-background p-8 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto space-y-6">
        
        <Link href="/knowledge" className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Knowledge Health
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent-red mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">KNOWLEDGE ALERT #KNW-2026-MISSING</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Missing: Fleet Accident & Hazmat Spill Response Plan
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium bg-surface hover:bg-surface/80 border border-border rounded transition-colors text-foreground">
              Ignore
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-accent-yellow text-black hover:bg-accent-yellow/90 rounded transition-colors shadow-[0_0_15px_rgba(255,204,0,0.15)]">
              Assign to Operations
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30 rounded transition-colors">
              Escalate to Legal
            </button>
          </div>
        </div>

        {/* Deep Dive Panel */}
        <div className="bg-surface/50 border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-foreground/80">
            <Info className="w-5 h-5 text-accent-red" />
            <h2 className="text-lg font-semibold">Knowledge Gap Analysis</h2>
          </div>
          <p className="text-foreground/70 leading-relaxed mb-8 max-w-4xl">
            A comprehensive scan across connected Google Drive and Notion workspaces failed to locate any documentation covering emergency protocols for commercial vehicle accidents or hazardous material spills. Under Department of Transportation (DOT) and FMCSA guidelines, this documentation is a strict regulatory requirement for fleet operators. The complete absence of an incident response playbook creates an extreme legal and operational liability in the event of an active driver incident.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Platform</div>
              <div className="font-medium text-foreground">Google Drive & Notion</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Document Type</div>
              <div className="font-medium text-accent-yellow">Standard Operating Procedure (SOP)</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Severity</div>
              <div className="font-medium text-red-400">CRITICAL</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Compliance Risk</div>
              <div className="font-medium text-foreground">DOT FMCSA Violation</div>
            </div>
          </div>
        </div>

        {/* Operational Impact Grid */}
        <div className="bg-surface/50 border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-foreground/80">
            <ShieldAlert className="w-5 h-5 text-accent-yellow" />
            <h2 className="text-lg font-semibold">Remediation Action Matrix</h2>
          </div>
          
          <div className="w-full">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="pb-3 font-semibold w-1/4">Assigned Team</th>
                  <th className="pb-3 font-semibold w-1/4">Required Artifact</th>
                  <th className="pb-3 font-semibold w-1/4">Remediation Action</th>
                  <th className="pb-3 font-semibold w-1/4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="group hover:bg-surface/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">Legal Counsel</td>
                  <td className="py-4 text-foreground/70">Liability & Reporting Protocol</td>
                  <td className="py-4 text-foreground/70">Draft legal reporting requirements for state and federal DOT</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-red-400 font-medium text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Urgent Review
                    </span>
                  </td>
                </tr>
                <tr className="group hover:bg-surface/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">Fleet Operations</td>
                  <td className="py-4 text-foreground/70">Driver Incident Checklist</td>
                  <td className="py-4 text-foreground/70">Create a step-by-step emergency checklist for all vehicle gloveboxes</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-accent-yellow font-medium text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
                      In Progress
                    </span>
                  </td>
                </tr>
                <tr className="group hover:bg-surface/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">Human Resources</td>
                  <td className="py-4 text-foreground/70">Training Module</td>
                  <td className="py-4 text-foreground/70">Schedule mandatory driver retraining on the new incident protocol</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-accent-cyan font-medium text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                      Planning
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
