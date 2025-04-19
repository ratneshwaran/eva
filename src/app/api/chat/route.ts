import { OpenAI } from 'openai';
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

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Invalid messages format. Expected non-empty array of messages.' },
        { status: 400 }
      );
    }

    // Validate each message has required properties
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string') {
        return Response.json(
          { error: 'Invalid message format. Each message must have role and content.' },
          { status: 400 }
        );
      }
    }

    // Add system message to the beginning of the conversation
    const conversationWithSystem = [systemMessage, ...messages];

    // Ask OpenAI for a chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: conversationWithSystem,
      max_tokens: 500,
      temperature: 0.7,
      frequency_penalty: 0.5,
    });

    const responseMessage = completion.choices[0].message;

    // Return the response with the expected message field
    return Response.json({
      message: responseMessage.content
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    
    if (error instanceof Error) {
      // Check for specific OpenAI API errors
      if (error.message.includes('API key')) {
        return Response.json(
          { error: 'Configuration error. Please check API settings.' },
          { status: 500 }
        );
      }
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json(
      { error: 'An unknown error occurred' }, 
      { status: 500 }
    );
  }
}