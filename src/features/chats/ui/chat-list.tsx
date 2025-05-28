import { Chat } from '@/entities/chats'
import Link from 'next/link'

interface ChatListProps {
  chats: Chat[]
  isLoading: boolean
  slug: string | string[]
}

export const ChatList = ({ chats, isLoading, slug }: ChatListProps) => {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='flex animate-pulse flex-col gap-2 border-b p-4'>
            <div className='flex items-center justify-between'>
              <div className='h-4 w-24 rounded bg-gray-300' />
              <div className='h-3 w-12 rounded bg-gray-300' />
            </div>
            <div className='h-4 w-40 rounded bg-gray-300' />
            <div className='h-3 w-60 rounded bg-gray-300' />
          </div>
        ))}
      </>
    )
  }

  if (chats.length === 0) {
    return (
    <div className="px-4 py-8 text-sm text-muted-foreground text-center">
        Ще немає жодного чату. Почни новий, щоб розпочати спілкування ✨
      </div>
    )
  }

  return (
    <>
      {chats.map(chat => {
        const lastMessage =
          chat.messages && chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1]
            : null

        return (
          <Link
            href={`/chats/${slug}/${chat.id}`}
            key={chat.id}
            className='flex flex-col items-start gap-2 whitespace-nowrap border-b bg-sidebar-accent-foreground p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          >
            <div className='flex w-full items-center gap-1'>
              <span className='text-xl font-medium'>{chat.name}</span>
              <span className='ml-auto text-xs'>
                {new Date(chat.createdAt).toLocaleDateString('uk-UA', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <span className='text-xs'>
              {lastMessage ? lastMessage.content : 'No messages yet'}
            </span>
          </Link>
        )
      })}
    </>
  )
}
