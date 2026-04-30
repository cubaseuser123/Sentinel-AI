import { MonitorResult } from "./types";
import { StreamEvent } from "./api";

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const VENDOR_DEMO: MonitorResult = {
  monitor: "vendor_risk",
  overall_risk_score: 45,
  executive_summary:
    "Critical vendor risks identified. FedEx is facing imminent localized strikes in key distribution hubs alongside upcoming peak-season surcharge increases that will directly impact operational costs and delivery timelines.",
  findings: [
    {
      title: "FedEx Ground — Imminent Union Walkout in Midwest Hubs",
      summary:
        "Contract negotiations between FedEx Ground and the Transport Workers Union broke down this week. The union has now authorized a strike starting next Tuesday, affecting 4 major distribution centers in Chicago, Memphis, Indianapolis, and Detroit.",
      impact:
        "Direct risk of 48–72 hour delivery delays for all packages routed through Midwest hubs during peak window.",
      severity: "critical",
      source: "https://wsj.com/articles/fedex-ground-strike-midwest-2026",
    },
    {
      title: "FedEx — Peak Season Surcharge +12% Effective Next Month",
      summary:
        "FedEx announced a 12% increase in oversized and heavy-package surcharges effective next billing cycle, citing rising fuel and last-mile labor costs. No opt-out clause for existing enterprise contracts.",
      impact:
        "Unplanned margin compression on heavy-goods delivery tier — estimated $2.1M annual impact on current volume.",
      severity: "high",
      source: "https://freightwaves.com/news/fedex-rate-increase-q2-2026",
    },
    {
      title: "FedEx Express — Q1 Fleet Electrification Milestone",
      summary:
        "FedEx deployed 500 new EV delivery vans in urban centers across the US and EU. All urban last-mile routes will transition to EV by 2027.",
      impact:
        "Positive alignment with your company's Scope 3 emissions reduction goals — reduces shared carbon liability.",
      severity: "low",
      source: "https://reuters.com/business/fedex-ev-fleet-q1-2026",
    },
  ],
};

export const REGULATORY_DEMO: MonitorResult = {
  monitor: "regulatory",
  overall_risk_score: 35,
  executive_summary:
    "High regulatory pressure approaching across Indian operations. Major state-level gig-worker welfare acts and aggressive urban EV mandates for delivery fleets require immediate operational and payroll compliance reviews.",
  findings: [
    {
      title: "Rajasthan Platform-Based Gig Workers (Welfare) Act",
      summary:
        "The Rajasthan government has enacted strict guidelines requiring all aggregators and delivery platforms to register their gig workers and deduct a mandatory 'welfare fee' (1-2% of per-transaction value) at source to fund state social security boards.",
      impact:
        "Direct margin compression on per-delivery unit economics in Rajasthan. Requires immediate backend payroll and app invoicing integration to deduct fees automatically.",
      severity: "critical",
      source: "https://prsindia.org/bills/states/the-rajasthan-platform-based-gig-workers-registration-and-welfare-bill-2023",
    },
    {
      title: "Delhi Motor Vehicle Aggregator & Delivery Scheme",
      summary:
        "The Delhi Transport Department has notified a new scheme mandating that 100% of all new two-wheelers and 50% of all new three-wheelers onboarded for commercial delivery operations must be Electric Vehicles (EVs) within the next 12 months.",
      impact:
        "Immediate halt on onboarding legacy ICE (Internal Combustion Engine) vehicles in the NCR region. Requires capital reallocation to EV fleet partners.",
      severity: "high",
      source: "https://transport.delhi.gov.in/transport/delhi-motor-vehicle-aggregator-and-delivery-service-provider-scheme",
    },
    {
      title: "GST E-Way Bill FASTag Integration",
      summary:
        "The CBIC (Central Board of Indirect Taxes and Customs) has fully integrated E-Way bill generation with FASTag / VAHAN data to track commercial vehicle movement in real-time, penalizing discrepancies between declared routes and actual toll crossings.",
      impact:
        "Requires stricter route compliance for inter-state freight. Unplanned route diversions by drivers will now trigger automated GST show-cause notices.",
      severity: "medium",
      source: "https://gstcouncil.gov.in/e-way-bill",
    },
  ],
};

