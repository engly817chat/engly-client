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
import { Textarea } from '@/shared/ui/common/textarea'
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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      <div className='relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl'>
        <button
          onClick={onClose}
          className='absolute right-5 top-5 text-gray-400 transition-colors hover:text-gray-700'
          aria-label={t('common.close')}
        >
          <X size={24} />
        </button>

        <div className='mb-6 text-center'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {t('chatPage.createChat')}
          </h2>
          <p className='text-sm text-gray-500'>
            Start a new conversation in the {categorySlug} category.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t('chatPage.headerPlaceholder')}
                      {...field}
                      className='w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-3 text-sm transition focus:border-blue-500 focus:ring-blue-500'
                    />
                  </FormControl>
                  <FormMessage className='mt-1 text-xs text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder={t('chatPage.descriptionPlaceholder')}
                      {...field}
                      className='w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-3 text-sm transition focus:border-blue-500 focus:ring-blue-500'
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage className='mt-1 text-xs text-red-500' />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              disabled={createChatMutation.isPending}
            >
              {createChatMutation.isPending
                ? t('common.creating')
                : t('chatPage.create')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
