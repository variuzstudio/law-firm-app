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
  CreditCard,
  Settings,
  LogOut,
  Scale,
  X,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { user, logout } = useAuth()

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { href: '/cases', icon: Briefcase, label: t('nav.cases') },
    { href: '/clients', icon: Users, label: t('nav.clients') },
    { href: '/documents', icon: FileText, label: t('nav.documents') },
    { href: '/calendar', icon: Calendar, label: t('nav.calendar') },
    { href: '/billing', icon: CreditCard, label: t('nav.billing') },
    { href: '/settings', icon: Settings, label: t('nav.settings') },
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

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
        style={{ background: 'var(--bg-sidebar)' }}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-100/80 via-slate-200/60 to-slate-300/40 dark:from-slate-900/80 dark:via-slate-800/60 dark:to-[#162033]/80 border-r border-[var(--border-color)]">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[var(--text-primary)]">LexSupport</h1>
                <p className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase">Legal Workspace</p>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-[var(--accent-light)]">
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-3 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-red-400 hover:text-red-500 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
