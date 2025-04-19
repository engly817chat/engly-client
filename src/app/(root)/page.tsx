'use client'

import { CategoryList } from '@/features/category'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const {t} = useTranslation()

  return (
    <div className='space-y-8 py-14 md:space-y-7 xl:py-16'>
      <div className='space-y-4 text-center'>
        <h1 className='text-2xl/9 font-bold md:text-3xl/none'>{t('welcome')}</h1>
        <p className='text-xl/none text-muted-foreground'>
          {t('home.description')}
        </p>
      </div>

      <CategoryList />
    </div>
  )
}
