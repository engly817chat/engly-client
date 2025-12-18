'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, MoreVertical, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MessagesList, useChatSocket, useImageUpload, usePaginatedMessages, MessageInput } from '@/features/chats'
import { AccessGuard, useAuth } from '@/entities/auth'
import { Chat, chatsApi, Message } from '@/entities/chats'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/common/avatar'

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

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { imagePreview, imageUrl, isUploading, uploadImage, clearImage } =
    useImageUpload()

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('You can only upload image files.')
      return
    }

    try {
      await uploadImage(file)
    } catch (err) {
      console.error('Error loading', err)
    }
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

  const handleMessageRead = useCallback((data: { messageIds: string[]; userId: string; timestamp: string }) => {
    console.log('Messages read by user:', data)
    // You can update UI here to show read status
  }, [])

  const { sendMessage, sendTyping, markAsRead } = useChatSocket(
    chatId,
    handleNewMessage,
    handleTyping,
    handleMessageRead,
  )

  const handleSend = async () => {
    if (!input.trim() && !imageUrl) return

    const newMsg = {
      roomId: chatId,
      content: [imageUrl, input.trim()].filter(Boolean).join('\n'),
    }

    sendMessage(newMsg)

    setInput('')
    clearImage()

    queryClient.invalidateQueries({ queryKey: ['chats', categorySlug] })
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
      <div className='flex h-full w-full flex-col bg-gray-50'>
        <header className='sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-11 w-11'>
              <AvatarImage src={chat?.creator?.avatarUrl} alt={chat?.name} />
              <AvatarFallback>{chat?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <div className='text-lg font-bold text-gray-800'>
                {isLoading ? (
                  <div className='h-6 w-40 animate-pulse rounded bg-gray-200'></div>
                ) : (
                  chat?.name || t('chatPage.chatNotFound')
                )}
              </div>
              <div className='text-sm text-gray-500'>
                {isLoading ? (
                  <div className='mt-1 h-4 w-20 animate-pulse rounded bg-gray-200'></div>
                ) : (
                  t('chatPage.members', { count: chat?.members ?? 0 })
                )}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100'>
              <Search size={20} />
            </button>
            <button className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100'>
              <MoreVertical size={20} />
            </button>
          </div>
        </header>

        {isInitialLoad ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
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
              markAsRead={markAsRead}
            />

            {typingUsers.length > 0 && (
              <div className='px-8 pb-2 text-sm italic text-gray-500'>
                {typingUsers.length === 1
                  ? t('typingIndicator.oneUser', { username: typingUsers[0] })
                  : t('typingIndicator.multipleUsers', {
                      usernames: typingUsers.join(', '),
                    })}
              </div>
            )}
          </>
        )}

        <MessageInput
          input={input}
          imagePreview={imagePreview}
          isUploading={isUploading}
          showEmojiPicker={showEmojiPicker}
          emojiPickerRef={emojiPickerRef}
          fileInputRef={fileInputRef}
          onInputChange={onInputChange}
          handleSend={handleSend}
          handleFileChange={handleFileChange}
          toggleEmojiPicker={() => setShowEmojiPicker(prev => !prev)}
          onEmojiSelect={emoji => setInput(prev => prev + emoji)}
          clearImage={clearImage}
        />
      </div>
    </AccessGuard>
  )
}
