import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Chat } from '@/entities/chats'
import { i18n } from '@/shared/lib'
import { cn } from '@/shared/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/common/avatar'
import { formatChatTime } from '../lib/formatChatTime'

interface ChatListProps {
  chats: Chat[]
  isLoading: boolean
  slug: string | string[]
  loadMoreRef?: React.RefObject<HTMLDivElement | null>
  onChatClick?: () => void
}

export const ChatList = ({
  chats,
  isLoading,
  slug,
  loadMoreRef,
  onChatClick,
}: ChatListProps) => {
  const params = useParams()
  const { t } = useTranslation()
  const chatId = Array.isArray(params?.id) ? params.id[0] : params?.id

  if (isLoading) {
    return (
      <div className='space-y-2 px-2'>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className='flex animate-pulse items-center gap-3 rounded-lg p-3'>
            <div className='h-12 w-12 rounded-full bg-gray-300' />
            <div className='flex-1 space-y-2'>
              <div className='h-4 w-3/4 rounded bg-gray-300' />
              <div className='h-3 w-1/2 rounded bg-gray-300' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className='mt-10 text-center text-sm text-gray-500'>
        {t('chatList.noChats')}
      </div>
    )
  }

  return (
    <nav className='flex-1 space-y-1 px-2'>
      {chats.map(chat => {
        const lastMessage = chat.lastMessage
        const isActive = chat.id === chatId

        const lastMessageContent =
          lastMessage && lastMessage.length > 30
            ? lastMessage.slice(0, 30) + '...'
            : lastMessage || t('chatList.noMessages')

        const lastMessageTime = chat.lastMessageCreatedAt
          ? formatChatTime(chat.lastMessageCreatedAt, i18n.language)
          : ''

        return (
          <Link
            href={`/chats/${slug}/${chat.id}`}
            key={chat.id}
            onClick={() => onChatClick?.()}
            className={cn(
              'group flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100',
            )}
          >
            <Avatar className='h-11 w-11 border-2 border-white'>
              <AvatarImage src={chat.creator?.avatarUrl} alt={chat.name} />
              <AvatarFallback className='text-base font-semibold'>
                {chat.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 truncate'>
              <div className='flex items-center justify-between'>
                <span className='font-semibold'>{chat.name}</span>
                {lastMessageTime && (
                  <span
                    className={cn(
                      'text-xs',
                      isActive ? 'text-gray-200' : 'text-gray-500',
                    )}
                  >
                    {lastMessageTime}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  'truncate text-xs',
                  isActive ? 'text-gray-200' : 'text-gray-500',
                )}
              >
                {lastMessageContent}
              </p>
            </div>
          </Link>
        )
      })}
      <div ref={loadMoreRef} className='h-10' />
    </nav>
  )
}
