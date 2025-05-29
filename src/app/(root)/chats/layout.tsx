'use client'

import { ChevronLeft } from 'lucide-react'
import { AccessGuard } from '@/entities/auth'
import { SidebarProvider, useSidebar } from '@/shared/ui/common/sidebar'
import { ChatSidebar } from '@/features/chats'

function SidebarToggleButton() {
  const { setOpenMobile } = useSidebar()
  return (
    <button
      onClick={() => setOpenMobile(true)}
      className='absolute left-1 top-7 z-50 md768:hidden'
    >
      <ChevronLeft size={26} strokeWidth={1.5} />
    </button>
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
        <ChatSidebar />
        <SidebarToggleButton />
        <div
        className='flex flex-1 min-h-screen w-full bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: "url('/images/bg-chat.jpg')" }}
        >
          {children}
        </div>
      </SidebarProvider>
    </AccessGuard>
  )
}
