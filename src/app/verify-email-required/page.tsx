'use client'

import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { authApi } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'

export default function VerifyEmailRequiredPage() {
  const { t } = useTranslation()

  const handleResend = async () => {
    try {
      await authApi.sendVerificationEmail()
      toast.success(t('A new verification link has been sent to your email.'))
    } catch {
      toast.error(t('errors.unknownError'))
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <div className='w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-lg'>
        <h1 className='mb-4 text-2xl font-bold text-foreground'>
          Please Verify Your Email Address
        </h1>
        <p className='mb-6 text-muted'>
          To continue, check your inbox and click on the verification link we&apos;ve sent you.
        </p>
        <p className='mb-6 text-sm text-muted'>
          Didn’t receive the email? Click the button below to resend it.
        </p>
        <Button type='button' onClick={handleResend} className='px-6 py-2 rounded-lg'>
          Resend Link
        </Button>
      </div>
    </div>
  )
}
