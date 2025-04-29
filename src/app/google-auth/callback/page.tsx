'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { authApi } from '@/entities/auth'
import { saveTokenStorage } from '@/shared/utils'

export default function GoogleCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const accessToken = urlParams.get('access_token')

      if (accessToken) {
        saveTokenStorage(accessToken)
        authApi
          .isFirstLogin()
          .then(isFirstLogin => {
            if (isFirstLogin) {
              router.push('/google-auth/additional-info')
            } else {
              router.push('/chats')
            }
          })
          .catch(error => {
            console.error('Error checking first login:', error)
            router.push('/login')
          })
      } else {
        router.push('/login')
      }
    }
  }, [router])

  return (
    <div className='flex h-screen items-center justify-center'>
      <Loader2 className='h-10 w-10 animate-spin text-primary' />
    </div>
  )
}
