"use client";
import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Search, ChevronDown } from "lucide-react";
import { VendorRequest, VENDOR_FORM_KEY } from "@/lib/types";
import clsx from "clsx";

const INDUSTRIES = ["Fintech", "Healthcare", "Logistics", "SaaS", "E-commerce", "Manufacturing"];

export default function VendorPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<string[]>([]);
  const [vendorInput, setVendorInput] = useState("");
  const [industry, setIndustry] = useState("Fintech");
  const [industryOpen, setIndustryOpen] = useState(false);

  function addVendor() {
    const v = vendorInput.trim();
    if (v && !vendors.includes(v)) setVendors(p => [...p, v]);
    setVendorInput("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addVendor(); }
  }

  function handleSubmit() {
    const req: VendorRequest = { vendors, industry };
    sessionStorage.setItem(VENDOR_FORM_KEY, JSON.stringify(req));
    router.push("/vendor/results");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative h-full py-12">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-yellow/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10 space-y-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-foreground mb-2">Vendor Risk</h2>
          <p className="text-foreground/70 text-base max-w-md mx-auto">
            Monitor your suppliers and tech vendors for signals that could disrupt your business — breaches, layoffs, outages — before you find out the hard way.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 space-y-8 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 block mb-3">Vendors to Monitor</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {vendors.map(v => (
                <div key={v} className="flex items-center gap-1.5 bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow text-xs font-bold px-3 py-1.5 rounded-full">
                  {v}
                  <button onClick={() => setVendors(p => p.filter(x => x !== v))}><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent-yellow/50 transition-colors"
                placeholder="Type vendor name and press Enter..."
                value={vendorInput}
                onChange={e => setVendorInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <button onClick={addVendor} className="p-2.5 bg-background border border-border rounded-lg hover:border-accent-yellow/50 text-foreground/70 hover:text-accent-yellow transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 block mb-3">Your Industry</label>
            <div className="relative">
              <button onClick={() => setIndustryOpen(!industryOpen)}
                className="w-full flex items-center justify-between bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground hover:border-accent-yellow/50 transition-colors focus:outline-none">
                {industry}
                <ChevronDown className={clsx("w-4 h-4 transition-transform", industryOpen && "rotate-180")} />
              </button>
              {industryOpen && (
                <div className="absolute top-full mt-1 w-full bg-surface border border-border rounded-lg overflow-hidden z-50 shadow-xl">
                  {INDUSTRIES.map(ind => (
                    <button key={ind} onClick={() => { setIndustry(ind); setIndustryOpen(false); }}
                      className={clsx("w-full text-left px-4 py-2.5 text-sm transition-colors",
                        ind === industry ? "text-accent-yellow bg-accent-yellow/10" : "text-foreground/70 hover:bg-background hover:text-foreground")}>
                      {ind}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={vendors.length === 0}
            className="w-full bg-accent-yellow text-black font-black py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-accent-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(255,184,0,0.2)] active:scale-[0.98]">
            <Search className="inline w-4 h-4 mr-2 -mt-0.5" />
            Scan Vendors
          </button>
        </div>
      </div>
    </div>
  );
}
