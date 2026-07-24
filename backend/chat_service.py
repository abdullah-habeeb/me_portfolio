import json
import uuid
from fastapi.responses import StreamingResponse
from markdown_loader import load_markdown_for_page
from prompt_builder import build_system_prompt, trim_history
from gemini_client import stream_chat

def process_chat_request(page: str, messages: list):
    markdown_content = load_markdown_for_page(page)
    system_prompt = build_system_prompt(markdown_content)
    
    # Extract the last message as the current user message
    if not messages:
        return StreamingResponse(iter([]), media_type="text/plain")
        
    current_message = messages[-1]
    history = trim_history(messages, max_messages=6)
    
    chat_messages = []
    for msg in (history + [current_message]):
        role = "user" if msg.get("role") == "user" else "assistant"

        # New AI SDK uses parts
        parts = msg.get("parts")
        if parts and isinstance(parts, list):
            text_content = "".join([p.get("text", "") for p in parts if p.get("type") == "text"])
        else:
            content = msg.get("content", "")
            text_content = content if isinstance(content, str) else str(content)

        chat_messages.append({
            "role": role,
            "content": text_content
        })

    def event_stream():
        msg_id = str(uuid.uuid4())
        # Format according to Vercel AI SDK UI Stream protocol (SSE)
        yield f'data: {json.dumps({"type": "text-start", "id": msg_id})}\n\n'

        for chunk in stream_chat(system_prompt, chat_messages):
            yield f'data: {json.dumps({"type": "text-delta", "id": msg_id, "delta": chunk})}\n\n'
            
        yield f'data: {json.dumps({"type": "text-end", "id": msg_id})}\n\n'
        yield f'data: {json.dumps({"type": "finish", "finishReason": "stop"})}\n\n'
            
    return StreamingResponse(
        event_stream(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    )