export const KNOWLEDGE_DEMO: MonitorResult = {
  monitor: "knowledge_health",
  overall_risk_score: 25,
  executive_summary:
    "Critical operational knowledge gaps detected across your Google Drive and Notion workspaces. An emergency response plan is entirely absent, key operational SOPs in Google Drive are severely outdated, and sensitive Notion pages have overly permissive access settings.",
  findings: [
    {
      title: "Missing: Fleet Accident & Hazmat Spill Response Plan",
      summary:
        "No documentation exists across either platform covering emergency protocols for vehicle accidents, hazardous material spills, or driver injury incidents.",
      impact:
        "Active compliance violation risk under DOT FMCSA guidelines. Lack of documented response process creates major legal liability.",
      severity: "critical",
      source: "Missing: incident_response",
    },
    {
      title: "Warehouse Operations SOP — Last Modified 245 Days Ago",
      summary:
        "The Warehouse Operations SOP in Google Drive has not been updated in over 8 months. It still references your legacy WMS (WarehouseIQ v2.1) which was decommissioned last year.",
      impact:
        "New warehouse associates are being onboarded to an outdated process, increasing pick error rates.",
      severity: "high",
      source: "Google Drive: Warehouse Operations SOP.gdoc",
    },
    {
      title: "Notion Workspace Permissions — Public Link Exposure",
      summary:
        "The internal 'Vendor Contracts & Rate Cards 2026' Notion page has 'Share to Web' enabled. It is currently accessible to anyone with the link.",
      impact:
        "Severe data leakage risk. Competitors or external actors could view negotiated 3PL rates and vendor SLA terms.",
      severity: "critical",
      source: "Notion: Vendor Contracts & Rate Cards 2026",
    },
    {
      title: "Q1 Driver Onboarding Guide — Up to Date",
      summary:
        "Document was last modified 12 days ago in Google Drive. Covers updated compliance checks and the new digital manifest system.",
      impact:
        "Driver onboarding is accurate and compliant. No action required.",
      severity: "low",
      source: "Google Drive: Q1 Driver Onboarding Guide.gdoc",
    },
    {
      title: "Logistics Routing Playbook — Up to Date",
      summary:
        "The Notion playbook for dynamic route optimization was successfully updated by the operations lead yesterday.",
      impact:
        "Dispatchers are using the most current routing algorithms.",
      severity: "low",
      source: "Notion: Logistics Routing Playbook",
    },
  ],
};

// ─── Fake Streaming Tokens ────────────────────────────────────────────────────

const VENDOR_TOKENS = [
  "Initializing vendor intelligence scan...\n",
  "Running web search: FedEx news 2026...\n",
  "Running web search: FedEx layoffs OR strikes 2026...\n",
  "Running web search: FedEx outage OR incident 2026...\n",
  "Analyzing signal patterns across 14 sources...\n",
  "Scoring findings by severity...\n",
  "Building structured risk digest...\n",
];

const REGULATORY_TOKENS = [
  "Initializing regulatory radar scan...\n",
  "Searching: logistics regulation change 2026...\n",
  "Searching: DOL compliance update freight carriers 2026...\n",
  "Searching: EU transportation law 2026...\n",
  "Cross-referencing enforcement timelines...\n",
  "Scoring regulatory exposure...\n",
  "Compiling findings...\n",
];

const KNOWLEDGE_TOKENS = [
  "Connecting to Google Drive workspace...\n",
  "Listing files in folder...\n",
  "Checking document modification dates...\n",
  "Scanning for missing SOP categories...\n",
  "Sampling 3 most recently modified documents...\n",
  "Assessing content quality and freshness...\n",
  "Building knowledge health report...\n",
];

// ─── Demo Streaming Generators ────────────────────────────────────────────────

async function* fakeSteam(
  tokens: string[],
  result: MonitorResult
): AsyncGenerator<StreamEvent> {
  const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  for (const token of tokens) {
    yield { type: "token", data: token };
    await delay(1200); // Increased from 280ms to 1.2 seconds per line for a longer loading phase
  }

  await delay(1500);
  yield { type: "done", result };
}

export const streamVendorDemo = () =>
  fakeSteam(VENDOR_TOKENS, VENDOR_DEMO);

export const streamRegulatoryDemo = () =>
  fakeSteam(REGULATORY_TOKENS, REGULATORY_DEMO);

export const streamKnowledgeDemo = () =>
  fakeSteam(KNOWLEDGE_TOKENS, KNOWLEDGE_DEMO);
