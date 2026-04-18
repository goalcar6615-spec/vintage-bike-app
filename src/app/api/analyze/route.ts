import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType } = await request.json();
    if (!imageBase64) return NextResponse.json({ error: 'No image' }, { status: 400 });

    const response = await client.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: imageBase64 } },
          { type: 'text', text: `วิเคราะห์จักรยานวินเทจในรูป ตอบเป็น JSON เท่านั้น:\n{"brand":"","model":"","era":"","origin":"","frame_material":"","frame_type":"","groupset":"","drivetrain":"","color":"","overall_condition":"","rarity":3,"collectibility":"","market_price_thb":"","highlights":[],"buying_advice":"","fun_fact":""}` }
        ]
      }]
    });

    const text = response.content.map(c => ('text' in c ? c.text : '')).join('');
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
