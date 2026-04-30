"""
End-to-end pipeline test for Sentinel.
Calls POST /analyze, streams SSE, prints tokens live, and validates the final digest.
"""
import httpx
import json
import sys
import io

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

API_URL = "http://localhost:8000"

PAYLOAD = {
    "vendors": ["Stripe", "AWS"],
    "industry": "Fintech",
    "region": "EU",
    "drive_folder_url": "",
}


def run():
    print("\n=== SENTINEL PIPELINE TEST ===")
    print(f"Vendors: {PAYLOAD['vendors']}")
    print(f"Industry: {PAYLOAD['industry']} | Region: {PAYLOAD['region']}")
    print("\n[1] Health check...", end=" ", flush=True)

    try:
        r = httpx.get(f"{API_URL}/health", timeout=5)
        r.raise_for_status()
        print("OK")
    except Exception as e:
        print(f"FAILED -- {e}")
        sys.exit(1)

    print("\n[2] Streaming /analyze (may take 60-120s)...\n")
    print("-" * 60)

    full_text = ""
    last_event = ""
    digest = None

    with httpx.stream(
        "POST",
        f"{API_URL}/analyze",
        json=PAYLOAD,
        headers={"Content-Type": "application/json"},
        timeout=300,
    ) as response:
        response.raise_for_status()

        for line in response.iter_lines():
            if line.startswith("event: "):
                last_event = line[7:].strip()
            elif line.startswith("data: "):
                data = line[6:]

                if last_event == "done":
                    print("\n" + "-" * 60)
                    print("\n[3] Parsing final digest...")
                    try:
                        digest = json.loads(data)
                    except json.JSONDecodeError as e:
                        print(f"FAILED: JSON parse error: {e}")
                        print(f"Raw snippet: {data[:500]}")
                        sys.exit(1)
                    last_event = ""

                elif last_event == "error":
                    print(f"\nBackend error: {data}")
                    sys.exit(1)

                else:
                    token = data.replace("\\n", "\n")
                    print(token, end="", flush=True)
                    full_text += token

    if not digest:
        print("\nFAILED: No 'done' event received -- pipeline did not complete.")
        sys.exit(1)

    # Validate structure
    print("\n[4] Validating digest structure...")
    errors = []
    for key in ("vendor_risk", "regulatory", "knowledge_health"):
        if key not in digest:
            errors.append(f"Missing key: {key}")
            continue
        m = digest[key]
        for field in ("monitor", "findings", "overall_risk_score", "executive_summary"):
            if field not in m:
                errors.append(f"{key} missing field: {field}")
        if "findings" in m and not isinstance(m["findings"], list):
            errors.append(f"{key}.findings is not a list")

    if errors:
        print("\nValidation errors:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)

    # Summary
    print("\nDigest valid!\n")
    print("=" * 60)
    print("EXECUTIVE SUMMARY:")
    print(digest.get("executive_summary", "(none)"))
    print()

    for key in ("vendor_risk", "regulatory", "knowledge_health"):
        m = digest[key]
        score = m.get("overall_risk_score", "?")
        findings = m.get("findings", [])
        crit = sum(1 for f in findings if f.get("severity") in ("critical", "high"))
        print(f"\n  [{key.upper().replace('_', ' ')}]  score={score}/100  findings={len(findings)}  high/crit={crit}")
        for f in findings:
            print(f"    [{f.get('severity','?').upper():8}] {f.get('title','')}")

    print()
    print("=== ALL CHECKS PASSED -- PIPELINE READY FOR DEMO ===\n")


if __name__ == "__main__":
    run()
