'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useData } from '@/context/DataContext'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import {
  ArrowLeft, Edit3, Trash2, Save, X, Calendar, User, Briefcase, Scale,
  FileText, Clock, AlertTriangle, CheckCircle2, MessageSquare, Plus,
} from 'lucide-react'

export default function CaseDetailPage() {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const { cases, documents, events, updateCase, deleteCase } = useData()
  const router = useRouter()
  const params = useParams()
  const caseId = params.id as string

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ name: '', client: '', type: '', priority: '', description: '', status: '' })
  const [notes, setNotes] = useState<{ id: number; text: string; date: string; author: string }[]>([
    { id: 1, text: 'Initial case review completed. All documents collected.', date: '2026-03-16', author: 'Ahmad Faisal' },
    { id: 2, text: 'Client meeting scheduled for next week to discuss strategy.', date: '2026-03-20', author: 'Siti Rahayu' },
  ])
  const [newNote, setNewNote] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  const caseData = cases.find((c) => c.id === caseId)

  useEffect(() => {
    if (caseData) {
      setEditData({
        name: caseData.name,
        client: caseData.client,
        type: caseData.type,
        priority: caseData.priority,
        description: caseData.description,
        status: caseData.status,
      })
    }
  }, [caseData])

  if (!isAuthenticated) return null
  if (!caseData) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Briefcase className="w-16 h-16 text-[var(--text-muted)] mb-4" />
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{t('common.noData')}</h2>
          <p className="text-[var(--text-muted)] mb-4">Case {caseId} not found</p>
          <Link href="/cases" className="btn-primary"><ArrowLeft className="w-4 h-4" /> {t('common.back')}</Link>
        </div>
      </AppLayout>
    )
  }

  const relatedDocs = documents.filter((d) => d.case === caseId)
  const relatedEvents = events.filter((e) => e.case === caseId)

  const statusColor: Record<string, string> = { active: 'badge-success', pending: 'badge-warning', closed: 'badge-neutral', review: 'badge-info' }
  const statusLabel: Record<string, string> = { active: t('cases.active'), pending: t('cases.pending'), closed: t('cases.closed'), review: t('cases.review') }
  const priorityColor: Record<string, string> = { high: 'badge-danger', medium: 'badge-warning', low: 'badge-info' }
  const priorityLabel: Record<string, string> = { high: t('cases.high'), medium: t('cases.medium'), low: t('cases.low') }

  const handleSave = () => {
    updateCase(caseId, editData)
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteCase(caseId)
    router.push('/cases')
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    setNotes((prev) => [...prev, {
      id: Date.now(),
      text: newNote,
      date: new Date().toISOString().split('T')[0],
      author: 'Current User',
    }])
    setNewNote('')
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/cases" className="p-2 rounded-xl hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-mono">{caseData.id}</p>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">{caseData.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="btn-secondary text-sm"><X className="w-4 h-4" /> {t('cases.cancel')}</button>
                <button onClick={handleSave} className="btn-primary text-sm"><Save className="w-4 h-4" /> {t('cases.save')}</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm"><Edit3 className="w-4 h-4" /> {t('cases.edit')}</button>
                <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-xl hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--accent)]" /> {t('cases.details')}
              </h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.caseName')}</label>
                    <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.client')}</label>
                      <input value={editData.client} onChange={(e) => setEditData({ ...editData, client: e.target.value })} className="glass-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.type')}</label>
                      <select value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })} className="glass-input text-sm">
                        <option>Corporate</option><option>Family</option><option>Property</option><option>Labor</option><option>IP</option><option>Criminal</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.status')}</label>
                      <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="glass-input text-sm">
                        <option value="active">{t('cases.active')}</option><option value="pending">{t('cases.pending')}</option>
                        <option value="review">{t('cases.review')}</option><option value="closed">{t('cases.closed')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.priority')}</label>
                      <select value={editData.priority} onChange={(e) => setEditData({ ...editData, priority: e.target.value })} className="glass-input text-sm">
                        <option value="high">{t('cases.high')}</option><option value="medium">{t('cases.medium')}</option><option value="low">{t('cases.low')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.description')}</label>
                    <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={4} className="glass-input text-sm" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">{t('cases.client')}</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)] ml-6">{caseData.client}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">{t('cases.type')}</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)] ml-6">{caseData.type}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">{t('cases.status')}</span>
                      </div>
                      <div className="ml-6"><span className={`badge ${statusColor[caseData.status]}`}>{statusLabel[caseData.status]}</span></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">{t('cases.priority')}</span>
                      </div>
                      <div className="ml-6"><span className={`badge ${priorityColor[caseData.priority]}`}>{priorityLabel[caseData.priority]}</span></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">{t('cases.assignee')}</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)] ml-6">{caseData.assignee}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">{t('cases.date')}</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)] ml-6">{caseData.date}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[var(--border-color)]">
                    <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">{t('cases.description')}</h3>
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed">{caseData.description}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[var(--accent)]" /> {t('cases.notes')}
              </h2>
              <div className="space-y-3 mb-4">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)]">
                    <p className="text-sm text-[var(--text-primary)]">{note.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[var(--text-muted)]">{note.author}</span>
                      <span className="text-xs text-[var(--text-muted)]">•</span>
                      <span className="text-xs text-[var(--text-muted)]">{note.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  placeholder={t('cases.addNote') + '...'}
                  className="glass-input text-sm flex-1"
                />
                <button onClick={handleAddNote} className="btn-primary text-sm px-4"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--accent)]" /> {t('nav.documents')} ({relatedDocs.length})
              </h2>
              {relatedDocs.length > 0 ? (
                <div className="space-y-2">
                  {relatedDocs.map((doc) => (
                    <Link key={doc.id} href={`/documents/${doc.id}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--accent-light)] transition-colors">
                      <FileText className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{doc.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{doc.size} • {doc.modified}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">{t('common.noData')}</p>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--accent)]" /> {t('cases.timeline')}
              </h2>
              {relatedEvents.length > 0 ? (
                <div className="space-y-3">
                  {relatedEvents.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: event.color }} />
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{event.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{event.date} • {event.time}</p>
                        {event.location !== '-' && <p className="text-xs text-[var(--text-muted)]">{event.location}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">{t('common.noData')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="glass-card w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{t('cases.delete')}?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">{caseData.name}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">{t('cases.cancel')}</button>
              <button onClick={handleDelete} className="flex-1 py-2 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium">{t('cases.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
