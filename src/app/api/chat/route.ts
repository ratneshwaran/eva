import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemMessage: ChatCompletionMessageParam = {
  role: 'system',
  content: `You are an AI mental health support assistant. Your role is to:
- Provide empathetic and supportive responses
- Use evidence-based therapeutic techniques (CBT, DBT)
- Help users explore their thoughts and feelings
- Suggest healthy coping strategies
- Recognize signs of crisis and direct to professional help
- Always maintain appropriate boundaries
- Be clear that you are an AI and not a replacement for professional therapy

Important: If you detect signs of immediate harm or crisis, always provide emergency resources and encourage seeking professional help.`
};

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatCompletionMessageParam[] } = await req.json();

    // Add system message to the beginning of the conversation
    const conversationWithSystem = [systemMessage, ...messages];

    // Ask OpenAI for a streaming chat completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: conversationWithSystem,
      max_tokens: 500,
      temperature: 0.7,
      frequency_penalty: 0.5,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }), 
      { status: 500 }
    );
  }
}