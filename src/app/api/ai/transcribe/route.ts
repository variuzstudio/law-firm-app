import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const MODEL = 'gemini-2.0-flash'

async function callGemini(apiKey: string, contents: unknown[]) {
  const res = await fetch(`${GEMINI_API_BASE}/${MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, generationConfig: { temperature: 0.3, maxOutputTokens: 8192 } }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })

  try {
    const { audioBase64, mimeType } = await req.json()

    const raw = await callGemini(apiKey, [{
      role: 'user',
      parts: [
        { inlineData: { mimeType, data: audioBase64 } },
        { text: 'Transcribe this audio recording accurately. Return only the transcription text, preserving the original language used in the audio.' },
      ],
    }])

    const summary = await callGemini(apiKey, [{
      role: 'user',
      parts: [{
        text: `Berikut adalah transkrip dari sebuah rekaman audio. Buatkan ringkasan yang terstruktur dan profesional.\n\nTranskrip:\n${raw}\n\nBuat ringkasan dengan format:\n1. Poin-poin utama\n2. Kesimpulan\n3. Tindak lanjut yang disarankan (jika ada)`,
      }],
    }])

    return NextResponse.json({ raw, summary })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
