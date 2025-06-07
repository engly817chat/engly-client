'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { chatsApi } from '@/entities/chats'
import { Button } from '@/shared/ui/common/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/common/form'
import { Input } from '@/shared/ui/common/input'
import { CreateChatFormValues, CreateChatSchema } from '../lib/schema'

export function CreateChatModal({
  onClose,
  categorySlug,
}: {
  onClose: () => void
  categorySlug: string
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const form = useForm<CreateChatFormValues>({
    resolver: zodResolver(CreateChatSchema(t)),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onBlur',
  })

  const createChatMutation = useMutation({
    mutationFn: (data: CreateChatFormValues) =>
      chatsApi.createNewChat(
        categorySlug.toUpperCase(),
        data.name,
        data.description || '',
      ),
    onError: (error: unknown) => {
      console.error('Error creating chat:', error)
      toast.error(t('chatPage.chatCreatedError'))
    },
    onSuccess: () => {
      toast.success(t('chatPage.chatCreatedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['chats', categorySlug] })
      onClose()
    },
  })

  const onSubmit = (data: CreateChatFormValues) => {
    createChatMutation.mutate(data)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='relative w-full max-w-md rounded-lg bg-white px-9 py-6 shadow-lg'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-gray-500 transition hover:text-gray-800'
          aria-label={t('common.close')}
        >
          <X size={20} />
        </button>

        <h2 className='mb-4 text-center text-2xl font-medium'>
          {t('chatPage.createChat')}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={t('chatPage.headerPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage className='text-sm text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder={t('chatPage.descriptionPlaceholder')}
                      className='w-full resize-none rounded-md border border-input bg-background p-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage className='text-sm text-red-500' />
                </FormItem>
              )}
            />

            <div className='flex justify-center pt-2'>
              <Button type='submit'>{t('chatPage.create')}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
