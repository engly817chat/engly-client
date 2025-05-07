'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuth } from '@/entities/auth'
import { Skeleton } from '@/shared/ui/common/skeleton'
import { categoryApi, PaginatedCategoriesResponse } from '../model'

export const CategoryList = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleCategoryClick = (name: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/chats/${formatKey(name)}`)
    } else {
      router.push(`/chats/${formatKey(name)}`)
    }
  }

  const { data, error, isError, isLoading } = useQuery<
    PaginatedCategoriesResponse,
    AxiosError
  >({
    queryKey: ['categories', { page: 0, size: 8, sort: 'id,desc' }],
    queryFn: () => categoryApi.getAllCategories({ page: 0, size: 8, sort: 'id,desc' }),
  })

  if (isError) {
    toast.error(error?.message)
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6'>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className='h-[102px] md:h-[178px]' />
        ))}
      </div>
    )
  }

  const formatKey = (name: string) => name.toLowerCase().replace(/\s+/g, '_')

  return (
    <div className='grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6'>
      {data?._embedded?.categoriesDtoList?.map(cat => {
        const isTopPick = cat.activeRoomsCount > 15
        const key = formatKey(cat.name)

        return (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className='h-[102px] rounded-[10px] border border-border bg-white p-3 hover:border-primary md:h-[178px] md:space-y-5 md:p-5 cursor-pointer'
          >
            <div className='hidden items-center justify-between md:flex'>
              <Image
                src={`/icons/${cat.icon}`}
                alt={cat.name}
                height={24}
                width={24}
                className='w-auto'
              />

              {isTopPick ? (
                <span className='flex items-center justify-center rounded-[10px] bg-primary px-4 py-1.5 text-sm/none text-primary-foreground'>
                  {t('topPick')}
                </span>
              ) : (
                <span className='flex w-24 items-center justify-center rounded-[10px] bg-[#F6FEFF] py-1.5 text-sm/none'>
                  {t('chatsCount', { count: cat.activeRoomsCount })}
                </span>
              )}
            </div>

            <div className='space-y-2 md:space-y-3'>
              <h2 className='flex items-center justify-between text-base/5 font-semibold md:text-xl/none'>
                {t(`categories.${key}`)}

                <Image
                  src={`/icons/${cat.icon}`}
                  width={24}
                  height={24}
                  alt={cat.name}
                  className='w-auto md:hidden'
                />
              </h2>
              <p className='line-clamp-2 h-[34px] text-sm/4 md:text-base/none'>
                {t(`categories.descriptions.${key}`)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
