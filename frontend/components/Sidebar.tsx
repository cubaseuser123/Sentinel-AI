"use client";
import { LineChart, Grid2X2, ShieldCheck, Database, CheckCircle, SearchCode, Settings, HelpCircle, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Intelligence", href: "/", icon: LineChart },
    { name: "Risk Matrix", href: "/matrix", icon: Grid2X2 },
    { name: "Knowledge Health", href: "/knowledge", icon: ShieldCheck },
    { name: "Assets", href: "/assets", icon: Database },
    { name: "Compliance", href: "/compliance", icon: CheckCircle },
    { name: "System Audit", href: "/audit", icon: SearchCode },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full py-6 space-y-6 bg-background w-64 flex-shrink-0 border-r border-border">
      <div className="mb-4 px-6">
        <div className="text-lg font-black text-accent-yellow tracking-tighter">SENTINEL</div>
        <div className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">Risk Intel Platform</div>
      </div>
      
      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-150 active:scale-95",
                isActive 
                  ? "text-accent-yellow border-r-2 border-accent-yellow bg-surface" 
                  : "text-foreground/70 hover:bg-surface hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-2 border-t border-border mt-auto pt-4">
        <button className="w-full bg-accent-yellow text-black font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,184,0,0.2)]">
          Export Report
        </button>
      </div>

      <div className="px-3 flex flex-col gap-1 pb-4">
        <Link href="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground/70 font-semibold text-sm hover:bg-surface hover:text-foreground transition-all duration-150">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <Link href="/support" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground/70 font-semibold text-sm hover:bg-surface hover:text-foreground transition-all duration-150">
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </Link>
      </div>
    </aside>
  );
}
