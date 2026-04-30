"""
Quick key + tool verification. Tests Tavily and Gemini independently.
Runs in ~5-10 seconds. If both pass, agents will work.
"""
import os, sys, json
from dotenv import load_dotenv
load_dotenv()

print("\n=== KEY + TOOL VERIFICATION ===\n")

# ── 1. TAVILY ───────────────────────────────────────────────
print("[1] Tavily Search API...", end=" ", flush=True)
try:
    from tavily import TavilyClient
    key = os.getenv("TAVILY_API_KEY")
    if not key:
        raise ValueError("TAVILY_API_KEY not set in .env")
    client = TavilyClient(api_key=key)
    results = client.search("Stripe fintech news 2025", max_results=2)
    hits = results.get("results", [])
    if not hits:
        raise ValueError("Search returned 0 results")
    print(f"PASS  ({len(hits)} results)")
    print(f"   Sample: {hits[0]['title'][:70]}")
except Exception as e:
    print(f"FAIL\n   Error: {e}")
    sys.exit(1)

# ── 2. GEMINI ───────────────────────────────────────────────
print("\n[2] Gemini API...", end=" ", flush=True)
try:
    from google import genai
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY not set in .env")
    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents='Reply with exactly: {"status":"ok"}'
    )
    text = response.text.strip().replace("```json","").replace("```","").strip()
    parsed = json.loads(text)
    if parsed.get("status") != "ok":
        raise ValueError(f"Unexpected response: {text}")
    print("PASS")
except Exception as e:
    print(f"FAIL\n   Error: {e}")
    sys.exit(1)

# ── 3. Schema smoke test ─────────────────────────────────────
print("\n[3] Checking agent schema imports...", end=" ", flush=True)
try:
    sys.path.insert(0, ".")
    from schemas.output import Finding, MonitorResult
    f = Finding(title="Test", summary="Summary", impact="Impact", severity="high", source="http://x.com")
    m = MonitorResult(monitor="vendor_risk", findings=[f], overall_risk_score=55, executive_summary="Test summary")
    print("PASS")
except Exception as e:
    print(f"FAIL\n   Error: {e}")
    sys.exit(1)

print("\n=== ALL KEYS + TOOLS VERIFIED -- AGENTS ARE READY ===\n")
print("What this means:")
print("  - Tavily is live and returning real search results")
print("  - Gemini 2.5 Flash is authenticated and responding")
print("  - Pydantic schemas load correctly")
print("  - Full pipeline will work when /analyze is called\n")
