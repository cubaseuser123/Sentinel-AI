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
from agents.vendor_risk import vendor_risk_agent
from agents.regulatory import regulatory_agent
from agents.knowledge_health import create_knowledge_health_agent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Sentinel API", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

APP_NAME = "sentinel"


class VendorRequest(BaseModel):
    vendors: List[str]
    industry: str


class RegulatoryRequest(BaseModel):
    industry: str
    region: str


class KnowledgeRequest(BaseModel):
    drive_folder_url: str


@app.get("/health")
async def health():
    return {"status": "ok"}


async def _stream_agent(agent, message_text: str) -> StreamingResponse:
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name=APP_NAME, user_id="sentinel_user", session_id=str(uuid.uuid4())
    )
    runner = Runner(agent=agent, app_name=APP_NAME, session_service=session_service)
    user_message = Content(role="user", parts=[Part(text=message_text)])

    async def event_generator():
        full_text = ""
        try:
            async for event in runner.run_async(
                user_id="sentinel_user", session_id=session.id, new_message=user_message
            ):
                if event.content and event.content.parts:
                    for part in event.content.parts:
                        if hasattr(part, "text") and part.text:
                            full_text += part.text
                            yield f"data: {part.text.replace(chr(10), chr(92)+'n')}\n\n"

            digest = full_text.strip()
            for fence in ["```json", "```"]:
                if digest.startswith(fence):
                    digest = digest[len(fence):]
            if digest.endswith("```"):
                digest = digest[:-3]
            yield f"event: done\ndata: {digest.strip().replace(chr(10), '')}\n\n"
        except Exception as e:
            logger.exception("Pipeline error")
            yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.post("/analyze/vendor")
async def analyze_vendor(request: VendorRequest):
    return await _stream_agent(
        vendor_risk_agent,
        f"vendors: {request.vendors}\nindustry: {request.industry}"
    )


@app.post("/analyze/regulatory")
async def analyze_regulatory(request: RegulatoryRequest):
    return await _stream_agent(
        regulatory_agent,
        f"industry: {request.industry}\nregion: {request.region}"
    )


@app.post("/analyze/knowledge")
async def analyze_knowledge(request: KnowledgeRequest):
    agent = create_knowledge_health_agent()
    return await _stream_agent(agent, f"drive_folder_url: {request.drive_folder_url}")
