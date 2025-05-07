'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { authApi, useAuth, type LoginRequestDto } from '@/entities/auth'
import { saveTokenStorage } from '@/shared/utils'
import { useEffect, useState } from 'react'

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
  const [redirectPath, setRedirectPath] = useState('/')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setRedirectPath(params.get('redirect') || '/')
    }
  }, [])

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

      try {
        const userData = await authApi.getProfile()
        setUser(userData)
        router.push(redirectPath)
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
