'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import { compareLawArticles } from '@/lib/gemini'
import { lawCompareResult } from '@/data/aiResponses'
import {
  BookOpenCheck, Plus, Trash2, Sparkles, CheckCircle2, XCircle, Lightbulb, Copy, Check,
} from 'lucide-react'

interface Article {
  id: number
  law: string
  articleNumber: string
  content: string
}

export default function LawComparePage() {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([
    { id: 1, law: 'KUH Perdata', articleNumber: 'Pasal 1320', content: 'Supaya terjadi persetujuan yang sah, perlu dipenuhi empat syarat:\n1. Kesepakatan mereka yang mengikatkan dirinya\n2. Kecakapan untuk membuat suatu perikatan\n3. Suatu pokok persoalan tertentu\n4. Suatu sebab yang tidak terlarang' },
    { id: 2, law: 'KUH Perdata', articleNumber: 'Pasal 1365', content: 'Tiap perbuatan yang melanggar hukum dan membawa kerugian kepada orang lain, mewajibkan orang yang menimbulkan kerugian itu karena kesalahannya untuk mengganti kerugian tersebut.' },
  ])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisText, setAnalysisText] = useState('')
  const [result, setResult] = useState<typeof lawCompareResult | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  if (!isAuthenticated) return null

  const addArticle = () => {
    setArticles([...articles, { id: Date.now(), law: '', articleNumber: '', content: '' }])
  }

  const removeArticle = (id: number) => {
    if (articles.length > 2) setArticles(articles.filter((a) => a.id !== id))
  }

  const updateArticle = (id: number, field: keyof Article, value: string) => {
    setArticles(articles.map((a) => a.id === id ? { ...a, [field]: value } : a))
  }

  const handleCompare = async () => {
    if (articles.some((a) => !a.content.trim())) return
    setIsAnalyzing(true)
    setResult(null)
    setAnalysisText('')

    try {
      const articlesForApi = articles.map((a) => ({
        title: `${a.law} ${a.articleNumber}`.trim(),
        content: a.content,
      }))
      const response = await compareLawArticles(articlesForApi)
      setAnalysisText(response)
    } catch {
      await new Promise((r) => setTimeout(r, 1500))
      setResult(lawCompareResult)
    }
    setIsAnalyzing(false)
  }

  const getDisplayText = () => {
    if (analysisText) return analysisText
    if (result) {
      return `PERSAMAAN:\n${result.similarities.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nPERBEDAAN:\n${result.differences.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nREKOMENDASI:\n${result.recommendation}`
    }
    return ''
  }

  const handleCopyResult = () => {
    const text = getDisplayText()
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    const text = getDisplayText()
    if (!text) return
    const w = window.open('', '_blank')
    if (w) {
      const content = text.replace(/\n/g, '<br>')
      w.document.write(`<html><head><title>Salomo Partners - Law Comparison</title><style>body{font-family:sans-serif;padding:40px;line-height:1.8;max-width:800px;margin:0 auto}h1{color:#1e3a5f;border-bottom:2px solid #3b82f6;padding-bottom:10px}</style></head><body><h1>Salomo Partners - Analisis Perbandingan Pasal</h1><p style="color:#666;font-size:12px">Generated: ${new Date().toLocaleString()}</p><hr style="border:none;border-top:1px solid #eee;margin:20px 0"><div style="font-size:14px">${content}</div></body></html>`)
      w.document.close()
      w.print()
    }
  }

  const hasResult = !!analysisText || !!result

  return (
    <AppLayout>
      <div className="space-y-5 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <BookOpenCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              {t('lawCompare.title')} <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-xs text-[var(--text-muted)]">{t('lawCompare.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {articles.map((article, idx) => (
            <div key={article.id} className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">{t('lawCompare.article')} {idx + 1}</h3>
                {articles.length > 2 && (
                  <button onClick={() => removeArticle(article.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">{t('lawCompare.law')}</label>
                    <input value={article.law} onChange={(e) => updateArticle(article.id, 'law', e.target.value)} className="glass-input text-sm" placeholder={t('lawCompare.lawPlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">{t('lawCompare.article')}</label>
                    <input value={article.articleNumber} onChange={(e) => updateArticle(article.id, 'articleNumber', e.target.value)} className="glass-input text-sm" placeholder="Pasal 1320" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">{t('lawCompare.content')}</label>
                  <textarea value={article.content} onChange={(e) => updateArticle(article.id, 'content', e.target.value)} rows={5} className="glass-input text-sm" placeholder={t('lawCompare.placeholder')} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={addArticle} className="btn-secondary">
            <Plus className="w-4 h-4" /> {t('lawCompare.addArticle')}
          </button>
          <button onClick={handleCompare} disabled={isAnalyzing || articles.some((a) => !a.content.trim())} className="btn-primary flex-1 max-w-xs disabled:opacity-50">
            {isAnalyzing ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> {t('lawCompare.compare')}</>
            )}
          </button>
        </div>

        {hasResult && (
          <div className="glass-card p-5 animate-fade-in space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> {t('lawCompare.analysis')}
              </h2>
              <div className="flex gap-2">
                <button onClick={handleCopyResult} className="btn-secondary text-xs py-1.5 px-3">
                  {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
                <button onClick={handlePrint} className="btn-secondary text-xs py-1.5 px-3">
                  {t('common.print')}
                </button>
              </div>
            </div>

            {analysisText ? (
              <div className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                {analysisText}
              </div>
            ) : result && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <h3 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4" /> {t('lawCompare.similarities')}
                    </h3>
                    <ul className="space-y-2">
                      {result.similarities.map((s, i) => (
                        <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                          <span className="text-emerald-500 flex-shrink-0 mt-1">&bull;</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <h3 className="font-semibold text-sm text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4" /> {t('lawCompare.differences')}
                    </h3>
                    <ul className="space-y-2">
                      {result.differences.map((d, i) => (
                        <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                          <span className="text-red-500 flex-shrink-0 mt-1">&bull;</span> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <h3 className="font-semibold text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4" /> {t('lawCompare.recommendation')}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{result.recommendation}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
