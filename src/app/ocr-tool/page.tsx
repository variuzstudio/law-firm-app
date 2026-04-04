'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import { scanDocument, getGeminiKey } from '@/lib/gemini'
import { ocrSampleResult } from '@/data/aiResponses'
import {
  ScanText, Upload, Sparkles, Copy, Check, FileImage, FileText, Printer,
} from 'lucide-react'

export default function OcrToolPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [hasFile, setHasFile] = useState(false)
  const [fileName, setFileName] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [fileBase64, setFileBase64] = useState('')
  const [fileMimeType, setFileMimeType] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        resolve(result.split(',')[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  if (!isAuthenticated) return null

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64 = await fileToBase64(file)
    setFileBase64(base64)
    setFileMimeType(file.type || 'image/png')
    setHasFile(true)
    setFileName(file.name)
    setResult('')

    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl('')
    }
  }

  const handleScan = async () => {
    if (!hasFile) return
    setIsScanning(true)
    setResult('')

    try {
      const apiKey = getGeminiKey()
      if (apiKey && fileBase64) {
        const response = await scanDocument(fileBase64, fileMimeType)
        setResult(response)
      } else {
        await new Promise((r) => setTimeout(r, 2500))
        setResult(ocrSampleResult)
      }
    } catch {
      await new Promise((r) => setTimeout(r, 500))
      setResult(ocrSampleResult)
    }
    setIsScanning(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(`<html><head><title>Salomo Partners - OCR Result</title><style>body{font-family:monospace;padding:40px;line-height:1.8;max-width:800px;margin:0 auto}h1{color:#1e3a5f;border-bottom:2px solid #3b82f6;padding-bottom:10px;font-family:sans-serif}pre{white-space:pre-wrap;background:#f8fafc;padding:24px;border-radius:8px;border:1px solid #e2e8f0}</style></head><body><h1>Salomo Partners - Document Scan Result</h1><p style="color:#666;font-size:12px;font-family:sans-serif">Source: ${fileName} | Scanned: ${new Date().toLocaleString()}</p><pre>${result}</pre></body></html>`)
      w.document.close()
      w.print()
    }
  }

  return (
    <AppLayout>
      <div className="space-y-5 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <ScanText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              {t('ocr.title')} <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-xs text-[var(--text-muted)]">{t('ocr.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">{t('ocr.upload')}</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={handleUploadClick}
                className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 text-center hover:border-[var(--accent)] transition-colors cursor-pointer"
              >
                <Upload className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-sm text-[var(--text-secondary)]">{t('ocr.dragDrop')}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{t('ocr.formats')}</p>
              </div>

              {hasFile && (
                <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-[var(--accent-light)]">
                  <FileImage className="w-8 h-8 text-[var(--accent)]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{fileName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{fileMimeType}</p>
                  </div>
                  <span className="text-xs text-emerald-500 font-medium">Ready</span>
                </div>
              )}
            </div>

            {hasFile && (
              <div className="glass-card p-5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Preview</h3>
                <div className="aspect-[3/4] rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-2" />
                      <p className="text-sm text-[var(--text-muted)]">{fileName}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleScan}
              disabled={!hasFile || isScanning}
              className="btn-primary w-full py-3 text-base disabled:opacity-50"
            >
              {isScanning ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Scanning...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> {t('ocr.scan')}</>
              )}
            </button>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card flex flex-col h-full min-h-[600px]">
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">{t('ocr.result')}</h3>
                {result && (
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="btn-secondary text-xs py-1.5 px-3">
                      {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> {t('ocr.copy')}</>}
                    </button>
                    <button onClick={handlePrint} className="btn-secondary text-xs py-1.5 px-3">
                      <Printer className="w-3 h-3" /> {t('common.print')}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {result ? (
                  <pre className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap font-mono">{result}</pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ScanText className="w-16 h-16 text-[var(--text-muted)] mb-3" />
                    <p className="text-sm text-[var(--text-muted)]">{t('ocr.noResult')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
