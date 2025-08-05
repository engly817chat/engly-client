'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, MoreVertical, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MessagesList, useChatSocket, useImageUpload, usePaginatedMessages, MessageInput } from '@/features/chats'
import { AccessGuard, useAuth } from '@/entities/auth'
import { Chat, chatsApi, Message } from '@/entities/chats'

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

  const { sendMessage, sendTyping } = useChatSocket(
    chatId,
    handleNewMessage,
    handleTyping,
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
