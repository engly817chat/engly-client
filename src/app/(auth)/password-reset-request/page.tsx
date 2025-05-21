'use client'

import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ResetPasswordSchema, ResetPasswordValues } from '@/features/auth'
import { authApi } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/common/form'
import { Input } from '@/shared/ui/common/input'
import { CircleAlertIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils'

export default function PasswordResetRequestPage() {
  const [success, setSuccess] = useState(false)
  const { t } = useTranslation()

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema(t)),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      await authApi.sendResetLink(values.email)
      setSuccess(true)
    } catch (error) {
      console.error('Error while sending the reset link:', error)
    }
  }

  return (
    <div className='flex h-full items-center justify-center bg-background'>
      <div className='w-full max-w-md p-6'>
        <h1 className='mb-6 text-center text-3xl font-semibold text-foreground'>
          {t('auth.reset.title')}
        </h1>
        <p className='mb-6 text-center text-muted'>{t('auth.reset.subtitle')}</p>
        {success ? (
          <p className='text-success'>{t('auth.reset.successMessage')}</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='form-label required' htmlFor='email'>
                      {t('auth.reset.email')}
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          id='email'
                          type='email'
                          placeholder={t('auth.reset.placeholder')}
                          className={cn(
                            'form-input',
                            form.formState.errors.email
                              ? '!border-destructive'
                              : form.formState.touchedFields.email && '!border-success',
                          )}
                          {...field}
                          onChange={async e => {
                            field.onChange(e)
                            await form.trigger('email')
                          }}
                        />

                        <div className='absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2'>
                          {form.formState.errors.email && (
                            <CircleAlertIcon className='text-destructive' />
                          )}
                          {!form.formState.errors.email &&
                            form.formState.touchedFields.email && (
                              <CheckIcon className='text-foreground' />
                            )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className='form-error' />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                {t('auth.reset.submit')}
              </Button>
            </form>
          </Form>
        )}
        <p className='mt-6 text-center text-sm/none text-foreground/40 md:text-base/none'>
          <Link href='/login' className='inline-flex items-center justify-center gap-1'>
            <ArrowLeft className='h-4 w-4' />
            <span>{t('auth.reset.back')}</span>
          </Link>
        </p>
      </div>
    </div>
  )
}
