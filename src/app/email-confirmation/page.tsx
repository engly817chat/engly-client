'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/entities/auth'
import { getAccessToken, saveTokenStorage } from '@/shared/utils'

export default function EmailConfirmationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  const router = useRouter()
  const accessToken = getAccessToken()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const confirmEmail = async () => {
      if (!email || !token || !accessToken) {
        setStatus('error')
        return
      }

      try {
        const res = await authApi.confirmEmail(email, token, accessToken)

        if (res.access_token) {
          saveTokenStorage(res.access_token)
        }
        setStatus('success')

        setTimeout(() => {
          router.push('/chats')
        }, 3000)
      } catch (error) {
        console.log(error)
        setStatus('error')
      }
    }
    confirmEmail()
  }, [email, token, accessToken])

  return (
    <div className='flex h-screen items-center justify-center px-4 text-center'>
      {status === 'loading' && <p>Підтвердження email...</p>}
      {status === 'success' && (
        <div>
          <p className='font-semibold text-green-600'>Email успішно підтверджено ✅</p>
          <p>Зараз ви будете перенаправлені в чат...</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <p className='font-semibold text-red-600'>Щось пішло не так</p>
          <p>Перевірте посилання або спробуйте ще раз.</p>
        </div>
      )}
    </div>
  )
}
