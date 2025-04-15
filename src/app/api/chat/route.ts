import OpenAI from 'openai';
import { NextResponse } from 'next/server';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI mental health support assistant. Your role is to:
- Provide empathetic and supportive responses
- Use evidence-based therapeutic techniques (CBT, DBT)
- Help users explore their thoughts and feelings
- Suggest healthy coping strategies
- Recognize signs of crisis and direct to professional help
- Always maintain appropriate boundaries
- Be clear that you are an AI and not a replacement for professional therapy

Important: If you detect signs of immediate harm or crisis, always provide emergency resources and encourage seeking professional help.`;

export async function POST(req: Request) {
  try {
    const { message, messageHistory } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const conversationHistory = messageHistory?.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    })) || [];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = response.choices[0].message?.content;
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}