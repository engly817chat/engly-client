import { AuthSlider } from '@/features/auth'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex h-screen items-center justify-center bg-slate-800'>
      <div className='flex h-full w-full bg-slate-400 xl:h-[752px] xl:w-[1030px] xl:overflow-hidden xl:rounded-2xl'>
        <AuthSlider />
        <div className='flex-1'>{children}</div>
      </div>
    </main>
  )
}
