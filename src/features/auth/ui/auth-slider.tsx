'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/shared/ui/common/carousel'
import { appRoutes } from '@/shared/config'
import { cn } from '@/shared/utils'
import { authSlidePosters } from '../model'

export const AuthSlider = () => {
  const path = usePathname()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className='relative hidden md:block md:h-full md:w-[486px] xl:w-[491px]'>
      <Carousel setApi={setApi} className=''>
        <CarouselContent className='h-full'>
          {authSlidePosters.map(({ id, src, alt }) => (
            <CarouselItem key={id} className='relative h-screen xl:h-[788px]'>
              <Image
                src={src}
                alt={alt}
                fill
                priority
                sizes='(max-width: 768px) 100vw, (max-width: 1280px) 486px, 491px'
                className='object-cover'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className='absolute bottom-16 left-0 right-0 space-y-5 px-2 text-center text-[32px]/[39.01px] font-medium text-secondary xl:bottom-8'>
        {path === appRoutes.register ? (
          <h2>Capturing Moments, Creating Memories</h2>
        ) : (
          <h2>Connect with a community through Engly</h2>
        )}

        <div className='flex justify-center gap-2'>
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-[5px] w-8 rounded-2xl bg-secondary/50 transition-all duration-300',
                current - 1 === index && 'w-10 bg-secondary',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
