# Sentinel — Technical Spec
> Multi-agent business blind spot intelligence system · Google ADK · VateCon Build Sprint

---

## 1. Project Overview

Sentinel is a multi-agent system that monitors three categories of business risk that companies have no systematic coverage for: vendor/supplier risk signals, regulatory and compliance changes, and internal knowledge health via Google Drive. A Manager Agent orchestrates three specialized sub-agents in parallel, each connected to real external tools (Brave Search API + Google Drive MCP). On demand, Sentinel runs all three monitors, synthesizes findings into a structured risk digest with severity scores, and streams output token-by-token to a React frontend. The pitch: *"Your business has blind spots. Sentinel watches all of them so you don't have to."*

---

## 2. Final Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Agent framework | Google ADK (Python) | Native multi-agent orchestration, streaming support, MCP toolset integration |
| LLM | gemini-2.5-flash | Fast, cheap, strong instruction following, free tier sufficient for MVP |
| Web search | Brave Search API (free tier) | 2000 req/month, no billing required, good news coverage |
| Drive integration | Google Drive MCP via `MCPToolset` + SSE | Real enterprise connection, resume-worthy, avoids manual OAuth plumbing |
| Backend | FastAPI + `asyncio` | Async streaming via SSE to frontend |
| Frontend | React (Vite) | Fast to scaffold, single page, no routing needed |
| Output format | Structured JSON → rendered cards | Enables color-coded severity UI, not just a wall of text |
| Environment | `.env` via `python-dotenv` | Standard, agent-safe |

---

## 3. Folder Structure

```
sentinel/
├── agents/
│   ├── __init__.py
│   ├── manager.py           # ManagerAgent — orchestrates all three sub-agents
│   ├── vendor_risk.py       # VendorRiskAgent — Brave Search for supplier signals
│   ├── regulatory.py        # RegulatoryAgent — Brave Search for compliance changes
│   └── knowledge_health.py  # KnowledgeHealthAgent — Google Drive MCP toolset
├── tools/
│   ├── __init__.py
│   ├── brave_search.py      # Brave Search async function tool (shared across agents)
│   └── drive_mcp.py         # MCPToolset factory for Google Drive SSE connection
├── schemas/
│   └── output.py            # Pydantic models for structured agent output
├── api/
│   ├── __init__.py
│   └── main.py              # FastAPI app, /analyze endpoint, SSE streaming
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx                  # Main layout, form, results panel
│   │   ├── components/
│   │   │   ├── InputForm.jsx        # Three-section form (vendors, regulatory, drive)
│   │   │   ├── RiskCard.jsx         # Single finding card with severity badge
│   │   │   ├── DigestPanel.jsx      # Renders all three monitor outputs
│   │   │   └── StreamingText.jsx    # Token-by-token streaming text component
│   │   └── main.jsx
│   └── package.json
├── .env.example
├── requirements.txt
└── README.md
```

---

## 4. Environment Variables

```env
# .env.example
BRAVE_API_KEY=your_brave_search_api_key
GOOGLE_DRIVE_MCP_URL=https://drivemcp.googleapis.com/mcp/v1
GOOGLE_DRIVE_MCP_TOKEN=your_oauth_token
GEMINI_API_KEY=your_gemini_api_key
```

---

## 5. Implementation Spec

### 5.1 `tools/brave_search.py`

**What it does:** Async function tool that queries Brave Search and returns top 5 result titles + descriptions as a formatted string. Registered directly as an ADK tool — no wrapper class needed.

**Input:** `query: str`

**Output:** `str` — newline-separated `Title: Description` lines

**Key details:**
- Use `httpx.AsyncClient`
- Endpoint: `https://api.search.brave.com/res/v1/web/search`
- Header: `X-Subscription-Token: {BRAVE_API_KEY}`
- Params: `{"q": query, "count": 5}`
- Parse `r.json()["web"]["results"]`, each has `title` and `description`
- Wrap in try/except, return `"No results found."` on any failure

---

### 5.2 `tools/drive_mcp.py`

**What it does:** Factory function that creates and returns an ADK `MCPToolset` connected to Google Drive MCP via SSE. Called fresh per request — never a module-level singleton.

**Input:** None (reads from env)

**Output:** `MCPToolset` instance

**Key details:**
```python
from google.adk.tools import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import SseConnectionParams

def get_drive_toolset() -> MCPToolset:
    return MCPToolset(
        connection_params=SseConnectionParams(
            url=os.getenv("GOOGLE_DRIVE_MCP_URL"),
            headers={"Authorization": f"Bearer {os.getenv('GOOGLE_DRIVE_MCP_TOKEN')}"}
        ),
        tool_filter=["search_files", "get_file_content", "list_files"]
    )
```
- `tool_filter` is a whitelist — only expose these three read-only tools
- Never expose any write or delete tools

---

### 5.3 `schemas/output.py`

**What it does:** Pydantic models defining the structured output contract all agents must follow.

