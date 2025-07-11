import { enUS, uk } from 'date-fns/locale'
import { Check, CheckCheck, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Message } from '@/entities/chats'
import { groupMessagesByDate } from '../lib/groupMessagesByDate'

interface MessagesListProps {
  messages: Message[]
  currentUserId?: string
  containerRef: React.RefObject<HTMLDivElement | null>
  scrollRef: React.RefObject<HTMLDivElement | null>
  onScroll: () => void
  isLoadingMore?: boolean
}

export const MessagesList = ({
  messages,
  currentUserId,
  containerRef,
  scrollRef,
  onScroll,
  isLoadingMore,
}: MessagesListProps) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'uk' ? uk : enUS
  const groupedMessages = groupMessagesByDate(messages, t, locale)

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className='flex-1 overflow-y-auto px-6 py-6 md:px-12'
    >
      {isLoadingMore && (
        <div className='flex items-center justify-center'>
          <Loader2 className='h-10 w-10 animate-spin text-primary' />
        </div>
      )}

      {Object.entries(groupedMessages).map(([dateLabel, group]) => (
        <div key={dateLabel}>
          <div className='sticky top-0 z-10 mb-4 flex justify-center'>
            <span className='rounded-md bg-gray-200 px-4 py-1 text-sm font-medium text-gray-600'>
              {dateLabel}
            </span>
          </div>

          {group.map(msg => {
            const isOwn = msg.user.id === currentUserId
            return (
              <div
                key={msg.id}
                className={`mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className='max-w-xs sm:max-w-md'>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'text-secodary-foreground bg-white'
                    }`}
                  >
                    {!isOwn && (
                      <div className='mb-1 text-sm font-medium text-[#803828]'>
                        {msg.user.username}
                      </div>
                    )}

                    <div className='whitespace-pre-wrap break-words text-base font-medium'>
                      {msg.content}
                    </div>

                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                        isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}

                      {isOwn &&
                        (msg.id === 'some-read-id' ? (
                          <CheckCheck size={14} strokeWidth={1.5} />
                        ) : (
                          <Check size={14} strokeWidth={1.5} />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      <div ref={scrollRef} />
    </div>
  )
}
