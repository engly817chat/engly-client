'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, useAuth } from '@/entities/auth'
import { refreshTokens } from '@/shared/api/refresh'

export function useHandleGoogleCallback() {
  const router = useRouter()
  const { setUser } = useAuth()

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const { access_token } = await refreshTokens()

        if (!access_token) {
          throw new Error('Access token not received')
        }

        const user = await authApi.getProfile()
        setUser(user)

        const response = await authApi.isFirstLogin()
        if (!response.userExists) {
          router.push('/google-auth/additional-info')
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Error during Google callback flow:', error)
        router.push('/login')
      }
    }

    handleGoogleAuth()
  }, [router, setUser])
}
