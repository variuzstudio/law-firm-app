'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import {
  Upload, Mic, Square, AudioLines, Copy, Check, Download, FileText, Sparkles,
  Play, Pause, Trash2, Clock, AlertCircle,
} from 'lucide-react'

interface Recording {
  id: string
  name: string
  blobUrl: string
  duration: number
  date: string
  transcript?: string
}

export default function AudioTranscribePage() {
  const { isAuthenticated, loading } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()

  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rawText, setRawText] = useState('')
  const [summary, setSummary] = useState('')
  const [activeTab, setActiveTab] = useState<'raw' | 'summary'>('raw')
  const [copied, setCopied] = useState(false)
  const [fileName, setFileName] = useState('')
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(null)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [speechSupported, setSpeechSupported] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  const isRecordingRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const liveTranscriptRef = useRef('')
  const recordingTimeRef = useRef(0)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition
      setSpeechSupported(!!SR)
    }
  }, [])

  useEffect(() => {
    if (isRecording) {
      recordingTimeRef.current = 0
      timerRef.current = setInterval(() => {
        recordingTimeRef.current += 1
        setRecordingTime(recordingTimeRef.current)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRecording])

  const blobToBase64 = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        resolve(result.split(',')[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }, [])

  if (!isAuthenticated) return null

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  function startSpeechRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) return

    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch { /* */ }
    }

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language === 'id' ? 'id-ID' : 'en-US'
    recognition.maxAlternatives = 1

    recognition.onresult = (event: { resultIndex: number; results: SpeechRecognitionResultList }) => {
      let finalText = liveTranscriptRef.current
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript
        if (result.isFinal) {
          finalText += (finalText ? ' ' : '') + transcript.trim()
          liveTranscriptRef.current = finalText
          setLiveTranscript(finalText)
        } else {
          interim += transcript
        }
      }
      setInterimText(interim)
    }

    recognition.onerror = (e: { error: string }) => {
      if (e.error === 'not-allowed') {
        setSpeechSupported(false)
      }
    }

    recognition.onend = () => {
      if (isRecordingRef.current) {
        setTimeout(() => {
          if (isRecordingRef.current && recognitionRef.current) {
            try { recognitionRef.current.start() } catch { /* */ }
          }
        }, 100)
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      setSpeechSupported(false)
    }
  }

  function stopSpeechRecognition() {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch { /* */ }
      recognitionRef.current = null
    }
  }

  function getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/wav',
    ]
    for (const type of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }
    return ''
  }

  function getFileExtension(mimeType: string): string {
    if (mimeType.includes('webm')) return '.webm'
    if (mimeType.includes('mp4')) return '.mp4'
    if (mimeType.includes('ogg')) return '.ogg'
    if (mimeType.includes('wav')) return '.wav'
    return '.audio'
  }

  const handleRecord = async () => {
    if (isRecording) {
      isRecordingRef.current = false
      setIsRecording(false)
      setInterimText('')
      stopSpeechRecognition()
      mediaRecorderRef.current?.stop()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      const mimeType = getSupportedMimeType()
      const options = mimeType ? { mimeType } : undefined
      const mediaRecorder = new MediaRecorder(stream, options)
      const actualMime = mediaRecorder.mimeType || mimeType || 'audio/webm'

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      liveTranscriptRef.current = ''
      setLiveTranscript('')
      setInterimText('')
      setRawText('')
      setSummary('')

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null

        const blob = new Blob(chunksRef.current, { type: actualMime })
        const blobUrl = URL.createObjectURL(blob)
        const now = new Date()
        const ext = getFileExtension(actualMime)
        const recName = `Recording_${now.toISOString().slice(0, 10)}_${now.toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '-')}${ext}`

        const capturedTranscript = liveTranscriptRef.current

        const newRecording: Recording = {
          id: `rec-${Date.now()}`,
          name: recName,
          blobUrl,
          duration: recordingTimeRef.current,
          date: now.toLocaleString(),
          transcript: capturedTranscript || undefined,
        }

        setRecordings((prev) => [newRecording, ...prev])
        setFileName(recName)
        setSelectedRecordingId(newRecording.id)

        if (capturedTranscript) {
          setRawText(capturedTranscript)
          setActiveTab('raw')
        }
      }

      mediaRecorder.start(1000)
      setRecordingTime(0)
      recordingTimeRef.current = 0
      isRecordingRef.current = true
      setIsRecording(true)

      startSpeechRecognition()
    } catch {
      alert(language === 'id'
        ? 'Tidak dapat mengakses mikrofon. Izinkan akses mikrofon di pengaturan browser.'
        : 'Could not access microphone. Please allow microphone permission in browser settings.')
    }
  }

  const handleUpload = () => fileInputRef.current?.click()

  const getAudioDuration = (blobUrl: string): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration === Infinity || isNaN(audio.duration)) {
          audio.currentTime = 1e10
          audio.addEventListener('timeupdate', function handler() {
            audio.removeEventListener('timeupdate', handler)
            resolve(Math.round(audio.duration))
            audio.currentTime = 0
          })
        } else {
          resolve(Math.round(audio.duration))
        }
      })
      audio.addEventListener('error', () => resolve(0))
      audio.src = blobUrl
    })
  }

  const processUploadedFile = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert(language === 'id' ? 'File harus berformat audio (MP3, WAV, M4A, WEBM)' : 'File must be an audio format (MP3, WAV, M4A, WEBM)')
      return
    }

    const blobUrl = URL.createObjectURL(file)
    const duration = await getAudioDuration(blobUrl)
    const newRecording: Recording = {
      id: `rec-${Date.now()}`,
      name: file.name,
      blobUrl,
      duration,
      date: new Date().toLocaleString(),
    }

    setRecordings((prev) => [newRecording, ...prev])
    setFileName(file.name)
    setSelectedRecordingId(newRecording.id)
    setRawText('')
    setSummary('')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processUploadedFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await processUploadedFile(file)
  }

  const handlePlayPause = (rec: Recording) => {
    if (playingId === rec.id) {
      audioPlayerRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
      }
      const audio = new Audio(rec.blobUrl)
      audioPlayerRef.current = audio
      audio.onended = () => setPlayingId(null)
      audio.onerror = () => setPlayingId(null)
      audio.play().catch(() => setPlayingId(null))
      setPlayingId(rec.id)
    }
  }

  const handleSelectRecording = (rec: Recording) => {
    setFileName(rec.name)
    setSelectedRecordingId(rec.id)
    if (rec.transcript) {
      setRawText(rec.transcript)
      setActiveTab('raw')
    } else {
      setRawText('')
    }
    setSummary('')
  }

  const handleDeleteRecording = (id: string) => {
    const rec = recordings.find((r) => r.id === id)
    if (rec) URL.revokeObjectURL(rec.blobUrl)
    if (playingId === id) {
      audioPlayerRef.current?.pause()
      setPlayingId(null)
    }
    setRecordings((prev) => prev.filter((r) => r.id !== id))
    if (selectedRecordingId === id) {
      setSelectedRecordingId(null)
      setFileName('')
      setRawText('')
      setSummary('')
    }
  }

  const generateLocalSummary = (text: string): string => {
    const words = text.split(/\s+/).filter(Boolean)
    const sentences = text.split(/[.!?।]+/).filter((s) => s.trim().length > 5)
    const keyPoints = sentences.slice(0, Math.min(5, sentences.length))

    if (language === 'id') {
      return [
        '📋 Ringkasan Transkripsi',
        '',
        '📌 Poin-poin Utama:',
        ...keyPoints.map((s, i) => `  ${i + 1}. ${s.trim()}`),
        '',
        '📊 Statistik:',
        `  - Total kata: ${words.length}`,
        `  - Total kalimat: ${sentences.length}`,
        '',
        '✅ Kesimpulan:',
        'Transkripsi berhasil dilakukan menggunakan pengenalan suara browser.',
      ].join('\n')
    }
    return [
      '📋 Transcription Summary',
      '',
      '📌 Key Points:',
      ...keyPoints.map((s, i) => `  ${i + 1}. ${s.trim()}`),
      '',
      '📊 Statistics:',
      `  - Total words: ${words.length}`,
      `  - Total sentences: ${sentences.length}`,
      '',
      '✅ Conclusion:',
      'Transcription completed using browser speech recognition.',
    ].join('\n')
  }

  const generateSummary = async (text: string) => {
    if (!text.trim()) return
    setIsProcessing(true)
    try {
      const apiRes = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioText: text }),
      })
      const data = await apiRes.json()
      if (apiRes.ok && data.summary) {
        setSummary(data.summary)
      } else {
        setSummary(generateLocalSummary(text))
      }
    } catch {
      setSummary(generateLocalSummary(text))
    }
    setIsProcessing(false)
  }

  const handleTranscribe = async () => {
    const selectedRec = recordings.find((r) => r.id === selectedRecordingId)
    if (!selectedRec) return

    if (selectedRec.transcript) {
      setRawText(selectedRec.transcript)
      setActiveTab('raw')
      generateSummary(selectedRec.transcript)
      return
    }

    if (rawText.trim()) {
      generateSummary(rawText)
      return
    }

    setIsProcessing(true)
    setRawText('')
    setSummary('')

    try {
      const response = await fetch(selectedRec.blobUrl)
      const blob = await response.blob()
      const base64 = await blobToBase64(blob)

      const apiRes = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64, mimeType: blob.type || 'audio/webm' }),
      })
      const data = await apiRes.json()

      if (apiRes.ok && data.raw) {
        setRawText(data.raw)
        setSummary(data.summary || '')
        setRecordings((prev) => prev.map((r) => r.id === selectedRec.id ? { ...r, transcript: data.raw } : r))
      } else {
        const hint = language === 'id'
          ? '💡 Untuk file audio yang diunggah, gunakan fitur "Rekam Audio" untuk hasil terbaik.\n\nFitur rekam menggunakan pengenalan suara real-time yang bekerja langsung di browser tanpa memerlukan API tambahan.\n\nCara penggunaan:\n1. Klik tombol mikrofon untuk mulai merekam\n2. Bicara dengan jelas\n3. Teks akan muncul secara real-time saat Anda berbicara\n4. Klik stop untuk menyelesaikan rekaman'
          : '💡 For uploaded audio files, use the "Record Audio" feature for best results.\n\nRecording uses real-time speech recognition that works directly in your browser without additional API.\n\nHow to use:\n1. Click the microphone button to start recording\n2. Speak clearly\n3. Text will appear in real-time as you speak\n4. Click stop to finish recording'
        setRawText(hint)
        setActiveTab('raw')
      }
    } catch {
      setRawText(language === 'id'
        ? '⚠️ Gagal memproses audio. Gunakan fitur Rekam Audio untuk transkripsi otomatis.'
        : '⚠️ Failed to process audio. Use the Record Audio feature for automatic transcription.')
      setActiveTab('raw')
    }
    setIsProcessing(false)
  }

  const handleCopy = () => {
    const text = activeTab === 'raw' ? rawText : summary
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const text = activeTab === 'raw' ? rawText : summary
    const label = activeTab === 'raw' ? 'Transcription' : 'AI_Summary'
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Salomo_Partners_${label}_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <AppLayout>
      <div className="space-y-5 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
            <AudioLines className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              {t('audio.title')} <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-xs text-[var(--text-muted)]">{t('audio.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">{t('audio.record')}</h3>
              <div className="flex flex-col items-center py-4">
                <button
                  onClick={handleRecord}
                  className={`w-24 h-24 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/30'
                      : 'bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-500/20'
                  }`}
                >
                  {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                </button>
                <p className="text-xs text-[var(--text-muted)] mt-3">
                  {isRecording
                    ? t('audio.stop')
                    : t('audio.record')}
                </p>

                {isRecording && (
                  <div className="mt-3 text-center w-full">
                    <p className="text-2xl font-mono font-bold text-red-500">{formatTime(recordingTime)}</p>
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1 justify-center">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      {t('audio.recording')}
                    </p>
                    {(liveTranscript || interimText) && (
                      <div className="mt-3 p-3 rounded-xl bg-[var(--bg-input)] text-left max-h-[120px] overflow-y-auto border border-[var(--border-color)]">
                        <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                          {liveTranscript}
                          {interimText && <span className="text-[var(--accent)] italic"> {interimText}</span>}
                        </p>
                      </div>
                    )}
                    {!liveTranscript && !interimText && speechSupported && recordingTime > 2 && (
                      <p className="text-xs text-[var(--text-muted)] mt-2 italic">
                        {language === 'id' ? 'Mendengarkan... Silakan bicara.' : 'Listening... Please speak.'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {!speechSupported && (
                <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-500">
                    {language === 'id'
                      ? 'Browser Anda tidak mendukung pengenalan suara. Gunakan Chrome atau Edge untuk hasil terbaik.'
                      : 'Your browser does not support speech recognition. Use Chrome or Edge for best results.'}
                  </p>
                </div>
              )}
            </div>

            {recordings.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <AudioLines className="w-4 h-4" /> {t('audio.recordings')} ({recordings.length})
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {recordings.map((rec) => (
                    <div
                      key={rec.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                        selectedRecordingId === rec.id
                          ? 'bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] border-opacity-30'
                          : 'hover:bg-[var(--accent-light)] border border-transparent'
                      }`}
                      onClick={() => handleSelectRecording(rec)}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePlayPause(rec) }}
                        className={`w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95 ${
                          playingId === rec.id
                            ? 'bg-[var(--accent)] text-white shadow-lg'
                            : 'bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white'
                        }`}
                      >
                        {playingId === rec.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{rec.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <Clock className="w-3 h-3" />
                            {rec.duration > 0 ? formatTime(rec.duration) : '--:--'}
                          </span>
                          {rec.transcript && (
                            <span className="text-xs text-emerald-500 font-medium">✓ {language === 'id' ? 'Tertranskripsi' : 'Transcribed'}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteRecording(rec.id) }}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 flex-shrink-0 active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">{t('audio.upload')}</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={handleUpload}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer active:scale-[0.98] ${
                  isDragging
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] scale-[1.02]'
                    : 'border-[var(--border-color)] hover:border-[var(--accent)]'
                }`}
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors ${isDragging ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                <p className="text-sm text-[var(--text-secondary)]">{t('audio.dragDrop')}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{t('audio.formats')}</p>
              </div>
              {selectedRecordingId && fileName && (
                <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-[var(--accent-light)]">
                  <FileText className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  <span className="text-sm text-[var(--text-primary)] truncate flex-1">{fileName}</span>
                  <span className="text-xs text-emerald-500 font-medium flex-shrink-0">Ready</span>
                </div>
              )}
            </div>

            <button
              onClick={handleTranscribe}
              disabled={!selectedRecordingId || isProcessing || isRecording}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-50 active:scale-[0.98]"
            >
              {isProcessing ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('audio.processing')}</>
              ) : (
                <><Sparkles className="w-5 h-5" /> {t('audio.transcribe')}</>
              )}
            </button>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card flex flex-col h-full min-h-[300px] lg:min-h-[500px]">
              <div className="flex items-center border-b border-[var(--border-color)]">
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors border-b-2 ${
                    activeTab === 'raw' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {t('audio.rawText')}
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors border-b-2 ${
                    activeTab === 'summary' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {t('audio.summary')} <Sparkles className="w-3 h-3 inline text-amber-400" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {(activeTab === 'raw' ? rawText : summary) ? (
                  <div className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                    {activeTab === 'raw' ? rawText : summary}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <AudioLines className="w-12 h-12 text-[var(--text-muted)] mb-3" />
                    <p className="text-sm text-[var(--text-muted)]">{t('audio.noTranscription')}</p>
                  </div>
                )}
              </div>

              {(rawText || summary) && (
                <div className="p-3 border-t border-[var(--border-color)] flex items-center gap-2 flex-wrap">
                  <button onClick={handleCopy} className="btn-secondary text-xs py-2 px-3 active:scale-95">
                    {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> {t('audio.copyText')}</>}
                  </button>
                  <button onClick={handleDownload} className="btn-secondary text-xs py-2 px-3 active:scale-95">
                    <Download className="w-3 h-3" /> {language === 'id' ? 'Unduh' : 'Download'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
