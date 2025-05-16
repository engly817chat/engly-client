'use client'

import { useRouter } from 'next/navigation'
import { XIcon } from 'lucide-react'
import { AuthSlider } from '@/features/auth'
import { AccessGuard, authApi, useAuth } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const { setUser } = useAuth()

  const closeForm = async () => {
    try {
      const userData = await authApi.getProfile()
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user profile on close:', error)
    }
    router.push('/')
  }

  return (
    <AccessGuard requireAuth={false}>
      <main className='flex min-h-screen items-center justify-center bg-slate-800'>
        <div className='flex h-[800px] w-full max-w-[1030px] overflow-hidden rounded-2xl bg-slate-400 shadow-xl'>
          <AuthSlider />
          <div className='relative flex-1'>
            <Button
              variant='link'
              onClick={closeForm}
              className='absolute right-2 top-2 z-10 p-2 text-foreground hover:bg-muted/10 md:right-4 md:top-2'
            >
              <XIcon style={{ width: '20px', height: '20px' }} />
            </Button>
            {children}
          </div>
        </div>
      </main>
    </AccessGuard>
  )
}
