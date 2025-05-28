'use client'

import { useParams } from 'next/navigation'

export default function ChatPage() {
  const params = useParams()
  const id = params?.id
  return (
    <div>
      <span className='text-xl'>Chat {id}</span>
    </div>
  )
}
