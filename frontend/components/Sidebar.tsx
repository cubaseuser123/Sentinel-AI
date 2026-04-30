"use client";
import { LayoutDashboard, ShieldAlert, Radio, BookOpen, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Vendor Risk", href: "/vendor", icon: ShieldAlert },
    { name: "Regulatory Radar", href: "/regulatory", icon: Radio },
    { name: "Knowledge Health", href: "/knowledge", icon: BookOpen },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full py-8 space-y-6 bg-background w-64 flex-shrink-0 border-r border-border">
      <div className="mb-10 px-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-accent-yellow flex items-center justify-center">
            <Shield className="text-black w-5 h-5" />
          </div>
          <div>
            <h1 className="text-foreground font-black italic tracking-tighter">SENTINEL</h1>
            <p className="text-[10px] text-foreground/50 tracking-[0.2em] uppercase font-bold">V.2.0.4</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

          return (
            <Link key={link.name} href={link.href}
              className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-150 active:scale-95",
                isActive
                  ? "text-accent-yellow border-r-2 border-accent-yellow bg-surface"
                  : "text-foreground/70 hover:bg-surface hover:text-foreground"
              )}>
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
