export default function MetricCard() {
  return (
    <div className="bg-surface rounded-xl border border-border p-6 relative overflow-hidden group hover:border-border/80 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div className="w-8 h-8 bg-[#232F3E] rounded flex items-center justify-center shrink-0 border border-border">
          <div className="w-5 h-5 bg-[#FF9900] rounded-sm flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">A</span>
          </div>
        </div>
        <div className="bg-surface-hover text-foreground/80 border border-border px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
          Medium
        </div>
      </div>

      <h3 className="text-lg font-bold leading-tight mb-3">AWS — US-East-1 Latency</h3>
      <p className="text-sm leading-relaxed text-foreground/60 mb-8">
        Minor degradation in API response times over the last 12 hours. Average p99 latency increased from 45ms to 122ms in northern Virginia region.
      </p>

      {/* Chart area */}
      <div className="bg-[#181818] rounded-lg p-4 border border-border mb-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">Latency (ms)</span>
          <span className="text-xs font-bold text-accent-yellow">+182%</span>
        </div>
        
        <div className="h-24 flex items-end justify-between gap-1">
          {[15, 18, 16, 22, 28, 45, 80, 100].map((height, i) => (
            <div 
              key={i} 
              className="w-full bg-accent-yellow transition-all duration-700 ease-out hover:opacity-80"
              style={{ height: `${height}%`, opacity: i < 5 ? 0.3 : (i === 7 ? 1 : 0.6) }}
            />
          ))}
        </div>
      </div>

      <button className="w-full bg-surface-hover hover:bg-border text-foreground/80 px-4 py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors">
        View Logs
      </button>
    </div>
  );
}
