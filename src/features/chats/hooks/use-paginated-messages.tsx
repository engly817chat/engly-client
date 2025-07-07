import { useCallback, useEffect, useRef, useState } from 'react'
import { chatsApi, Message } from '@/entities/chats'

const PAGE_SIZE = 30

export function usePaginatedMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [page, setPage] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const isAtBottomRef = useRef(true)

  useEffect(() => {
    isAtBottomRef.current = isAtBottom
  }, [isAtBottom])

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const appendMessage = useCallback((message: Message) => {
    setMessages(prev => {
      if (prev.some(m => m.id === message.id)) return prev
      return [...prev, message]
    })

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    if (isAtBottomRef.current) {
      scrollTimeoutRef.current = setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
        scrollTimeoutRef.current = null
      }, 50)
    }
  }, [])

  const loadPage = useCallback(
    async (pageNumber: number) => {
      try {
        const res = await chatsApi.getMessages(chatId, {
          page: pageNumber,
          size: PAGE_SIZE,
        })

        const newMessages: Message[] = res.messages || []

        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const filtered = newMessages.filter(m => !existingIds.has(m.id))
          return [...filtered, ...prev]
        })
        setPage(pageNumber)
        setHasMore(pageNumber > 0)
      } catch (e) {
        console.error('Load page failed', e)
      }
    },
    [chatId],
  )

  useEffect(() => {
    async function loadLastPage() {
      try {
        const meta = await chatsApi.getMessages(chatId, {
          page: 0,
          size: PAGE_SIZE,
        })

        const totalPages = meta.totalPages ?? 1
        let currentPage = totalPages - 1
        let allMessages: Message[] = []

        while (currentPage >= 0) {
          const res = await chatsApi.getMessages(chatId, {
            page: currentPage,
            size: PAGE_SIZE,
          })

          const newMessages: Message[] = res.messages || []
          allMessages = [...allMessages, ...newMessages]
          currentPage--

          await new Promise(res => setTimeout(res, 30))
          const container = containerRef.current
          if (container && container.scrollHeight > container.clientHeight) break
        }

        setMessages(allMessages.reverse())
        setPage(currentPage + 1)
        setHasMore(currentPage + 1 > 0)
        setIsInitialLoad(false)
      } catch (e) {
        console.error('Initial load failed', e)
      }
    }

    if (chatId) {
      loadLastPage()
    }
  }, [chatId])

  const onScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || isInitialLoad || isLoadingMore) return

    const nearTop = container.scrollTop < 50
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100

    setIsAtBottom(nearBottom)

    if (nearTop && hasMore && page !== null && page > 0) {
      const prevHeight = container.scrollHeight
      const nextPage = page - 1

      setIsLoadingMore(true)
      loadPage(nextPage).then(() => {
        requestAnimationFrame(() => {
          const newHeight = container.scrollHeight
          container.scrollTop = newHeight - prevHeight
          setIsLoadingMore(false)
        })
      })
    }
  }, [page, hasMore, isLoadingMore, isInitialLoad])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return {
    messages,
    scrollRef,
    containerRef,
    onScroll,
    appendMessage,
    isInitialLoad,
    isLoadingMore,
  }
}
