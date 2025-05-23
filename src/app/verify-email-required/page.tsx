'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { authApi, useAuth } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'

export default function VerifyEmailRequiredPage() {
  const { t } = useTranslation()
  const { isLoading, isEmailVerified, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isEmailVerified) {
      router.replace('/')
    }
  }, [isLoading, isEmailVerified, router])

  const handleResend = async () => {
    try {
      await authApi.sendVerificationEmail()
      toast.success(t('emailConfirmation.resentSuccess'))
    } catch {
      toast.error(t('errors.unknownError'))
    }
  }

  if (isEmailVerified) return null

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      {isLoading ? (
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
      ) : (
        <div className='w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-lg'>
          <h1 className='mb-4 text-2xl font-bold text-foreground'>
             {t('emailConfirmation.title')}
          </h1>
          <p className='mb-6 text-muted'>
             {t('emailConfirmation.linkSentTo')}{' '}
            <span className='font-semibold'>{user?.email}</span>
          </p>

          <p className='mb-6 text-muted'>
            {t('emailConfirmation.instructions')}
          </p>

          <Button type='button' onClick={handleResend} className='rounded-lg px-6 py-2'>
             {t('emailConfirmation.resend')}
          </Button>
        </div>
      )}
    </div>
  )
}
