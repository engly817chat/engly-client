'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { UserProfile } from '@/entities/auth'
import { getAccessToken, removeFromStorage } from '@/shared/utils'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: UserProfile | null) => void
  logout: () => void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = () => {
    setUser(null)
    removeFromStorage()
    setIsLoading(false)
  }

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated: !!user, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
