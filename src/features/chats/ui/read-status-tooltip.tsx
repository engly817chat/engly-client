import * as Tooltip from '@radix-ui/react-tooltip'
import { CheckCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reader } from '@/entities/chats'

interface ReadStatusTooltipProps {
  readers: Reader[] | undefined
}

export const ReadStatusTooltip = ({ readers }: ReadStatusTooltipProps) => {
  const isRead = readers && readers.length > 0
  const { t } = useTranslation()

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div>
            <CheckCheck
              className={isRead ? 'text-white' : 'text-gray-400'}
              size={14}
              strokeWidth={1.5}
            />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side='top'
            className='animate-fade-in z-50 rounded-md bg-white px-4 py-2 text-sm text-gray-800 shadow-lg ring-1 ring-gray-200'
          >
            {isRead
              ? t('readStatusTooltip.read', { users: readers.map(r => r.username).join(', ') })
              : t('readStatusTooltip.unread')}
            <Tooltip.Arrow className='fill-white' />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
