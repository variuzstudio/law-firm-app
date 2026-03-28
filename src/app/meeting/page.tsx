'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import {
  Video, VideoOff, Mic, MicOff, Monitor, MessageSquare, Users, PhoneOff,
  Copy, Check, Plus, Clock, Calendar, Link2, X, Settings,
} from 'lucide-react'

interface Participant {
  id: number
  name: string
  initials: string
  muted: boolean
  videoOff: boolean
  color: string
}

export default function MeetingPage() {
  const { isAuthenticated, user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [inMeeting, setInMeeting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [meetingTime, setMeetingTime] = useState(0)
  const [roomId, setRoomId] = useState('')
  const [joinId, setJoinId] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ name: string; text: string; time: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [showNewMeeting, setShowNewMeeting] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const participants: Participant[] = [
    { id: 1, name: 'Ahmad Faisal, S.H.', initials: 'AF', muted: false, videoOff: false, color: 'from-blue-500 to-indigo-600' },
    { id: 2, name: 'Siti Rahayu, S.H.', initials: 'SR', muted: true, videoOff: false, color: 'from-violet-500 to-purple-600' },
    { id: 3, name: 'Dewi Putri, S.H.', initials: 'DP', muted: false, videoOff: true, color: 'from-rose-500 to-pink-600' },
  ]

  const scheduledMeetings = [
    { id: 1, title: 'Rapat Tim - Review Kasus', time: '10:00', date: '2026-03-29', participants: 4 },
    { id: 2, title: 'Meeting Klien - PT Global Invest', time: '11:00', date: '2026-04-01', participants: 3 },
    { id: 3, title: 'Mediasi - PT Makmur Sentosa', time: '14:00', date: '2026-04-07', participants: 5 },
  ]

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    if (inMeeting) {
      timerRef.current = setInterval(() => setMeetingTime((t) => t + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [inMeeting])

  if (!isAuthenticated) return null

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const startMeeting = () => {
    const id = 'SP-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomId(id)
    setInMeeting(true)
    setMeetingTime(0)
    setShowNewMeeting(false)
  }

  const joinMeeting = () => {
    if (!joinId.trim()) return
    setRoomId(joinId.trim())
    setInMeeting(true)
    setMeetingTime(0)
  }

  const leaveMeeting = () => {
    setInMeeting(false)
    setMeetingTime(0)
    setShowChat(false)
    setShowParticipants(false)
    setIsSharing(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`https://salomopartners.id/meeting/${roomId}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    setChatMessages([...chatMessages, {
      name: user?.name || 'You',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setChatInput('')
  }

  if (inMeeting) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-[#0f172a] to-[#162033]">
        <div className="flex items-center justify-between px-4 py-2 bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Video className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">Salomo Partners Meeting</span>
            <span className="text-white/50 text-xs font-mono">{roomId}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {formatTime(meetingTime)}
            </span>
            <button onClick={copyLink} className="text-white/50 hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10">
              {copiedLink ? <><Check className="w-3 h-3" /> Copied</> : <><Link2 className="w-3 h-3" /> Copy Link</>}
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 h-full">
              {participants.map((p) => (
                <div key={p.id} className="relative rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                  {p.videoOff ? (
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mx-auto mb-2`}>
                        <span className="text-white text-xl font-bold">{p.initials}</span>
                      </div>
                      <p className="text-white/70 text-sm">{p.name}</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                        <span className="text-white text-2xl font-bold">{p.initials}</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-white text-xs bg-black/50 px-2 py-0.5 rounded-lg">{p.name.split(',')[0]}</span>
                    {p.muted && <MicOff className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(showChat || showParticipants) && (
            <div className="w-80 border-l border-slate-700/50 bg-slate-900/50 flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
                <h3 className="text-white font-semibold text-sm">
                  {showChat ? t('meeting.chat') : t('meeting.participants')}
                </h3>
                <button onClick={() => { setShowChat(false); setShowParticipants(false) }} className="p-1 rounded-lg hover:bg-white/10">
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>
              {showChat && (
                <>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-blue-400 font-medium text-xs">{msg.name}</span>
                        <span className="text-white/30 text-[10px] ml-1">{msg.time}</span>
                        <p className="text-white/80 mt-0.5">{msg.text}</p>
                      </div>
                    ))}
                    {chatMessages.length === 0 && <p className="text-white/30 text-sm text-center py-8">No messages yet</p>}
                  </div>
                  <div className="p-3 border-t border-slate-700/50">
                    <form onSubmit={(e) => { e.preventDefault(); sendChat() }} className="flex gap-2">
                      <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500" placeholder="Type message..." />
                      <button type="submit" className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600"><Video className="w-4 h-4 text-white" /></button>
                    </form>
                  </div>
                </>
              )}
              {showParticipants && (
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{p.initials}</span>
                      </div>
                      <span className="text-white/80 text-sm flex-1">{p.name}</span>
                      <div className="flex gap-1">
                        {p.muted && <MicOff className="w-3.5 h-3.5 text-red-400" />}
                        {p.videoOff && <VideoOff className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 py-4 bg-black/30">
          <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-xl transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}>
            {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
          </button>
          <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 rounded-xl transition-colors ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}>
            {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
          </button>
          <button onClick={() => setIsSharing(!isSharing)} className={`p-3 rounded-xl transition-colors ${isSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}>
            <Monitor className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => { setShowChat(!showChat); setShowParticipants(false) }} className={`p-3 rounded-xl transition-colors ${showChat ? 'bg-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
            <MessageSquare className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => { setShowParticipants(!showParticipants); setShowChat(false) }} className={`p-3 rounded-xl transition-colors ${showParticipants ? 'bg-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
            <Users className="w-5 h-5 text-white" />
          </button>
          <div className="w-px h-8 bg-slate-600 mx-1" />
          <button onClick={leaveMeeting} className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 flex items-center gap-2 text-white font-medium text-sm">
            <PhoneOff className="w-5 h-5" /> {t('meeting.leave')}
          </button>
        </div>
      </div>
    )
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
            <p className="text-xs text-[var(--text-muted)] mb-4">Start an instant meeting with your team</p>
            <button onClick={startMeeting} className="btn-primary w-full">
              <Video className="w-4 h-4" /> {t('meeting.start')}
            </button>
          </div>

          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mb-4">
              <Link2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-1">{t('meeting.join')}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">Join a meeting with a room ID</p>
            <div className="flex gap-2 w-full">
              <input value={joinId} onChange={(e) => setJoinId(e.target.value)} className="glass-input text-sm flex-1" placeholder="SP-XXXXXX" />
              <button onClick={joinMeeting} disabled={!joinId.trim()} className="btn-primary px-4 disabled:opacity-50">{t('meeting.join')}</button>
            </div>
          </div>
        </div>

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
                <button onClick={startMeeting} className="btn-primary text-xs py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('meeting.join')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
