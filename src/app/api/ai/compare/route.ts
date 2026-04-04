import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const MODEL = 'gemini-2.0-flash'

const LEGAL_SYSTEM_PROMPT = `Kamu adalah ahli hukum Indonesia yang sangat berpengalaman. Berikan analisis yang mendalam dan akurat.`

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })

  try {
    const { articles } = await req.json()

    const articleTexts = articles
      .map((a: { title: string; content: string }, i: number) => `--- Pasal ${i + 1}: ${a.title} ---\n${a.content}`)
      .join('\n\n')

    const res = await fetch(`${GEMINI_API_BASE}/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: `Sebagai ahli hukum Indonesia, bandingkan dan analisis pasal-pasal berikut:\n\n${articleTexts}\n\nBerikan analisis dalam format berikut:\n\n**PERSAMAAN:**\n- (daftar persamaan)\n\n**PERBEDAAN:**\n- (daftar perbedaan)\n\n**ANALISIS:**\n(analisis mendalam tentang hubungan antar pasal, potensi konflik, dan implikasi hukum)\n\n**REKOMENDASI:**\n(rekomendasi untuk praktisi hukum)`,
          }],
        }],
        systemInstruction: { parts: [{ text: LEGAL_SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.5, maxOutputTokens: 4096 },
      }),
    })

    const data = await res.json()
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return NextResponse.json({ text })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
