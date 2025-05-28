export interface Chat {
  id: string
  name: string
  description: string
    creator?: {
    email?: string
  }
  createdAt: string
  messages: Message[] | null
}

export interface Message {
  id: string
  room: string
  createdAt: string
  updatedAt: string
  user: string
  content: string
  isEdited: boolean
  isDeleted: boolean
}