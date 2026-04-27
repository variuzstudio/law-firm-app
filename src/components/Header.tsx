'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import {
  Menu, Sun, Moon, Bell, Search, ChevronDown, ChevronLeft, Scale,
} from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [langOpen, setLangOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const isDashboard = pathname === '/dashboard'

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    { id: 1, title: 'Sidang CSE-2026-001', desc: 'Hari ini pukul 09:00 WIB', time: '30 min', unread: true },
    { id: 2, title: 'Dokumen baru diunggah', desc: 'Surat Kuasa - PT Maju Jaya', time: '2 jam', unread: true },
    { id: 3, title: 'Invoice INV-2026-007', desc: 'Jatuh tempo terlewat', time: '1 hari', unread: false },
    { id: 4, title: 'Rapat Tim', desc: 'Besok pukul 10:00 WIB', time: '1 hari', unread: false },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-2xl">
      <div className="flex items-center justify-between h-14 px-3 lg:px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-[var(--accent-light)] transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>

          {!isDashboard && (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl hover:bg-[var(--accent-light)] transition-colors lg:hidden"
              title={t('common.back')}
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          )}

          <Link href="/dashboard" className="flex items-center gap-2 mr-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Scale className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--text-primary)] hidden sm:inline">Salomo Partners</span>
          </Link>

          <div className="h-5 w-px bg-[var(--border-color)] mx-1 hidden sm:block" />

          <div className={`relative hidden sm:block transition-all duration-200 ${searchFocused ? 'w-72' : 'w-56'}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder={t('common.search') + '...'}
              className="glass-input pl-9 py-1.5 text-sm"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl hover:bg-[var(--accent-light)] transition-all duration-200"
              title={theme === 'dark' ? t('settings.light') : t('settings.dark')}
            >
              {theme === 'dark' ? (
                <Sun className="w-[17px] h-[17px] text-amber-400" />
              ) : (
                <Moon className="w-[17px] h-[17px] text-slate-500" />
              )}
            </button>
          )}

          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 p-2 px-2.5 rounded-xl hover:bg-[var(--accent-light)] transition-all duration-200"
            >
              <span className="text-base">
                {language === 'en' ? '🇺🇸' : '🇮🇩'}
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-4 w-40 glass-card p-1.5 shadow-elegant-lg z-50" style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}>
                <button
                  onClick={() => { setLanguage('en'); setLangOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    language === 'en' ? 'bg-[var(--accent-light)] text-[var(--accent)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--accent-light)]'
                  }`}
                >
                  <span className="text-base">🇺🇸</span> English
                </button>
                <button
                  onClick={() => { setLanguage('id'); setLangOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    language === 'id' ? 'bg-[var(--accent-light)] text-[var(--accent)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--accent-light)]'
                  }`}
                >
                  <span className="text-base">🇮🇩</span> Indonesia
                </button>
              </div>
            )}
          </div>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl hover:bg-[var(--accent-light)] transition-all duration-200"
            >
              <Bell className="w-[17px] h-[17px] text-[var(--text-secondary)]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
            </button>
            {notifOpen && (
              <div className="absolute right-8 top-full mt-8 w-80 glass-card shadow-elegant-lg overflow-hidden z-50" style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}>
                <div className="p-3 border-b border-[var(--border-color)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                    {language === 'en' ? 'Notifications' : 'Notifikasi'}
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 border-b border-[var(--border-color)] hover:bg-[var(--accent-light)] transition-colors cursor-pointer ${
                        n.unread ? 'bg-[var(--accent-light)]/50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`text-sm ${n.unread ? 'font-semibold' : 'font-medium'} text-[var(--text-primary)]`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{n.desc}</p>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap ml-2">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
