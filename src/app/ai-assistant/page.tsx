'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import { chatWithGemini } from '@/lib/gemini'
import { getAiResponse } from '@/data/aiResponses'
import { Send, Bot, User, Sparkles, Trash2, Copy, Check } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AiAssistantPage() {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: t('dashboard.aiChatWelcome'), timestamp: new Date() },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, isTyping])

  if (!isAuthenticated) return null

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }])
    setIsTyping(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const response = await chatWithGemini([...history, { role: 'user', content: userMsg }])
      setMessages((prev) => [...prev, { role: 'assistant', content: response, timestamp: new Date() }])
    } catch {
      const response = getAiResponse(userMsg)
      setMessages((prev) => [...prev, { role: 'assistant', content: response, timestamp: new Date() }])
    }
    setIsTyping(false)
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const suggestions = [
    'Apa saja syarat sah perjanjian menurut KUH Perdata?',
    'Jelaskan tentang hukum ketenagakerjaan di Indonesia',
    'Bagaimana prosedur PHK menurut UU Cipta Kerja?',
    'Apa saja jenis hak atas tanah di Indonesia?',
    'Jelaskan tentang hukum perusahaan dan jenis badan usaha',
    'What are the requirements for establishing a PT in Indonesia?',
  ]

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)] max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                {t('nav.aiAssistant')} <Sparkles className="w-4 h-4 text-amber-400" />
              </h1>
              <p className="text-xs text-[var(--text-muted)]">Indonesian Legal Knowledge Base</p>
            </div>
          </div>
          <button onClick={() => setMessages([{ role: 'assistant', content: t('dashboard.aiChatWelcome'), timestamp: new Date() }])} className="btn-secondary text-sm py-2 px-3">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>

        <div className="glass-card flex-1 flex flex-col overflow-hidden">
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant' ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600' : 'bg-gradient-to-br from-violet-500 to-purple-600'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[80%] group ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'assistant'
                    ? 'bg-[var(--bg-input)] text-[var(--text-primary)] rounded-tl-sm'
                    : 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 text-white rounded-tr-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.role === 'assistant' && i > 0 && (
                      <button onClick={() => handleCopy(msg.content, i)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[var(--accent-light)]">
                        {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-[var(--text-muted)]" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[var(--bg-input)] rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            {messages.length === 1 && !isTyping && (
              <div className="mt-4">
                <p className="text-xs text-[var(--text-muted)] mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => { setInput(s); }} className="text-xs px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--border-color)]">
            <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('dashboard.aiChatPlaceholder')}
                className="glass-input text-sm flex-1"
                disabled={isTyping}
              />
              <button type="submit" disabled={isTyping || !input.trim()} className="btn-primary px-4 disabled:opacity-50">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{t('dashboard.aiSend')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
