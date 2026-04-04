const GEMINI_KEY_STORAGE = 'salomo-gemini-key'
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const MODEL = 'gemini-2.0-flash'

export function getGeminiKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(GEMINI_KEY_STORAGE)
}

export function setGeminiKey(key: string) {
  localStorage.setItem(GEMINI_KEY_STORAGE, key)
}

export function removeGeminiKey() {
  localStorage.removeItem(GEMINI_KEY_STORAGE)
}

interface GeminiContent {
  role: string
  parts: GeminiPart[]
}

interface GeminiPart {
  text?: string
  inlineData?: { mimeType: string; data: string }
}

interface GeminiResponse {
  candidates?: Array<{
    content: { parts: Array<{ text: string }> }
  }>
  error?: { message: string }
}

async function callGemini(
  contents: GeminiContent[],
  systemInstruction?: string,
): Promise<string> {
  const apiKey = getGeminiKey()
  if (!apiKey) throw new Error('API key not configured. Please set your Gemini API key in Settings.')

  const body: Record<string, unknown> = { contents }

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    }
  }

  body.generationConfig = {
    temperature: 0.7,
    maxOutputTokens: 4096,
  }

  const res = await fetch(`${GEMINI_API_BASE}/${MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data: GeminiResponse = await res.json()

  if (data.error) throw new Error(data.error.message)
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Empty response from Gemini')
  }

  return data.candidates[0].content.parts[0].text
}

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

export async function chatWithGemini(
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  const contents: GeminiContent[] = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  return callGemini(contents, LEGAL_SYSTEM_PROMPT)
}

export async function transcribeAudio(audioBase64: string, mimeType: string): Promise<{ raw: string; summary: string }> {
  const transcribeContents: GeminiContent[] = [
    {
      role: 'user',
      parts: [
        { inlineData: { mimeType, data: audioBase64 } },
        { text: 'Transcribe this audio recording accurately. Return only the transcription text, preserving the original language used in the audio.' },
      ],
    },
  ]

  const raw = await callGemini(transcribeContents)

  const summarizeContents: GeminiContent[] = [
    {
      role: 'user',
      parts: [
        {
          text: `Berikut adalah transkrip dari sebuah rekaman audio. Buatkan ringkasan yang terstruktur dan profesional.

Transkrip:
${raw}

Buat ringkasan dengan format:
1. Poin-poin utama
2. Kesimpulan
3. Tindak lanjut yang disarankan (jika ada)`,
        },
      ],
    },
  ]

  const summary = await callGemini(summarizeContents)

  return { raw, summary }
}

export async function compareLawArticles(
  articles: Array<{ title: string; content: string }>,
): Promise<string> {
  const articleTexts = articles
    .map((a, i) => `--- Pasal ${i + 1}: ${a.title} ---\n${a.content}`)
    .join('\n\n')

  const contents: GeminiContent[] = [
    {
      role: 'user',
      parts: [
        {
          text: `Sebagai ahli hukum Indonesia, bandingkan dan analisis pasal-pasal berikut:

${articleTexts}

Berikan analisis dalam format berikut:

**PERSAMAAN:**
- (daftar persamaan)

**PERBEDAAN:**
- (daftar perbedaan)

**ANALISIS:**
(analisis mendalam tentang hubungan antar pasal, potensi konflik, dan implikasi hukum)

**REKOMENDASI:**
(rekomendasi untuk praktisi hukum)`,
        },
      ],
    },
  ]

  return callGemini(contents, LEGAL_SYSTEM_PROMPT)
}

export async function scanDocument(imageBase64: string, mimeType: string): Promise<string> {
  const contents: GeminiContent[] = [
    {
      role: 'user',
      parts: [
        { inlineData: { mimeType, data: imageBase64 } },
        {
          text: `Extract all text from this document image/PDF accurately. 
Preserve the original formatting, paragraphs, and structure as much as possible.
If the document contains legal text, maintain article numbers, section headers, and references.
Return only the extracted text.`,
        },
      ],
    },
  ]

  return callGemini(contents)
}
