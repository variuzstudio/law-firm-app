import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const TRANSCRIBE_MODEL = 'google/gemini-2.0-flash-001'
const SUMMARY_MODEL = 'google/gemini-2.0-flash-001'
const SECRET = process.env.NEXTAUTH_SECRET || 'salomo-partners-dev-secret-change-in-production'

async function callOpenRouter(apiKey: string, model: string, messages: unknown[], temperature = 0.3) {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://law-firm-app-three.vercel.app',
      'X-Title': 'Salomo Partners Legal AI',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 8192,
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`OpenRouter API: ${data.error.message || JSON.stringify(data.error)}`)
  return data.choices?.[0]?.message?.content || ''
}

async function transcribeAudio(apiKey: string, audioBase64: string, mimeType: string): Promise<string> {
  const dataUrl = `data:${mimeType || 'audio/webm'};base64,${audioBase64}`
  return callOpenRouter(apiKey, TRANSCRIBE_MODEL, [{
    role: 'user',
    content: [
      {
        type: 'image_url',
        image_url: { url: dataUrl },
      },
      {
        type: 'text',
        text: 'Transcribe this audio recording accurately. Return only the transcription text, preserving the original language. Do not add any commentary or labels.',
      },
    ],
  }], 0.2)
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      error: 'OPENROUTER_API_KEY belum dikonfigurasi. Silakan hubungi administrator.',
    }, { status: 503 })
  }

  try {
    const { audioBase64, mimeType, audioText } = await req.json()

    let raw = ''

    if (audioText) {
      raw = audioText
    } else if (audioBase64) {
      if (typeof audioBase64 !== 'string' || audioBase64.length < 100) {
        return NextResponse.json({ error: 'Data audio tidak valid atau kosong. Silakan rekam ulang.' }, { status: 400 })
      }

      const sizeInMB = (audioBase64.length * 3) / 4 / 1024 / 1024
      if (sizeInMB > 3.5) {
        return NextResponse.json({
          error: `File audio terlalu besar (${sizeInMB.toFixed(1)}MB). Maksimum 3.5MB. Coba rekam audio yang lebih pendek.`,
        }, { status: 413 })
      }

      raw = await transcribeAudio(apiKey, audioBase64, mimeType || 'audio/webm')
    }

    if (!raw) {
      return NextResponse.json({ error: 'Tidak ada data audio atau teks untuk diproses.' }, { status: 400 })
    }

    const summary = await callOpenRouter(apiKey, SUMMARY_MODEL, [{
      role: 'user',
      content: `Berikut adalah transkrip dari sebuah rekaman audio. Buatkan ringkasan yang terstruktur dan profesional.\n\nTranskrip:\n${raw}\n\nBuat ringkasan dengan format:\n1. Poin-poin utama\n2. Kesimpulan\n3. Tindak lanjut yang disarankan (jika ada)`,
    }])

    return NextResponse.json({ raw, summary })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
