import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geistMontserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Engly',
  description: 'Engly is a platform to learn English.',
  keywords: 'english, learn, platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistMontserrat.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
