import { AppSidebar } from '@/shared/ui/app-sidebar'
import { SidebarProvider } from '@/shared/ui/common/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
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
