'use client'

import React, { createContext, useContext, useState } from 'react'
import { cases as initialCases, calendarEvents as initialEvents, clients as initialClients, documents as initialDocs } from '@/data/mockData'

export type CaseItem = typeof initialCases[number]
export type CalendarEvent = typeof initialEvents[number]
export type ClientItem = typeof initialClients[number]
export type DocumentItem = typeof initialDocs[number]

interface DataContextType {
  cases: CaseItem[]
  events: CalendarEvent[]
  clients: ClientItem[]
  documents: DocumentItem[]
  addCase: (c: CaseItem) => void
  updateCase: (id: string, data: Partial<CaseItem>) => void
  deleteCase: (id: string) => void
  addEvent: (e: CalendarEvent) => void
  updateEvent: (id: number, data: Partial<CalendarEvent>) => void
  deleteEvent: (id: number) => void
  addClient: (c: ClientItem) => void
  updateClient: (id: number, data: Partial<ClientItem>) => void
  deleteClient: (id: number) => void
  addDocument: (d: DocumentItem) => void
  updateDocument: (id: number, data: Partial<DocumentItem>) => void
  deleteDocument: (id: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<CaseItem[]>(initialCases)
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [clients, setClients] = useState<ClientItem[]>(initialClients)
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocs)

  const addCase = (c: CaseItem) => setCases((prev) => [c, ...prev])
  const updateCase = (id: string, data: Partial<CaseItem>) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const deleteCase = (id: string) => setCases((prev) => prev.filter((c) => c.id !== id))

  const addEvent = (e: CalendarEvent) => setEvents((prev) => [...prev, e])
  const updateEvent = (id: number, data: Partial<CalendarEvent>) =>
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)))
  const deleteEvent = (id: number) => setEvents((prev) => prev.filter((e) => e.id !== id))

  const addClient = (c: ClientItem) => setClients((prev) => [c, ...prev])
  const updateClient = (id: number, data: Partial<ClientItem>) =>
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const deleteClient = (id: number) => setClients((prev) => prev.filter((c) => c.id !== id))

  const addDocument = (d: DocumentItem) => setDocuments((prev) => [d, ...prev])
  const updateDocument = (id: number, data: Partial<DocumentItem>) =>
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)))
  const deleteDocument = (id: number) => setDocuments((prev) => prev.filter((d) => d.id !== id))

  return (
    <DataContext.Provider value={{
      cases, events, clients, documents,
      addCase, updateCase, deleteCase,
      addEvent, updateEvent, deleteEvent,
      addClient, updateClient, deleteClient,
      addDocument, updateDocument, deleteDocument,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
