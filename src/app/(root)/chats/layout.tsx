'use client'

import { Menu } from 'lucide-react'
import { AccessGuard } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'
import { SidebarProvider, useSidebar } from '@/shared/ui/common/sidebar'
import { AppSidebar } from '@/shared/ui'

function SidebarToggleButton() {
  const { setOpenMobile } = useSidebar()
  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setOpenMobile(true)}
      className='md768:hidden absolute left-4 top-4 z-50'
    >
      <Menu className='h-6 w-6' />
    </Button>
  )
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AccessGuard requireAuth>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '489px',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarToggleButton />
        <div
          className='flex min-h-screen flex-1 items-center justify-center bg-cover bg-center bg-no-repeat px-4'
          style={{ backgroundImage: "url('/images/bg-chat.jpg')" }}
        >
          {children}
        </div>
      </SidebarProvider>
    </AccessGuard>
  )
}
