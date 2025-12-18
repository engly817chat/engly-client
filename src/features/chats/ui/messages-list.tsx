import React from 'react'
import { enUS, uk } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Message } from '@/entities/chats'
import { useObservedMessageReadStatuses } from '../hooks/use-message-read-statuses'
import { useVisibleMessages } from '../hooks/use-visible-message-observer'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/common/avatar'
import { formatChatTime } from '../lib/formatChatTime'
import { groupMessagesByDate } from '../lib/groupMessagesByDate'
import { renderMessageContent } from '../lib/renderMessageContent'
import { ReadStatusTooltip } from './read-status-tooltip'

interface MessagesListProps {
  messages: Message[]
  currentUserId?: string
  containerRef: React.RefObject<HTMLDivElement | null>
  scrollRef: React.RefObject<HTMLDivElement | null>
  onScroll: () => void
  isLoadingMore?: boolean
  markAsRead?: (messageIds: string[]) => void
}

export const MessagesList = ({
  messages,
  currentUserId,
  containerRef,
  scrollRef,
  onScroll,
  isLoadingMore,
  markAsRead,
}: MessagesListProps) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'uk' ? uk : enUS
  const groupedMessages = groupMessagesByDate(messages, t, locale)
  const { readersMap: readStatuses, loadForId } = useObservedMessageReadStatuses(
    messages,
    currentUserId,
  )

  const visibleMessageIds = React.useRef<Set<string>>(new Set())

  const handleMessageVisible = React.useCallback((messageId: string) => {
    loadForId(messageId)
    
    // Only mark as read if it's not from current user
    const message = messages.find(m => m.id === messageId)
    if (message && message.user.id !== currentUserId && markAsRead) {
      visibleMessageIds.current.add(messageId)
      
      // Debounce marking as read - collect visible messages and send in batch
      setTimeout(() => {
        const idsToMark = Array.from(visibleMessageIds.current)
        if (idsToMark.length > 0) {
          markAsRead(idsToMark)
          visibleMessageIds.current.clear()
        }
      }, 1000)
    }
  }, [messages, currentUserId, markAsRead, loadForId])

  useVisibleMessages(
    messages.map(m => m.id),
    handleMessageVisible,
  )

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className='flex-1 overflow-y-auto p-6'
    >
      {isLoadingMore && (
        <div className='flex justify-center py-4'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
        </div>
      )}

      {Object.entries(groupedMessages).map(([dateLabel, group]) => (
        <div key={dateLabel} className='relative mb-6'>
          <div className='sticky top-4 z-10 mb-4 flex justify-center'>
            <span className='rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600'>
              {dateLabel}
            </span>
          </div>

          <div className='space-y-6'>
            {group.map(msg => {
              const isOwn = msg.user.id === currentUserId
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                  data-message-id={msg.id}
                >
                  {!isOwn && (
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={msg.user.avatarUrl} alt={msg.user.username} />
                      <AvatarFallback>
                        {msg.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-md rounded-2xl px-4 py-3 ${
                      isOwn
                        ? 'rounded-br-none bg-blue-500 text-white'
                        : 'rounded-bl-none bg-white shadow-md'
                    }`}
                  >
                    {!isOwn && (
                      <div className='mb-1 text-sm font-semibold text-blue-600'>
                        {msg.user.username}
                      </div>
                    )}

                    <div className='whitespace-pre-wrap break-words text-sm'>
                      {renderMessageContent(msg.content)}
                    </div>

                    <div
                      className={`mt-1.5 flex items-center justify-end gap-1.5 text-xs ${
                        isOwn ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      {msg.createdAt ? formatChatTime(msg.createdAt, i18n.language) : ''}

                      {isOwn && <ReadStatusTooltip readers={readStatuses[msg.id]} />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div ref={scrollRef} />
    </div>
  )
}
