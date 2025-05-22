'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import { authApi, useAuth, type LoginRequestDto } from '@/entities/auth'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
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
  const { setUser } = useAuth()
  const queryParams = useQueryParams()

  const redirectPath = queryParams?.get('redirect') || '/'

  const loginMutation = useMutation({
    mutationFn: ({ formData, meta }: LoginMutationParams) =>
      authApi.login(formData, {
        signal: meta?.signal ?? abortController.signal,
      }),
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 401 &&
          error.response?.data?.message === 'Password or email is not correct'
        ) {
          toast.error('Email or password is incorrect')
          return
        }
      }
      toast.error('Something went wrong. Please try again.')
      console.log(error)
    },
    onSuccess: async data => {
      toast.success('Logged in successfully')
      saveTokenStorage(data.access_token)

      try {
        const userData = await authApi.getProfile()
        setUser(userData)
        router.replace(redirectPath)
      } catch (error) {
        console.error('Error fetching user profile', error)
      }
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
