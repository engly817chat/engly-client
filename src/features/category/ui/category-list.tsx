'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { Skeleton } from '@/shared/ui/common/skeleton'
import { Category, categoryApi } from '../model'

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const controller = new AbortController()

    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await categoryApi.getAllCategories({ signal: controller.signal })
        setCategories(data.categories)
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.message)
        } else if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('An unexpected error occurred')
        }
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()

    return () => controller.abort()
  }, [])

  return (
    <div className='grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6'>
      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className='h-[178] w-[306]' />
          ))
        : categories.map(cat => {
            const isTopPick = cat.activeRoomsCount > 20

            return (
              <Link
                href={cat.name.toLowerCase()}
                key={cat.id}
                className='h-[102px] rounded-[10px] border border-border bg-white p-3 hover:border-primary md:h-[178px] md:space-y-5 md:p-5'
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
                      Top Pick
                    </span>
                  ) : (
                    <span className='flex w-24 items-center justify-center rounded-[10px] bg-[#F6FEFF] py-1.5 text-sm/none'>
                      {cat.activeRoomsCount} chats
                    </span>
                  )}
                </div>

                <div className='space-y-2 md:space-y-3'>
                  <h2 className='flex items-center justify-between text-base/5 font-semibold md:text-xl/none'>
                    {cat.name}

                    <Image
                      src={`/icons/${cat.icon}`}
                      width={24}
                      height={24}
                      alt={cat.name}
                      className='w-auto md:hidden'
                    />
                  </h2>
                  <p className='line-clamp-2 h-[34px] text-sm/4 md:text-base/none'>
                    {cat.description}
                  </p>
                </div>
              </Link>
            )
          })}
    </div>
  )
}
