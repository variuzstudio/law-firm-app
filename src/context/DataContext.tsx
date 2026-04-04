'use client'

import React, { createContext, useContext, useState } from 'react'
import { cases as initialCases, calendarEvents as initialEvents } from '@/data/mockData'

export type CaseItem = typeof initialCases[number]
export type CalendarEvent = typeof initialEvents[number]

interface DataContextType {
  cases: CaseItem[]
  events: CalendarEvent[]
  addCase: (c: CaseItem) => void
  updateCase: (id: string, data: Partial<CaseItem>) => void
  deleteCase: (id: string) => void
  addEvent: (e: CalendarEvent) => void
  updateEvent: (id: number, data: Partial<CalendarEvent>) => void
  deleteEvent: (id: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<CaseItem[]>(initialCases)
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)

  const addCase = (c: CaseItem) => setCases((prev) => [c, ...prev])
  const updateCase = (id: string, data: Partial<CaseItem>) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const deleteCase = (id: string) => setCases((prev) => prev.filter((c) => c.id !== id))

  const addEvent = (e: CalendarEvent) => setEvents((prev) => [...prev, e])
  const updateEvent = (id: number, data: Partial<CalendarEvent>) =>
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)))
  const deleteEvent = (id: number) => setEvents((prev) => prev.filter((e) => e.id !== id))

  return (
    <DataContext.Provider value={{ cases, events, addCase, updateCase, deleteCase, addEvent, updateEvent, deleteEvent }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
