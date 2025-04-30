'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { authApi } from '@/entities/auth'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { saveTokenStorage } from '@/shared/utils'

export default function GoogleCallbackPage() {
  const params = useQueryParams()
  const accessToken = params?.get('access_token')
  const router = useRouter()

  useEffect(() => {
    if (!params) return

    if (accessToken) {
      saveTokenStorage(accessToken)
      authApi
        .isFirstLogin()
        .then(response => {
          if (!response.userExists) {
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
  }, [params, accessToken, router])

  return (
    <div className='flex h-screen items-center justify-center'>
      <Loader2 className='h-10 w-10 animate-spin text-primary' />
    </div>
  )
}
