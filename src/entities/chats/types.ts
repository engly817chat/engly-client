export interface Chat {
  id: string
  name: string
  description: string
  creator?: {
    email?: string
  }
  createdAt: string
  updatedAt: string
  messages: Message[] | null
  chatParticipants: []
  lastMessage: LastMessage
}

export interface LastMessage {
  id: string
  content: string
  createdAt: string
}

export interface Message {
  id: string
  room?: {
    id: string
    name?: string
  }

  createdAt: string
  updatedAt: string
  user: {
    username: string
    email: string
    id: string
  }
  content: string
  isEdited: boolean
  isDeleted: boolean
}

export interface PaginatedChatsResponse {
  content: Chat[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  pageable: Pageable
  size: number
  totalElements: number
  totalPages: number
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface Reader {
  id: string
  username: string
  email: string
}
