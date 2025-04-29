export default function GoogleAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex min-h-screen items-center justify-center bg-slate-800'>
      {children}
    </main>
  )
}
