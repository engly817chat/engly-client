import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Данные остаются свежими 5 минут
      gcTime: 1000 * 60 * 10, // Данные кэшируются на 10 минут
      refetchOnWindowFocus: false,
    },
  },
})
