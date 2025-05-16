'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { authApi, useAuth } from '@/entities/auth'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { saveTokenStorage } from '@/shared/utils'

export default function EmailConfirmationPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useQueryParams()
  const token = params?.get('token')
  const { isAuthenticated, setUser } = useAuth()

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async (token: string) => {
      const res = await authApi.confirmEmail(token)
      if (res.access_token) {
        saveTokenStorage(res.access_token)
        const userData = await authApi.getProfile()
        setUser(userData)
      }
      return res
    },
    onSuccess: () => {
      setTimeout(() => router.push('/'), 3000)
    },
    onError: error => {
      console.error('Email confirmation failed:', error)
    },
  })

  useEffect(() => {
    if (token) mutate(token)
  }, [token])

  if (isAuthenticated && !isPending && !isSuccess) {
    router.replace('/')
    return null
  }

  return (
    <div className='flex h-screen items-center justify-center px-4 text-center'>
      {isPending && <p className='font-semibold text-muted'>{t('emailConfirmation.loading')}</p>}

      {isSuccess && (
        <p className='font-semibold text-success'>
          {t('emailConfirmation.successTitle')}
        </p>
      )}

      {isError && (
        <div>
          <p className='font-semibold text-destructive'>
            {t('emailConfirmation.errorTitle')}
          </p>
          <p>{t('emailConfirmation.errorMessage')}</p>
        </div>
      )}
    </div>
  )
}
