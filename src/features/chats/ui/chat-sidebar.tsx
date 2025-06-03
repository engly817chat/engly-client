'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
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
import { ChatList } from '@/features/chats/ui'
import { useAuth } from '@/entities/auth'
import { Chat, chatsApi } from '@/entities/chats'
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
  SidebarTrigger,
  useSidebar,
} from '@/shared/ui/common/sidebar'
import { Sheet, SheetContent } from '../../../shared/ui/common/sheet'

const data = {
  navMain: [
    {
      title: 'Messages',
      url: '#',
      icon: MessageSquare,
      isActive: true,
    },
    {
      title: 'Users',
      url: '#',
      icon: Users,
      isActive: false,
    },
    {
      title: 'Bell',
      url: '#',
      icon: Bell,
      isActive: false,
    },
    {
      title: 'User',
      url: '#',
      icon: UserRound,
      isActive: false,
    },
    {
      title: 'Alert',
      url: '#',
      icon: CircleAlert,
      isActive: false,
    },
  ],
}

export function ChatSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = useState(data.navMain[0])
  const { setOpen } = useSidebar()
  const { logout } = useAuth()
  const params = useParams()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const slug = params.slug ?? ''
  const slugValue = Array.isArray(slug) ? slug[0] : (slug ?? '')
  const { isMobile, openMobile, setOpenMobile } = useSidebar()
  

  useEffect(() => {
    const fetchChats = async () => {
      if (!slugValue) return
      setIsLoading(true)

      try {
        const data = await chatsApi.getChatsByCategory(slugValue.toUpperCase())
        const rooms = data._embedded?.roomsDtoList || []
        setChats(rooms)
      } catch (error) {
        console.error('Error fetching chats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()
  }, [slugValue])

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side='left'
          className='w-full max-w-[668px] overflow-auto bg-sidebar p-0 text-sidebar-foreground'
        >
          <div className='flex h-full w-full flex-row'>
            <Sidebar
              collapsible='none'
              className='!w-[72px] border-r bg-sidebar-primary-foreground'
            >
              <SidebarHeader>
                {/* <SidebarTrigger className='-ml-1' /> */}

                <Link href='/' className='mb-2 mt-4 font-bold'>
                  <span className='text-[20px]'>Engly</span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent className='px-1.5 md:px-0'>
                    <SidebarMenu>
                      {data.navMain.map(item => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            tooltip={{
                              children: item.title,
                              hidden: false,
                            }}
                            onClick={() => {
                              setActiveItem(item)
                              setOpen(true)
                            }}
                            isActive={activeItem.title === item.title}
                            className='flex items-center justify-center px-2.5 md:px-2'
                          >
                            <item.icon
                              className='!h-[26px] !w-[26px]'
                              strokeWidth={1.5}
                            />
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
                      tooltip={{ children: 'Settings', hidden: false }}
                      className='flex items-center justify-center px-2.5'
                    >
                      <Settings className='!h-[26px] !w-[26px]' strokeWidth={1.5} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip={{ children: 'Logout', hidden: false }}
                      onClick={logout}
                      className='flex items-center justify-center px-2.5'
                    >
                      <LogOut className='!h-[26px] !w-[26px]' strokeWidth={1.5} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            <Sidebar collapsible='none' className='flex-1'>
              <SidebarHeader className='gap-3.5 border-b p-4'>
                <div className='flex w-full flex-col gap-5'>
                  <div className='text-[24px] font-medium text-foreground md:text-4xl'>
                    {activeItem.title}
                  </div>

                  <div className='flex flex-wrap items-center gap-2'>
                    {['All', 'Unread', 'Groups', 'Archived'].map(label => (
                      <button
                        key={label}
                        className='rounded-full border border-sidebar-foreground bg-sidebar-accent-foreground px-4 font-medium text-foreground'
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className='flex items-center gap-2'>
                    <div className='flex-1'>
                      <SidebarInput placeholder='Search' icon={<Search size={20} />} />
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
                    <ChatList chats={chats} isLoading={isLoading} slug={slugValue} />
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sidebar
      collapsible='icon'
      className='overflow-hidden [&>[data-sidebar=sidebar]]:flex-row'
      {...props}
    >
      <Sidebar
        collapsible='none'
        className='!w-[72px] border-r bg-sidebar-primary-foreground'
      >
        <SidebarHeader>
          <Link href='/' className='mb-2 mt-4 font-bold'>
            <span className='text-[20px]'>Engly</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className='px-1.5 md:px-0'>
              <SidebarMenu>
                {data.navMain.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                      }}
                      isActive={activeItem.title === item.title}
                      className='flex items-center justify-center px-2.5 md:px-2'
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
                tooltip={{ children: 'Settings', hidden: false }}
                className='flex items-center justify-center px-2.5'
              >
                <Settings className='!h-[26px] !w-[26px]' strokeWidth={1.5} />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={{ children: 'Logout', hidden: false }}
                onClick={logout}
                className='flex items-center justify-center px-2.5'
              >
                <LogOut className='!h-[26px] !w-[26px]' strokeWidth={1.5} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible='none' className='hidden flex-1 md768:flex'>
        <SidebarHeader className='gap-3.5 border-b p-4'>
          <div className='flex w-full flex-col gap-5'>
            <div className='text-[24px] font-medium text-foreground md:text-4xl'>
              {activeItem.title}
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              {['All', 'Unread', 'Groups', 'Archived'].map(label => (
                <button
                  key={label}
                  className='rounded-full border border-sidebar-foreground bg-sidebar-accent-foreground px-4 font-medium text-foreground'
                >
                  {label}
                </button>
              ))}
            </div>

            <div className='flex items-center gap-2'>
              <div className='flex-1'>
                <SidebarInput placeholder='Search' icon={<Search size={20} />} />
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
              <ChatList chats={chats} isLoading={isLoading} slug={slugValue} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
