import Link from "next/link";

export default function ThreatCard() {
  return (
    <div className="bg-[#1C1C1C] rounded-xl border-l-4 border-l-[#FFC107] border-y border-r border-border p-6 shadow-2xl relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-accent-red/10 transition-colors duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-surface rounded flex items-center justify-center shrink-0 border border-border">
            <div className="w-6 h-6 bg-[#635BFF] rounded-sm flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">S</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold leading-tight max-w-[300px]">Stripe — Aggressive Fraud Team Hiring</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">Vendor Monitoring</span>
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">12m ago</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">
            Critical Risk
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_var(--color-accent-cyan)] animate-pulse" />
            <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider">High Confidence</span>
          </div>
        </div>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/80 mb-8 max-w-2xl relative z-10">
        Huge spikes in fraud team hires suggest a recent breach. Sentinel AI has detected a <span className="text-foreground font-semibold">450% increase</span> in senior security investigator roles opened within the last 48 hours, concentrated in the Dublin and San Francisco offices.
      </p>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-surface border-2 border-[#1C1C1C] flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600" />
            </div>
            <div className="w-8 h-8 rounded-full bg-surface border-2 border-[#1C1C1C] flex items-center justify-center">
              <span className="text-[10px] font-bold text-foreground/60">+3</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/threat" className="inline-block bg-accent-yellow text-black px-6 py-2 rounded text-xs font-black uppercase tracking-wider hover:bg-accent-yellow/90 transition-colors shadow-[0_0_15px_rgba(255,184,0,0.2)]">
            Review Threat
          </Link>
          <button className="text-xs font-bold text-foreground/50 hover:text-foreground transition-colors uppercase tracking-wider">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
