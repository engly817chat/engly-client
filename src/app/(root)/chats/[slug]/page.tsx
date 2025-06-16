'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function ChatCategoryPage() {
  const params = useParams()
  const { t } = useTranslation()
  const slug = params?.slug

  const formattedSlug =
    typeof slug === 'string'
      ? slug
          .replace(/_+/g, ' ')
          .trim()
          .replace(/\b\w/g, char => char.toUpperCase())
      : ''

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='flex max-w-2xl flex-col gap-3 text-center text-foreground md:gap-5'>
        <h1 className='text-2xl font-semibold md:text-4xl'>
          {t('chatCategoryPage.title', { category: formattedSlug })}
        </h1>
        <p className='text-base text-foreground md:text-xl'>
          {t('chatCategoryPage.description')}
        </p>
      </div>
    </div>
  )
}
