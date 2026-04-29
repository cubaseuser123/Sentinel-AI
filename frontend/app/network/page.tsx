import { Search, History, ChevronRight } from "lucide-react";

export default function NetworkPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative h-full pt-16">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-yellow/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10">
        {/* Hero Branding */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-foreground mb-2">
            Global Entity Intel
          </h2>
          <p className="text-foreground/70 text-base max-w-md mx-auto">
            Access the monolithic data network. Search across domains, supply chains, and legal frameworks with surgical precision.
          </p>
        </div>

        {/* Search Section */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-yellow/20 to-transparent rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative flex items-center">
            <span className="absolute left-6 text-foreground/50 group-focus-within:text-accent-yellow transition-colors duration-200">
              <Search className="w-6 h-6" />
            </span>
            <input
              className="w-full bg-surface/40 border border-border/50 hover:border-border focus:border-accent-yellow/50 focus:ring-0 focus:outline-none rounded-xl py-6 pl-16 pr-6 text-lg font-medium placeholder:text-foreground/40 transition-all duration-200 backdrop-blur-md"
              placeholder="Search vendor network, legal entities, or domains..."
              type="text"
            />
            <div className="absolute right-6 flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-1 bg-surface text-foreground/70 rounded uppercase tracking-widest border border-border/50">
                ⌘ K
              </span>
            </div>
          </div>
        </div>

        {/* Recent Searches Section */}
        <div className="mt-12 w-full">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-[0.15em]">
              Recent Queries
            </h3>
            <button className="text-xs text-foreground/70 hover:text-accent-yellow transition-colors">
              Clear history
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group flex items-center justify-between p-4 bg-surface/50 hover:bg-surface transition-all duration-150 rounded-lg cursor-pointer border border-transparent hover:border-border/50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded bg-background flex items-center justify-center text-foreground/70 group-hover:text-accent-yellow transition-colors">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Acme Corp Supply Chain</div>
                  <div className="text-[10px] text-foreground/50 uppercase tracking-wider">
                    Enterprise Search • 2h ago
                  </div>
                </div>
              </div>
              <ChevronRight className="text-transparent group-hover:text-foreground/50 transition-all duration-150 w-5 h-5" />
            </div>

            <div className="group flex items-center justify-between p-4 bg-surface/50 hover:bg-surface transition-all duration-150 rounded-lg cursor-pointer border border-transparent hover:border-border/50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded bg-background flex items-center justify-center text-foreground/70 group-hover:text-accent-yellow transition-colors">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">OpenAI GDPR compliance</div>
                  <div className="text-[10px] text-foreground/50 uppercase tracking-wider">
                    Legal Framework • 5h ago
                  </div>
                </div>
              </div>
              <ChevronRight className="text-transparent group-hover:text-foreground/50 transition-all duration-150 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Decorative Stat Row (Minimalist) */}
        <div className="mt-20 flex justify-center space-x-12 px-6">
          <div className="text-center">
            <div className="text-foreground/70 text-[10px] uppercase tracking-widest font-bold mb-1">
              Monitored Entities
            </div>
            <div className="text-2xl font-black text-foreground">14.2M</div>
          </div>
          <div className="w-px h-10 bg-border/50 self-center" />
          <div className="text-center">
            <div className="text-foreground/70 text-[10px] uppercase tracking-widest font-bold mb-1">
              Active Clusters
            </div>
            <div className="text-2xl font-black text-foreground">842</div>
          </div>
          <div className="w-px h-10 bg-border/50 self-center" />
          <div className="text-center">
            <div className="text-foreground/70 text-[10px] uppercase tracking-widest font-bold mb-1">
              Latency (ms)
            </div>
            <div className="text-2xl font-black text-accent-cyan flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mr-2 animate-pulse" />
              14
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
