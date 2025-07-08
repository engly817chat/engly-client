import { format, isToday, isYesterday } from 'date-fns'
import { Message } from '@/entities/chats'

export function groupMessagesByDate(messages: Message[]) {
  const groups: Record<string, Message[]> = {}

  messages.forEach(message => {
    const date = new Date(message.createdAt)
    let dateKey = ''

    if (isToday(date)) {
      dateKey = 'Today'
    } else if (isYesterday(date)) {
      dateKey = 'Yesterday'
    } else {
      dateKey = format(date, 'MMMM d, yyyy')
    }

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }

    groups[dateKey].push(message)
  })

  return groups
}
