'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { Scale, Eye, EyeOff, Sun, Moon, Globe, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 800))

    if (login(email, password)) {
      router.push('/dashboard')
    } else {
      setError(language === 'en' ? 'Invalid credentials' : 'Email atau kata sandi salah')
    }
    setLoading(false)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 dark:from-slate-950 dark:via-[#0f172a] dark:to-[#162033]" />
      <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-[20%] -right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/5 blur-3xl" />

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('login.title')}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('login.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                placeholder="name@lawfirm.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t('login.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[var(--border-color)] accent-blue-500" />
                <span className="text-sm text-[var(--text-secondary)]">{t('login.remember')}</span>
              </label>
              <button type="button" className="text-sm text-[var(--accent)] hover:underline">
                {t('login.forgot')}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t('login.button')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            {t('login.noAccount')}{' '}
            <button className="text-[var(--accent)] hover:underline font-medium">
              {t('login.register')}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          &copy; 2026 Salomo Partners. All rights reserved.
        </p>
      </div>
    </div>
  )
}
