'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import {
  User, Palette, Bell, Shield, Globe, Sun, Moon, Save, Check,
} from 'lucide-react'

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name: 'Ahmad Faisal, S.H.',
    email: 'ahmad.faisal@salomopartners.id',
    role: 'Senior Partner',
    firm: 'Salomo Partners',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    caseUpdates: true,
    deadlines: true,
    messages: false,
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
  })

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  if (!isAuthenticated || !mounted) return null

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'appearance', label: t('settings.appearance'), icon: Palette },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'security', label: t('settings.security'), icon: Shield },
  ]

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1000px] mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('settings.title')}</h1>
          <p className="text-[var(--text-muted)] mt-1">{t('settings.subtitle')}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-56 flex-shrink-0">
            <div className="glass-card p-2 flex md:flex-col gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--accent-light)]'
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('settings.profile')}</h2>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--accent-light)]">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold">
                    AF
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{profile.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{profile.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('settings.fullName')}</label>
                    <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('settings.email')}</label>
                    <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('settings.role')}</label>
                    <input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('settings.firm')}</label>
                    <input value={profile.firm} onChange={(e) => setProfile({ ...profile, firm: e.target.value })} className="glass-input text-sm" />
                  </div>
                </div>
                <button onClick={handleSave} className="btn-primary">
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {t('settings.save')}</>}
                </button>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="glass-card p-6 space-y-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('settings.appearance')}</h2>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">{t('settings.theme')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        theme === 'light' ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-[var(--border-color)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <Sun className="w-6 h-6 text-amber-500" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">{t('settings.light')}</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        theme === 'dark' ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-[var(--border-color)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <Moon className="w-6 h-6 text-blue-400" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">{t('settings.dark')}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">{t('settings.language')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        language === 'en' ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-[var(--border-color)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <span className="text-2xl">🇺🇸</span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-[var(--text-primary)]">English</p>
                        <p className="text-xs text-[var(--text-muted)]">United States</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setLanguage('id')}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        language === 'id' ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-[var(--border-color)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <span className="text-2xl">🇮🇩</span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-[var(--text-primary)]">Indonesia</p>
                        <p className="text-xs text-[var(--text-muted)]">Bahasa Indonesia</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('settings.notifications')}</h2>
                {[
                  { key: 'email', label: t('settings.emailNotif') },
                  { key: 'push', label: t('settings.pushNotif') },
                  { key: 'caseUpdates', label: t('settings.caseUpdates') },
                  { key: 'deadlines', label: t('settings.deadlineReminders') },
                  { key: 'messages', label: t('settings.newMessages') },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--accent-light)] transition-colors">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-blue-500' : 'bg-[var(--border-color)]'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-[22px]' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
                <button onClick={handleSave} className="btn-primary mt-2">
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {t('settings.save')}</>}
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass-card p-6 space-y-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('settings.security')}</h2>

                <div className="space-y-4">
                  <h3 className="font-medium text-[var(--text-primary)]">{t('settings.changePassword')}</h3>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('settings.currentPassword')}</label>
                    <input type="password" value={security.currentPassword} onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('settings.newPassword')}</label>
                    <input type="password" value={security.newPassword} onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })} className="glass-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('settings.confirmPassword')}</label>
                    <input type="password" value={security.confirmPassword} onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })} className="glass-input text-sm" />
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)]">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--accent-light)]">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{t('settings.twoFactor')}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{t('settings.twoFactorDesc')}</p>
                    </div>
                    <button
                      onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${security.twoFactor ? 'bg-blue-500' : 'bg-[var(--border-color)]'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${security.twoFactor ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <button onClick={handleSave} className="btn-primary">
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {t('settings.save')}</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
