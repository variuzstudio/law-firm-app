'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  FileText,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { cases, activities, calendarEvents, revenueData, caseTypeData } from '@/data/mockData'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function RevenueChart() {
  const max = Math.max(...revenueData.map((d) => d.revenue))
  return (
    <div className="flex items-end gap-3 h-40 mt-4">
      {revenueData.map((d, i) => {
        const height = (d.revenue / max) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative group">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${height}%`, minHeight: '8px' }}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-2 py-1 text-xs font-medium text-[var(--text-primary)] whitespace-nowrap shadow-lg">
                {formatCurrency(d.revenue)}
              </div>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

function CaseDistribution() {
  const total = caseTypeData.reduce((s, d) => s + d.value, 0)
  return (
    <div className="space-y-3 mt-4">
      {caseTypeData.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--text-secondary)]">{d.name}</span>
              <span className="font-medium text-[var(--text-primary)]">{d.value}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--border-color)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const activeCases = cases.filter((c) => c.status === 'active').length
  const recentCases = cases.slice(0, 5)
  const upcomingEvents = calendarEvents.slice(0, 4)
  const recentActivities = activities.slice(0, 5)

  const stats = [
    { label: t('dashboard.activeCases'), value: activeCases, icon: Briefcase, change: '+12%', up: true, color: 'from-blue-500 to-blue-600' },
    { label: t('dashboard.totalClients'), value: 10, icon: Users, change: '+8%', up: true, color: 'from-violet-500 to-violet-600' },
    { label: t('dashboard.pendingTasks'), value: 7, icon: Clock, change: '-5%', up: false, color: 'from-amber-500 to-amber-600' },
    { label: t('dashboard.revenue'), value: formatCurrency(285000000), icon: TrendingUp, change: '+23%', up: true, color: 'from-emerald-500 to-emerald-600' },
  ]

  const statusColor: Record<string, string> = {
    active: 'badge-success',
    pending: 'badge-warning',
    closed: 'badge-neutral',
    review: 'badge-info',
  }

  const statusLabel: Record<string, string> = {
    active: t('cases.active'),
    pending: t('cases.pending'),
    closed: t('cases.closed'),
    review: t('cases.review'),
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {t('dashboard.welcome')}, {user?.name?.split(',')[0]}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">{t('dashboard.overview')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className={`glass-card stat-card p-5 animate-fade-in animate-fade-in-delay-${i + 1}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.up ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-[var(--text-muted)] ml-1">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-[var(--text-primary)]">{t('dashboard.monthlyRevenue')}</h2>
              <button
                onClick={() => router.push('/billing')}
                className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                {t('dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <RevenueChart />
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-[var(--text-primary)]">{t('dashboard.caseDistribution')}</h2>
            </div>
            <CaseDistribution />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">{t('dashboard.recentCases')}</h2>
              <button
                onClick={() => router.push('/cases')}
                className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                {t('dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left py-2.5 px-3 text-[var(--text-muted)] font-medium">{t('cases.caseNumber')}</th>
                    <th className="text-left py-2.5 px-3 text-[var(--text-muted)] font-medium">{t('cases.caseName')}</th>
                    <th className="text-left py-2.5 px-3 text-[var(--text-muted)] font-medium hidden sm:table-cell">{t('cases.type')}</th>
                    <th className="text-left py-2.5 px-3 text-[var(--text-muted)] font-medium">{t('cases.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map((c) => (
                    <tr
                      key={c.id}
                      className="table-row border-b border-[var(--border-color)] last:border-0 cursor-pointer"
                      onClick={() => router.push('/cases')}
                    >
                      <td className="py-2.5 px-3 font-mono text-xs text-[var(--accent)]">{c.id}</td>
                      <td className="py-2.5 px-3 text-[var(--text-primary)] font-medium">{c.name}</td>
                      <td className="py-2.5 px-3 text-[var(--text-secondary)] hidden sm:table-cell">{c.type}</td>
                      <td className="py-2.5 px-3">
                        <span className={`badge ${statusColor[c.status]}`}>{statusLabel[c.status]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">{t('dashboard.upcomingEvents')}</h2>
              <button
                onClick={() => router.push('/calendar')}
                className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                {t('dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-3 p-3 rounded-xl hover:bg-[var(--accent-light)] transition-colors cursor-pointer"
                  onClick={() => router.push('/calendar')}
                >
                  <div
                    className="w-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                      <span className="text-xs text-[var(--text-muted)]">{event.date} &bull; {event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text-primary)]">{t('dashboard.recentActivity')}</h2>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--text-primary)]">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-[var(--text-secondary)]">{activity.action}</span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{activity.detail}</p>
                </div>
                <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
