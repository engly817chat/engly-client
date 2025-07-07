import { useCallback, useEffect, useRef, useState } from 'react'
import { chatsApi, Message } from '@/entities/chats'

const PAGE_SIZE = 8

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
          sort: ['createdAt,asc'],
        })

        const newMessages: Message[] = res._embedded?.messagesDtoList || []

        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const filteredNewMessages = newMessages.filter(m => !existingIds.has(m.id))
          return [...filteredNewMessages, ...prev]
        })
        setPage(pageNumber)

        const isFirstPage = pageNumber === 0
        setHasMore(!isFirstPage)
      } catch (error) {
        console.error('Failed to load messages:', error)
      }
    },
    [chatId],
  )

  useEffect(() => {
    async function loadLastPage() {
      try {
        const metaRes = await chatsApi.getMessages(chatId, {
          page: 0,
          size: PAGE_SIZE,
          sort: ['createdAt,asc'],
        })

        const totalPages = metaRes.page?.totalPages ?? 1
        let currentPage = totalPages - 1
        let allMessages: Message[] = []

        while (currentPage >= 0) {
          const res = await chatsApi.getMessages(chatId, {
            page: currentPage,
            size: PAGE_SIZE,
            sort: ['createdAt,asc'],
          })

          const newMessages: Message[] = res._embedded?.messagesDtoList || []
          const existingIds = new Set(allMessages.map(m => m.id))
          const filtered = newMessages.filter(m => !existingIds.has(m.id))

          allMessages = [...filtered, ...allMessages]

          currentPage--

          await new Promise(resolve => setTimeout(resolve, 30))

          const container = containerRef.current
          if (container && container.scrollHeight > container.clientHeight) {
            break
          }
        }

        setMessages(allMessages)
        setPage(currentPage + 1)
        setHasMore(currentPage + 1 > 0)

        if (allMessages.length === 0) setHasMore(false)

        setIsInitialLoad(false)
      } catch (error) {
        console.error('Failed to load initial messages:', error)
        setIsInitialLoad(false)
      }
    }

    if (chatId) {
      loadLastPage()
    }
  }, [chatId])

  const onScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || isInitialLoad || isLoadingMore) return

    const nearTop = container.scrollTop < 1
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100

    setIsAtBottom(nearBottom)

    if (nearTop && hasMore) {
      const nextPage = page !== null ? page - 1 : null
      if (nextPage !== null && nextPage >= 0) {
        const prevHeight = container.scrollHeight

        setIsLoadingMore(true)

        loadPage(nextPage)
          .then(() => {
            setTimeout(() => {
              const newHeight = container.scrollHeight
              container.scrollTop = newHeight - prevHeight
              setIsLoadingMore(false)
            }, 0)
          })
          .catch(error => {
            console.error('Failed to load more messages:', error)
            setIsLoadingMore(false)
          })
      }
    }
  }, [page, loadPage, hasMore, isInitialLoad])

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
