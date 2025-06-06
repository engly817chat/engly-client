'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { authApi, UserProfile } from '@/entities/auth'
import { getAccessToken, removeFromStorage } from '@/shared/utils'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isEmailVerified: boolean
  isLoading: boolean
  setUser: (user: UserProfile | null) => void
  logout: () => void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  const logout = async () => {
    setIsLoading(true)
    try {
      await authApi.logout()
      toast.success(t('auth.logout'))
    } catch (error) {
      toast.error(t('auth.logoutError'))
      console.error('Error during logout:', error)
    } finally {
      removeFromStorage()
      setUser(null)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi
      .getProfile()
      .then(userData => {
        setUser(userData)
      })
      .catch(error => {
        if (error.response?.status === 401) {
          removeFromStorage()
        } else {
          console.error('Error fetching profile:', error)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        logout,
        isLoading,
        isEmailVerified: !!user?.emailVerified,
      }}
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
