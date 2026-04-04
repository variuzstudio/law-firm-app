'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { Scale, Sun, Moon, Globe, ArrowRight, Sparkles } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { isAuthenticated, loginWithGoogle, loading: authLoading } = useAuth()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  const handleGoogleLogin = () => {
    setLoading(true)
    loginWithGoogle()
  }

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:from-[#060610] dark:via-[#0a0a1e] dark:to-[#0d1025]" />
      <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-400/8 dark:bg-cyan-500/5 blur-3xl" />
      <div className="absolute bottom-[20%] -right-[10%] w-[400px] h-[400px] rounded-full bg-purple-400/8 dark:bg-purple-500/5 blur-3xl" />
      <div className="absolute top-[60%] left-[50%] w-[300px] h-[300px] rounded-full dark:bg-blue-600/3 blur-3xl" />

      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>
        )}
        <button
          onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-all text-sm text-[var(--text-secondary)]"
        >
          <Globe className="w-4 h-4" />
          {language === 'en' ? 'EN' : 'ID'}
        </button>
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="glass-card p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('login.title')}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">{t('login.subtitle')}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-[var(--border-color)] hover:border-[var(--accent)] bg-[var(--bg-card)] hover:bg-[var(--accent-light)] transition-all text-[var(--text-primary)] font-medium disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <GoogleIcon />
                  {t('login.googleButton')}
                </>
              )}
            </button>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-color)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[var(--bg-card)] text-[var(--text-muted)]">{t('login.orContinue')}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--accent-light)] border border-[var(--card-border)]">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{t('login.aiPowered')}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{t('login.aiDesc')}</p>
                </div>
              </div>
            </div>

            <ul className="space-y-2 pt-2">
              {[
                t('login.feature1'),
                t('login.feature2'),
                t('login.feature3'),
                t('login.feature4'),
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          &copy; 2026 Salomo Partners. All rights reserved.
        </p>
      </div>
    </div>
  )
}
