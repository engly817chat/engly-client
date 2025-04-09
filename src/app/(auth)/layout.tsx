'use client'

import { useRouter } from 'next/navigation'
import { XIcon } from 'lucide-react'
import { AuthSlider } from '@/features/auth'
import { Button } from '@/shared/ui/common/button'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  const closeForm = () => {
    router.push('/')
  }

  return (
    <main className='flex h-screen items-center justify-center bg-slate-800'>
      <div className='flex h-full w-full bg-slate-400 xl:h-[752px] xl:w-[1030px] xl:overflow-hidden xl:rounded-2xl'>
        <AuthSlider />
        <div className='relative flex-1'>
          <Button
            variant='ghost'
            onClick={closeForm}
            className='absolute right-2 top-5 z-10 p-2 text-foreground hover:bg-black/10'
          >
            <XIcon className='h-4 w-4' />
          </Button>
          {children}
        </div>
      </div>
    </main>
  )
}
