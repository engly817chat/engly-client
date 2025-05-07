'use client'

import { useParams } from 'next/navigation'

export default function ChatCategoryPage() {
  const params = useParams()
  const slug = params?.slug

  return (
    <div className="p-4 text-xl font-semibold">
      {slug}
    </div>
  )
}