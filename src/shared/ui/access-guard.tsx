'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/entities/auth'
import { Loader2 } from 'lucide-react'

interface AccessGuardProps {
  requireAuth: boolean
  requireVerifiedEmail?: boolean
  redirectTo?: string
  children: React.ReactNode
}

export const AccessGuard = ({
  requireAuth,
  requireVerifiedEmail = false,
  redirectTo = '/',
  children,
}: AccessGuardProps) => {
  const { isAuthenticated, isEmailVerified, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !isAuthenticated) {
      router.replace('/login')
      return
    }

    if (!requireAuth && isAuthenticated) {
      router.replace(redirectTo)
      return
    }

    if (requireAuth && requireVerifiedEmail && !isEmailVerified) {
      router.replace('/verify-email')
      return
    }
  }, [requireAuth, requireVerifiedEmail, isAuthenticated, isEmailVerified, isLoading, router, redirectTo])

  const shouldBlockContent =
    isLoading ||
    (requireAuth && !isAuthenticated) ||
    (!requireAuth && isAuthenticated) ||
    (requireAuth && requireVerifiedEmail && !isEmailVerified)

  if (shouldBlockContent) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
      </div>
    )
  }

  return <>{children}</>
}
