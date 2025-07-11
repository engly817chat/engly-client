'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import EmojiPicker from 'emoji-picker-react'
import { Loader2, MoreVertical, Paperclip, Search, Send, Smile } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MessagesList, useChatSocket, usePaginatedMessages } from '@/features/chats'
import { AccessGuard, useAuth } from '@/entities/auth'
import { Chat, chatsApi, Message } from '@/entities/chats'
import { Button } from '@/shared/ui/common/button'

export default function ChatPage() {
  const params = useParams()
  const { t } = useTranslation()
  const { user } = useAuth()
  const userId = user?.id
  const chatId = params?.id as string
  const categorySlug = params?.slug as string
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [input, setInput] = useState('')

  const queryClient = useQueryClient()

  const {
    messages,
    containerRef,
    scrollRef,
    onScroll,
    appendMessage,
    isInitialLoad,
    isLoadingMore,
  } = usePaginatedMessages(chatId)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    if (!isTyping) {
      setIsTyping(true)
      sendTyping(true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      sendTyping(false)
    }, 2000)
  }

  const handleTyping = useCallback(
    ({ username, isTyping }: { username: string; isTyping: boolean }) => {
      if (username === user?.username) {
        return
      }

      setTypingUsers(prev => {
        if (isTyping) {
          if (!prev.includes(username)) {
            return [...prev, username]
          }
          return prev
        } else {
          return prev.filter(u => u !== username)
        }
      })
    },
    [user?.username],
  )

  const handleNewMessage = useCallback(
    (message: Message) => {
      appendMessage(message)
    },
    [appendMessage],
  )

  useLayoutEffect(() => {
    if (!isInitialLoad && messages.length > 0 && containerRef.current) {
      const container = containerRef.current

      if (container.scrollHeight > container.clientHeight) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
          })
        })
      }
    }
  }, [isInitialLoad, messages])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const { sendMessage, sendTyping } = useChatSocket(
    chatId,
    handleNewMessage,
    handleTyping,
  )

  const handleSend = () => {
    if (input.trim()) {
      const newMsg = {
        roomId: chatId,
        content: input,
      }
      sendMessage(newMsg)
      setInput('')

      queryClient.invalidateQueries({ queryKey: ['chats', categorySlug] })
    }
  }

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats', categorySlug.toUpperCase()],
    queryFn: () => chatsApi.getChatsByCategory(categorySlug.toUpperCase()),
    enabled: !!categorySlug,
  })

  const chat = useMemo(() => {
    return chats?.content.find((c: Chat) => c.id === chatId) || null
  }, [chats, chatId])

  return (
    <AccessGuard requireAuth>
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

        {isInitialLoad ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='h-10 w-10 animate-spin text-primary' />
          </div>
        ) : (
          <>
            <MessagesList
              messages={messages}
              currentUserId={userId}
              containerRef={containerRef}
              scrollRef={scrollRef}
              onScroll={onScroll}
              isLoadingMore={isLoadingMore}
            />

            {typingUsers.length > 0 && (
              <div className='py-2 pl-12 text-sm italic text-gray-600'>
                {typingUsers.length === 1
                  ? t('typingIndicator.oneUser', { username: typingUsers[0] })
                  : t('typingIndicator.multipleUsers', {
                      usernames: typingUsers.join(', '),
                    })}
              </div>
            )}
          </>
        )}

        <div className='flex px-4 pb-8 md768:px-6 md:px-12'>
          <div className='relative flex-1' ref={emojiPickerRef}>
            <input
              value={input}
              onChange={onInputChange}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className='w-full rounded-[20px] bg-white px-5 py-4 pr-32 placeholder:text-sm placeholder:text-[#0000004D] focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder={t('chatPage.inputPlaceholder')}
            />

            {showEmojiPicker && (
              <div className='absolute bottom-[60px] right-20 z-50'>
                <EmojiPicker
                  onEmojiClick={emojiData => setInput(prev => prev + emojiData.emoji)}
                />
              </div>
            )}

            <div className='absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2'>
              <button
                type='button'
                className='text-gray-500'
                onClick={() => setShowEmojiPicker(prev => !prev)}
              >
                <Smile size={20} strokeWidth={1.5} />
              </button>

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
      </div>
    </AccessGuard>
  )
}
