'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { CategoryList } from '@/features/category'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/common/select'
import { GlobeIcon } from '@/shared/ui/icons'
import { appRoutes } from '@/shared/config'
import { useAuth } from '../providers/auth-context'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language || 'en'

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <>
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
              <Select defaultValue={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className='flex h-auto items-center gap-1 rounded-[10px] border-white text-[16px] leading-none shadow-none sm:gap-2 sm:border-border md:px-3.5 md:py-4 xl:px-4 xl:text-[20px]'>
                  <GlobeIcon />
                  <SelectValue placeholder='English' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='en'>
                    <span className='md:hidden'>En</span>
                    <span className='hidden md:inline'>{t('english')}</span>
                  </SelectItem>
                  <SelectItem value='uk'>
                    <span className='md:hidden'>Uk</span>
                    <span className='hidden md:inline'>{t('ukrainian')}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {!isAuthenticated && (
                <Link href={appRoutes.register} className='btn-link'>
                  {t('signUp')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>{' '}
      <div className='container space-y-8 py-14 md:space-y-7 xl:py-16'>
        <div className='space-y-4 text-center'>
          <h1 className='text-2xl/9 font-bold md:text-3xl/none'>{t('welcome')}</h1>
          <p className='text-xl/none text-muted-foreground'>{t('home.description')}</p>
        </div>

        <CategoryList />
      </div>
    </>
  )
}
