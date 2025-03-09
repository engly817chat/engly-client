'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/shared/ui/common/button'
import { GoogleIcon } from '@/shared/ui/icons'
import { appRoutes } from '@/shared/config'

export const Providers = () => {
  const path = usePathname()

  return (
    <div className=''>
      <div className='flex items-center gap-4 py-3 md:py-5'>
        <div className='h-px flex-1 bg-black/15' />
        <span className='text-base/none text-black/30'>Or</span>
        <div className='h-px flex-1 bg-black/15' />
      </div>

      <div className='space-y-4 xl:space-y-5'>
        <Button variant='secondary' className='w-full'>
          <GoogleIcon />
          {path === appRoutes.register ? 'Sign up with Google' : 'Log in with Google'}
        </Button>
        <p className='flex items-baseline justify-center gap-1 text-sm/none text-foreground/30 md:text-base/none'>
          {path === appRoutes.register
            ? 'Already have an account?'
            : 'Don’t have an account?'}
          <Link href={appRoutes.login} className='text-foreground underline'>
            {path === appRoutes.register ? 'Log in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  )
}
