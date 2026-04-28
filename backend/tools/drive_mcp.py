import os
from dotenv import load_dotenv

load_dotenv()


def get_drive_toolset():
    """Factory — creates a fresh MCPToolset connected to Google Drive MCP via stdio.

    Called per-request. Never use as a module-level singleton.

    Returns:
        MCPToolset instance with read-only Drive tools exposed.
    """
    from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

    gdrive_mcp_path = os.getenv("GDRIVE_MCP_SERVER_PATH", "./gdrive-mcp-server")
    oauth_keys_path = os.getenv(
        "GDRIVE_OAUTH_KEYS_PATH",
        "./gdrive-mcp-server/credentials/gcp-oauth.keys.json",
    )
    credentials_path = os.getenv(
        "GDRIVE_CREDENTIALS_PATH",
        "./gdrive-mcp-server/credentials/.gdrive-server-credentials.json",
    )

    return MCPToolset(
        connection_params=StdioServerParameters(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-gdrive"],
            env={
                **os.environ,
                "GDRIVE_MCP_SERVER_PATH": gdrive_mcp_path,
                "GDRIVE_OAUTH_KEYS_PATH": oauth_keys_path,
                "GDRIVE_CREDENTIALS_PATH": credentials_path,
            },
        ),
        tool_filter=["search_files", "get_file_content", "list_files"],
    )
