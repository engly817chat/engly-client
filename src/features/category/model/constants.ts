import career_src from '@/shared/assets/icons/career.svg'
import chats_src from '@/shared/assets/icons/chats.svg'
import hobbies_src from '@/shared/assets/icons/hobbies.svg'
import movies_src from '@/shared/assets/icons/movies.svg'
import news_src from '@/shared/assets/icons/news.svg'
import sports_src from '@/shared/assets/icons/sports.svg'
import tech_src from '@/shared/assets/icons/tech.svg'
import travel_src from '@/shared/assets/icons/travel.svg'

export const categories = [
  {
    id: 1,
    title: 'General Chat',
    desc: 'Open discussions about anything',
    count: 18,
    isTop: false,
    iconSrc: chats_src,
  },
  {
    id: 2,
    title: 'News',
    desc: 'Latest updates and discussions',
    count: 100,
    isTop: true,
    iconSrc: news_src,
  },
  {
    id: 3,
    title: 'Sports',
    desc: 'Sports news and discussions',
    count: 12,
    isTop: false,
    iconSrc: sports_src,
  },
  {
    id: 4,
    title: 'Travel & Food',
    desc: 'Adventures, Culinary Delights, and Gastronomic Explorations',
    count: 32,
    isTop: false,
    iconSrc: travel_src,
  },
  {
    id: 5,
    title: 'Tech',
    desc: 'Innovations, Gadgets, and Future Trends',
    count: 26,
    isTop: false,
    iconSrc: tech_src,
  },
  {
    id: 6,
    title: 'Hobbies',
    desc: 'Passions, Pastimes, and Creative Pursuits',
    count: 54,
    isTop: false,
    iconSrc: hobbies_src,
  },
  {
    id: 7,
    title: 'Career',
    desc: 'Growth, Opportunities, and Professional Insights',
    count: 88,
    isTop: false,
    iconSrc: career_src,
  },
  {
    id: 8,
    title: 'Movies',
    desc: 'Reviews, Discussions, and Cinematic Experiences',
    count: 49,
    isTop: false,
    iconSrc: movies_src,
  },
] as const
