'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useData } from '@/context/DataContext'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import {
  Upload, Search, Download, Trash2, X, FileText, File, FileCheck, FilePlus2,
  ChevronDown, FolderOpen, Printer,
} from 'lucide-react'

const typeIcons: Record<string, typeof FileText> = {
  contract: FileCheck,
  pleading: File,
  correspondence: FileText,
  evidence: FolderOpen,
  memo: FilePlus2,
}

const typeColors: Record<string, string> = {
  contract: 'text-blue-500 bg-blue-500/10',
  pleading: 'text-red-500 bg-red-500/10',
  correspondence: 'text-violet-500 bg-violet-500/10',
  evidence: 'text-amber-500 bg-amber-500/10',
  memo: 'text-emerald-500 bg-emerald-500/10',
}

export default function DocumentsPage() {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const { documents: docsList, addDocument, deleteDocument } = useData()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadName, setUploadName] = useState('')
  const [uploadType, setUploadType] = useState('contract')
  const [uploadCase, setUploadCase] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  if (!isAuthenticated) return null

  const filtered = docsList.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || d.type === filterType
    return matchSearch && matchType
  })

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    deleteDocument(id)
  }

  const handleUpload = () => {
    if (!uploadName) return
    addDocument({
      id: Date.now(),
      name: uploadName,
      type: uploadType,
      case: uploadCase || '-',
      size: '1.0 MB',
      modified: new Date().toISOString().split('T')[0],
      author: 'Ahmad Faisal',
    })
    setShowUpload(false)
    setUploadName('')
    setUploadType('contract')
    setUploadCase('')
  }

  const handlePrint = (e: React.MouseEvent, doc: typeof docsList[0]) => {
    e.preventDefault()
    e.stopPropagation()
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(`<html><head><title>Salomo Partners - ${doc.name}</title><style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:0 auto}h1{color:#1e3a5f;border-bottom:2px solid #3b82f6;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:8px;border-bottom:1px solid #eee}td:first-child{color:#666;width:140px}</style></head><body><h1>${doc.name}</h1><table><tr><td>Type</td><td>${doc.type}</td></tr><tr><td>Case</td><td>${doc.case}</td></tr><tr><td>Size</td><td>${doc.size}</td></tr><tr><td>Modified</td><td>${doc.modified}</td></tr><tr><td>Author</td><td>${doc.author}</td></tr></table><p style="margin-top:40px;color:#999;font-size:11px">Printed from Salomo Partners - ${new Date().toLocaleString()}</p></body></html>`)
      w.document.close()
      w.print()
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('docs.title')}</h1>
            <p className="text-[var(--text-muted)] mt-1">{t('docs.subtitle')}</p>
          </div>
          <button onClick={() => setShowUpload(true)} className="btn-primary">
            <Upload className="w-4 h-4" /> {t('docs.upload')}
          </button>
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder={t('docs.search')} value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10 text-sm" />
            </div>
            <div className="relative">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="glass-input text-sm appearance-none pr-8 cursor-pointer">
                <option value="all">All Types</option>
                <option value="contract">{t('docs.contract')}</option>
                <option value="pleading">{t('docs.pleading')}</option>
                <option value="correspondence">{t('docs.correspondence')}</option>
                <option value="evidence">{t('docs.evidence')}</option>
                <option value="memo">{t('docs.memo')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((doc) => {
              const Icon = typeIcons[doc.type] || FileText
              const colorClass = typeColors[doc.type] || 'text-gray-500 bg-gray-500/10'
              return (
                <Link key={doc.id} href={`/documents/${doc.id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--accent-light)] transition-colors group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">{doc.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-[var(--text-muted)]">{doc.case}</span>
                      <span className="text-xs text-[var(--text-muted)]">{doc.size}</span>
                      <span className="text-xs text-[var(--text-muted)]">{doc.modified}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handlePrint(e, doc)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)]" title={t('docs.print')}><Printer className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation() }} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)]" title={t('docs.download')}><Download className="w-4 h-4" /></button>
                    <button onClick={(e) => handleDelete(e, doc.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500" title={t('cases.delete')}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </Link>
              )
            })}
          </div>
          {filtered.length === 0 && <p className="text-center py-8 text-[var(--text-muted)]">{t('common.noData')}</p>}
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowUpload(false)}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{t('docs.upload')}</h2>
              <button onClick={() => setShowUpload(false)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)]"><X className="w-5 h-5 text-[var(--text-muted)]" /></button>
            </div>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 text-center hover:border-[var(--accent)] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">Click or drag files here</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">PDF, DOC, DOCX up to 50MB</p>
              </div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('docs.name')}</label><input value={uploadName} onChange={(e) => setUploadName(e.target.value)} className="glass-input text-sm" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('docs.type')}</label>
                <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="glass-input text-sm">
                  <option value="contract">{t('docs.contract')}</option><option value="pleading">{t('docs.pleading')}</option><option value="correspondence">{t('docs.correspondence')}</option><option value="evidence">{t('docs.evidence')}</option><option value="memo">{t('docs.memo')}</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('docs.case')}</label><input value={uploadCase} onChange={(e) => setUploadCase(e.target.value)} className="glass-input text-sm" placeholder="CSE-2026-001" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowUpload(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button onClick={handleUpload} className="btn-primary flex-1">{t('docs.upload')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
