'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { authApi, type RegisterRequestDto } from '@/entities/auth'
import { saveTokenStorage } from '@/shared/utils'
import { useRouter } from 'next/navigation'
import { appRoutes } from '@/shared/config'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

export interface RegisterMutationParams {
  formData: RegisterRequestDto
  meta?: {
    redirectUrl?: string
    signal?: AbortSignal
  }
}

export function useRegister() {
  const router = useRouter()
  const abortController = new AbortController()
  const { t } = useTranslation()

  const registerMutation = useMutation({
    mutationFn: ({ formData, meta }: RegisterMutationParams) =>
      authApi.register(formData, {
        signal: meta?.signal ?? abortController.signal,
      }),
    onError: async error => {
      if (axios.isAxiosError(error) && error.response?.data?.message === 'User Already Exist') {
        toast.error(t('auth.userExists'));
      } else {
        toast.error(t('auth.unknownError'))
        console.log(error)
      }
    },
    onSuccess: async data => {
      toast.success(t('auth.success'))
      saveTokenStorage(data.access_token)
      console.log(data)
      router.push(appRoutes.chats)
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
