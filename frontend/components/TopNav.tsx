"use client";
import { Bell, Network, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function TopNav() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Global Intel", href: "/" },
    { name: "Knowledge Health", href: "/knowledge" },
    { name: "Systems", href: "/" },
  ];

  return (
    <header className="flex justify-between items-center w-full px-6 py-4 bg-background z-20 border-b border-border shrink-0">
      <div className="flex items-center space-x-6 w-1/4">
        <div className="md:hidden text-xl font-black tracking-tighter text-foreground uppercase">Sentinel</div>
      </div>
      
      <div className="hidden md:flex items-center justify-center gap-8 flex-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={clsx(
                "text-sm font-medium px-3 py-1.5 rounded transition-all duration-150",
                isActive 
                  ? "text-accent-yellow border-b-2 border-accent-yellow rounded-none" 
                  : "text-foreground/70 hover:bg-surface hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-end space-x-4 w-1/4">
        <button className="p-2 text-foreground/70 hover:bg-surface rounded-lg transition-colors duration-150 active:scale-95">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-foreground/70 hover:bg-surface rounded-lg transition-colors duration-150 active:scale-95">
          <Network className="w-5 h-5" />
        </button>
        <button className="p-2 text-foreground/70 hover:bg-surface rounded-lg transition-colors duration-150 active:scale-95">
          <UserCircle className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
