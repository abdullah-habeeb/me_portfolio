import { streamText } from 'ai';
import { createMockLanguageModel } from 'ai/test';

async function test() {
  const model = createMockLanguageModel({
    doStream: async () => ({
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue({ type: 'text-delta', textDelta: 'Hi' });
          controller.enqueue({ type: 'text-delta', textDelta: ' there' });
          controller.close();
        },
      }),
      rawCall: { rawPrompt: null, rawSettings: {} },
    }),
  });

  const result = streamText({
    model,
    prompt: 'hello',
  });

  const response = result.toUIMessageStreamResponse();
  console.log("Status:", response.status);
  console.log("Headers:", Object.fromEntries(response.headers.entries()));
  
  const reader = response.body.getReader();
  let done = false;
  while (!done) {
    const { value, done: isDone } = await reader.read();
    done = isDone;
    if (value) {
      console.log("CHUNK:", new TextDecoder().decode(value));
    }
  }
}

test();
