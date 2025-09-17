'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  AlignJustify,
  Bell,
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

export function ChatSidebar({ onOpenModal }: { onOpenModal: (slug: string) => void }) {
  const { t } = useTranslation()

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
        disabled: true,
      },
      {
        title: t('sidebar.alert'),
        url: '#',
        icon: CircleAlert,
        isActive: false,
        disabled: true,
      },
    ],
    [t],
  )
  const [activeItem, setActiveItem] = useState(navMain[0])
  const { showRail, setShowRail, setOpenMobile } = useSidebar()
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
    <Sidebar>
      <div className='flex h-full w-[72px] flex-col items-center justify-between px-2 py-4'>
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
                      onClick={() => !item.disabled && setActiveItem(item)}
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

      <div className='flex w-full flex-col'>
        <SidebarHeader className='gap-3.5 border-b p-5'>
          <div className='flex w-full flex-col gap-5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <button className='md:hidden' onClick={() => setShowRail(!showRail)}>
                  <AlignJustify />
                </button>
                <div className='text-[24px] font-medium text-foreground md:text-4xl'>
                  {activeItem.title}
                </div>
              </div>

              <Button onClick={() => onOpenModal(slugValue)}>
                {t('chatPage.newChatFull')}
              </Button>
            </div>

            <div className='flex items-center gap-2.5'>
              <div className='flex-1'>
                <SidebarInput
                  placeholder={t('sidebar.search')}
                  icon={<Search size={20} />}
                  value={search}
                  onChange={e => {
                    const value = e.target.value
                    setSearch(value)
                    debouncedUpdate(value)
                  }}
                />
              </div>
              <button
                className='rounded-md border border-sidebar-foreground bg-sidebar-accent-foreground px-5 py-[17px]'
                aria-label='Filter'
              >
                <ListFilter size={16} />
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
    </Sidebar>
  )
}
