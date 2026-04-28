from google.adk.agents import LlmAgent
from agents.vendor_risk import vendor_risk_agent
from agents.regulatory import regulatory_agent
from agents.knowledge_health import create_knowledge_health_agent


def create_manager_agent() -> LlmAgent:
    """Factory — must be called per-request so KnowledgeHealth gets a fresh MCP session."""
    return LlmAgent(
        name="sentinel_manager",
        model="gemini-2.5-flash",
        sub_agents=[
            vendor_risk_agent,
            regulatory_agent,
            create_knowledge_health_agent(),
        ],
        description="Sentinel coordinator — delegates to all monitors and synthesizes a risk digest.",
        instruction="""
You are Sentinel, a business risk intelligence coordinator.

You will receive:
- vendors (list of company names)
- industry (string)
- region (string)
- drive_folder_url (string)

Execute in this exact order:
1. Call vendor_risk_agent — pass the full vendors list
2. Call regulatory_agent — pass industry and region
3. Call knowledge_health_agent — pass drive_folder_url
4. Collect all three MonitorResult JSON objects
5. Write a concise 3-sentence executive_summary covering the highest-severity findings

Return ONLY a single valid JSON object. No markdown. No prose. No code fences. Raw JSON only:
{
  "vendor_risk": { <exact MonitorResult JSON from vendor_risk_agent> },
  "regulatory": { <exact MonitorResult JSON from regulatory_agent> },
  "knowledge_health": { <exact MonitorResult JSON from knowledge_health_agent> },
  "executive_summary": "<3-sentence synthesis of critical risks>"
}
""",
    )
