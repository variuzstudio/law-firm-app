'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import {
  Video, Copy, Check, Plus, Calendar, Link2, Users, ExternalLink, Trash2,
} from 'lucide-react'

interface MeetingLink {
  id: string
  title: string
  link: string
  createdAt: string
  participants?: number
}

export default function MeetingPage() {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [meetings, setMeetings] = useState<MeetingLink[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [joinLink, setJoinLink] = useState('')

  const scheduledMeetings = [
    { id: 1, title: 'Rapat Tim - Review Kasus', time: '10:00', date: '2026-03-29', participants: 4 },
    { id: 2, title: 'Meeting Klien - PT Global Invest', time: '11:00', date: '2026-04-01', participants: 3 },
    { id: 3, title: 'Mediasi - PT Makmur Sentosa', time: '14:00', date: '2026-04-07', participants: 5 },
  ]

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  if (!isAuthenticated) return null

  const createMeeting = () => {
    const title = newTitle.trim() || 'Salomo Partners Meeting'
    const meetLink = `https://meet.google.com/new`

    const meeting: MeetingLink = {
      id: Date.now().toString(),
      title,
      link: meetLink,
      createdAt: new Date().toLocaleString(),
    }
    setMeetings((prev) => [meeting, ...prev])
    setNewTitle('')
    setShowCreate(false)

    window.open(meetLink, '_blank', 'noopener,noreferrer')
  }

  const openMeeting = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const joinMeetingByLink = () => {
    if (!joinLink.trim()) return
    let link = joinLink.trim()
    if (!link.startsWith('http')) {
      link = `https://meet.google.com/${link}`
    }
    window.open(link, '_blank', 'noopener,noreferrer')
    setJoinLink('')
  }

  const copyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const removeMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <AppLayout>
      <div className="space-y-5 max-w-[1000px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('meeting.title')}</h1>
            <p className="text-xs text-[var(--text-muted)]">{t('meeting.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-1">{t('meeting.new')}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">{t('meeting.newDesc')}</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary w-full">
              <Video className="w-4 h-4" /> {t('meeting.createGmeet')}
            </button>
          </div>

          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mb-4">
              <Link2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-1">{t('meeting.join')}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">{t('meeting.joinDesc')}</p>
            <div className="flex gap-2 w-full">
              <input value={joinLink} onChange={(e) => setJoinLink(e.target.value)} className="glass-input text-sm flex-1" placeholder="meet.google.com/xxx-xxxx-xxx" />
              <button onClick={joinMeetingByLink} disabled={!joinLink.trim()} className="btn-primary px-4 disabled:opacity-50">{t('meeting.join')}</button>
            </div>
          </div>
        </div>

        {meetings.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Video className="w-4 h-4 text-[var(--accent)]" /> {t('meeting.recentMeetings')}
            </h2>
            <div className="space-y-3">
              {meetings.map((m) => (
                <div key={m.id} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--card-border)]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">{m.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{m.createdAt}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => copyLink(m.id, m.link)} className="p-2 rounded-lg hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)]" title="Copy link">
                      {copiedId === m.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openMeeting(m.link)} className="p-2 rounded-lg hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)]" title="Open">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeMeeting(m.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card p-5">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--accent)]" /> {t('meeting.scheduled')}
          </h2>
          <div className="space-y-3">
            {scheduledMeetings.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--accent-light)] transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[var(--text-muted)]">{m.date.split('-')[2]}</span>
                  <span className="text-xs font-bold text-[var(--accent)]">{m.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">{m.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Users className="w-3 h-3 text-[var(--text-muted)]" />
                    <span className="text-xs text-[var(--text-muted)]">{m.participants} participants</span>
                  </div>
                </div>
                <button
                  onClick={() => { createMeeting() }}
                  className="btn-primary text-xs py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  <Video className="w-3 h-3" /> Google Meet
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="glass-card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">{t('meeting.createGmeet')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('meeting.meetingTitle')}</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="glass-input text-sm"
                  placeholder="Rapat Tim..."
                />
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {t('meeting.gmeetNote')}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button onClick={createMeeting} className="btn-primary flex-1">
                  <ExternalLink className="w-4 h-4" /> {t('meeting.openGmeet')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
