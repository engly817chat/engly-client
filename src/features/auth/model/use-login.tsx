'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { authApi, type LoginRequestDto } from '@/entities/auth'
import { appRoutes } from '@/shared/config'
import { saveTokenStorage } from '@/shared/utils'

export interface LoginMutationParams {
  formData: LoginRequestDto
  meta?: {
    redirectUrl?: string
    signal?: AbortSignal
  }
}

export function useLogin() {
  const abortController = new AbortController()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: ({ formData, meta }: LoginMutationParams) =>
      authApi.login(formData, {
        signal: meta?.signal ?? abortController.signal,
      }),
    onError: async error => {
      toast.error('Something went wrong. Please try again.')
      console.log(error)
    },
    onSuccess: async data => {
      toast.success('Logged in successfully')
      saveTokenStorage(data.access_token)
      console.log(data)
      router.push(appRoutes.chats)
    },
    // onSettled: async (data, error, variables, context) => {},
  })

  return {
    data: loginMutation.data,
    error: loginMutation.error,
    isPending: loginMutation.isPending,
    mutate: loginMutation.mutate,
  }
}
