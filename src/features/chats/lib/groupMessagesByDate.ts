import { format, isToday, isYesterday, Locale } from 'date-fns'
import { Message } from '@/entities/chats'

export function groupMessagesByDate(
  messages: Message[],
  t: (key: string) => string,
  locale: Locale,
) {
  const groups: Record<string, Message[]> = {}

  messages.forEach(message => {
    const date = new Date(message.createdAt)
    let dateKey = ''

    if (isToday(date)) {
      dateKey = t('chatPage.Today')
    } else if (isYesterday(date)) {
      dateKey = t('chatPage.Yesterday')
    } else {
      dateKey = format(date, 'MMMM d, yyyy', { locale })
    }

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }

    groups[dateKey].push(message)
  })

  return groups
}
