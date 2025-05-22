'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PasswordResetRequestForm } from '@/features/auth'


export default function PasswordResetRequestPage() {
  const { t } = useTranslation()

  return (
    <div className='flex h-full items-center justify-center bg-background'>
      <div className='w-full max-w-md p-6'>
        <h1 className='mb-6 text-center text-3xl font-semibold text-foreground'>
          {t('auth.reset.title')}
        </h1>
        <p className='mb-6 text-center text-muted'>{t('auth.reset.subtitle')}</p>

          <PasswordResetRequestForm />

        <p className='mt-6 text-center text-sm/none text-foreground/40 md:text-base/none'>
          <Link href='/login' className='inline-flex items-center justify-center gap-1'>
            <ArrowLeft className='h-4 w-4' />
            <span>{t('auth.reset.back')}</span>
          </Link>
        </p>
      </div>
    </div>
  )
}
