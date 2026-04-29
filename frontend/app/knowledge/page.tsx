import { Cloud, FileText, TrendingUp, Calendar, Folder, AlertTriangle, Link as LinkIcon, GitMerge, Activity, X } from "lucide-react";

export default function KnowledgeHealthPage() {
  return (
    <div className="flex-1 p-8 min-h-screen relative">
      {/* Header */}
      <div className="mb-10 max-w-6xl mx-auto flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Knowledge Health</h1>
          <p className="text-foreground/70 text-sm">Monitoring structural integrity and contextual decay across connected intelligence sources.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface px-4 py-2 rounded-lg flex items-center gap-3 border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_var(--color-accent-cyan)]" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Active Scan</span>
          </div>
        </div>
      </div>

      {/* Connection Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        {/* Sync Card 1 */}
        <div className="bg-surface p-6 rounded-xl border border-border hover:border-border/80 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded flex items-center justify-center border border-border">
                <Cloud className="text-foreground/70 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Google Drive</div>
                <div className="text-[10px] text-foreground/50 uppercase tracking-tighter">Repository Integration</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-accent-cyan/10 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              <span className="text-[10px] font-bold text-accent-cyan uppercase">Syncing</span>
            </div>
          </div>
          <div className="h-1 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-accent-cyan w-[74%] rounded-full" />
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-foreground/70 uppercase font-medium">
            <span>94.2k Objects Indexed</span>
            <span>74% Complete</span>
          </div>
        </div>

        {/* Sync Card 2 */}
        <div className="bg-surface p-6 rounded-xl border border-border hover:border-border/80 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded flex items-center justify-center border border-border">
                <FileText className="text-foreground/70 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Notion</div>
                <div className="text-[10px] text-foreground/50 uppercase tracking-tighter">Workspace Integration</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-accent-yellow/10 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow shadow-[0_0_8px_var(--color-accent-yellow)]" />
              <span className="text-[10px] font-bold text-accent-yellow uppercase">Connected</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black text-foreground">99.8<span className="text-sm font-normal text-foreground/50 ml-1">%</span></div>
            <div className="text-[10px] text-accent-cyan uppercase bg-accent-cyan/10 px-2 py-1 rounded font-bold">Optimal Flow</div>
          </div>
          <div className="mt-3 text-[10px] text-foreground/70 uppercase font-medium">
            Integrity Rating: Verified
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-surface p-6 rounded-xl border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent-yellow/20 transition-all" />
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Global Context Rot</div>
            <div className="text-4xl font-black text-accent-yellow mb-2 tracking-tighter">12.4%</div>
            <div className="flex items-center gap-2 text-xs text-foreground/70">
              <TrendingUp className="text-accent-red w-4 h-4" />
              <span>+2.1% from last audit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Findings */}
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Audit Findings
            <span className="text-xs font-normal text-foreground/70 bg-surface px-2 py-0.5 rounded-full border border-border">24 Critical Issues</span>
          </h2>
          <div className="flex gap-2">
            <button className="bg-surface border border-border text-foreground text-xs font-medium px-4 py-2 rounded-lg hover:bg-border transition-all">Filter: All</button>
            <button className="bg-surface border border-border text-foreground text-xs font-medium px-4 py-2 rounded-lg hover:bg-border transition-all">Sort: Severity</button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Item 1 */}
          <div className="bg-surface p-5 rounded-xl border-l-4 border-accent-yellow border-y border-r border-border hover:bg-surface-hover transition-all flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-foreground tracking-tight">Outdated Document: Incident Response SOP (Notion)</span>
                <span className="bg-accent-yellow/10 text-accent-yellow text-[10px] font-black px-2 py-0.5 rounded uppercase">Medium Severity</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-foreground/70">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Last updated 14 months ago</span>
                <span className="flex items-center gap-1"><Folder className="w-3.5 h-3.5" /> SecOps / Compliance</span>
              </div>
            </div>
            <button className="bg-background border border-border px-4 py-2 rounded-lg text-[10px] font-bold text-foreground uppercase tracking-widest hover:bg-border transition-all">Re-Verify</button>
          </div>

          {/* Item 2 */}
          <div className="bg-surface p-5 rounded-xl border-l-4 border-accent-red border-y border-r border-border hover:bg-surface-hover transition-all flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-foreground tracking-tight">Missing Policy: Q3 Vendor Offboarding (Google Drive)</span>
                <span className="bg-accent-red/20 text-accent-red text-[10px] font-black px-2 py-0.5 rounded uppercase shadow-[0_0_8px_var(--color-accent-red)] opacity-80">High Severity</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-foreground/70">
                <span className="flex items-center gap-1 font-semibold text-accent-red/80"><AlertTriangle className="w-3.5 h-3.5" /> No document found matching required compliance schema</span>
                <span className="flex items-center gap-1"><LinkIcon className="w-3.5 h-3.5" /> Requirement: SOC2_v2.4</span>
              </div>
            </div>
            <button className="bg-accent-yellow text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-accent-yellow/90 transition-all shadow-[0_0_15px_rgba(255,184,0,0.2)]">Resolve</button>
          </div>

          {/* Item 3 */}
          <div className="bg-surface p-5 rounded-xl border-l-4 border-foreground/30 border-y border-r border-border hover:bg-surface-hover transition-all flex items-center gap-6 opacity-80">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-foreground tracking-tight">Ambiguous Terminology: "Legacy Firewall" definitions</span>
                <span className="bg-foreground/10 text-foreground/70 text-[10px] font-black px-2 py-0.5 rounded uppercase">Low Severity</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-foreground/70">
                <span className="flex items-center gap-1"><GitMerge className="w-3.5 h-3.5" /> Conflict between Network Guide & Security Handbook</span>
              </div>
            </div>
            <button className="bg-background border border-border px-4 py-2 rounded-lg text-[10px] font-bold text-foreground uppercase tracking-widest hover:bg-border transition-all">Dismiss</button>
          </div>
        </div>

        {/* Empty Space filler */}
        <div className="mt-12 p-12 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-border">
            <Activity className="text-foreground/40 w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1">Deep Learning Scan Pending</h3>
          <p className="text-xs text-foreground/50 max-w-xs">Sentinel is currently analyzing cross-platform semantics. Additional insights will appear as context patterns emerge.</p>
        </div>
      </section>

      {/* Contextual Details Panel */}
      <div className="fixed bottom-8 right-8 w-80 bg-surface/80 backdrop-blur-xl p-6 rounded-xl border border-border shadow-2xl z-50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-accent-yellow">Real-time Health</h4>
          <X className="w-4 h-4 text-foreground/50 cursor-pointer hover:text-foreground transition-colors" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider">Knowledge Velocity</span>
            <span className="text-xs font-bold text-foreground">4.2 TB/hr</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider">Contextual Entropy</span>
            <span className="text-xs font-bold text-accent-red">Critical</span>
          </div>
          <div className="pt-4 border-t border-border">
            <div className="text-[9px] text-foreground/50 uppercase mb-2 font-bold tracking-wider">Primary Node Status</div>
            <div className="flex gap-1">
              <div className="h-1 flex-1 bg-accent-cyan rounded-full" />
              <div className="h-1 flex-1 bg-accent-cyan rounded-full" />
              <div className="h-1 flex-1 bg-accent-cyan rounded-full" />
              <div className="h-1 flex-1 bg-accent-cyan rounded-full" />
              <div className="h-1 flex-1 bg-accent-yellow animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
