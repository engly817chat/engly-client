'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/common/button'
import { GoogleIcon } from '@/shared/ui/icons'
import { appRoutes } from '@/shared/config'

export const Providers = () => {
  const { t } = useTranslation()
  const path = usePathname()

  return (
    <div className=''>
      <div className='flex items-center gap-4 py-3 md:py-5'>
        <div className='h-px flex-1 bg-black/15' />
        <span className='text-base/none text-black/30'>{t('auth.or')}</span>
        <div className='h-px flex-1 bg-black/15' />
      </div>

      <div className='space-y-4 xl:space-y-5'>
        <Button variant='secondary' className='w-full'>
          <GoogleIcon />
          {path === appRoutes.register
            ? t('auth.signUpWithGoogle')
            : t('auth.loginWithGoogle')}
        </Button>
        <p className='flex items-baseline justify-center gap-1 text-sm/none text-foreground/30 md:text-base/none'>
          {path === appRoutes.register
            ? t('auth.alreadyHaveAccount')
            : t('auth.dontHaveAccount')}
          <Link
            href={path === appRoutes.register ? appRoutes.login : appRoutes.register}
            className='text-foreground underline'
          >
            {path === appRoutes.register ? t('auth.log_in') : t('auth.signUp')}
          </Link>
        </p>
      </div>
    </div>
  )
}
