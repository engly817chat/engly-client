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

  const appendMessage = useCallback(
    (message: Message) => {
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev
        return [...prev, message]
      })

      setTimeout(() => {
        if (isAtBottom) {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      }, 50)
    },
    [isAtBottom],
  )

  const loadPage = useCallback(
    async (pageNumber: number) => {
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
    },
    [chatId],
  )

  useEffect(() => {
    async function loadLastPage() {
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

      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
        setIsInitialLoad(false)
      }, 50)
    }

    if (chatId) {
      loadLastPage()
    }
  }, [chatId])

  const onScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || isInitialLoad) return

    const nearTop = container.scrollTop === 0
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100

    setIsAtBottom(nearBottom)

    if (nearTop && hasMore) {
      const nextPage = page !== null ? page - 1 : null
      if (nextPage !== null && nextPage >= 0) {
        const prevHeight = container.scrollHeight

        setIsLoadingMore(true)

        loadPage(nextPage).then(() => {
          setTimeout(() => {
            const newHeight = container.scrollHeight
            container.scrollTop = newHeight - prevHeight
            setIsLoadingMore(false)
          }, 0)
        })
      }
    }
  }, [page, loadPage, hasMore, isInitialLoad])

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
