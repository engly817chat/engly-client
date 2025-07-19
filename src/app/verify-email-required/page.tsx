'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { authApi, useAuth } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'

const COOLDOWN_SECONDS = 60
const STORAGE_KEY = 'resendCooldownUntil'

export default function VerifyEmailRequiredPage() {
  const { t } = useTranslation()
  const { isLoading, isEmailVerified, user } = useAuth()
  const [isCooldown, setIsCooldown] = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isEmailVerified) {
      router.replace('/')
    }
  }, [isLoading, isEmailVerified, router])

  const startCooldown = (seconds: number) => {
    setIsCooldown(true)
    setCooldownSeconds(seconds)

    const until = Date.now() + seconds * 1000
    localStorage.setItem(STORAGE_KEY, until.toString())

    const interval = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsCooldown(false)
          localStorage.removeItem(STORAGE_KEY)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    try {
      await authApi.sendVerificationEmail()
      toast.success(t('emailConfirmation.resentSuccess'))
      startCooldown(COOLDOWN_SECONDS)
    } catch {
      toast.error(t('errors.unknownError'))
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const until = parseInt(saved, 10)
      const now = Date.now()
      const diff = Math.ceil((until - now) / 1000)

      if (diff > 0) {
        startCooldown(diff)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

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

          <p className='mb-6 text-muted'>{t('emailConfirmation.instructions')}</p>

          <Button
            type='button'
            onClick={handleResend}
            disabled={isCooldown}
            className='rounded-lg px-6 py-2'
          >
            {t('emailConfirmation.resend')}
          </Button>
          {isCooldown && (
            <p className='mt-4 text-sm font-medium text-gray-400'>
              {t('emailConfirmation.cooldownMessage', { seconds: cooldownSeconds })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
