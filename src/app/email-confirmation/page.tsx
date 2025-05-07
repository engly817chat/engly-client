'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { authApi, useAuth } from '@/entities/auth'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { saveTokenStorage } from '@/shared/utils'

export default function EmailConfirmationPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useQueryParams()
  const email = params?.get('email')
  const token = params?.get('token')
  const { setUser } = useAuth()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const confirmEmail = async () => {
      if (!email || !token) return

      try {
        const res = await authApi.confirmEmail(email, token)
        if (res.access_token) {
          saveTokenStorage(res.access_token)
          const userData = await authApi.getProfile()
          setUser(userData)
        }
        setStatus('success')
        setTimeout(() => router.push('/chats'), 3000)
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    }

    confirmEmail()
  }, [email, token, router])

  if (!params) {
    return <p>{t('emailConfirmation.loading')}</p>
  }

  return (
    <div className='flex h-screen items-center justify-center px-4 text-center'>
      {status === 'loading' && <p>{t('emailConfirmation.loading')}</p>}
      {status === 'success' && (
        <div>
          <p className='font-semibold text-green-600'>
            {t('emailConfirmation.successTitle')}
          </p>
          <p>{t('emailConfirmation.successMessage')}</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <p className='font-semibold text-red-600'>
            {t('emailConfirmation.errorTitle')}
          </p>
          <p>{t('emailConfirmation.errorMessage')}</p>
        </div>
      )}
    </div>
  )
}
