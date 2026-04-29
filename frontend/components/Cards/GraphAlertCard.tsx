import { Share2 } from "lucide-react";

export default function GraphAlertCard() {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 relative overflow-hidden group hover:border-border/80 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-4 h-4 text-accent-cyan" />
        <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">Graph Alert</span>
      </div>

      <h3 className="text-base font-bold leading-tight mb-2">Unusual Traffic Path</h3>
      <p className="text-xs leading-relaxed text-foreground/60">
        Shadow-IT detection: Employee "jsmith_admin" connected to unverified...
      </p>
    </div>
  );
}
