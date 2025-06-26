import { useEffect, useRef } from 'react'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import { Message } from '@/entities/chats'
import { getAccessToken } from '@/shared/utils'

type OutgoingMessage = {
  roomId: string
  content: string
}

export const useChatSocket = (chatId: string, onMessage: (msg: Message) => void) => {
  const clientRef = useRef<Client | null>(null)
  const subscriptionRef = useRef<StompSubscription | null>(null)
  const token = getAccessToken()

  useEffect(() => {
    const client = new Client({
      brokerURL: 'wss://engly-server-practika-5d017e7c.koyeb.app/chat',
      reconnectDelay: 8000,
      debug: str => console.log('[STOMP]', str),
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    client.onConnect = () => {
      console.log('[STOMP] Connected to server')

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }

      if (chatId) {
        console.log(`[STOMP] Subscribing to /topic/messages/${chatId}`)
        subscriptionRef.current = client.subscribe(
          `/topic/messages/${chatId}`,
          (message: IMessage) => {
            console.log('[STOMP] Received message:', message.body)
            if (message.body) {
              try {
                const parsed = JSON.parse(message.body)

                if (parsed?.type === 'MESSAGE_SEND' && parsed.payload) {
                  const payload = parsed.payload

                  const msgData: Message = {
                    id: payload.id,
                    content: payload.content,
                    createdAt: payload.createdAt ?? new Date().toISOString(),
                    updatedAt: payload.updatedAt,
                    isEdited: payload.isEdited,
                    isDeleted: payload.isDeleted,
                    room: payload.room
                      ? {
                          id: payload.room.id,
                          name: payload.room.name,
                        }
                      : undefined,
                    user: {
                      id: payload.user.id,
                      username: payload.user.username,
                      email: payload.user.email,
                    },
                  }

                  console.log('[STOMP] Normalized message:', msgData)
                  onMessage(msgData)
                }
              } catch (error) {
                console.error('[STOMP] Failed to parse message body:', error)
              }
            }
          },
        )
      }
    }

    client.onWebSocketClose = event => {
      console.warn('[STOMP] WebSocket closed:', event.code, event.reason)
    }

    client.onDisconnect = frame => {
      console.warn('[STOMP] Disconnected:', frame)
    }

    client.onStompError = frame => {
      console.error('[STOMP] Broker error:', frame.headers['message'])
      console.error('Details:', frame.body)
    }

    client.activate()
    clientRef.current = client

    return () => {
      if (subscriptionRef.current) {
        console.log('[STOMP] Unsubscribing from chat')
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }

      if (clientRef.current) {
        console.log('[STOMP] Deactivating client')
        clientRef.current.deactivate()
        clientRef.current = null
      }
    }
  }, [chatId, onMessage])

  const sendMessage = (message: OutgoingMessage) => {
    const client = clientRef.current

    if (client && client.connected) {
      console.log('[STOMP] Sending message:', message)
      client.publish({
        destination: '/app/chat/message.send',
        body: JSON.stringify(message),
      })
    } else {
      console.warn('[STOMP] Cannot send: client not connected')
    }
  }

  return { sendMessage }
}
