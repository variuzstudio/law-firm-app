'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import { transcribeAudio, getGeminiKey } from '@/lib/gemini'
import { sampleTranscription } from '@/data/aiResponses'
import {
  Upload, Mic, Square, AudioLines, Copy, Check, Download, FileText, Sparkles,
} from 'lucide-react'

export default function AudioTranscribePage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasAudio, setHasAudio] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rawText, setRawText] = useState('')
  const [summary, setSummary] = useState('')
  const [activeTab, setActiveTab] = useState<'raw' | 'summary'>('raw')
  const [copied, setCopied] = useState(false)
  const [fileName, setFileName] = useState('')
  const [audioBase64, setAudioBase64] = useState('')
  const [audioMimeType, setAudioMimeType] = useState('audio/webm')
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000)
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

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const handleRecord = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop())
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const base64 = await blobToBase64(blob)
          setAudioBase64(base64)
          setAudioMimeType('audio/webm')
          setHasAudio(true)
          setFileName('Recording_' + new Date().toISOString().slice(0, 10) + '.webm')
        }

        mediaRecorder.start()
        setRecordingTime(0)
        setIsRecording(true)
        setHasAudio(false)
        setRawText('')
        setSummary('')
      } catch {
        alert('Could not access microphone. Please allow microphone permission.')
      }
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64 = await blobToBase64(file)
    setAudioBase64(base64)
    setAudioMimeType(file.type || 'audio/mpeg')
    setHasAudio(true)
    setFileName(file.name)
    setRawText('')
    setSummary('')
  }

  const handleTranscribe = async () => {
    if (!hasAudio) return
    setIsProcessing(true)
    setRawText('')
    setSummary('')

    try {
      const apiKey = getGeminiKey()
      if (apiKey && audioBase64) {
        const result = await transcribeAudio(audioBase64, audioMimeType)
        setRawText(result.raw)
        setActiveTab('raw')
        setSummary(result.summary)
      } else {
        await new Promise((r) => setTimeout(r, 2000))
        setRawText(sampleTranscription.raw)
        setActiveTab('raw')
        await new Promise((r) => setTimeout(r, 1500))
        setSummary(sampleTranscription.summary)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Transcription failed'
      setRawText(`⚠️ ${errorMsg}\n\nFalling back to demo data...`)
      setSummary('')
      await new Promise((r) => setTimeout(r, 1000))
      setRawText(sampleTranscription.raw)
      setSummary(sampleTranscription.summary)
    }
    setIsProcessing(false)
  }

  const handleCopy = () => {
    const text = activeTab === 'raw' ? rawText : summary
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    const text = activeTab === 'raw' ? rawText : summary
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(`<html><head><title>Salomo Partners - Transcription</title><style>body{font-family:sans-serif;padding:40px;line-height:1.8;max-width:800px;margin:0 auto}h1{color:#1e3a5f;border-bottom:2px solid #3b82f6;padding-bottom:10px}pre{white-space:pre-wrap;font-family:sans-serif}</style></head><body><h1>Salomo Partners - ${activeTab === 'raw' ? 'Raw Transcription' : 'AI Summary'}</h1><p style="color:#666;font-size:12px">${fileName} | ${new Date().toLocaleString()}</p><hr style="border:none;border-top:1px solid #eee;margin:20px 0"><pre>${text}</pre></body></html>`)
      w.document.close()
      w.print()
    }
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
              <div className="flex flex-col items-center py-6">
                <button
                  onClick={handleRecord}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/30'
                      : 'bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-500/20'
                  }`}
                >
                  {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                </button>
                {isRecording && (
                  <div className="mt-4 text-center">
                    <p className="text-2xl font-mono font-bold text-red-500">{formatTime(recordingTime)}</p>
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1 justify-center">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      {t('audio.recording')}
                    </p>
                  </div>
                )}
                {!isRecording && !hasAudio && (
                  <p className="text-xs text-[var(--text-muted)] mt-4">{t('audio.record')}</p>
                )}
              </div>
            </div>

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
                className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 text-center hover:border-[var(--accent)] transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">{t('audio.dragDrop')}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{t('audio.formats')}</p>
              </div>
              {hasAudio && fileName && (
                <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-[var(--accent-light)]">
                  <FileText className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm text-[var(--text-primary)] truncate flex-1">{fileName}</span>
                  <span className="text-xs text-emerald-500 font-medium">Ready</span>
                </div>
              )}
            </div>

            <button
              onClick={handleTranscribe}
              disabled={!hasAudio || isProcessing}
              className="btn-primary w-full py-3 text-base disabled:opacity-50"
            >
              {isProcessing ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('audio.processing')}</>
              ) : (
                <><Sparkles className="w-5 h-5" /> {t('audio.transcribe')}</>
              )}
            </button>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card flex flex-col h-full min-h-[500px]">
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
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <AudioLines className="w-12 h-12 text-[var(--text-muted)] mb-3" />
                    <p className="text-sm text-[var(--text-muted)]">{t('audio.noTranscription')}</p>
                  </div>
                )}
              </div>

              {(rawText || summary) && (
                <div className="p-3 border-t border-[var(--border-color)] flex items-center gap-2">
                  <button onClick={handleCopy} className="btn-secondary text-xs py-1.5 px-3">
                    {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> {t('audio.copyText')}</>}
                  </button>
                  <button onClick={handlePrint} className="btn-secondary text-xs py-1.5 px-3">
                    <Download className="w-3 h-3" /> {t('common.print')}
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
