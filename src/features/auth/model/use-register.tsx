'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { authApi, type RegisterRequestDto } from '@/entities/auth'
import { saveTokenStorage } from '@/shared/utils'

export interface RegisterMutationParams {
  formData: RegisterRequestDto
  meta?: {
    redirectUrl?: string
    signal?: AbortSignal
  }
}

export function useRegister() {
  const abortController = new AbortController()

  const registerMutation = useMutation({
    mutationFn: ({ formData, meta }: RegisterMutationParams) =>
      authApi.register(formData, {
        signal: meta?.signal ?? abortController.signal,
      }),
    onError: async error => {
      toast.error('Something went wrong. Please try again.')
      console.log(error)
    },
    onSuccess: async data => {
      toast.success('User registered successfully.')
      saveTokenStorage(data.access_token)
      console.log(data)
      // router.push(AppRoutes.chats)
    },
    // onSettled: async (data, error, variables, context) => {},
  })

  return {
    data: registerMutation.data,
    error: registerMutation.error,
    isPending: registerMutation.isPending,
    mutate: registerMutation.mutate,
  }
}
