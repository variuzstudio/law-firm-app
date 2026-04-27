'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useData } from '@/context/DataContext'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import {
  ArrowLeft, Edit3, Trash2, Save, X, FileText, File, FileCheck, FilePlus2,
  FolderOpen, Download, Printer, Calendar, User, Briefcase, Eye,
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

const typeLabels: Record<string, string> = {
  contract: 'Contract',
  pleading: 'Pleading',
  correspondence: 'Correspondence',
  evidence: 'Evidence',
  memo: 'Memo',
}

export default function DocumentDetailPage() {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const { documents, cases, updateDocument, deleteDocument } = useData()
  const router = useRouter()
  const params = useParams()
  const docId = Number(params.id)

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ name: '', type: '', case: '', author: '' })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  const docData = documents.find((d) => d.id === docId)

  useEffect(() => {
    if (docData) {
      setEditData({
        name: docData.name,
        type: docData.type,
        case: docData.case,
        author: docData.author,
      })
    }
  }, [docData])

  if (!isAuthenticated) return null
  if (!docData) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <FileText className="w-16 h-16 text-[var(--text-muted)] mb-4" />
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{t('common.noData')}</h2>
          <p className="text-[var(--text-muted)] mb-4">Document not found</p>
          <Link href="/documents" className="btn-primary"><ArrowLeft className="w-4 h-4" /> {t('common.back')}</Link>
        </div>
      </AppLayout>
    )
  }

  const Icon = typeIcons[docData.type] || FileText
  const colorClass = typeColors[docData.type] || 'text-gray-500 bg-gray-500/10'
  const relatedCase = cases.find((c) => c.id === docData.case)

  const handleSave = () => {
    updateDocument(docId, editData)
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteDocument(docId)
    router.push('/documents')
  }

  const handlePrint = () => {
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(`<html><head><title>Salomo Partners - ${docData.name}</title><style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:0 auto}h1{color:#1e3a5f;border-bottom:2px solid #3b82f6;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:8px;border-bottom:1px solid #eee}td:first-child{color:#666;width:140px}.placeholder{margin-top:40px;padding:60px;text-align:center;border:2px dashed #ddd;border-radius:12px;color:#999}</style></head><body><h1>${docData.name}</h1><table><tr><td>Type</td><td>${typeLabels[docData.type] || docData.type}</td></tr><tr><td>Related Case</td><td>${docData.case}</td></tr><tr><td>Size</td><td>${docData.size}</td></tr><tr><td>Last Modified</td><td>${docData.modified}</td></tr><tr><td>Author</td><td>${docData.author}</td></tr></table><div class="placeholder">Document content preview area</div><p style="margin-top:40px;color:#999;font-size:11px">Printed from Salomo Partners - ${new Date().toLocaleString()}</p></body></html>`)
      w.document.close()
      w.print()
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/documents" className="p-2 rounded-xl hover:bg-[var(--accent-light)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">{docData.name}</h1>
                <p className="text-xs text-[var(--text-muted)]">{typeLabels[docData.type] || docData.type} • {docData.size}</p>
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
                <button onClick={handlePrint} className="btn-secondary text-sm"><Printer className="w-4 h-4" /> {t('docs.print')}</button>
                <button className="btn-secondary text-sm"><Download className="w-4 h-4" /> {t('docs.download')}</button>
                <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm"><Edit3 className="w-4 h-4" /> {t('common.edit')}</button>
                <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-xl hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--accent)]" /> {t('docs.preview')}
              </h2>
              <div className="rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] p-8 min-h-[400px] flex flex-col items-center justify-center">
                <Icon className="w-20 h-20 text-[var(--text-muted)] mb-4" />
                <p className="text-lg font-medium text-[var(--text-primary)] mb-1">{docData.name}</p>
                <p className="text-sm text-[var(--text-muted)] mb-6">{typeLabels[docData.type] || docData.type} • {docData.size}</p>
                <div className="flex gap-3">
                  <button onClick={handlePrint} className="btn-secondary text-sm"><Printer className="w-4 h-4" /> {t('docs.print')}</button>
                  <button className="btn-primary text-sm"><Download className="w-4 h-4" /> {t('docs.download')}</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">{t('cases.details')}</h2>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('docs.name')}</label>
                    <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('docs.type')}</label>
                    <select value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })} className="glass-input text-sm">
                      <option value="contract">{t('docs.contract')}</option>
                      <option value="pleading">{t('docs.pleading')}</option>
                      <option value="correspondence">{t('docs.correspondence')}</option>
                      <option value="evidence">{t('docs.evidence')}</option>
                      <option value="memo">{t('docs.memo')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('docs.case')}</label>
                    <input value={editData.case} onChange={(e) => setEditData({ ...editData, case: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Author</label>
                    <input value={editData.author} onChange={(e) => setEditData({ ...editData, author: e.target.value })} className="glass-input text-sm" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">{t('docs.type')}</p>
                      <p className="text-[var(--text-primary)] capitalize">{typeLabels[docData.type] || docData.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">{t('docs.case')}</p>
                      {relatedCase ? (
                        <Link href={`/cases/${relatedCase.id}`} className="text-[var(--accent)] hover:underline">{relatedCase.name}</Link>
                      ) : (
                        <p className="text-[var(--text-primary)]">{docData.case}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Download className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">{t('docs.size')}</p>
                      <p className="text-[var(--text-primary)]">{docData.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">{t('docs.modified')}</p>
                      <p className="text-[var(--text-primary)]">{docData.modified}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Author</p>
                      <p className="text-[var(--text-primary)]">{docData.author}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {relatedCase && (
              <div className="glass-card p-6">
                <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[var(--accent)]" /> {t('docs.case')}
                </h2>
                <Link href={`/cases/${relatedCase.id}`} className="block p-4 rounded-xl hover:bg-[var(--accent-light)] transition-colors border border-[var(--border-color)]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-[var(--accent)]">{relatedCase.id}</span>
                    <span className={`badge ${relatedCase.status === 'active' ? 'badge-success' : relatedCase.status === 'pending' ? 'badge-warning' : relatedCase.status === 'review' ? 'badge-info' : 'badge-neutral'}`}>
                      {relatedCase.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">{relatedCase.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{relatedCase.client} • {relatedCase.type}</p>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="glass-card w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{t('common.delete')}?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">{docData.name}</p>
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
