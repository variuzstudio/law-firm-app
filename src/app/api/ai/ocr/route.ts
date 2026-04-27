import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const VISION_MODEL = 'qwen/qwen-2.5-vl-72b-instruct:free'
const SECRET = process.env.NEXTAUTH_SECRET || 'salomo-partners-dev-secret-change-in-production'

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })

  try {
    const { imageBase64, mimeType } = await req.json()

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://law-firm-app-three.vercel.app',
        'X-Title': 'Salomo Partners Legal AI',
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
            { type: 'text', text: 'Extract all text from this document image/PDF accurately. Preserve the original formatting, paragraphs, and structure as much as possible. If the document contains legal text, maintain article numbers, section headers, and references. Return only the extracted text.' },
          ],
        }],
        temperature: 0.2,
        max_tokens: 8192,
      }),
    })

    const data = await res.json()
    if (data.error) return NextResponse.json({ error: `AI API: ${data.error.message || JSON.stringify(data.error)}` }, { status: 500 })

    const text = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ text })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
