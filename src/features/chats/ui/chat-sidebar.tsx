'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  AlignJustify,
  Bell,
  ChevronLeft,
  CircleAlert,
  ListFilter,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  UserRound,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDebounceCallback } from 'usehooks-ts'
import { ChatList, useInfiniteScroll, usePaginatedChats } from '@/features/chats'
import { useAuth } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/common/sidebar'
import { cn } from '@/shared/utils'
import { useSearchChats } from '../hooks/use-search-chats'

export function ChatSidebar({ 
  onOpenModal,
  isRoomListOpen,
  setIsRoomListOpen 
}: { 
  onOpenModal: (slug: string) => void
  isRoomListOpen?: boolean
  setIsRoomListOpen?: (open: boolean) => void
}) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [internalIsOpen, setInternalIsOpen] = useState(true)
  const isOpen = isRoomListOpen ?? internalIsOpen
  const setIsOpen = setIsRoomListOpen ?? setInternalIsOpen

  const navMain = useMemo(
    () => [
      {
        title: t('sidebar.messages'),
        url: '#',
        icon: MessageSquare,
        isActive: false,
        disabled: false,
      },
      {
        title: t('sidebar.users'),
        url: '#',
        icon: Users,
        isActive: false,
        disabled: true,
      },
      {
        title: t('sidebar.bell'),
        url: '#',
        icon: Bell,
        isActive: false,
        disabled: true,
      },
      {
        title: t('sidebar.user'),
        url: '#',
        icon: UserRound,
        isActive: false,
        disabled: false,
        onClick: () => router.push('/profile'),
      },
      {
        title: t('sidebar.alert'),
        url: '#',
        icon: CircleAlert,
        isActive: false,
        disabled: true,
      },
    ],
    [t, router],
  )
  const [activeItem, setActiveItem] = useState(navMain[0])
  const { showRail, setShowRail, setOpenMobile, isMobile } = useSidebar()
  const { logout } = useAuth()
  const params = useParams()
  const slug = params.slug ?? ''
  const slugValue = Array.isArray(slug) ? slug[0] : (slug ?? '')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaginatedChats(slugValue)

  const loadMoreRef = useInfiniteScroll(hasNextPage, fetchNextPage)

  const debouncedUpdate = useDebounceCallback((value: string) => {
    setDebouncedSearch(value)
  }, 500)

  const { data: searchResults, isLoading: isSearchLoading } = useSearchChats(
    slugValue,
    debouncedSearch,
  )

  const chatsToShow = debouncedSearch
    ? searchResults?.content || []
    : data?.pages.flatMap(page => page.content) || []

  return (
    <Sidebar className='flex shrink-0 overflow-hidden transition-all duration-300' style={{ width: isOpen ? '365px' : '72px' }}>
      <div className={cn('flex h-full w-[72px] shrink-0 flex-col items-center justify-between px-2 py-4', isOpen && 'border-r')}>
        <SidebarHeader>
          <Link href='/' className='mb-2 mt-1 font-bold'>
            <span className='text-xl'>Engly</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className='px-1.5 md:px-0'>
              <SidebarMenu>
                {navMain.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        if (!item.disabled) {
                          if (item.onClick) {
                            item.onClick()
                          } else {
                            setActiveItem(item)
                          }
                        }
                      }}
                      isActive={activeItem.title === item.title}
                      className={cn(
                        'flex items-center justify-center px-2.5 md:px-2',
                        item.disabled && 'pointer-events-none opacity-40',
                      )}
                    >
                      <item.icon className='!h-[26px] !w-[26px]' strokeWidth={1.5} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={{ children: t('sidebar.settings'), hidden: false }}
                className='pointer-events-none flex items-center justify-center px-2.5 opacity-40'
              >
                <Settings className='!h-[26px] !w-[26px]' strokeWidth={1.5} />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={{ children: t('sidebar.logout'), hidden: false }}
                onClick={logout}
                className='flex items-center justify-center px-2.5'
              >
                <LogOut className='!h-[26px] !w-[26px]' strokeWidth={1.5} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>

      {isOpen && (
        <div className='flex w-full flex-col transition-all duration-300'>
          <SidebarHeader className='gap-4 border-b bg-white p-6 shadow-sm'>
            <div className='flex w-full flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <button 
                    className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 hover:shadow-md'
                    onClick={() => setIsOpen(false)}
                    aria-label='Hide room list'
                  >
                    <ChevronLeft size={18} className='text-gray-600' />
                  </button>
                  <button className='md:hidden' onClick={() => setShowRail(!showRail)}>
                    <AlignJustify />
                  </button>
                  <div className='text-2xl font-semibold text-foreground md:text-3xl'>
                    {activeItem.title}
                  </div>
                </div>

              <Button 
                onClick={() => onOpenModal(slugValue)}
                size='sm'
                className='rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:scale-105'
              >
                {t('chatPage.newChatFull')}
              </Button>
            </div>

            <div className='flex items-center gap-2'>
              <div className='relative flex-1'>
                <SidebarInput
                  placeholder={t('sidebar.search')}
                  icon={<Search size={16} className='text-gray-400' />}
                  value={search}
                  onChange={e => {
                    const value = e.target.value
                    setSearch(value)
                    debouncedUpdate(value)
                  }}
                  className='h-10 rounded-full border-gray-200 bg-white pl-10 pr-4 text-sm shadow-sm transition-all placeholder:text-gray-400 hover:shadow-md focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                />
              </div>
              <button
                className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-md hover:scale-105'
                aria-label='Filter'
              >
                <ListFilter size={16} className='text-gray-600' />
              </button>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className='px-0 py-0'>
            <SidebarGroupContent>
              <ChatList
                chats={chatsToShow}
                isLoading={
                  (debouncedSearch ? isSearchLoading : isLoading) || isFetchingNextPage
                }
                slug={slugValue}
                loadMoreRef={loadMoreRef}
                onChatClick={() => setOpenMobile(false)}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
      )}
      {!isOpen && (
        <button
          className='fixed left-[84px] top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-all hover:bg-gray-50 hover:shadow-lg'
          onClick={() => setIsOpen(true)}
          aria-label='Show room list'
        >
          <ChevronLeft size={14} className='rotate-180 text-gray-600' />
        </button>
      )}
    </Sidebar>
  )
}
