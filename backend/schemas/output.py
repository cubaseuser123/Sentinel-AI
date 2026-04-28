from pydantic import BaseModel
from typing import Literal, List

class Finding(BaseModel):
    title: str
    summary: str
    impact: str
    severity: Literal["low", "medium", "high", "critical"]
    source: str

class MonitorResult(BaseModel):
    monitor: Literal["vendor_risk", "regulatory", "knowledge_health"]
    findings: List[Finding]
    overall_risk_score: int
    executive_summary: str
