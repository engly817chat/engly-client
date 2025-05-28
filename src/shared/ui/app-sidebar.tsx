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
import { Chat } from '@/features/chats/model/types'
import { ChatList } from '@/features/chats/ui'
import { useAuth } from '@/entities/auth'
import { chatsApi } from '@/entities/chats'
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
import { Sheet, SheetContent } from './common/sheet'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
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
  mails: [
    {
      name: 'William Smith',
      email: 'williamsmith@example.com',
      subject: 'Meeting Tomorrow',
      date: '09:34 AM',
      teaser:
        'Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.',
    },
    {
      name: 'Alice Smith',
      email: 'alicesmith@example.com',
      subject: 'Re: Project Update',
      date: 'Yesterday',
      teaser:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      name: 'Bob Johnson',
      email: 'bobjohnson@example.com',
      subject: 'Weekend Plans',
      date: '2 days ago',
      teaser:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      name: 'Emily Davis',
      email: 'emilydavis@example.com',
      subject: 'Re: Question about Budget',
      date: '2 days ago',
      teaser:
        "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
      name: 'Michael Wilson',
      email: 'michaelwilson@example.com',
      subject: 'Important Announcement',
      date: '1 week ago',
      teaser:
        "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    },
    {
      name: 'Sarah Brown',
      email: 'sarahbrown@example.com',
      subject: 'Re: Feedback on Proposal',
      date: '1 week ago',
      teaser:
        "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
    },
    {
      name: 'David Lee',
      email: 'davidlee@example.com',
      subject: 'New Project Idea',
      date: '1 week ago',
      teaser:
        "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
    },
    {
      name: 'Olivia Wilson',
      email: 'oliviawilson@example.com',
      subject: 'Vacation Plans',
      date: '1 week ago',
      teaser:
        "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
    },
    {
      name: 'James Martin',
      email: 'jamesmartin@example.com',
      subject: 'Re: Conference Registration',
      date: '1 week ago',
      teaser:
        "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
    },
    {
      name: 'Sophia White',
      email: 'sophiawhite@example.com',
      subject: 'Team Dinner',
      date: '1 week ago',
      teaser:
        "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        console.log(data)
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

      <Sidebar collapsible='none' className='md768:flex hidden flex-1'>
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
