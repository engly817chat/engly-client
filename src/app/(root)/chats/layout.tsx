'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/entities/auth'
import { SidebarProvider } from '@/shared/ui/common/sidebar'
import { AppSidebar } from '@/shared/ui'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) return null

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '350px',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      {children}
    </SidebarProvider>
  )
}
