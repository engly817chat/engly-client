'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { authApi, useAuth } from '@/entities/auth'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { saveTokenStorage } from '@/shared/utils'

export default function EmailConfirmationPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useQueryParams()
  const token = params?.get('token')
  const { setUser } = useAuth()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        return
      }

      try {
        const res = await authApi.confirmEmail(token)
        if (res.access_token) {
          saveTokenStorage(res.access_token)
          const userData = await authApi.getProfile()
          setUser(userData)
        }
        setStatus('success')
        setTimeout(() => router.push('/'), 3000)
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    }

    confirmEmail()
  }, [token, router])

  if (!params) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='flex h-screen items-center justify-center px-4 text-center'>
      {status === 'loading' && <p>{t('emailConfirmation.loading')}</p>}
      {status === 'success' && (
        <div>
          <p className='font-semibold text-green-600'>
            {t('emailConfirmation.successTitle')}
          </p>
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
