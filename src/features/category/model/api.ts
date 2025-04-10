import { axiosWithAuth } from '@/shared/api'
import { PaginatedCategoriesResponse } from './types'

const endpoints = {
  getAllCategories: '/public/get-all-categories',
} as const

export const categoryApi = {
  getAllCategories: async ({
    page = 0,
    size = 8,
    sort = 'name,asc',
    signal,
  }: {
    page?: number;
    size?: number;
    sort?: string;
    signal?: AbortSignal;
  }): Promise<PaginatedCategoriesResponse> => {
    const response = await axiosWithAuth.get<PaginatedCategoriesResponse>(
      endpoints.getAllCategories,
      {
        params: { page, size, sort },
        signal,
      }
    );
    return response.data;
  },
} as const;