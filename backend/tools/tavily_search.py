import os
import httpx
from dotenv import load_dotenv

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")
TAVILY_ENDPOINT = "https://api.tavily.com/search"


async def tavily_search(query: str) -> str:
    """Search the web using Tavily API and return top 5 results.

    Args:
        query: The search query string.

    Returns:
        Newline-separated 'Title: Description' lines, or an error string.
    """
    if not TAVILY_API_KEY:
        return "Error: TAVILY_API_KEY not configured."

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                TAVILY_ENDPOINT,
                json={"api_key": TAVILY_API_KEY, "query": query, "max_results": 5},
            )
            response.raise_for_status()
            data = response.json()

        results = data.get("results", [])
        if not results:
            return "No results found."

        return "\n".join(
            f"{r.get('title', 'No title')}: {r.get('content', 'No description')}"
            for r in results
        )

    except Exception as e:
        return f"No results found. Error: {str(e)}"
