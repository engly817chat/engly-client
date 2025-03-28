import { axiosWithAuth } from '@/shared/api'
import type { SignalOptions } from '@/shared/types'
import { PaginatedCategoriesResponse } from './types'

const endpoints = {
  getAllCategories: '/get-all-categories',
} as const

export const categoryApi = {
  getAllCategories: async ({
    signal,
  }: SignalOptions): Promise<PaginatedCategoriesResponse> => {
    const response = await axiosWithAuth.get<PaginatedCategoriesResponse>(
      endpoints.getAllCategories,
      {
        signal,
      },
    )

    return response.data
  },
} as const
