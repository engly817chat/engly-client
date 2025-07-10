import { chatsApi } from "@/entities/chats"
import { useInfiniteQuery } from "@tanstack/react-query"

export function usePaginatedChats(categorySlug: string) {
  return useInfiniteQuery({
    queryKey: ['chats', categorySlug],
    queryFn: ({ pageParam = 0 }) =>
      chatsApi.getChatsByCategory(categorySlug.toUpperCase(), pageParam),
    getNextPageParam: lastPage => {
      const { number, totalPages } = lastPage
      return number + 1 < totalPages ? number + 1 : undefined
    },
    initialPageParam: 0,
    enabled: !!categorySlug,
  })
}