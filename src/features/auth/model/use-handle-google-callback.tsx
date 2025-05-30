'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, useAuth } from '@/entities/auth'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { saveTokenStorage } from '@/shared/utils'

export function useHandleGoogleCallback() {
  const params = useQueryParams()
  const accessToken = params?.get('access_token')
  const router = useRouter()
  const { setUser } = useAuth()

  useEffect(() => {
    if (!params) return

    if (accessToken) {
      saveTokenStorage(accessToken)

      authApi
        .getProfile()
        .then(user => {
          setUser(user)
          return authApi.isFirstLogin()
        })
        .then(response => {
          if (!response.userExists) {
            router.push('/google-auth/additional-info')
          } else {
            router.push('/')
          }
        })
        .catch(error => {
          console.error('Error during Google callback flow:', error)
          router.push('/login')
        })
    } else {
      router.push('/login')
    }
  }, [params, accessToken, router, setUser])
}
