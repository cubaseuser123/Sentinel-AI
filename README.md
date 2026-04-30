# Sentinel Risk Intelligence

> **Your business has blind spots. Sentinel watches all of them so you don't have to.**

Sentinel is an autonomous, multi-agent business risk intelligence platform that continuously monitors vendor/supplier risk signals, regulatory/compliance changes, and internal knowledge health. 

*(Built with Google ADK, Gemini 2.5 Flash on Vertex AI, FastAPI, and Next.js for the VateCon Build Sprint.)*

---

## 🏗️ Architecture

Sentinel uses a highly resilient, hybrid-streaming architecture. It orchestrates three specialized sub-agents in parallel, streaming intelligence token-by-token to the frontend via SSE.

```ascii
User Input (Vendors, Industry, Drive URL)
          │
          ▼
   [ FastAPI Backend ] ── POST /analyze (SSE Stream)
          │
          ▼
  [ Orchestrator ] (Google ADK)
    /     │     \
   /      │      \
  ▼       ▼       ▼
Vendor  Regul.   Knowledge
Agent   Agent    Health Agent
  │       │       │
  ▼       ▼       ▼
[Tavily] [Tavily] [Drive MCP]
(Web)    (Web)    (Local/GCP)
```

---

## 🔍 Core Capabilities

Sentinel is built around three specialized modules that provide cross-domain intelligence:

### 1. Vendor Risk Intelligence
Monitors the stability and security posture of your third-party ecosystem. The agent queries real-time web sources to identify:
- Sudden engineering attrition or mass layoffs.
- Unpatched CVE exposures or supply chain cyber incidents.
- Operational disruptions (e.g., Warehouse strikes).

### 2. Regulatory & Compliance Radar
Watches for shifting legal frameworks across specific industries and jurisdictions. The agent tracks:
- Impending compliance deadlines and operational mandates.
- Changes to privacy and data residency laws.
- Industry-specific mandates that could threaten existing product workflows or require immediate engineering pivots.

### 3. Knowledge Health Auditing
Connects directly to your internal Google Drive and Notion workspaces. The agent acts as an internal auditor, cross-referencing external threats with internal vulnerabilities:
- Stale, outdated policies that expose the company to new legal liabilities.
- Security hygiene risks, such as over-provisioned employee access logs.
- Structural integrity issues within the team's internal documentation repository.

---

## 📋 Prerequisites

Before running the project locally, ensure you have:
- **Python 3.11+**
- **Node 18+**
- **pnpm** (for frontend package management)
- **Google Cloud Platform (GCP) Account** with Vertex AI API enabled.

### Required Integrations
- **Tavily Search API Key:** Required for real-time live-web grounding.
- **Google Cloud Auth:** Required for Vertex AI inference.
- **Google Drive MCP Token:** OAuth token required for the Drive connection.

---

## 🚀 Setup & Installation

### 1. Backend (FastAPI + Python Agents)

Open a terminal in the `backend/` directory:

```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Set up your environment variables:
```bash
cp .env.example .env
```
Edit `.env` and insert your credentials:
```env
TAVILY_API_KEY=your_tavily_search_api_key
GOOGLE_DRIVE_MCP_URL=https://drivemcp.googleapis.com/mcp/v1
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
GOOGLE_CLOUD_LOCATION=us-central1
```

Run the API:
```bash
uvicorn api.main:app --reload --port 8000
```

### 2. Frontend (Next.js)

Open a second terminal in the `frontend/` directory:

```bash
cd frontend
pnpm install
pnpm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🧪 Running the Demo

To see the power of Sentinel's cross-domain intelligence, try running the specific scenarios below from the Dashboard:

1. **Vendor Risk:** Input `FedEx`, Industry `Logistics`. Watch it identify an impending high-severity warehouse strike.
2. **Regulatory Radar:** Set Region to `India`, Industry `Logistics`. Watch it uncover the new Delhi 25% EV Transition Mandate.
3. **Knowledge Health:** Connect your Google Drive containing the sample documents (`Fleet_Management_Plan_2025.pdf`, `Vendor_Risk_Policy_v2.docx`, `Employee_Onboarding_Access_Log.xlsx`). Watch Sentinel connect the dots—realizing your internal Fleet Plan is completely unprepared for the external Delhi EV mandate it just found.
