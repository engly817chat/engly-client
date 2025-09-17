import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Chat } from '@/entities/chats'
import { i18n } from '@/shared/lib'
import { cn } from '@/shared/utils'
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
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='flex animate-pulse flex-col gap-2 border-b p-4'>
            <div className='flex items-center justify-between'>
              <div className='h-5 w-24 rounded bg-gray-300' />
              <div className='h-3 w-12 rounded bg-gray-300' />
            </div>
            <div className='h-4 w-40 rounded bg-gray-300' />
          </div>
        ))}
      </>
    )
  }

  if (chats.length === 0) {
    return (
      <div className='px-4 py-8 text-center text-sm text-muted-foreground'>
        {t('chatList.noChats')}
      </div>
    )
  }

  return (
    <>
      {chats.map(chat => {
        const lastMessage = chat.lastMessage
        const isActive = chat.id === chatId

        const lastMessageContent =
          lastMessage?.content && lastMessage.content.length > 45
            ? lastMessage.content.slice(0, 45) + '...'
            : lastMessage?.content || t('chatList.noMessages')

        const lastMessageTime = lastMessage?.createdAt
          ? formatChatTime(lastMessage.createdAt, i18n.language)
          : ''

        return (
          <Link
            href={`/chats/${slug}/${chat.id}`}
            key={chat.id}
            onClick={() => onChatClick?.()}
            className={cn(
              'group flex flex-col items-start gap-2 whitespace-nowrap border-b border-b-border bg-sidebar-primary-foreground p-4 text-sm font-medium hover:border-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isActive &&
                'border-none bg-sidebar-primary text-sidebar-primary-foreground',
            )}
          >
            <div className='flex w-full items-center gap-1'>
              <span className='text-xl font-medium'>{chat.name}</span>
              {lastMessageTime && (
                <span
                  className={cn(
                    'ml-auto text-xs text-[rgba(0,0,0,0.5)] group-hover:text-sidebar-accent-foreground',
                    isActive && 'text-sidebar-accent-foreground',
                  )}
                >
                  {lastMessageTime}
                </span>
              )}
            </div>

            <span
              className={cn(
                'text-xs font-medium text-[rgba(0,0,0,0.5)]',
                'group-hover:text-sidebar-accent-foreground',
                isActive && 'text-sidebar-accent-foreground',
              )}
            >
              {lastMessageContent}
            </span>
          </Link>
        )
      })}
      <div ref={loadMoreRef} className='mt-20 h-10' />
    </>
  )
}
