import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'openrouter/free'
const SECRET = process.env.NEXTAUTH_SECRET || 'salomo-partners-dev-secret-change-in-production'

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })

  try {
    const { articles } = await req.json()

    const articleTexts = articles
      .map((a: { title: string; content: string }, i: number) => `--- Pasal ${i + 1}: ${a.title} ---\n${a.content}`)
      .join('\n\n')

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://law-firm-app-three.vercel.app',
        'X-Title': 'Salomo Partners Legal AI',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'Kamu adalah ahli hukum Indonesia yang sangat berpengalaman. Berikan analisis yang mendalam dan akurat.' },
          {
            role: 'user',
            content: `Sebagai ahli hukum Indonesia, bandingkan dan analisis pasal-pasal berikut:\n\n${articleTexts}\n\nBerikan analisis dalam format berikut:\n\n**PERSAMAAN:**\n- (daftar persamaan)\n\n**PERBEDAAN:**\n- (daftar perbedaan)\n\n**ANALISIS:**\n(analisis mendalam tentang hubungan antar pasal, potensi konflik, dan implikasi hukum)\n\n**REKOMENDASI:**\n(rekomendasi untuk praktisi hukum)`,
          },
        ],
        temperature: 0.5,
        max_tokens: 4096,
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
