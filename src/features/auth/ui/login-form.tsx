'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlertIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
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
import { cn } from '@/shared/utils'
import { LoginFormSchema, type LoginFormValues } from '../lib'
import { loginData, useLogin } from '../model'
import { Providers } from './providers'

export function LoginForm() {
  const [visiblePassword, setVisiblePassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: 'userrr@gmail.com',
      password: 'VmaP_NZOBp#HF2LM7Ks',
    },
  })

  const { mutate, isPending } = useLogin()

  const onSubmit = (formData: LoginFormValues) => {
    mutate({ formData })
  }

  return (
    <div className='relative h-full bg-background px-4 py-12 md:px-6 md:py-14 xl:px-16'>
      <h1 className='xl:text-4xl/[ 43.88px] mb-10 text-center text-2xl/[29.26px] font-bold md:mb-4 md:text-[32px]/[39.01px] xl:mb-3'>
        Login
      </h1>

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
                    <FormLabel className='form-label required'>{i.label}</FormLabel>
                    <FormControl>
                      <div className='relative'>
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
                          placeholder={i.placeholder}
                          {...field}
                        />

                        <div className='absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2'>
                          {i.showPasswordToggle && (
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
                            <CircleAlertIcon className='text-destructive' />
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
          <div className='pt-8'>
            <Button type='submit' className={cn('w-full')}>
              {isPending ? 'Loading...' : 'Login'}
            </Button>
          </div>
        </form>
      </Form>

      <Providers />
    </div>
  )
}
