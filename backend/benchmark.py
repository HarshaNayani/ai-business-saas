import httpx
import time
import statistics
import json

# ── CONFIG ──────────────────────────────────────────────────────────────
FASTAPI_URL = "http://127.0.0.1:8000/ask"
RUNS = 10  # how many times to hit the API per query

# Test queries with expected keywords in the answer
TEST_QUERIES = [
    {"query": "who is the current PM of India", "expect": ["modi", "narendra"]},
    {"query": "what is machine learning", "expect": ["data", "algorithm", "model"]},
    {"query": "who is the current CM of Telangana", "expect": ["revanth"]},
    {"query": "what is python programming language", "expect": ["python", "programming"]},
    {"query": "what is artificial intelligence", "expect": ["intelligence", "machine", "ai"]},
]

# ── HELPERS ──────────────────────────────────────────────────────────────
def call_api(query: str) -> tuple[float, str | None]:
    """Returns (latency_ms, response_text or None on error)"""
    try:
        start = time.perf_counter()
        r = httpx.post(f"{FASTAPI_URL}?query={query}", timeout=60)
        latency = (time.perf_counter() - start) * 1000
        data = r.json()
        text = data.get("answer", {}).get("output") or data.get("answer", {}).get("message") or ""
        return latency, text
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return None, None

def check_accuracy(response: str, keywords: list[str]) -> bool:
    if not response:
        return False
    resp_lower = response.lower()
    return any(kw.lower() in resp_lower for kw in keywords)

# ── BENCHMARK 1: Latency ─────────────────────────────────────────────────
print("\n" + "="*55)
print("  BENCHMARK 1 — Webhook-to-Response Latency")
print("="*55)
latencies = []
query = "what is artificial intelligence"
print(f"  Query: '{query}'  ×{RUNS} runs\n")
for i in range(RUNS):
    lat, _ = call_api(query)
    if lat:
        latencies.append(lat)
        print(f"  Run {i+1:02d}: {lat:7.0f} ms")

if latencies:
    print(f"\n  Min    : {min(latencies):.0f} ms")
    print(f"  Max    : {max(latencies):.0f} ms")
    print(f"  Avg    : {statistics.mean(latencies):.0f} ms")
    print(f"  Median : {statistics.median(latencies):.0f} ms")
    print(f"  P90    : {sorted(latencies)[int(len(latencies)*0.9)]:.0f} ms")

# ── BENCHMARK 2: n8n Workflow Steps ──────────────────────────────────────
print("\n" + "="*55)
print("  BENCHMARK 2 — n8n Workflow Steps")
print("="*55)
steps = [
    "1. Webhook Trigger         — receives GET request",
    "2. AI Agent (Orchestrator) — decides tool usage",
    "3. Groq LLM (Chat Model)   — generates response",
    "4. Simple Memory           — stores conversation",
    "5. Search in Tavily (Tool) — web search when needed",
    "6. Respond to Webhook      — returns final answer",
]
print(f"\n  Total nodes in workflow: {len(steps)}\n")
for s in steps:
    print(f"  ✓ {s}")

# ── BENCHMARK 3: AI Agent Accuracy ───────────────────────────────────────
print("\n" + "="*55)
print("  BENCHMARK 3 — AI Agent Accuracy")
print("="*55)
correct = 0
total = len(TEST_QUERIES)
print()
for item in TEST_QUERIES:
    lat, resp = call_api(item["query"])
    passed = check_accuracy(resp, item["expect"])
    correct += passed
    status = "✓ PASS" if passed else "✗ FAIL"
    print(f"  {status} | {item['query'][:45]:<45} | {lat:.0f} ms")
    if resp:
        print(f"         → {resp[:80]}...")
    print()

accuracy = (correct / total) * 100
print(f"  Accuracy : {correct}/{total} = {accuracy:.0f}%")

# ── SUMMARY ──────────────────────────────────────────────────────────────
print("\n" + "="*55)
print("  RESUME-READY NUMBERS")
print("="*55)
if latencies:
    print(f"  • Avg response latency  : ~{statistics.mean(latencies):.0f} ms")
    print(f"  • Median latency        : ~{statistics.median(latencies):.0f} ms")
print(f"  • Workflow nodes (steps): {len(steps)}")
print(f"  • Agent accuracy        : {accuracy:.0f}% on {total}-query test set")
print("="*55 + "\n")
