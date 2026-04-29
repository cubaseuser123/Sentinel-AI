import { Filter, Download, Plus, X } from "lucide-react";
import ThreatCard from "../Cards/ThreatCard";
import MetricCard from "../Cards/MetricCard";
import GraphAlertCard from "../Cards/GraphAlertCard";
import PulseCard from "../Cards/PulseCard";

export default function RiskFeed() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      {/* Filter Chips */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer hover:border-foreground/20 transition-colors">
          <div className="w-3 h-3 bg-[#635BFF] rounded-sm flex items-center justify-center">
            <span className="text-[8px] text-white font-bold leading-none">S</span>
          </div>
          <span>Stripe</span>
          <X className="w-3 h-3 text-foreground/50 hover:text-foreground" />
        </div>

        <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer hover:border-foreground/20 transition-colors">
          <div className="w-3 h-3 bg-[#FF9900] rounded-sm flex items-center justify-center">
            <span className="text-[8px] text-white font-bold leading-none">A</span>
          </div>
          <span>AWS</span>
          <X className="w-3 h-3 text-foreground/50 hover:text-foreground" />
        </div>

        <button className="flex items-center gap-1.5 text-accent-yellow text-xs font-bold ml-2 hover:opacity-80 transition-opacity">
          <Plus className="w-3 h-3" />
          New Watchlist
        </button>
      </div>

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-1">Risk Feed</h2>
          <p className="text-sm text-foreground/60">Live intelligence across your ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-xs font-bold text-foreground/70 hover:text-foreground transition-colors uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-foreground/70 hover:text-foreground transition-colors uppercase tracking-wider">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ThreatCard />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GraphAlertCard />
            <PulseCard />
          </div>
        </div>
        <div className="md:col-span-1 space-y-6">
          <MetricCard />
        </div>
      </div>
    </div>
  );
}
