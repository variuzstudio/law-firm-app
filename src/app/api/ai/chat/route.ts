import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const MODEL = 'gemini-2.0-flash'

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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })

  try {
    const { messages } = await req.json()

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const res = await fetch(`${GEMINI_API_BASE}/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: LEGAL_SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
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
