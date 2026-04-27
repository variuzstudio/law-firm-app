import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'openrouter/free'

const LEGAL_SYSTEM_PROMPT = `Kamu adalah asisten hukum AI yang sangat ahli dalam hukum Indonesia. 
Kamu membantu pengacara dan praktisi hukum dengan:
- Menjelaskan pasal-pasal dalam UU, Peraturan Pemerintah, dan regulasi Indonesia
- Memberikan analisis hukum yang akurat dan mendalam
- Membantu menyusun dokumen hukum
- Memberikan referensi ke undang-undang dan peraturan yang relevan
- Menjelaskan prosedur hukum di Indonesia

Jawab dengan bahasa yang sesuai dengan pertanyaan (Indonesia atau English).
Selalu berikan referensi pasal atau undang-undang jika relevan.
Jika kamu tidak yakin, sampaikan dengan jujur dan sarankan untuk konsultasi lebih lanjut.`

const SECRET = process.env.NEXTAUTH_SECRET || 'salomo-partners-dev-secret-change-in-production'

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized - please login first' }, { status: 401 })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'AI service not configured (OPENROUTER_API_KEY missing)' }, { status: 503 })

  try {
    const { messages } = await req.json()

    const openRouterMessages = [
      { role: 'system', content: LEGAL_SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ]

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
        messages: openRouterMessages,
        temperature: 0.7,
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
