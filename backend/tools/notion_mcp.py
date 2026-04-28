import os
from dotenv import load_dotenv
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

load_dotenv()


def get_notion_toolset() -> MCPToolset:
    """Factory — creates a fresh MCPToolset connected to Notion MCP via stdio.

    Called per-request.
    """
    notion_token = os.getenv("NOTION_TOKEN", "")

    return MCPToolset(
        connection_params=StdioServerParameters(
            command="npx",
            args=["-y", "@notionhq/notion-mcp-server"],
            env={
                **os.environ,
                "NOTION_TOKEN": notion_token,
            },
        )
    )
