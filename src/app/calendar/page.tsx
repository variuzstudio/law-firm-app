'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useData } from '@/context/DataContext'
import AppLayout from '@/components/AppLayout'
import {
  Plus, ChevronLeft, ChevronRight, X, Clock, MapPin, Briefcase, Edit3, Trash2, Save, Check,
} from 'lucide-react'

export default function CalendarPage() {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const { events, addEvent, updateEvent, deleteEvent, updateCase } = useData()
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1))
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ title: '', type: 'meeting', date: '', time: '', location: '', caseId: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [isAuthenticated, loading, router])

  if (!isAuthenticated) return null

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date(2026, 2, 28))

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter((e) => e.date === dateStr)
  }

  const typeColor = (type: string) => {
    switch (type) {
      case 'hearing': return '#ef4444'
      case 'deadline': return '#f59e0b'
      case 'consultation': return '#3b82f6'
      default: return '#8b5cf6'
    }
  }

  const typeLabel: Record<string, string> = {
    hearing: t('calendar.hearing'),
    meeting: t('calendar.meeting'),
    deadline: t('calendar.deadline'),
    consultation: t('calendar.consultation'),
  }

  const handleAddNew = () => {
    setFormData({ title: '', type: 'meeting', date: '', time: '', location: '', caseId: '' })
    setIsEditing(false)
    setShowForm(true)
  }

  const handleEdit = () => {
    if (!selectedEvent) return
    setFormData({
      title: selectedEvent.title,
      type: selectedEvent.type,
      date: selectedEvent.date,
      time: selectedEvent.time,
      location: selectedEvent.location,
      caseId: selectedEvent.case,
    })
    setEditingEventId(selectedEvent.id)
    setIsEditing(true)
    setSelectedEvent(null)
    setShowForm(true)
  }

  const handleSaveEdit = () => {
    if (!formData.title || !formData.date) return

    if (isEditing && editingEventId !== null) {
      const color = typeColor(formData.type)
      updateEvent(editingEventId, {
        title: formData.title,
        type: formData.type,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        case: formData.caseId || '-',
        color,
      })

      if (formData.caseId && formData.caseId !== '-') {
        updateCase(formData.caseId, { date: formData.date })
      }
    } else {
      const color = typeColor(formData.type)
      addEvent({
        id: Date.now(),
        title: formData.title,
        type: formData.type,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        case: formData.caseId || '-',
        color,
      })
    }

    setShowForm(false)
    setIsEditing(false)
    setEditingEventId(null)
    setFormData({ title: '', type: 'meeting', date: '', time: '', location: '', caseId: '' })
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deleteEvent(selectedEvent.id)
    setSelectedEvent(null)
    setDeleteConfirm(false)
  }

  const handleDayClick = (day: number) => {
    const dayEvents = getEventsForDay(day)
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0])
    } else if (dayEvents.length === 0) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      setFormData({ title: '', type: 'meeting', date: dateStr, time: '', location: '', caseId: '' })
      setIsEditing(false)
      setShowForm(true)
    }
  }

  const upcomingEvents = events
    .filter((e) => e.date >= '2026-03-28')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 6)

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('calendar.title')}</h1>
            <p className="text-[var(--text-muted)] mt-1">{t('calendar.subtitle')}</p>
          </div>
          <button onClick={handleAddNew} className="btn-primary">
            <Plus className="w-4 h-4" /> {t('calendar.newEvent')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-[var(--accent-light)]">
                <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{monthNames[month]} {year}</h2>
                <button onClick={goToday} className="text-xs btn-secondary py-1 px-2">{t('calendar.today')}</button>
              </div>
              <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-[var(--accent-light)]">
                <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-px">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-[var(--text-muted)] py-2">{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[80px] p-1" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayEvents = getEventsForDay(day)
                const isToday = day === 28 && month === 2 && year === 2026
                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`min-h-[80px] p-1.5 rounded-xl border transition-colors cursor-pointer hover:bg-[var(--accent-light)] ${
                      isToday ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-transparent'
                    }`}
                  >
                    <span className={`text-xs font-medium ${isToday ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)]'}`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 2).map((e) => (
                        <div
                          key={e.id}
                          className="text-[10px] px-1.5 py-0.5 rounded-md truncate cursor-pointer font-medium"
                          style={{ backgroundColor: e.color + '20', color: e.color }}
                          onClick={(ev) => { ev.stopPropagation(); setSelectedEvent(e) }}
                        >
                          {e.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[10px] text-[var(--text-muted)] pl-1">+{dayEvents.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-card p-4">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">{t('calendar.upcoming')}</h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-xl hover:bg-[var(--accent-light)] transition-colors cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{event.title}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {event.date} {event.time}
                        </span>
                        {event.location !== '-' && (
                          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </span>
                        )}
                      </div>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: event.color + '20', color: event.color }}>
                        {typeLabel[event.type] || event.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => { setSelectedEvent(null); setDeleteConfirm(false) }}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Event Details</h2>
              <button onClick={() => { setSelectedEvent(null); setDeleteConfirm(false) }} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)]">
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedEvent.color }} />
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: selectedEvent.color + '20', color: selectedEvent.color }}>
                  {typeLabel[selectedEvent.type] || selectedEvent.type}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{selectedEvent.title}</h3>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]"><Clock className="w-4 h-4 text-[var(--text-muted)]" /> {selectedEvent.date} &bull; {selectedEvent.time}</div>
                {selectedEvent.location !== '-' && <div className="flex items-center gap-2 text-[var(--text-secondary)]"><MapPin className="w-4 h-4 text-[var(--text-muted)]" /> {selectedEvent.location}</div>}
                {selectedEvent.case !== '-' && <div className="flex items-center gap-2 text-[var(--text-secondary)]"><Briefcase className="w-4 h-4 text-[var(--text-muted)]" /> {selectedEvent.case}</div>}
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-[var(--border-color)]">
              <button onClick={handleEdit} className="btn-primary flex-1">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              {deleteConfirm ? (
                <button onClick={handleDelete} className="flex-1 py-2 px-4 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Confirm Delete
                </button>
              ) : (
                <button onClick={() => setDeleteConfirm(true)} className="btn-secondary flex-1 text-red-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => { setShowForm(false); setIsEditing(false) }}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{isEditing ? 'Edit Event' : t('calendar.newEvent')}</h2>
              <button onClick={() => { setShowForm(false); setIsEditing(false) }} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)]"><X className="w-5 h-5 text-[var(--text-muted)]" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label><input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="glass-input text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="glass-input text-sm">
                    <option value="hearing">{t('calendar.hearing')}</option><option value="meeting">{t('calendar.meeting')}</option><option value="deadline">{t('calendar.deadline')}</option><option value="consultation">{t('calendar.consultation')}</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Time</label><input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="glass-input text-sm" /></div>
              </div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="glass-input text-sm" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location</label><input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="glass-input text-sm" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Case ID</label><input value={formData.caseId} onChange={(e) => setFormData({ ...formData, caseId: e.target.value })} className="glass-input text-sm" placeholder="CSE-2026-001" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowForm(false); setIsEditing(false) }} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button onClick={handleSaveEdit} className="btn-primary flex-1"><Save className="w-4 h-4" /> {t('common.save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
