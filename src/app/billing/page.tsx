'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import { invoices as initialInvoices } from '@/data/mockData'
import {
  Plus, Search, Eye, ChevronDown, X, DollarSign, TrendingUp, AlertTriangle, CheckCircle2,
} from 'lucide-react'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function BillingPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [invoicesList, setInvoicesList] = useState(initialInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<typeof initialInvoices[0] | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ client: '', amount: '', dueDate: '', caseId: '' })

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const filtered = invoicesList.filter((inv) => {
    const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalRevenue = invoicesList.reduce((s, i) => s + i.amount, 0)
  const collected = invoicesList.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const outstanding = invoicesList.filter((i) => i.status === 'unpaid' || i.status === 'partial').reduce((s, i) => s + i.amount, 0)
  const overdue = invoicesList.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)

  const statusColor: Record<string, string> = {
    paid: 'badge-success', unpaid: 'badge-warning', overdue: 'badge-danger', partial: 'badge-info',
  }
  const statusLabel: Record<string, string> = {
    paid: t('billing.paid'), unpaid: t('billing.unpaid'), overdue: t('billing.overdue'), partial: t('billing.partial'),
  }

  const handleSubmit = () => {
    if (!formData.client || !formData.amount) return
    setInvoicesList([{
      id: `INV-2026-${String(invoicesList.length + 1).padStart(3, '0')}`,
      client: formData.client,
      amount: Number(formData.amount),
      status: 'unpaid',
      dueDate: formData.dueDate,
      case: formData.caseId || '-',
      issuedDate: new Date().toISOString().split('T')[0],
    }, ...invoicesList])
    setShowForm(false)
    setFormData({ client: '', amount: '', dueDate: '', caseId: '' })
  }

  const summaryCards = [
    { label: t('billing.totalRevenue'), value: formatCurrency(totalRevenue), icon: DollarSign, color: 'from-blue-500 to-blue-600' },
    { label: t('billing.collected'), value: formatCurrency(collected), icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
    { label: t('billing.outstanding'), value: formatCurrency(outstanding), icon: TrendingUp, color: 'from-amber-500 to-amber-600' },
    { label: t('billing.overdueAmount'), value: formatCurrency(overdue), icon: AlertTriangle, color: 'from-red-500 to-red-600' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('billing.title')}</h1>
            <p className="text-[var(--text-muted)] mt-1">{t('billing.subtitle')}</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> {t('billing.newInvoice')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, i) => (
            <div key={i} className="glass-card stat-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">{card.label}</p>
                  <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder={t('billing.search')} value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10 text-sm" />
            </div>
            <div className="relative">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="glass-input text-sm appearance-none pr-8 cursor-pointer">
                <option value="all">All</option>
                <option value="paid">{t('billing.paid')}</option>
                <option value="unpaid">{t('billing.unpaid')}</option>
                <option value="overdue">{t('billing.overdue')}</option>
                <option value="partial">{t('billing.partial')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">{t('billing.invoiceNo')}</th>
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">{t('billing.client')}</th>
                  <th className="text-right py-3 px-3 text-[var(--text-muted)] font-medium">{t('billing.amount')}</th>
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium hidden sm:table-cell">{t('billing.dueDate')}</th>
                  <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">{t('billing.status')}</th>
                  <th className="text-right py-3 px-3 text-[var(--text-muted)] font-medium">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="table-row border-b border-[var(--border-color)] last:border-0">
                    <td className="py-3 px-3 font-mono text-xs text-[var(--accent)]">{inv.id}</td>
                    <td className="py-3 px-3 text-[var(--text-primary)] font-medium">{inv.client}</td>
                    <td className="py-3 px-3 text-right text-[var(--text-primary)] font-semibold">{formatCurrency(inv.amount)}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)] hidden sm:table-cell">{inv.dueDate}</td>
                    <td className="py-3 px-3"><span className={`badge ${statusColor[inv.status]}`}>{statusLabel[inv.status]}</span></td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => setSelectedInvoice(inv)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)]">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center py-8 text-[var(--text-muted)]">{t('common.noData')}</p>}
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Invoice Details</h2>
              <button onClick={() => setSelectedInvoice(null)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)]"><X className="w-5 h-5 text-[var(--text-muted)]" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">{t('billing.invoiceNo')}</span><span className="font-mono text-[var(--accent)]">{selectedInvoice.id}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">{t('billing.client')}</span><span className="text-[var(--text-primary)] font-medium">{selectedInvoice.client}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">{t('billing.amount')}</span><span className="text-[var(--text-primary)] font-bold text-lg">{formatCurrency(selectedInvoice.amount)}</span></div>
              <div className="flex justify-between items-center"><span className="text-[var(--text-muted)]">{t('billing.status')}</span><span className={`badge ${statusColor[selectedInvoice.status]}`}>{statusLabel[selectedInvoice.status]}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Issued Date</span><span className="text-[var(--text-primary)]">{selectedInvoice.issuedDate}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">{t('billing.dueDate')}</span><span className="text-[var(--text-primary)]">{selectedInvoice.dueDate}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Case</span><span className="font-mono text-xs text-[var(--accent)]">{selectedInvoice.case}</span></div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{t('billing.newInvoice')}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)]"><X className="w-5 h-5 text-[var(--text-muted)]" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('billing.client')}</label><input value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} className="glass-input text-sm" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('billing.amount')} (IDR)</label><input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="glass-input text-sm" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('billing.dueDate')}</label><input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="glass-input text-sm" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Case ID</label><input value={formData.caseId} onChange={(e) => setFormData({ ...formData, caseId: e.target.value })} className="glass-input text-sm" placeholder="CSE-2026-001" /></div>
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
