'use client'

import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MoreVertical, Paperclip, Search, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CreateChatModal, MessagesList, useChatSocket } from '@/features/chats'
import { useAuth } from '@/entities/auth'
import { Chat, chatsApi, Message } from '@/entities/chats'
import { Button } from '@/shared/ui/common/button'

export default function ChatPage() {
  const params = useParams()
  const { t } = useTranslation()
  const chatId = params?.id as string
  const categorySlug = params?.slug as string
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { user } = useAuth()
  const userId = user?.id

  const queryClient = useQueryClient()

  const [input, setInput] = useState('')

  const handleNewMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData<Message[]>(['messages', chatId], prev => [
        ...(prev || []),
        message,
      ])
    },
    [chatId, queryClient],
  )

  const { sendMessage } = useChatSocket(chatId, handleNewMessage)

  const handleSend = () => {
    if (input.trim()) {
      const newMsg = {
        roomId: chatId,
        content: input,
      }
      sendMessage(newMsg)
      setInput('')
    }
  }

  const {
    data: messages = [],
  } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      const data = await chatsApi.getMessages(chatId)
      return data._embedded?.messagesDtoList || []
    },
    enabled: !!chatId,
  })

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats', categorySlug.toUpperCase()],
    queryFn: () => chatsApi.getChatsByCategory(categorySlug.toUpperCase()),
    enabled: !!categorySlug,
  })

  const chat = useMemo(() => {
    return chats?._embedded?.roomsDtoList.find((c: Chat) => c.id === chatId) || null
  }, [chats, chatId])

  return (
    <div className='flex h-full w-full flex-col'>
      <header className='sticky top-0 z-10 flex items-center justify-between border-b bg-primary-foreground px-6 py-4 shadow-sm'>
        <div className='ml-4 flex flex-col gap-y-1'>
          <div className='text-sm font-medium text-foreground md:text-xl'>
            {isLoading ? (
              <div className='h-6 w-40 animate-pulse rounded bg-gray-200'></div>
            ) : (
              chat?.name || t('chatPage.chatNotFound')
            )}
          </div>
          <div className='text-xs text-muted'>
            {isLoading ? (
              <div className='h-5 w-16 animate-pulse rounded bg-gray-200'></div>
            ) : (
              t('chatPage.members', { count: chat?.chatParticipants.length })
            )}
          </div>
        </div>

        <div className='flex items-center gap-2 md:gap-8'>
          <Button
            className='md:py:3 rounded-lg px-4 py-2 text-base font-semibold md:px-6'
            onClick={() => setIsModalOpen(true)}
          >
            <span className='md768:hidden'>+</span>
            <span className='hidden md768:inline'>{t('chatPage.newChatFull')}</span>
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

      <MessagesList messages={messages} currentUserId={userId} />

      <div className='flex px-4 pb-8 md768:px-6 md:px-12'>
        <div className='relative flex-1'>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className='w-full rounded-[20px] bg-white px-5 py-4 pr-32 placeholder:text-sm placeholder:text-[#0000004D] focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder={t('chatPage.inputPlaceholder')}
          />

          <div className='absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2'>
            <button type='button' className='text-gray-500'>
              <Paperclip size={20} strokeWidth={1.5} />
            </button>

            <Button
              onClick={handleSend}
              className='flex items-center gap-2 rounded-[20px] px-3 py-1 md768:px-5 md768:py-2'
            >
              {t('chatPage.send')}
              <Send size={16} strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CreateChatModal
          onClose={() => setIsModalOpen(false)}
          categorySlug={categorySlug}
        />
      )}
    </div>
  )
}
