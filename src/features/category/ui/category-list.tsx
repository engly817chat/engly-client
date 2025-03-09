import Image from 'next/image'
import Link from 'next/link'
import { categories } from '../model'

export const CategoryList = () => {
  return (
    <div className='grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6'>
      {categories.map(cat => (
        <Link
          href={cat.title.toLowerCase()}
          key={cat.id}
          className='h-[102px] rounded-[10px] border border-border bg-white p-3 hover:border-primary md:h-[178px] md:space-y-5 md:p-5'
        >
          <div className='hidden items-center justify-between md:flex'>
            <Image src={cat.iconSrc} alt={cat.title} height={24} className='w-auto' />

            {cat.isTop ? (
              <span className='flex items-center justify-center rounded-[10px] bg-primary px-4 py-1.5 text-sm/none text-primary-foreground'>
                Top Pick
              </span>
            ) : (
              <span className='flex w-24 items-center justify-center rounded-[10px] bg-[#F6FEFF] py-1.5 text-sm/none'>
                {cat.count} chats
              </span>
            )}
          </div>

          <div className='space-y-2 md:space-y-3'>
            <h2 className='flex items-center justify-between text-base/5 font-semibold md:text-xl/none'>
              {cat.title}

              <Image
                src={cat.iconSrc}
                alt={cat.title}
                height={24}
                className='w-auto md:hidden'
              />
            </h2>
            <p className='line-clamp-2 h-[34px] text-sm/4 md:text-base/none'>
              {cat.desc}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
