import { streamText } from 'ai';

// Mock LanguageModelV1
const mockModel = {
  specificationVersion: 'v2',
  provider: 'mock',
  modelId: 'mock-model',
  async doStream(options) {
    return {
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue({ type: 'text-delta', textDelta: 'Hi ' });
          controller.enqueue({ type: 'text-delta', textDelta: 'there' });
          controller.close();
        }
      }),
      rawCall: { rawPrompt: null, rawSettings: {} }
    };
  }
};

async function test() {
  const result = streamText({
    model: mockModel,
    prompt: 'hello'
  });
  
  const response = result.toUIMessageStreamResponse();
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log("--- CHUNK START ---");
    console.log(decoder.decode(value));
    console.log("--- CHUNK END ---");
  }
}

test().catch(console.error);
