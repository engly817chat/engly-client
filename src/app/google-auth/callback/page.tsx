'use client'

import { Loader2 } from 'lucide-react'
import { useHandleGoogleCallback } from '@/features/auth'

export default function GoogleCallbackPage() {
  useHandleGoogleCallback()

  return (
    <div className='flex h-screen items-center justify-center'>
      <Loader2 className='h-10 w-10 animate-spin text-primary' />
    </div>
  )
}
