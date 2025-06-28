'use client'

import { useState } from 'react'
import { ChatSidebar, CreateChatModal } from '@/features/chats'
import { AccessGuard } from '@/entities/auth'
import { SidebarProvider, SidebarTrigger } from '@/shared/ui/common/sidebar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [slugValue, setSlugValue] = useState('')
  return (
    // <AccessGuard requireAuth>
    <SidebarProvider>
      <ChatSidebar
        onOpenModal={(slug: string) => {
          setSlugValue(slug)
          setIsModalOpen(true)
        }}
      />
      <SidebarTrigger />
      <div
        className='flex min-h-screen w-full flex-1 bg-cover bg-fixed bg-center bg-no-repeat'
        style={{ backgroundImage: "url('/images/bg-chat.jpg')" }}
      >
        {children}
      </div>
      {isModalOpen && (
        <CreateChatModal categorySlug={slugValue} onClose={() => setIsModalOpen(false)} />
      )}
    </SidebarProvider>
    // </AccessGuard>
  )
}
