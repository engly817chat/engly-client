import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/common/select'
import { GlobeIcon } from '@/shared/ui/icons'
import { appRoutes } from '@/shared/config'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-b-border bg-white'>
        <div className='container'>
          <div className='flex items-center justify-between py-2 md:py-3'>
            <Link
              href={appRoutes.home}
              className='text-2xl/9 font-bold md:text-[32px]/9 xl:text-4xl/none'
            >
              Engly
            </Link>

            <div className='flex items-center gap-2 md:gap-3'>
              <Select defaultValue='en'>
                <SelectTrigger className='flex h-auto items-center gap-1 rounded-[10px]  text-[16px] leading-none shadow-none sm:gap-2 border-white sm:border-border  md:px-3.5 md:py-4 xl:px-4 xl:text-[20px]'>
                  <GlobeIcon />
                  <SelectValue placeholder='English' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='en'>
                    <span className='sm:hidden'>En</span>
                    <span className='hidden sm:inline'>English</span>
                  </SelectItem>
                  <SelectItem value='uk'>
                    <span className='sm:hidden'>Uk</span>
                    <span className='hidden sm:inline'>Ukrainian</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Link href={appRoutes.register} className='btn-link'>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className='container'>{children}</main>
    </div>
  )
}
