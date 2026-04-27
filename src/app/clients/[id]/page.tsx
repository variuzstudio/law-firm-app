'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useData } from '@/context/DataContext'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import {
  ArrowLeft, Edit3, Trash2, Save, X, Mail, Phone, Building2, User,
  Briefcase, Calendar, CheckCircle2, AlertTriangle,
} from 'lucide-react'

export default function ClientDetailPage() {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const { clients, cases, updateClient, deleteClient } = useData()
  const router = useRouter()
  const params = useParams()
  const clientId = Number(params.id)

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ name: '', email: '', phone: '', company: '', type: '' })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  const clientData = clients.find((c) => c.id === clientId)

  useEffect(() => {
    if (clientData) {
      setEditData({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        company: clientData.company,
        type: clientData.type,
      })
    }
  }, [clientData])

  if (!isAuthenticated) return null
  if (!clientData) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <User className="w-16 h-16 text-[var(--text-muted)] mb-4" />
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{t('common.noData')}</h2>
          <p className="text-[var(--text-muted)] mb-4">Client not found</p>
          <Link href="/clients" className="btn-primary"><ArrowLeft className="w-4 h-4" /> {t('common.back')}</Link>
        </div>
      </AppLayout>
    )
  }

  const clientCases = cases.filter((c) => c.client === clientData.name || c.client === clientData.company)
  const statusColor: Record<string, string> = { active: 'badge-success', pending: 'badge-warning', closed: 'badge-neutral', review: 'badge-info' }
  const statusLabel: Record<string, string> = { active: t('cases.active'), pending: t('cases.pending'), closed: t('cases.closed'), review: t('cases.review') }
  const priorityColor: Record<string, string> = { high: 'badge-danger', medium: 'badge-warning', low: 'badge-info' }
  const priorityLabel: Record<string, string> = { high: t('cases.high'), medium: t('cases.medium'), low: t('cases.low') }

  const handleSave = () => {
    updateClient(clientId, editData)
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteClient(clientId)
    router.push('/clients')
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/clients" className="p-2 rounded-xl hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {clientData.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">{clientData.name}</h1>
                <span className={`badge ${clientData.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                  {clientData.status === 'active' ? t('clients.active') : t('clients.inactive')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="btn-secondary text-sm"><X className="w-4 h-4" /> {t('common.cancel')}</button>
                <button onClick={handleSave} className="btn-primary text-sm"><Save className="w-4 h-4" /> {t('common.save')}</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm"><Edit3 className="w-4 h-4" /> {t('common.edit')}</button>
                <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-xl hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--accent)]" /> {t('clients.title')}
              </h2>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('clients.name')}</label>
                    <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('clients.email')}</label>
                    <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('clients.phone')}</label>
                    <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('clients.company')}</label>
                    <input value={editData.company} onChange={(e) => setEditData({ ...editData, company: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Type</label>
                    <select value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })} className="glass-input text-sm">
                      <option value="Individual">Individual</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <span className="text-[var(--text-primary)]">{clientData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <span className="text-[var(--text-primary)]">{clientData.phone}</span>
                  </div>
                  {clientData.company !== '-' && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                      <span className="text-[var(--text-primary)]">{clientData.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <span className="text-[var(--text-primary)]">{clientData.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <span className="text-[var(--text-muted)]">{t('clients.joined')}: </span>
                    <span className="text-[var(--text-primary)]">{clientData.joined}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--accent)]" /> {t('nav.cases')} ({clientCases.length})
              </h2>
              {clientCases.length > 0 ? (
                <div className="space-y-3">
                  {clientCases.map((c) => (
                    <Link key={c.id} href={`/cases/${c.id}`} className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--accent-light)] transition-colors border border-[var(--border-color)] group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-[var(--accent)]">{c.id}</span>
                          <span className={`badge ${statusColor[c.status]}`}>{statusLabel[c.status]}</span>
                          <span className={`badge ${priorityColor[c.priority]}`}>{priorityLabel[c.priority]}</span>
                        </div>
                        <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">{c.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-[var(--text-muted)]">{c.type}</span>
                          <span className="text-xs text-[var(--text-muted)]">•</span>
                          <span className="text-xs text-[var(--text-muted)]">{c.assignee}</span>
                          <span className="text-xs text-[var(--text-muted)]">•</span>
                          <span className="text-xs text-[var(--text-muted)]">{c.date}</span>
                        </div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-[var(--text-muted)] rotate-180 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--text-muted)]">{t('common.noData')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="glass-card w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{t('common.delete')}?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">{clientData.name}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
              <button onClick={handleDelete} className="flex-1 py-2 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium">{t('common.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
