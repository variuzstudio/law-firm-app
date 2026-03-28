'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import { clients as initialClients } from '@/data/mockData'
import { Plus, Search, Eye, Edit3, Trash2, X, Mail, Phone, Building2, User } from 'lucide-react'

export default function ClientsPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [clientsList, setClientsList] = useState(initialClients)
  const [selectedClient, setSelectedClient] = useState<typeof initialClients[0] | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', type: 'Individual' })

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const filtered = clientsList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: number) => setClientsList(clientsList.filter((c) => c.id !== id))

  const handleSubmit = () => {
    if (editingId) {
      setClientsList(clientsList.map((c) =>
        c.id === editingId ? { ...c, name: formData.name, email: formData.email, phone: formData.phone, company: formData.company, type: formData.type } : c
      ))
    } else {
      setClientsList([{
        id: clientsList.length + 1, name: formData.name, email: formData.email, phone: formData.phone,
        company: formData.company || '-', cases: 0, status: 'active', joined: new Date().toISOString().split('T')[0], type: formData.type,
      }, ...clientsList])
    }
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', email: '', phone: '', company: '', type: 'Individual' })
  }

  const openEdit = (c: typeof initialClients[0]) => {
    setFormData({ name: c.name, email: c.email, phone: c.phone, company: c.company, type: c.type })
    setEditingId(c.id)
    setShowForm(true)
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('clients.title')}</h1>
            <p className="text-[var(--text-muted)] mt-1">{t('clients.subtitle')}</p>
          </div>
          <button onClick={() => { setEditingId(null); setFormData({ name: '', email: '', phone: '', company: '', type: 'Individual' }); setShowForm(true) }} className="btn-primary">
            <Plus className="w-4 h-4" /> {t('clients.new')}
          </button>
        </div>

        <div className="glass-card p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input type="text" placeholder={t('clients.search')} value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10 text-sm max-w-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div key={c.id} className="glass-card p-4 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                      {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] text-sm">{c.name}</h3>
                      <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-neutral'} mt-1`}>
                        {c.status === 'active' ? t('clients.active') : t('clients.inactive')}
                      </span>
                    </div>
                  </div>
                  <span className="badge badge-info">{c.type}</span>
                </div>
                <div className="space-y-1.5 text-sm flex-1">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {c.email}
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {c.phone}
                  </div>
                  {c.company !== '-' && (
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {c.company}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
                  <span className="text-xs text-[var(--text-muted)]">{c.cases} {t('nav.cases')}</span>
                  <div className="flex gap-1">
                    <button onClick={() => { setSelectedClient(c); setShowModal(true) }} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)]"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)]"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-center py-8 text-[var(--text-muted)]">{t('common.noData')}</p>}
        </div>
      </div>

      {showModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{t('clients.name')}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)]"><X className="w-5 h-5 text-[var(--text-muted)]" /></button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                {selectedClient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">{selectedClient.name}</h3>
                <span className={`badge ${selectedClient.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                  {selectedClient.status === 'active' ? t('clients.active') : t('clients.inactive')}
                </span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">{t('clients.email')}</span><span className="text-[var(--text-primary)]">{selectedClient.email}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">{t('clients.phone')}</span><span className="text-[var(--text-primary)]">{selectedClient.phone}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">{t('clients.company')}</span><span className="text-[var(--text-primary)]">{selectedClient.company}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">{t('nav.cases')}</span><span className="text-[var(--text-primary)]">{selectedClient.cases}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">{t('clients.joined')}</span><span className="text-[var(--text-primary)]">{selectedClient.joined}</span></div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{editingId ? t('common.edit') : t('clients.new')}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)]"><X className="w-5 h-5 text-[var(--text-muted)]" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('clients.name')}</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="glass-input text-sm" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('clients.email')}</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="glass-input text-sm" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('clients.phone')}</label><input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="glass-input text-sm" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('clients.company')}</label><input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="glass-input text-sm" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button onClick={handleSubmit} className="btn-primary flex-1">{t('common.save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
