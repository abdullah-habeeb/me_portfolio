from google import genai

MODEL_ID = "gemini-3.6-flash"

def get_client():
    # Reads GEMINI_API_KEY from the environment
    return genai.Client()

def stream_chat(system_prompt: str, messages: list):
    client = get_client()

    # Fold the trimmed conversation history into a single transcript for the
    # Interactions API's `input` field.
    turns = []
    for msg in messages[:-1]:
        speaker = "User" if msg["role"] == "user" else "Assistant"
        turns.append(f"{speaker}: {msg['content']}")
    turns.append(f"User: {messages[-1]['content']}")
    conversation_input = "\n\n".join(turns)

    try:
        stream = client.interactions.create(
            model=MODEL_ID,
            system_instruction=system_prompt,
            input=conversation_input,
            stream=True,
        )
        for event in stream:
            if event.event_type == "step.delta" and event.delta.type == "text":
                yield event.delta.text
    except Exception as e:
        yield f"Error connecting to Gemini API: {str(e)}"
