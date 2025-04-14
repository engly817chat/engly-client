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
    <div className='fixed bottom-4 left-1/2 z-50 h-auto w-[90%] min-w-[320px] max-w-[1100px] -translate-x-1/2 rounded-[10px] border border-border bg-card px-[12px] py-[20px] shadow-lg sm:px-[24px] sm:py-[30px] md:px-[36px] md:py-[32px]'>
      <button
        onClick={closeConsent}
        className='absolute right-5 top-5 text-sm hover:text-foreground md:text-lg'
        aria-label='Close'
      >
        ✕
      </button>

      <h2 className='mb-2 text-base font-semibold text-foreground sm:mb-3 sm:text-xl'>
        Accept the use of cookies.
      </h2>

      <p className='mb-2 text-sm sm:mb-3 sm:text-lg max-w-[900px]'>
        We use cookies to improve your browsing experience, serve personalized content,
        and analyze our traffic. By clicking Accept all Cookies, you agree to the storing
        of cookies on your device.
      </p>
      <p className='mb-4 text-sm sm:mb-6 sm:text-lg max-w-[900px]'>
        For more details,
        see our{' '}
        <Link href='/cookie-policy' className='underline'>
          Cookie Policy
        </Link>
        .
      </p>

      <div className='flex flex-col gap-3 md:flex-row'>
        <button
          onClick={acceptCookies}
          className='rounded-[10px] bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark sm:px-8 sm:py-3 sm:text-lg'
        >
          Accept all Cookies
        </button>
        <button
          onClick={declineCookies}
          className='rounded-[10px] border border-border bg-background px-6 py-2 text-sm font-semibold text-foreground hover:bg-gray-200 sm:px-8 sm:py-3 sm:text-lg'
        >
          Decline cookies
        </button>
      </div>
    </div>
  )
}
