import { axiosWithAuth } from '@/shared/api'
import { PaginatedChatsResponse } from './types'

const endpoints = {
  getChatsByCategory: '/api/rooms/by-category',
  createChat: '/api/rooms/create',
  getMessages: (roomId: string) => `/api/message/current-room/native/${roomId}`,
  sendMessage: '/api/message/send',
  findChats: (category: string) => `/api/rooms/find/in/${category}/by-keyString/`,
  uploadImage: '/api/upload',
} as const

export const chatsApi = {
  getChatsByCategory: async (
    categorySlug: string,
    page: number = 0,
    size: number = 8,
  ): Promise<PaginatedChatsResponse> => {
    const response = await axiosWithAuth.get(endpoints.getChatsByCategory, {
      params: {
        category: categorySlug,
        page,
        size,
      },
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
  getMessages: async (
    roomId: string,
    options?: {
      page?: number
      size?: number
    },
  ) => {
    const response = await axiosWithAuth.get(endpoints.getMessages(roomId), {
      params: {
        ...options,
      },
    })
    return response.data
  },
  sendMessage: async (roomId: string, content: string) => {
    const response = await axiosWithAuth.post(endpoints.sendMessage, {
      roomId,
      content,
    })

    return response.data
  },
  findChats: async (
    category: string,
    keyString: string,
  ): Promise<PaginatedChatsResponse> => {
    const response = await axiosWithAuth.get(endpoints.findChats(category), {
      params: {
        keyString: keyString.trim(),
      },
    })

    return response.data
  },
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await axiosWithAuth.post(endpoints.uploadImage, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },
} as const
