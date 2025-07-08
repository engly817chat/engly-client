import { useCallback, useEffect, useRef, useState } from 'react'
import { chatsApi, Message } from '@/entities/chats'

const PAGE_SIZE = 30

export function usePaginatedMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [page, setPage] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isAtBottomRef = useRef(true)

  const setScrollBottom = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const appendMessage = useCallback(
    (message: Message) => {
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev
        return [...prev, message]
      })

      if (isAtBottomRef.current) {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = setTimeout(setScrollBottom, 50)
      }
    },
    [setScrollBottom],
  )

  const ensureEnoughMessagesToScroll = useCallback(
    async (currentPage: number) => {
      const container = containerRef.current
      if (!container) return

      const isScrollable = container.scrollHeight > container.clientHeight

      if (!isScrollable && currentPage > 0) {
        const prevPage = currentPage - 1

        try {
          const res = await chatsApi.getMessages(chatId, {
            page: prevPage,
            size: PAGE_SIZE,
          })

          const newMessages: Message[] = res.messages || []

          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id))
            const filtered = newMessages.filter(m => !existingIds.has(m.id))
            return [...filtered, ...prev]
          })

          setPage(prevPage)
          setHasMore(prevPage > 0)

          requestAnimationFrame(() => {
            ensureEnoughMessagesToScroll(prevPage)
          })
        } catch (e) {
          console.error('Auto-scroll load failed', e)
        }
      }
    },
    [chatId],
  )

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
        setHasMore(!res.isFirst)
      } catch (e) {
        console.error('Load page failed', e)
      }
    },
    [chatId],
  )

  const loadInitialMessages = useCallback(async () => {
    try {
      const meta = await chatsApi.getMessages(chatId, {
        page: 0,
        size: 1,
      })

      const total = meta.totalElements ?? 0
      const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1)
      let currentPage = totalPages - 1
      let loadedMessages: Message[] = []

      const container = containerRef.current

      while (currentPage >= 0) {
        const res = await chatsApi.getMessages(chatId, {
          page: currentPage,
          size: PAGE_SIZE,
        })

        const pageMessages = res.messages || []
        loadedMessages = [...pageMessages, ...loadedMessages]
        currentPage--

        setMessages([...loadedMessages])

        await new Promise(resolve => requestAnimationFrame(resolve))

        if (container && container.scrollHeight > container.clientHeight) {
          currentPage++
          break
        }

        if (currentPage < 0) break
      }

      setPage(currentPage + 1)
      setHasMore(currentPage + 1 > 0)
      setIsInitialLoad(false)

    } catch (e) {
      console.error('Initial load failed', e)
    }
  }, [chatId])

  useEffect(() => {
    if (chatId) {
      loadInitialMessages()
    }
  }, [chatId, loadInitialMessages])

  const onScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || isInitialLoad || isLoadingMore) return

    const nearTop = container.scrollTop < 50
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100
    isAtBottomRef.current = nearBottom

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
  }, [page, hasMore, isLoadingMore, isInitialLoad, loadPage])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
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
