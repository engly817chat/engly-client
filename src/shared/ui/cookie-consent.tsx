'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useCookieConsent } from '@/shared/hooks/useCookieConsent'

export function CookieConsent() {
  const { t } = useTranslation()
  const { consent, acceptCookies, loading } = useCookieConsent()

  if (consent || loading) return null

  return (
    <div className='fixed bottom-4 left-1/2 z-50 h-auto w-[90%] min-w-[320px] max-w-[1100px] -translate-x-1/2 rounded-[10px] border border-border bg-card px-[12px] py-[20px] shadow-lg sm:px-[24px] sm:py-[30px] md:px-[36px] md:py-[32px]'>
      <h2 className='mb-2 text-base font-semibold text-foreground sm:mb-3 sm:text-xl'>
        {t('cookies.title')}
      </h2>

      <p className='mb-2 max-w-[900px] text-sm sm:mb-3 sm:text-lg'>
        {t('cookies.description')}
      </p>
      <p className='mb-4 max-w-[900px] text-sm sm:mb-6 sm:text-lg'>
        {t('cookies.moreInfo')}{' '}
        <Link href='/cookie-policy' className='underline'>
          {t('cookies.policyLink')}
        </Link>
        .
      </p>

      <div className='flex flex-col gap-3 md:flex-row'>
        <button
          onClick={acceptCookies}
          className='rounded-[10px] bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark sm:px-8 sm:py-3 sm:text-lg'
        >
          {t('cookies.accept')}
        </button>
      </div>
    </div>
  )
}