```python
from pydantic import BaseModel
from typing import Literal, List

class Finding(BaseModel):
    title: str           # e.g. "Stripe — Aggressive Fraud Team Hiring"
    summary: str         # 2-3 sentence analyst-style summary
    impact: str          # One-liner business impact statement
    severity: Literal["low", "medium", "high", "critical"]
    source: str          # URL or "Google Drive: filename"

class MonitorResult(BaseModel):
    monitor: Literal["vendor_risk", "regulatory", "knowledge_health"]
    findings: List[Finding]
    overall_score: int   # 0–100, lower = more risk

class SentinelDigest(BaseModel):
    vendor_risk: MonitorResult
    regulatory: MonitorResult
    knowledge_health: MonitorResult
    executive_summary: str   # 3-sentence overall synthesis from Manager
```

---

### 5.4 `agents/vendor_risk.py`

**What it does:** Searches for risk signals across a list of vendor names — news, hiring patterns, financial signals, outages.

**Input (via ADK session):** `vendors: list[str]`

**Output:** `MonitorResult` JSON with `monitor="vendor_risk"`

**Key details:**
```python
from google.adk.agents import LlmAgent
from tools.brave_search import brave_search

vendor_risk_agent = LlmAgent(
    name="vendor_risk_agent",
    model="gemini-2.5-flash",
    tools=[brave_search],
    description="Researches vendor risk signals using web search.",
    instruction="""
    You are a vendor risk intelligence analyst. For each vendor provided:
    1. Search: "{vendor} news 2025"
    2. Search: "{vendor} layoffs OR hiring 2025"
    3. Search: "{vendor} outage OR incident 2025"

    For each vendor produce a Finding:
    - title: vendor name + primary signal
    - summary: what you found in 2-3 sentences
    - impact: one sentence on business risk
    - severity: low/medium/high/critical
    - source: URL of the most relevant result

    Return ONLY a valid JSON MonitorResult object. No prose outside the JSON.
    If no significant signals found for a vendor, include it with severity "low".
    """
)
```

---

### 5.5 `agents/regulatory.py`

**What it does:** Searches for recent regulatory and compliance changes for a given industry and region.

**Input (via ADK session):** `industry: str`, `region: str`

**Output:** `MonitorResult` JSON with `monitor="regulatory"`

**Key details:**
```python
regulatory_agent = LlmAgent(
    name="regulatory_agent",
    model="gemini-2.5-flash",
    tools=[brave_search],
    description="Monitors regulatory and compliance changes by industry and region.",
    instruction="""
    You are a regulatory intelligence analyst. Given an industry and region:
    1. Search: "{industry} regulation change {region} 2025"
    2. Search: "{industry} compliance update {region} 2025"
    3. Search: "{industry} new law policy {region} 2025"

    For each significant change found, produce a Finding:
    - title: regulation name + what changed
    - summary: what changed and when it takes effect
    - impact: what a company must do or risk
    - severity: based on enforcement risk and timeline
    - source: URL of the official or authoritative source

    Return ONLY a valid JSON MonitorResult object. No prose outside the JSON.
    """
)
```

---

### 5.6 `agents/knowledge_health.py`

**What it does:** Connects to the company's Google Drive via MCP, scans files, and identifies stale documents, missing SOPs, and knowledge gaps.

**Input (via ADK session):** `drive_folder_url: str`

**Output:** `MonitorResult` JSON with `monitor="knowledge_health"`

**Key details:**
- `KnowledgeHealthAgent` must be created via a factory function `create_knowledge_health_agent()` — never instantiated as a module-level singleton because it holds an MCP session
- Use `get_drive_toolset()` from `tools/drive_mcp.py`

```python
def create_knowledge_health_agent() -> LlmAgent:
    return LlmAgent(
        name="knowledge_health_agent",
        model="gemini-2.5-flash",
        tools=[get_drive_toolset()],
        description="Audits Google Drive for stale docs and knowledge gaps.",
        instruction="""
        You are a knowledge management analyst with access to a Google Drive folder.
        1. Use list_files to enumerate all documents
        2. Flag files not modified in the last 90 days as potentially stale
        3. Check for missing SOP categories: onboarding, incident response, security policy, offboarding
        4. Use get_file_content to sample the 3 most recently modified docs

        For each issue, produce a Finding:
        - title: document name or missing category
        - summary: what the issue is (stale/missing/outdated)
        - impact: business risk if this gap exists
        - severity: based on how critical the doc type is
        - source: Drive filename or "Missing: {category}"

        Return ONLY a valid JSON MonitorResult object. No prose outside the JSON.
        """
    )
```

---

### 5.7 `agents/manager.py`

**What it does:** Coordinator agent that delegates to all three sub-agents and synthesizes a final `SentinelDigest`.

