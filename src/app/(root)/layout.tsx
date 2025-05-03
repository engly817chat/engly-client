'use client'

import type { ReactNode } from 'react'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-background'>
      <main>{children}</main>
    </div>
  )
}
