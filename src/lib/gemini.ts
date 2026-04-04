export async function chatWithGemini(
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Chat failed')
  return data.text
}

export async function transcribeAudio(
  audioBase64: string,
  mimeType: string,
): Promise<{ raw: string; summary: string }> {
  const res = await fetch('/api/ai/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, mimeType }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Transcription failed')
  return { raw: data.raw, summary: data.summary }
}

export async function compareLawArticles(
  articles: Array<{ title: string; content: string }>,
): Promise<string> {
  const res = await fetch('/api/ai/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articles }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Comparison failed')
  return data.text
}

export async function scanDocument(
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const res = await fetch('/api/ai/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Scanning failed')
  return data.text
}
