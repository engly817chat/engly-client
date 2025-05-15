'use client'

import { AccessGuard } from '@/shared/ui/access-guard'
import { SidebarProvider } from '@/shared/ui/common/sidebar'
import { AppSidebar } from '@/shared/ui'

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
