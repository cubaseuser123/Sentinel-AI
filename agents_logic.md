# Sentinel Context

## Arch
- Google ADK 2.0.0b1 & Gemini 2.5 Flash
- FastAPI SSE (`/analyze`) -> Manager Agent -> Sub-Agents
- Output: Strict JSON matching `MonitorResult` Pydantic schema

## Agents
- **Manager (`agents/manager.py`)**: Router. Uses `transfer_to_agent` based on query. Generates `executive_summary`.
- **VendorRisk (`agents/vendor_risk.py`)**: Scans web (`brave_search`) for layoffs/outages of vendors.
- **Regulatory (`agents/regulatory.py`)**: Scans web (`brave_search`) for compliance changes by region/industry.
- **KnowledgeHealth (`agents/knowledge_health.py`)**: Audits internal docs. Instantiated per-request via factory. Uses `felores/gdrive-mcp-server` (via MCPToolset stdio) & Notion REST API.

## Tools
- `tools/brave_search.py`: Async REST wrapper
- `tools/notion_tools.py`: Async REST wrapper (search, get_page, list_db)
- `tools/drive_mcp.py`: MCP stdio subprocess wrapper

## Schema (`schemas/output.py`)
- `MonitorResult`: `monitor` (Literal), `findings` (List[Finding]), `overall_risk_score` (int), `executive_summary` (str)
- `Finding`: `title`, `summary`, `impact`, `severity`, `source`
