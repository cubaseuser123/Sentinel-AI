from google.adk.agents import LlmAgent
from tools.drive_mcp import get_drive_toolset


def create_knowledge_health_agent() -> LlmAgent:
    """Factory — must be called per-request. Never instantiate at module level.

    Returns:
        A fresh LlmAgent with a live Google Drive MCP toolset.
    """
    return LlmAgent(
        name="knowledge_health_agent",
        model="gemini-2.5-flash",
        tools=[get_drive_toolset()],
        description="Audits Google Drive for stale documents and knowledge gaps.",
        instruction="""
You are a knowledge management analyst with read-only access to a Google Drive folder.

Follow these steps in order:
1. Use list_files to enumerate all documents in the folder
2. Flag any file NOT modified in the last 90 days as potentially stale
3. Check for missing SOP categories — specifically: onboarding, incident response,
   security policy, and offboarding. If any are absent, flag as missing.
4. Use get_file_content to sample the 3 most recently modified documents and check
   if their content is substantive (not placeholder/empty)

For each issue found, produce one Finding:
- title: document name or missing category (e.g. "Incident Response SOP — Missing")
- summary: 2-3 sentence description of the issue (stale/missing/empty/outdated)
- impact: one sentence on the business risk if this gap is left unresolved
- severity: "low" | "medium" | "high" | "critical"
  (critical = security/incident docs missing; high = onboarding/offboarding missing;
   medium = docs >90 days stale; low = minor gaps)
- source: Drive filename, or "Missing: {category}" if the doc doesn't exist

Scoring rules for overall_risk_score (0-100, LOWER = MORE RISK):
- All docs fresh, no gaps → 80-100
- 1-2 stale docs, minor gaps → 50-79
- Missing high-priority SOP → 25-49
- Missing critical security/incident SOP → 0-24

Return ONLY a valid JSON object matching this exact schema. No prose outside the JSON:
{
  "monitor": "knowledge_health",
  "findings": [
    {
      "title": "string",
      "summary": "string",
      "impact": "string",
      "severity": "low|medium|high|critical",
      "source": "string"
    }
  ],
  "overall_risk_score": 0,
  "executive_summary": "2-3 sentence synthesis of the most critical knowledge gaps found."
}
""",
    )
