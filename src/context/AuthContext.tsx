'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  name: string
  email: string
  role: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USER: User = {
  name: 'Ahmad Faisal, S.H.',
  email: 'ahmad.faisal@lexsupport.id',
  role: 'Senior Partner',
  avatar: 'AF',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('lexsupport-auth')
    if (saved === 'true') {
      setUser(DEMO_USER)
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    if (email && password) {
      setUser(DEMO_USER)
      localStorage.setItem('lexsupport-auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('lexsupport-auth')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
