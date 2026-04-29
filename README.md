# Sentinel

> **Your business has blind spots. Sentinel watches all of them so you don't have to.**

Sentinel is a multi-agent business risk intelligence system that continuously monitors vendor/supplier risk signals, regulatory/compliance changes, and internal knowledge health. 

*(Built with Google ADK, Gemini 2.5 Flash, FastAPI, and Next.js for the VateCon Build Sprint.)*

---

## 📸 Overview

*(Add screenshot or GIF here after the first working demo)*

---

## 🏗️ Architecture

Sentinel uses a **Manager Agent** to orchestrate three specialized sub-agents in parallel. Output is streamed token-by-token to the frontend via SSE.

```ascii
User Input (Vendors, Industry, Drive URL)
          │
          ▼
   [ FastAPI Backend ] ── POST /analyze (SSE Stream)
          │
          ▼
  [ Manager Agent ] (Google ADK)
    /     │     \
   /      │      \
  ▼       ▼       ▼
Vendor  Regul.   Knowledge
Agent   Agent    Health Agent
  │       │       │
  ▼       ▼       ▼
[Brave] [Brave]  [Drive MCP]
(Web)   (Web)    (Local/GCP)
```

---

## 🔍 Core Capabilities

Sentinel is built around three specialized sub-agents that run asynchronously in parallel, orchestrated by a central Manager Agent:

### 1. Vendor Risk Intelligence
Monitors the stability and security posture of your third-party ecosystem. The agent queries real-time web sources to identify:
- Sudden engineering attrition or mass layoffs indicating internal chaos.
- Unpatched CVE exposures or recent cyber incidents affecting your supply chain.
- Negative market signals or leadership shakeups.

### 2. Regulatory & Compliance Radar
Watches for shifting legal frameworks across specific industries and jurisdictions. The agent tracks:
- Impending compliance deadlines (e.g., EU AI Act, DORA).
- Changes to privacy and data residency laws.
- Industry-specific mandates that could threaten existing product workflows or require immediate engineering pivots.

### 3. Knowledge Health Auditing
Uses the Model Context Protocol (MCP) to securely connect to your internal Google Drive. The agent acts as an internal auditor to prevent "Context Rot" by identifying:
- Stale, outdated Standard Operating Procedures (SOPs) that no longer match reality.
- Missing critical policies (e.g., Incident Response, Vendor Offboarding).
- Structural integrity issues within the team's internal documentation repository.

---

## 📋 Prerequisites

Before running the project locally, ensure you have:
- **Python 3.11+**
- **Node 18+**
- **pnpm** (for the frontend package management)

### Required API Keys
- **Brave Search API Key:** Get it free at [search.brave.com/api](https://brave.com/search/api/) (2000 req/month free tier).
- **Gemini API Key:** Get it from [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Google Drive MCP Token:** OAuth token required for the Drive MCP connection.

---

## 🚀 Setup & Installation

### 1. Backend (FastAPI + Python Agents)

Open a terminal in the `backend/` directory:

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Set up your environment variables:
```bash
cp .env.example .env
```
Edit `.env` and insert your API keys:
```env
BRAVE_API_KEY=your_brave_search_api_key
GOOGLE_DRIVE_MCP_URL=https://drivemcp.googleapis.com/mcp/v1
GOOGLE_DRIVE_MCP_TOKEN=your_oauth_token
GEMINI_API_KEY=your_gemini_api_key
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

## 🧪 Example Demo Inputs

To see the power of Sentinel, try running an analysis with the following real-world parameters from the **Network Search** page:

- **Vendors to Monitor:** `AWS`, `Stripe`, `Twilio`
- **Industry:** `Fintech`
- **Region:** `EU`
- **Google Drive URL:** *(Paste a link to a folder containing outdated SOPs or missing policies)*

Watch as the agents scrape the open web for live signals and audit your internal knowledge base in parallel.
