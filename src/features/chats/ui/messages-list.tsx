import { useEffect, useRef } from 'react'
import { Check, CheckCheck } from 'lucide-react'
import { Message } from '@/entities/chats'

interface MessagesListProps {
  messages: Message[]
  currentUserId?: string
}

export const MessagesList = ({ messages, currentUserId }: MessagesListProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className='flex-1 overflow-y-auto px-6 py-8 md:px-12'>
      {messages.map(msg => {
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

                <div className='text-base font-medium'>{msg.content}</div>

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
      <div ref={bottomRef} />
    </div>
  )
}
