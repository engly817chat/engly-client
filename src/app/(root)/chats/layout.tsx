import { SidebarProvider } from '@/shared/ui/common/sidebar'
import { AppSidebar } from '@/shared/ui'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
