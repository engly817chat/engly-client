import { useState } from 'react'
import { chatsApi, Message, Reader } from '@/entities/chats'

type MessageReadersMap = Record<string, Reader[]>

export const useObservedMessageReadStatuses = (
  messages: Message[],
  currentUserId?: string,
) => {
  const [readersMap, setReadersMap] = useState<MessageReadersMap>({})
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set())

  const loadForId = async (messageId: string) => {
    if (!currentUserId || loadedIds.has(messageId)) return

    const msg = messages.find(m => m.id === messageId && m.user.id === currentUserId)
    if (!msg) return

    try {
      const readers = await chatsApi.getMessageReaders(msg.id)
      setReadersMap(prev => ({ ...prev, [msg.id]: readers }))
      setLoadedIds(prev => new Set(prev).add(msg.id))
    } catch (e) {
      console.error('Failed to load readers for', msg.id)
    }
  }

  return { readersMap, loadForId }
}
