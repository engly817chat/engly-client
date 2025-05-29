'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MoreVertical, Search } from 'lucide-react'
import { Chat, chatsApi } from '@/entities/chats'
import { Button } from '@/shared/ui/common/button'

export default function ChatPage() {
  const params = useParams()
  const chatId = params?.id as string
  const categorySlug = params?.slug as string

  const [chat, setChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chats = await chatsApi.getChatsByCategory(categorySlug.toUpperCase())
        const matched = chats._embedded?.roomsDtoList.find((c: Chat) => c.id === chatId)
        setChat(matched || null)
      } catch (error) {
        console.error('Error fetching chat:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (categorySlug && chatId) {
      fetchChat()
    }
  }, [categorySlug, chatId])

  return (
    <div className='flex h-full w-full flex-col'>
      <header className='sticky top-0 z-10 flex items-center justify-between border-b bg-primary-foreground px-6 py-4 shadow-sm'>
        <div className='ml-4 flex flex-col gap-y-1'>
          <div className='text-sm font-medium md:text-xl text-foreground'>
            {isLoading ? (
              <div className='h-5 w-40 animate-pulse rounded bg-gray-200'></div>
            ) : (
              chat?.name || 'Чат не знайдено'
            )}
          </div>
          <div className='text-xs text-muted'>
            {isLoading ? (
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200'></div>
            ) : (
              `${chat?.chatParticipants.length} members`
            )}
          </div>
        </div>

        <div className='flex items-center gap-2 md:gap-8'>
          <Button className='md:py:3 rounded-lg px-4 py-2 text-base font-semibold md:px-6'>
            <span className='md768:hidden'>+</span>
            <span className='hidden md768:inline'>+ New chat</span>
          </Button>
          <div className='flex items-center gap-1 md:gap-2'>
            <button className='p-1 text-foreground'>
              <Search size={20} />
            </button>
            <button className='p-1 text-foreground'>
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className='p-6'></div>
    </div>
  )
}
