import { CategoryList } from '@/features/category'

export default function HomePage() {
  return (
    <div className='space-y-8 py-14 md:space-y-7 xl:py-16'>
      <div className='space-y-4 text-center'>
        <h1 className='text-2xl/9 font-bold md:text-3xl/none'>Welcome to the chat!</h1>
        <p className='text-xl/none text-muted-foreground'>
          Choose a chat and enjoy communication
        </p>
      </div>

      <CategoryList />
    </div>
  )
}
