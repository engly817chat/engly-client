'use client'

import { useParams } from 'next/navigation'

export default function ChatCategoryPage() {
  const params = useParams()
  const slug = params?.slug

  return (
    <div className='flex w-full max-w-2xl flex-col gap-3 md:gap-5 text-center text-foreground'>
      <h1 className='text-2xl md:text-4xl font-semibold'>Welcome to {slug} chat</h1>
      <p className='text-base md:text-xl text-foreground'>
        Select a chat from the list and join the conversation. Here you can continue the
        discussion with already familiar interlocutors or start a new topic for
        communication with other platform participants.
      </p>
    </div>
  )
}
