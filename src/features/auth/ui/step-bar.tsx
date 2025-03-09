import { Separator } from '@/shared/ui/common/separator'
import { cn } from '@/shared/utils'
import { RegisterStepEnum, type RegisterStepType } from '../model'

interface StepBarProps {
  step: RegisterStepType
  className?: string
}
export const StepBar = ({ step, className }: StepBarProps) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className='flex size-3 rounded-full border border-primary bg-primary' />
      <Separator orientation='horizontal' className='h-px flex-1 bg-black/15' />
      <div
        className={cn(
          'flex size-3 rounded-full border border-black bg-secondary',
          step === RegisterStepEnum.Profile && 'border-primary bg-primary',
        )}
      />
    </div>
  )
}
