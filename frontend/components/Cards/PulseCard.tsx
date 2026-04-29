export default function PulseCard() {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 relative overflow-hidden group hover:border-border/80 transition-colors">
      <h3 className="text-base font-bold leading-tight mb-2">Knowledge Pulse</h3>
      <p className="text-xs leading-relaxed text-foreground/60 mb-6 pr-16">
        You have 14 unreviewed regulatory changes affecting your current vendor stack.
      </p>

      {/* Progress Circle Mock */}
      <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle cx="50" cy="50" r="40" className="stroke-border fill-none stroke-[8]" />
          <circle 
            cx="50" cy="50" r="40" 
            className="stroke-accent-yellow fill-none stroke-[8] drop-shadow-[0_0_4px_rgba(255,184,0,0.5)]" 
            strokeDasharray="251.2" 
            strokeDashoffset="75.36" 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pr-2 pb-2">
          <span className="text-lg font-bold text-foreground">70%</span>
        </div>
      </div>
      
      <button className="absolute bottom-4 right-4 w-10 h-10 bg-accent-yellow rounded flex items-center justify-center hover:bg-accent-yellow/90 transition-colors shadow-[0_0_10px_rgba(255,184,0,0.2)]">
        <span className="text-black font-medium text-xl leading-none">+</span>
      </button>
    </div>
  );
}
