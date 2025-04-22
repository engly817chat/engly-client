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
    <main className='flex items-center justify-center bg-slate-800 min-h-screen'>
      <div className='flex w-full max-w-[1030px] bg-slate-400 h-[800px] rounded-2xl overflow-hidden shadow-xl'>
        <AuthSlider />
        <div className='relative flex-1'>
          <Button
            variant='ghost'
            onClick={closeForm}
            className='absolute right-2 top-2 z-10 p-2 text-foreground hover:bg-black/10'
          >
            <XIcon style={{ width: '20px', height: '20px' }}/>
          </Button>
          {children}
        </div>
      </div>
    </main>
  )
}
