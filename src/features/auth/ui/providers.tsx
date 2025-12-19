'use client'

import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/common/button'
import { GoogleIcon } from '@/shared/ui/icons'
import { appRoutes } from '@/shared/config'
import { AppConfig } from '@/shared/constants'

export const Providers = () => {
  const { t } = useTranslation()
  const path = usePathname()
  const isLogin = path === appRoutes.login

  const googleButton = (
    <Button
      variant='secondary'
      className='w-full'
      onClick={() => {
        window.location.href =
        AppConfig.apiUrl + '/oauth2/authorization/google'
      }}
    >
      <GoogleIcon />
      {isLogin ? t('auth.loginWithGoogle') : t('auth.signUpWithGoogle')}
    </Button>
  )

  const orDivider = (
    <div className='flex items-center gap-4 py-3 md:py-5'>
      <div className='h-px flex-1 bg-black/15' />
      <span className='text-base/none text-black/30'>{t('auth.or')}</span>
      <div className='h-px flex-1 bg-black/15' />
    </div>
  )

  return (
    <div className=''>
      {isLogin ? (
        <>
          {googleButton}
          {orDivider}
        </>
      ) : (
        <>
          {orDivider}
          {googleButton}
        </>
      )}
    </div>
  )
}
