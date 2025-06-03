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
