import { cn } from '@/shared/utils'

export const PageWrapper = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) => {
  return (
    <div className={cn('py-10 lg:py-14 xl:py-16', className)}>
      <div className='container'>{children}</div>
    </div>
  )
}
