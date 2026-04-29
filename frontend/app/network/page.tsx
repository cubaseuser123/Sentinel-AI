"use client";
import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Search, ChevronDown } from "lucide-react";
import { AnalyzeRequest, SENTINEL_FORM_KEY } from "@/lib/types";
import clsx from "clsx";

const INDUSTRIES = [
  "Fintech",
  "Healthcare",
  "Logistics",
  "SaaS",
  "E-commerce",
  "Manufacturing",
];

export default function NetworkPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<string[]>(["AWS", "Stripe"]);
  const [vendorInput, setVendorInput] = useState("");
  const [industry, setIndustry] = useState("Fintech");
  const [region, setRegion] = useState("EU");
  const [driveUrl, setDriveUrl] = useState("");
  const [industryOpen, setIndustryOpen] = useState(false);

  function addVendor() {
    const v = vendorInput.trim();
    if (v && !vendors.includes(v)) setVendors((prev) => [...prev, v]);
    setVendorInput("");
  }

  function removeVendor(v: string) {
    setVendors((prev) => prev.filter((x) => x !== v));
  }

  function handleVendorKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addVendor(); }
  }

  function handleSubmit() {
    const req: AnalyzeRequest = { vendors, industry, region, drive_folder_url: driveUrl };
    sessionStorage.setItem(SENTINEL_FORM_KEY, JSON.stringify(req));
    router.push("/network/signals");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative h-full py-12">
      {/* BG glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-yellow/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10 space-y-10">
        {/* Hero */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-foreground mb-2">
            Global Entity Intel
          </h2>
          <p className="text-foreground/70 text-base max-w-md mx-auto">
            Access the monolithic data network. Search across vendors, supply chains, and compliance frameworks with surgical precision.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 space-y-8 shadow-[0_0_60px_rgba(0,0,0,0.4)]">

          {/* Section 1: Vendors */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 block mb-3">
              Vendors to Monitor
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {vendors.map((v) => (
                <div key={v} className="flex items-center gap-1.5 bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow text-xs font-bold px-3 py-1.5 rounded-full">
                  {v}
                  <button onClick={() => removeVendor(v)} className="hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent-yellow/50 transition-colors"
                placeholder="Add vendor name and press Enter..."
                value={vendorInput}
                onChange={(e) => setVendorInput(e.target.value)}
                onKeyDown={handleVendorKey}
              />
              <button onClick={addVendor} className="p-2.5 bg-background border border-border rounded-lg hover:border-accent-yellow/50 text-foreground/70 hover:text-accent-yellow transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section 2: Regulatory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 block mb-3">
                Industry
              </label>
              <div className="relative">
                <button
                  onClick={() => setIndustryOpen(!industryOpen)}
                  className="w-full flex items-center justify-between bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground hover:border-accent-yellow/50 transition-colors focus:outline-none"
                >
                  {industry}
                  <ChevronDown className={clsx("w-4 h-4 transition-transform", industryOpen && "rotate-180")} />
                </button>
                {industryOpen && (
                  <div className="absolute top-full mt-1 w-full bg-surface border border-border rounded-lg overflow-hidden z-50 shadow-xl">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        onClick={() => { setIndustry(ind); setIndustryOpen(false); }}
                        className={clsx(
                          "w-full text-left px-4 py-2.5 text-sm transition-colors",
                          ind === industry ? "text-accent-yellow bg-accent-yellow/10" : "text-foreground/70 hover:bg-background hover:text-foreground"
                        )}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 block mb-3">
                Region
              </label>
              <input
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent-yellow/50 transition-colors"
                placeholder="e.g. EU, US, APAC"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Knowledge Health */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 block mb-3">
              Google Drive Folder URL <span className="text-foreground/30">(optional — for Knowledge Health)</span>
            </label>
            <input
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent-yellow/50 transition-colors"
              placeholder="https://drive.google.com/drive/folders/..."
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={vendors.length === 0}
            className="w-full bg-accent-yellow text-black font-black py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-accent-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(255,184,0,0.2)] active:scale-[0.98]"
          >
            <Search className="inline w-4 h-4 mr-2 -mt-0.5" />
            Initialize Analysis
          </button>
        </div>

        {/* Recent */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-[0.15em]">Recent Queries</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Acme Corp Supply Chain", sub: "Enterprise Search • 2h ago" },
              { label: "OpenAI GDPR compliance", sub: "Legal Framework • 5h ago" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => router.push("/network/signals")}
                className="group flex items-center justify-between p-4 bg-surface/50 hover:bg-surface transition-all duration-150 rounded-lg text-left border border-transparent hover:border-border/50"
              >
                <div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-accent-yellow transition-colors">{item.label}</div>
                  <div className="text-[10px] text-foreground/50 uppercase tracking-wider mt-0.5">{item.sub}</div>
                </div>
                <Search className="w-4 h-4 text-transparent group-hover:text-foreground/50 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
