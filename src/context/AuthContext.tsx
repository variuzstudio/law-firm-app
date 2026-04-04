'use client'

import React, { createContext, useContext } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface User {
  name: string
  email: string
  role: string
  avatar: string
  image?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  loginWithGoogle: () => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const user: User | null = session?.user
    ? {
        name: session.user.name || 'User',
        email: session.user.email || '',
        role: 'Partner',
        avatar: (session.user.name || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
        image: session.user.image || undefined,
      }
    : null

  const login = (): boolean => {
    signIn('google', { callbackUrl: '/dashboard' })
    return true
  }

  const loginWithGoogle = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const logout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!session,
        login,
        loginWithGoogle,
        logout,
        loading: status === 'loading',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
