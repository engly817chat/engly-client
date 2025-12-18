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

  const formatCategoryName = (slug: string) => {
    return slug
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md'>
      <div className='relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-200'>
        <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl ring-1 ring-gray-200'>
          <button
            onClick={onClose}
            className='absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-700 hover:scale-110'
            aria-label={t('common.close')}
          >
            <X size={18} />
          </button>

          <div className='mb-8'>
            <div className='mb-2 inline-flex rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1.5'>
              <span className='text-xs font-semibold text-white'>{formatCategoryName(categorySlug)}</span>
            </div>
            <h2 className='text-3xl font-bold text-gray-900'>
              {t('chatPage.createChat')}
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Start a new conversation and connect with others
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('chatPage.headerPlaceholder')}
                        {...field}
                        className='h-12 rounded-xl border-gray-200 bg-white px-4 text-sm shadow-sm transition-all focus:border-blue-400 focus:shadow-md focus:ring-2 focus:ring-blue-100'
                      />
                    </FormControl>
                    <FormMessage className='mt-2 text-xs text-red-500' />
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
                        className='min-h-[100px] rounded-xl border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-blue-400 focus:shadow-md focus:ring-2 focus:ring-blue-100'
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage className='mt-2 text-xs text-red-500' />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='h-12 w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:hover:scale-100'
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
    </div>
  )
}
