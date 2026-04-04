'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Scale,
  X,
  MessageSquareText,
  AudioLines,
  BookOpenCheck,
  ScanText,
  Video,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { user, logout } = useAuth()

  const aiTools = [
    { href: '/ai-assistant', icon: MessageSquareText, label: t('nav.aiAssistant') },
    { href: '/audio-transcribe', icon: AudioLines, label: t('nav.audioTranscribe') },
    { href: '/law-compare', icon: BookOpenCheck, label: t('nav.lawCompare') },
    { href: '/ocr-tool', icon: ScanText, label: t('nav.ocrTool') },
  ]

  const managementItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { href: '/cases', icon: Briefcase, label: t('nav.cases') },
    { href: '/clients', icon: Users, label: t('nav.clients') },
    { href: '/documents', icon: FileText, label: t('nav.documents') },
  ]

  const workspaceItems = [
    { href: '/meeting', icon: Video, label: t('nav.meeting') },
    { href: '/calendar', icon: Calendar, label: t('nav.calendar') },
    { href: '/settings', icon: Settings, label: t('nav.settings') },
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const renderNavGroup = (label: string, items: typeof aiTools) => (
    <div className="mb-2">
      <p className="px-3 mb-1.5 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">{label}</p>
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-[260px]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-white/70 via-slate-100/50 to-slate-200/40 dark:from-[#0a0a1e]/95 dark:via-[#0d1025]/90 dark:to-[#0a0a1e]/95 border-r border-[var(--card-border)] backdrop-blur-2xl">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Scale className="w-[18px] h-[18px] text-white" />
              </div>
              <div>
                <h1 className="text-[15px] font-bold text-[var(--text-primary)] leading-tight">Salomo Partners</h1>
                <p className="text-[9px] text-[var(--text-muted)] tracking-wider uppercase">AI Legal Workspace</p>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-[var(--accent-light)]">
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>

          <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto">
            {renderNavGroup(t('nav.aiTools'), aiTools)}
            <div className="h-px bg-[var(--border-color)] my-2 mx-2" />
            {renderNavGroup(t('nav.management'), managementItems)}
            <div className="h-px bg-[var(--border-color)] my-2 mx-2" />
            {renderNavGroup(t('nav.workspace'), workspaceItems)}
          </nav>

          <div className="p-2.5 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-card)]">
              {user?.image ? (
                <img src={user.image} alt="" className="w-8 h-8 rounded-lg flex-shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.avatar}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-red-400 hover:text-red-500 hover:bg-red-500/10 mt-1"
            >
              <LogOut className="w-[18px] h-[18px]" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
