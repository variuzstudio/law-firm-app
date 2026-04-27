'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useData } from '@/context/DataContext'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import {
  Plus, Search, Eye, Edit3, Trash2, X, ChevronDown,
} from 'lucide-react'

export default function CasesPage() {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const { cases: casesList, addCase, updateCase, deleteCase } = useData()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', client: '', type: 'Corporate', priority: 'medium', description: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  if (!isAuthenticated) return null

  const filtered = casesList.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const statusColor: Record<string, string> = {
    active: 'badge-success', pending: 'badge-warning', closed: 'badge-neutral', review: 'badge-info',
  }
  const statusLabel: Record<string, string> = {
    active: t('cases.active'), pending: t('cases.pending'), closed: t('cases.closed'), review: t('cases.review'),
  }
  const priorityColor: Record<string, string> = {
    high: 'badge-danger', medium: 'badge-warning', low: 'badge-info',
  }
  const priorityLabel: Record<string, string> = {
    high: t('cases.high'), medium: t('cases.medium'), low: t('cases.low'),
  }

  const handleDelete = (id: string) => {
    deleteCase(id)
  }

  const handleSubmit = () => {
    if (editingId) {
      updateCase(editingId, { name: formData.name, client: formData.client, type: formData.type, priority: formData.priority, description: formData.description })
    } else {
      addCase({
        id: `CSE-2026-${String(casesList.length + 1).padStart(3, '0')}`,
        name: formData.name,
        client: formData.client,
        type: formData.type,
        status: 'active',
        priority: formData.priority,
        assignee: 'Ahmad Faisal',
        date: new Date().toISOString().split('T')[0],
        description: formData.description,
      })
    }
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', client: '', type: 'Corporate', priority: 'medium', description: '' })
  }

  const openEdit = (c: typeof casesList[0]) => {
    setFormData({ name: c.name, client: c.client, type: c.type, priority: c.priority, description: c.description })
    setEditingId(c.id)
    setShowForm(true)
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('cases.title')}</h1>
            <p className="text-[var(--text-muted)] mt-1">{t('cases.subtitle')}</p>
          </div>
          <button onClick={() => { setEditingId(null); setFormData({ name: '', client: '', type: 'Corporate', priority: 'medium', description: '' }); setShowForm(true) }} className="btn-primary">
            <Plus className="w-4 h-4" /> {t('cases.new')}
          </button>
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={t('cases.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input pl-10 text-sm"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="glass-input text-sm appearance-none pr-8 cursor-pointer"
              >
                <option value="all">{t('cases.all')}</option>
                <option value="active">{t('cases.active')}</option>
                <option value="pending">{t('cases.pending')}</option>
                <option value="review">{t('cases.review')}</option>
                <option value="closed">{t('cases.closed')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">{t('cases.caseNumber')}</th>
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">{t('cases.caseName')}</th>
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium hidden md:table-cell">{t('cases.client')}</th>
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium hidden sm:table-cell">{t('cases.type')}</th>
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">{t('cases.status')}</th>
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium hidden lg:table-cell">{t('cases.priority')}</th>
                  <th className="text-right py-3 px-3 text-[var(--text-muted)] font-medium">{t('cases.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="table-row border-b border-[var(--border-color)] last:border-0 cursor-pointer" onClick={() => router.push(`/cases/${c.id}`)}>
                    <td className="py-3 px-3 font-mono text-xs text-[var(--accent)]">{c.id}</td>
                    <td className="py-3 px-3 text-[var(--text-primary)] font-medium max-w-[200px] truncate hover:text-[var(--accent)] transition-colors">{c.name}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)] hidden md:table-cell">{c.client}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)] hidden sm:table-cell">{c.type}</td>
                    <td className="py-3 px-3"><span className={`badge ${statusColor[c.status]}`}>{statusLabel[c.status]}</span></td>
                    <td className="py-3 px-3 hidden lg:table-cell"><span className={`badge ${priorityColor[c.priority]}`}>{priorityLabel[c.priority]}</span></td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/cases/${c.id}`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)]" title={t('cases.view')}>
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={(e) => { e.stopPropagation(); openEdit(c) }} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)]" title={t('cases.edit')}>
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id) }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500" title={t('cases.delete')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-[var(--text-muted)]">{t('common.noData')}</p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass-card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{editingId ? t('cases.edit') : t('cases.new')}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)]">
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.caseName')}</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="glass-input text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.client')}</label>
                <input value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} className="glass-input text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.type')}</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="glass-input text-sm">
                    <option>Corporate</option><option>Family</option><option>Property</option><option>Labor</option><option>IP</option><option>Criminal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.priority')}</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="glass-input text-sm">
                    <option value="high">{t('cases.high')}</option><option value="medium">{t('cases.medium')}</option><option value="low">{t('cases.low')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('cases.description')}</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="glass-input text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('cases.cancel')}</button>
                <button onClick={handleSubmit} className="btn-primary flex-1">{t('cases.save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
