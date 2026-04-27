import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'openrouter/free'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
const SECRET = process.env.NEXTAUTH_SECRET || 'salomo-partners-dev-secret-change-in-production'

async function callOpenRouter(apiKey: string, messages: unknown[]) {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://law-firm-app-three.vercel.app',
      'X-Title': 'Salomo Partners Legal AI',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 8192,
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`AI API: ${data.error.message || JSON.stringify(data.error)}`)
  return data.choices?.[0]?.message?.content || ''
}

async function transcribeWithGemini(geminiKey: string, audioBase64: string, mimeType: string): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: mimeType || 'audio/webm', data: audioBase64 } },
          { text: 'Transcribe this audio recording accurately. Return only the transcription text, preserving the original language. Do not add any commentary or labels.' },
        ],
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
      },
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`Gemini API: ${data.error.message || JSON.stringify(data.error)}`)
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const openrouterKey = process.env.OPENROUTER_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY

  try {
    const { audioBase64, mimeType, audioText } = await req.json()

    let raw = ''

    if (audioText) {
      raw = audioText
    } else if (audioBase64) {
      if (!geminiKey) {
        return NextResponse.json({
          error: 'GEMINI_API_KEY belum dikonfigurasi. Silakan hubungi administrator untuk mengaktifkan fitur transkripsi audio.',
        }, { status: 503 })
      }

      if (typeof audioBase64 !== 'string' || audioBase64.length < 100) {
        return NextResponse.json({ error: 'Data audio tidak valid atau kosong. Silakan rekam ulang.' }, { status: 400 })
      }

      const sizeInMB = (audioBase64.length * 3) / 4 / 1024 / 1024
      if (sizeInMB > 3.5) {
        return NextResponse.json({
          error: `File audio terlalu besar (${sizeInMB.toFixed(1)}MB). Maksimum 3.5MB. Coba rekam audio yang lebih pendek.`,
        }, { status: 413 })
      }

      raw = await transcribeWithGemini(geminiKey, audioBase64, mimeType || 'audio/webm')
    }

    if (!raw) {
      return NextResponse.json({ error: 'Tidak ada data audio atau teks untuk diproses.' }, { status: 400 })
    }

    let summary = ''
    if (openrouterKey) {
      summary = await callOpenRouter(openrouterKey, [{
        role: 'user',
        content: `Berikut adalah transkrip dari sebuah rekaman audio. Buatkan ringkasan yang terstruktur dan profesional.\n\nTranskrip:\n${raw}\n\nBuat ringkasan dengan format:\n1. Poin-poin utama\n2. Kesimpulan\n3. Tindak lanjut yang disarankan (jika ada)`,
      }])
    } else if (geminiKey) {
      const summaryRes = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Berikut adalah transkrip dari sebuah rekaman audio. Buatkan ringkasan yang terstruktur dan profesional.\n\nTranskrip:\n${raw}\n\nBuat ringkasan dengan format:\n1. Poin-poin utama\n2. Kesimpulan\n3. Tindak lanjut yang disarankan (jika ada)`,
            }],
          }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
        }),
      })
      const summaryData = await summaryRes.json()
      summary = summaryData.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }

    return NextResponse.json({ raw, summary })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
