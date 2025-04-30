'use client'

import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlertIcon, EyeIcon, EyeOffIcon, MailIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/common/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/common/form'
import { Input } from '@/shared/ui/common/input'
import { appRoutes } from '@/shared/config'
import { cn } from '@/shared/utils'
import { LoginFormSchema, type LoginFormValues } from '../lib'
import { loginData, useLogin } from '../model'
import { Providers } from './providers'

export function LoginForm() {
  const { t } = useTranslation()
  const [visiblePassword, setVisiblePassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema(t)),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const { mutate, isPending } = useLogin()

  const onSubmit = (formData: LoginFormValues) => {
    mutate({ formData })
  }

  return (
    <div className='relative flex h-full flex-col justify-center bg-background px-4 py-12 md:px-6 md:py-14 xl:px-16'>
      <h1 className='mb-4 text-center text-[32px] font-semibold text-foreground sm:text-[40px] md:mb-7 xl:mb-8'>
        {t('login.welcomeBack')}
      </h1>

      <p className='mb-8 text-center text-xl text-foreground'>{t('login.details')}</p>
      <Providers />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-5 xl:space-y-3'>
            {loginData.map(i => (
              <FormField
                key={i.name}
                control={form.control}
                name={i.name}
                render={({ field }) => (
                  <FormItem className='space-y-1 md:space-y-3'>
                    <FormControl>
                      <div className='relative'>
                        {i.name === 'email' && !form.formState.errors[i.name] && (
                          <MailIcon className='absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 stroke-1 text-gray-500' />
                        )}
                        <Input
                          className={cn(
                            'form-input',
                            form.formState.errors[i.name]
                              ? '!border-destructive'
                              : form.formState.touchedFields[i.name] && '!border-success',
                          )}
                          type={
                            i.type === 'password'
                              ? visiblePassword
                                ? 'text'
                                : 'password'
                              : i.type
                          }
                          placeholder={t(i.placeholder)}
                          {...field}
                        />

                        <div className='absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2'>
                          {i.showPasswordToggle && !form.formState.errors[i.name] && (
                            <button
                              type='button'
                              onClick={() => setVisiblePassword(prev => !prev)}
                              className='text-gray-500 hover:text-gray-700'
                              aria-label={
                                visiblePassword ? 'Hide password' : 'Show password'
                              }
                            >
                              {visiblePassword ? (
                                <EyeOffIcon className='h-5 w-5 stroke-1' />
                              ) : (
                                <EyeIcon className='h-5 w-5 stroke-1' />
                              )}
                            </button>
                          )}
                          {form.formState.errors[i.name] && (
                            <CircleAlertIcon className='h-5 w-5 text-destructive' />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className='form-error' />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className='flex justify-end pt-2'>
            <button
              type='button'
              className='text-sm text-muted-foreground opacity-50 transition-colors hover:underline'
              onClick={() => {
                console.log('Forgot password clicked')
              }}
            >
              {t('login.forgotPassword')}
            </button>
          </div>

          <div className='pt-8'>
            <Button type='submit' className={cn('w-full')}>
              {isPending ? t('auth.loading') : t('auth.login')}
            </Button>
          </div>
        </form>
      </Form>

      <p className='mt-6 text-center text-sm/none text-foreground/30 md:text-base/none'>
        {t('auth.dontHaveAccount')}
        <Link href={appRoutes.register} className='ml-1 text-foreground underline'>
          {t('auth.signUp')}
        </Link>
      </p>
    </div>
  )
}
