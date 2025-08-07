import { useEffect, useState } from 'react'
import { chatsApi, Message, Reader } from '@/entities/chats'

type MessageReadersMap = Record<string, Reader[]>

export const useMessageReadStatuses = (messages: Message[], currentUserId?: string) => {
  const [readersMap, setReadersMap] = useState<MessageReadersMap>({})

  useEffect(() => {
    if (!currentUserId) return

    const fetchStatuses = async () => {
      const map: MessageReadersMap = {}

      const last10 = [...messages].filter(msg => msg.user.id === currentUserId).slice(-10)

      for (const msg of last10) {
        const readers = await chatsApi.getMessageReaders(msg.id)
        map[msg.id] = readers
      }

      setReadersMap(map)
    }

    fetchStatuses()
  }, [messages, currentUserId])

  return readersMap
}
