"use client";
import { Info, AlertCircle, ArrowLeft, Building2, Truck } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function VendorDetailPage() {
  return (
    <div className="flex flex-col h-full bg-background p-8 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto space-y-6">
        
        <Link href="/vendor/results" className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vendor Results
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent-red mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">VENDOR ALERT #VND-2026-FDX</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Imminent Union Walkout in Midwest Hubs
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
              Escalate to Supply Chain
            </button>
          </div>
        </div>

        {/* Deep Dive Panel */}
        <div className="bg-surface/50 border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-foreground/80">
            <Info className="w-5 h-5 text-accent-red" />
            <h2 className="text-lg font-semibold">Threat Analysis</h2>
          </div>
          <p className="text-foreground/70 leading-relaxed mb-8 max-w-4xl">
            Contract negotiations between FedEx Ground and the Transport Workers Union have completely broken down as of this week. The union has officially authorized a coordinated walkout starting next Tuesday. The strike will severely limit operations across 4 major distribution centers: Chicago, Memphis, Indianapolis, and Detroit. Given the upcoming peak window, this presents an immediate existential threat to our delivery SLAs in the Midwest and East Coast corridors.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Vendor</div>
              <div className="font-medium text-foreground">FedEx Ground</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Impact Date</div>
              <div className="font-medium text-accent-yellow">Next Tuesday</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Severity</div>
              <div className="font-medium text-red-400">CRITICAL</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground/50 tracking-wider uppercase mb-1">Est. Delay</div>
              <div className="font-medium text-foreground">48-72 Hours</div>
            </div>
          </div>
        </div>

        {/* Operational Impact Grid */}
        <div className="bg-surface/50 border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-foreground/80">
            <Truck className="w-5 h-5 text-accent-yellow" />
            <h2 className="text-lg font-semibold">Supply Chain Mitigation Matrix</h2>
          </div>
          
          <div className="w-full">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="pb-3 font-semibold w-1/4">Affected Node</th>
                  <th className="pb-3 font-semibold w-1/4">Process Risk</th>
                  <th className="pb-3 font-semibold w-1/4">Required Action</th>
                  <th className="pb-3 font-semibold w-1/4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="group hover:bg-surface/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">Chicago Hub</td>
                  <td className="py-4 text-foreground/70">Last-Mile Delivery</td>
                  <td className="py-4 text-foreground/70">Reroute 15% of volume to UPS</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-red-400 font-medium text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Urgent Review
                    </span>
                  </td>
                </tr>
                <tr className="group hover:bg-surface/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">Memphis Hub</td>
                  <td className="py-4 text-foreground/70">National Sorting</td>
                  <td className="py-4 text-foreground/70">Alert priority customers of SLA breaks</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-accent-yellow font-medium text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
                      Planning
                    </span>
                  </td>
                </tr>
                <tr className="group hover:bg-surface/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">Indianapolis</td>
                  <td className="py-4 text-foreground/70">Ground Freight</td>
                  <td className="py-4 text-foreground/70">Activate secondary 3PL contracts</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-accent-yellow font-medium text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
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
