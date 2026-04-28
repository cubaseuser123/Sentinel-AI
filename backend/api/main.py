import json
import uuid
import logging
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content, Part
from agents.manager import create_manager_agent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Sentinel API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

APP_NAME = "sentinel"


class AnalyzeRequest(BaseModel):
    vendors: List[str]
    industry: str
    region: str
    drive_folder_url: str


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    """Run the Sentinel multi-agent pipeline and stream output as SSE."""

    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name=APP_NAME,
        user_id="sentinel_user",
        session_id=str(uuid.uuid4()),
    )

    runner = Runner(
        agent=create_manager_agent(),
        app_name=APP_NAME,
        session_service=session_service,
    )

    user_message = Content(
        role="user",
        parts=[
            Part(
                text=f"vendors: {request.vendors}\n"
                     f"industry: {request.industry}\n"
                     f"region: {request.region}\n"
                     f"drive_folder_url: {request.drive_folder_url}"
            )
        ],
    )

    async def event_generator():
        full_text = ""
        try:
            async for event in runner.run_async(
                user_id="sentinel_user",
                session_id=session.id,
                new_message=user_message,
            ):
                # Stream partial text tokens as they arrive
                if event.content and event.content.parts:
                    for part in event.content.parts:
                        if hasattr(part, "text") and part.text:
                            full_text += part.text
                            # Escape newlines so SSE doesn't break
                            safe = part.text.replace("\n", "\\n")
                            yield f"data: {safe}\n\n"

            # On completion, strip markdown fences and emit 'done'
            digest = full_text.strip()
            if digest.startswith("```json"):
                digest = digest[7:]
            if digest.startswith("```"):
                digest = digest[3:]
            if digest.endswith("```"):
                digest = digest[:-3]
            digest = digest.strip()

            yield f"event: done\ndata: {digest}\n\n"

        except Exception as e:
            logger.exception("Pipeline error")
            yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
