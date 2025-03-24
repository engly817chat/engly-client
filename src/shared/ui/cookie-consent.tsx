'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCookieConsent } from '@/shared/hooks/useCookieConsent'

export function CookieConsent() {
  const { consent, acceptCookies, loading, declineCookies } = useCookieConsent()
  const [isVisible, setIsVisible] = useState(true)

  const closeConsent = () => setIsVisible(false)

  if (consent || !isVisible || loading) return null

  return (
    <div className='fixed bottom-4 left-1/2 z-50 h-auto w-[90%] min-w-[320px] max-w-[1305px] -translate-x-1/2 rounded-[10px] border border-border bg-card px-[12px] py-[50px] shadow-lg sm:px-[40px] sm:py-[60px] md:px-[73px] md:py-[52px]'>
      <button
        onClick={closeConsent}
        className='absolute right-7 top-7 text-sm hover:text-foreground md:text-2xl'
        aria-label='Close'
      >
        ✕
      </button>

      <h2 className='mb-3 text-base font-semibold text-foreground sm:mb-4 sm:text-2xl'>
        Accept the use of cookies.
      </h2>

      <p className='mb-3 text-sm sm:mb-4 sm:text-xl max-w-[1060px]'>
        We use cookies to improve your browsing experience, serve personalized content,
        and analyze our traffic. By clicking Accept all Cookies, you agree to the storing
        of cookies on your device.
      </p>
      <p className='mb-6 text-sm sm:mb-8 sm:text-xl max-w-[1060px]'>
        You can customize your settings by clicking Manage Preferences. For more details,
        see our{' '}
        <Link href='/cookie-policy' className='underline'>
          Cookie Policy
        </Link>
        .
      </p>

      <div className='flex flex-col gap-4 md:flex-row'>
        <button
          onClick={acceptCookies}
          className='rounded-[10px] bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-dark sm:px-12 sm:py-3 sm:text-xl'
        >
          Accept all Cookies
        </button>
        <button
          onClick={declineCookies}
          className='rounded-[10px] border border-border bg-background px-8 py-3 text-sm font-semibold text-foreground hover:bg-gray-200 sm:px-12 sm:py-3 sm:text-xl'
        >
          Decline cookies
        </button>
      </div>
    </div>
  )
}
