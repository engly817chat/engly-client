import { axiosWithAuth } from '@/shared/api'


const endpoints = {
  getChatsByCategory: '/api/rooms/by-category',
  createChat: '/api/rooms/create',
} as const

export const chatsApi = {
  getChatsByCategory: async (categorySlug: string) => {
    const response = await axiosWithAuth.get(endpoints.getChatsByCategory, {
      params: { category: categorySlug },
    })
    return response.data
  },
  createNewChat: async (category: string, roomName: string, desc: string) => {
    const response = await axiosWithAuth.post(
      endpoints.createChat,
      {
        name: roomName,
        description: desc,
      },
      {
        params: {
          name: category,
        },
      },
    )
    return response.data
  },
} as const
