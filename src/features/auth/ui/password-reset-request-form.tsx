'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { CheckIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useDebounceCallback } from 'usehooks-ts'
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

export function PasswordResetRequestForm() {
  const { t } = useTranslation()
  const [emailExists, setEmailExists] = useState<boolean | null>(null)

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema(t)),
    defaultValues: { email: '' },
  })

  const mutation = useMutation({
    mutationFn: (email: string) => authApi.sendResetLink(email),
    onSuccess: () => {
      toast.success(t('auth.reset.successMessage'))
    },
    onError: error => {
      console.error('Error while sending the reset link:', error)
      toast.error(t('errors.unknownError'))
    },
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    const isValid = await form.trigger()
    if (!isValid) return
    if (form.formState.errors.email) return

    mutation.mutate(values.email)
  }

  const debouncedCheckEmail = useDebounceCallback((email: string) => {
    checkEmailExists(email)
  }, 500)

  const checkEmailExists = async (email: string) => {
    const isValid = await form.trigger('email')
    if (!isValid) return

    try {
      const res = await authApi.checkEmail(email)

      if (res.available) {
        form.setError('email', {
          type: 'manual',
          message: t('auth.validation.emailNotFound'),
        })
        setEmailExists(false)
      } else {
        form.clearErrors('email')
        setEmailExists(true)
      }
    } catch (error) {
      console.error('Email check failed:', error)
    }
  }

  return (
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
                      debouncedCheckEmail(e.target.value)
                    }}
                    onBlur={async () => {
                      field.onBlur()
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
        <Button
          type='submit'
          className='w-full'
          disabled={!emailExists || mutation.isPending}
        >
          {t('auth.reset.submit')}
        </Button>
      </form>
    </Form>
  )
}