**Key details:**
```python
def create_manager_agent() -> LlmAgent:
    return LlmAgent(
        name="sentinel_manager",
        model="gemini-2.5-flash",
        sub_agents=[
            vendor_risk_agent,
            regulatory_agent,
            create_knowledge_health_agent()
        ],
        instruction="""
        You are Sentinel, a business risk intelligence coordinator.

        When given vendors, industry, region, and drive_folder_url:
        1. Delegate to vendor_risk_agent with the vendors list
        2. Delegate to regulatory_agent with industry and region
        3. Delegate to knowledge_health_agent with drive_folder_url
        4. Wait for all three to complete
        5. Write a 3-sentence executive_summary of the most critical findings
        6. Return a complete SentinelDigest JSON object

        Never return partial results. Always return valid JSON matching SentinelDigest schema.
        No prose outside the JSON.
        """
    )
```

---

### 5.8 `api/main.py`

**What it does:** FastAPI app with a single `/analyze` POST endpoint that accepts user inputs, runs the Manager Agent, and streams tokens via SSE.

**Request body:**
```json
{
  "vendors": ["AWS", "Stripe", "Twilio"],
  "industry": "fintech",
  "region": "EU",
  "drive_folder_url": "https://drive.google.com/drive/folders/..."
}
```

**Key details:**
- Use ADK `Runner` with `InMemorySessionService`
- Return `StreamingResponse` with `media_type="text/event-stream"`
- Stream each token as `data: {token}\n\n`
- On completion emit `event: done\ndata: {full_digest_json}\n\n`
- CORS: allow `http://localhost:5173`
- No authentication for MVP
- Create a fresh `Runner` and `create_manager_agent()` per request

---

### 5.9 Frontend Components

**`InputForm.jsx`**
- Section 1 — Vendors: tag-style input, user types a vendor name and presses Enter to add it as a chip. Stored as `string[]` in state.
- Section 2 — Regulatory: Industry dropdown (Fintech, Healthcare, Logistics, SaaS, E-commerce, Manufacturing) + Region free text input
- Section 3 — Knowledge Health: single text input for Google Drive folder URL
- Submit button uses `onClick` handler — never an HTML `<form>` tag
- Disable submit while analysis is running

**`RiskCard.jsx`**
- Props: `finding: Finding`
- Severity badge colors: `critical=red-600`, `high=orange-500`, `medium=yellow-500`, `low=green-500`
- Shows title, summary, impact statement, severity badge, and source link
- Subtle border-left color matching severity

**`DigestPanel.jsx`**
- Renders three `MonitorResult` sections side by side (or stacked on mobile)
- Each section has an `overall_score` gauge: circular SVG, 0–100, lower = worse
- Executive summary rendered prominently at top before the three columns
- Shows streaming text while loading, replaces with cards on `done` event

**`StreamingText.jsx`**
- Props: `text: string`, `isStreaming: boolean`
- Renders text with a blinking cursor `|` appended while `isStreaming` is true
- Used inside DigestPanel during the loading phase

---

## 6. Data Flow

```
User fills form → POST /analyze
  → FastAPI creates ADK Runner with ManagerAgent
  → ManagerAgent delegates to 3 sub-agents
      VendorRiskAgent      → brave_search() × (3 queries × N vendors)
      RegulatoryAgent      → brave_search() × 3 queries
      KnowledgeHealthAgent → Drive MCP list_files + get_file_content
  → Each returns MonitorResult JSON
  → ManagerAgent writes executive_summary + returns SentinelDigest
  → FastAPI streams tokens as SSE
  → React renders StreamingText → then replaces with RiskCards on done
```

---

## 7. Dependencies

```txt
# requirements.txt
google-adk>=1.0.0
fastapi>=0.111.0
uvicorn>=0.29.0
httpx>=0.27.0
python-dotenv>=1.0.0
pydantic>=2.7.0
```

```json
// frontend/package.json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "vite": "^5.2.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

---

## 8. README Must Contain

1. One-line description of what Sentinel does
2. Screenshot or GIF of the UI (add after first working demo)
3. Prerequisites: Python 3.11+, Node 18+, Brave API key, Google Drive MCP token, Gemini API key
4. Setup: `pip install -r requirements.txt` → copy `.env.example` to `.env` → fill keys → `uvicorn api.main:app --reload` → `cd frontend && npm install && npm run dev`
5. Where to get each API key (Brave, Gemini)
6. Example demo inputs (use real public companies as vendors, e.g. AWS/Stripe/Twilio, industry=fintech, region=EU)
7. Architecture diagram (ASCII is fine)

---

## 9. Key Constraints — Do Not Violate

- Use Google ADK only — no LangGraph, LangChain, or other agent frameworks
- Drive MCP toolset: whitelist `search_files`, `get_file_content`, `list_files` only — no write tools ever
- Never use HTML `<form>` tags in React — use `onClick` on `<button>` elements
- Never store user input in any database — fully stateless, in-memory per request
- Never hardcode API keys — always read from `.env`
- All sub-agent instructions must end with "Return ONLY valid JSON. No prose outside the JSON."
- `KnowledgeHealthAgent` must always be created via `create_knowledge_health_agent()` factory — never a module-level singleton
- Frontend must render progressively from SSE stream — do not buffer and wait for the full response
- `overall_score` is 0–100 where lower = more risk (not higher = more risk)
