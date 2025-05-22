'use client'

import { useTranslation } from 'react-i18next'
import { SetNewPasswordForm } from '@/features/auth'
import { useQueryParams } from '@/shared/hooks/useQueryParams'

export default function PasswordResetPage() {
  const { t } = useTranslation()
  const params = useQueryParams()
  const token = params?.get('token') ?? null

  return (
    <div className='flex h-full items-center justify-center bg-background'>
      <div className='w-full max-w-md p-6'>
        <h1 className='mb-6 text-center text-3xl font-semibold text-foreground'>
          {t('auth.reset.title')}
        </h1>
        <p className='mb-6 text-center text-sm text-muted'>
          {t('auth.reset.newPasswordSubtitle')}
        </p>
        <SetNewPasswordForm token={token} />
      </div>
    </div>
  )
}
