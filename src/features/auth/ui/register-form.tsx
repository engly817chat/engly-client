'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/common/button'
import { Form } from '@/shared/ui/common/form'
import { cn, excludeProperties } from '@/shared/utils'
import { RegisterFormSchema, validatePasswords, type RegisterFormValues } from '../lib'
import { RegisterStepEnum, useRegister, type RegisterStepType } from '../model'
import { Providers } from './providers'
import { StepBar } from './step-bar'
import { StepCredentials } from './step-credentials'
import { StepProfile } from './step-profile'

export function RegisterForm() {
  const [step, setStep] = useState<RegisterStepType>(RegisterStepEnum.Credentials)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      password: 'VmaP_NZOBp#HF2LM7Ks?cSsyLc?@vq',
      confirm: 'VmaP_NZOBp#HF2LM7Ks?cSsyLc?@vq',
      nativeLanguage: undefined,
      englishLevel: undefined,
      gender: undefined,
      goals: 'DEFAULT',
    },
  })

  const { mutate, isPending } = useRegister()

  const onContinue = async () => {
    const isValid = await form.trigger(['username', 'email', 'password', 'confirm'])

    if (!validatePasswords(form)) return

    if (isValid) {
      setStep(RegisterStepEnum.Profile)
    }
  }

  const onSubmit = (data: RegisterFormValues) => {
    const formData = excludeProperties(data, ['confirm'])
    mutate({ formData })
  }

  return (
    <div className='relative h-full bg-background px-4 py-12 md:px-6 md:py-14 xl:px-16'>
      <Button
        variant='link'
        onClick={() => setStep(RegisterStepEnum.Credentials)}
        className={cn(
          'absolute left-0 top-1 text-foreground md:left-2 md:top-2 xl:left-12 xl:top-3',
          step === RegisterStepEnum.Credentials && 'hidden',
        )}
      >
        <ArrowLeftIcon />
      </Button>

      <StepBar step={step} className='mb-5 md:mb-10 xl:mb-5' />

      <h1 className='xl:text-4xl/[ 43.88px] mb-10 text-center text-2xl/[29.26px] font-bold md:mb-4 md:text-[32px]/[39.01px] xl:mb-3'>
        Registration
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === RegisterStepEnum.Credentials && <StepCredentials form={form} />}

          {step === RegisterStepEnum.Profile && <StepProfile form={form} />}

          <div className='pt-8'>
            {step === RegisterStepEnum.Credentials && (
              <Button type='button' onClick={onContinue} className='w-full'>
                Continue
              </Button>
            )}
            {step === RegisterStepEnum.Profile && (
              <Button type='submit' className={cn('w-full')}>
                {isPending ? 'Creating...' : 'Create account'}
              </Button>
            )}
          </div>
        </form>
      </Form>

      <Providers />
    </div>
  )
}
