'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import { chatWithGemini, getGeminiKey } from '@/lib/gemini'
import { getAiResponse } from '@/data/aiResponses'
import {
  Briefcase, Users, Clock, ChevronRight, ArrowUpRight, ArrowDownRight,
  Send, Bot, User, Sparkles, AudioLines, BookOpenCheck, ScanText, Video, Calendar, FileText,
} from 'lucide-react'
import { cases, activities, calendarEvents, caseTypeData } from '@/data/mockData'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function AiChatWidget({ t }: { t: (k: string) => string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: t('dashboard.aiChatWelcome') },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setIsTyping(true)

    try {
      const apiKey = getGeminiKey()
      if (apiKey) {
        const history = messages.map((m) => ({ role: m.role, content: m.content }))
        const response = await chatWithGemini([...history, { role: 'user', content: userMsg }])
        setMessages((prev) => [...prev, { role: 'assistant', content: response }])
      } else {
        await new Promise((r) => setTimeout(r, 800))
        setMessages((prev) => [...prev, { role: 'assistant', content: getAiResponse(userMsg) }])
      }
    } catch {
      await new Promise((r) => setTimeout(r, 500))
      setMessages((prev) => [...prev, { role: 'assistant', content: getAiResponse(userMsg) }])
    }
    setIsTyping(false)
  }

  return (
    <div className="glass-card flex flex-col h-[420px]">
      <div className="flex items-center gap-2 p-4 border-b border-[var(--border-color)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">{t('dashboard.aiChat')}</h3>
          <p className="text-[10px] text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
          </p>
        </div>
        <Sparkles className="w-4 h-4 text-amber-400 ml-auto" />
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600'
                : 'bg-gradient-to-br from-violet-500 to-purple-600'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'assistant'
                ? 'bg-[var(--bg-input)] text-[var(--text-primary)]'
                : 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 text-white'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-[var(--bg-input)] rounded-xl p-3 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[var(--border-color)]">
        <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('dashboard.aiChatPlaceholder')}
            className="glass-input text-sm flex-1"
            disabled={isTyping}
          />
          <button type="submit" disabled={isTyping || !input.trim()} className="btn-primary px-3 disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

function CaseDistribution() {
  const total = caseTypeData.reduce((s, d) => s + d.value, 0)
  return (
    <div className="space-y-3 mt-3">
      {caseTypeData.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--text-secondary)]">{d.name}</span>
              <span className="font-medium text-[var(--text-primary)]">{d.value}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--border-color)]">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const activeCases = cases.filter((c) => c.status === 'active').length
  const upcomingEvents = calendarEvents.slice(0, 3)
  const recentActivities = activities.slice(0, 4)

  const stats = [
    { label: t('dashboard.activeCases'), value: activeCases, icon: Briefcase, change: '+12%', up: true, color: 'from-cyan-500 to-blue-600' },
    { label: t('dashboard.totalClients'), value: 10, icon: Users, change: '+8%', up: true, color: 'from-blue-500 to-purple-600' },
    { label: t('dashboard.pendingTasks'), value: 7, icon: Clock, change: '-5%', up: false, color: 'from-amber-500 to-orange-600' },
  ]

  const quickActions = [
    { icon: AudioLines, label: t('nav.audioTranscribe'), href: '/audio-transcribe', color: 'from-rose-500 to-pink-600 shadow-rose-500/20' },
    { icon: BookOpenCheck, label: t('nav.lawCompare'), href: '/law-compare', color: 'from-amber-500 to-orange-600 shadow-amber-500/20' },
    { icon: ScanText, label: t('nav.ocrTool'), href: '/ocr-tool', color: 'from-teal-500 to-cyan-600 shadow-teal-500/20' },
    { icon: Video, label: t('nav.meeting'), href: '/meeting', color: 'from-blue-500 to-purple-600 shadow-blue-500/20' },
  ]

  return (
    <AppLayout>
      <div className="space-y-5 max-w-[1400px] mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {t('dashboard.welcome')}, {user?.name?.split(',')[0]}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">{t('dashboard.overview')}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card stat-card p-4 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                  <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{stat.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {stat.up ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                <span className={`text-xs font-medium ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <AiChatWidget t={t} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-4">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">{t('dashboard.quickActions')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(action.href)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[var(--accent-light)] transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-secondary)] text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">{t('dashboard.upcomingEvents')}</h3>
                <button onClick={() => router.push('/calendar')} className="text-xs text-[var(--accent)] hover:underline flex items-center gap-0.5">
                  {t('dashboard.viewAll')} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex gap-2 p-2 rounded-lg hover:bg-[var(--accent-light)] transition-colors cursor-pointer" onClick={() => router.push('/calendar')}>
                    <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate">{event.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5" /> {event.date} &bull; {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-2">{t('dashboard.caseDistribution')}</h3>
            <CaseDistribution />
          </div>

          <div className="lg:col-span-2 glass-card p-4">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">{t('dashboard.recentActivity')}</h3>
            <div className="space-y-2">
              {recentActivities.map((a) => (
                <div key={a.id} className="flex items-start gap-2 p-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-3 h-3 text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--text-primary)]">
                      <span className="font-medium">{a.user}</span>{' '}
                      <span className="text-[var(--text-secondary)]">{a.action}</span>
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
