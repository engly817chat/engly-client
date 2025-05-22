'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { SetNewPasswordSchema, SetNewPasswordValues } from '@/features/auth'
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

export function SetNewPasswordForm({ token }: { token: string | null }) {
  const { t } = useTranslation()
  const router = useRouter()

  const [visibleFields, setVisibleFields] = useState<
    Record<'password' | 'confirm', boolean>
  >({
    password: false,
    confirm: false,
  })

  const [validFields, setValidFields] = useState<Record<'password' | 'confirm', boolean>>(
    {
      password: false,
      confirm: false,
    },
  )

  const form = useForm<SetNewPasswordValues>({
    resolver: zodResolver(SetNewPasswordSchema(t)),
    defaultValues: {
      password: '',
      confirm: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: SetNewPasswordValues) =>
      authApi.setNewPassword(data.password, token || ''),
    onSuccess: () => {
      toast.success(t('auth.reset.newPasswordSuccess'))
      router.push('/login')
    },
    onError: error => {
      console.error('Password reset error:', error)
      toast.error(t('errors.unknownError'))
    },
  })

  const onSubmit = async (values: SetNewPasswordValues) => {
    const isValid = await form.trigger()
    if (!isValid) return
    mutation.mutate(values)
  }

  const toggleVisibility = (field: 'password' | 'confirm') => {
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className='space-y-4'>
        {(['password', 'confirm'] as const).map(fieldName => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='form-label required' htmlFor={fieldName}>
                  {t(
                    `auth.reset.newPassword${fieldName === 'password' ? 'Label' : 'ConfirmLabel'}`,
                  )}
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      id={fieldName}
                      type={visibleFields[fieldName] ? 'text' : 'password'}
                      placeholder={t(
                        `auth.reset.newPassword${fieldName === 'password' ? 'Placeholder' : 'ConfirmPlaceholder'}`,
                      )}
                      className={cn(
                        'form-input',
                        form.formState.errors[fieldName]
                          ? '!border-destructive'
                          : validFields[fieldName] && '!border-success',
                      )}
                      {...field}
                      onChange={async e => {
                        field.onChange(e)
                        const valid = await form.trigger(fieldName)
                        setValidFields(prev => ({ ...prev, [fieldName]: valid }))
                      }}
                    />
                    <div className='absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => toggleVisibility(fieldName)}
                        className='text-gray-500 hover:text-gray-700'
                        aria-label={
                          visibleFields[fieldName] ? 'Скрыть пароль' : 'Показать пароль'
                        }
                      >
                        {visibleFields[fieldName] ? (
                          <EyeOffIcon className='h-5 w-5 stroke-1' />
                        ) : (
                          <EyeIcon className='h-5 w-5 stroke-1' />
                        )}
                      </button>
                      {form.formState.errors[fieldName] && (
                        <CircleAlertIcon className='text-destructive' />
                      )}
                      {validFields[fieldName] && !form.formState.errors[fieldName] && (
                        <CheckIcon className='text-foreground' />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className='form-error' />
              </FormItem>
            )}
          />
        ))}

        <Button
          type='submit'
          className='w-full'
          disabled={!validFields.password || !validFields.confirm || mutation.isPending}
        >
          {t('auth.reset.newPasswordSubmit')}
        </Button>
      </form>
    </Form>
  )
}
