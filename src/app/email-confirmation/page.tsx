'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/entities/auth'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { useConfirmEmail } from '@/features/auth'

export default function EmailConfirmationPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useQueryParams()
  const token = params?.get('token')
  const { isAuthenticated } = useAuth()

  const { mutate, isPending, isSuccess, isError } = useConfirmEmail()

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
