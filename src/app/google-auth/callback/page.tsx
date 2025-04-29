'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { authApi } from '@/entities/auth'
import { saveTokenStorage } from '@/shared/utils'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get('access_token')

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
  }, [router, searchParams])

  return (
    <div className='flex h-screen items-center justify-center'>
      <Loader2 className='h-10 w-10 animate-spin text-primary' />
    </div>
  )
}
