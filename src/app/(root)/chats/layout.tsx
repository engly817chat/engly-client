'use client'

import { SidebarProvider } from '@/shared/ui/common/sidebar'
import { AppSidebar } from '@/shared/ui'
import { AccessGuard } from '@/entities/auth'

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
            '--sidebar-width': '350px',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        {children}
      </SidebarProvider>
    </AccessGuard>
  )
}
