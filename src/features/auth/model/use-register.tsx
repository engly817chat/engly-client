'use client'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
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

export function useRegister({
  setIsModalOpen,
}: {
  setIsModalOpen: (value: boolean) => void
}) {
  const abortController = new AbortController()
  const { t } = useTranslation()

  const registerMutation = useMutation({
    mutationFn: ({ formData, meta }: RegisterMutationParams) =>
      authApi.register(formData, {
        signal: meta?.signal ?? abortController.signal,
      }),
    onError: async error => {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.message === 'User Already Exist'
      ) {
        toast.error(t('auth.userExists'))
      } else {
        toast.error(t('auth.unknownError'))
        console.log(error)
      }
    },
    onSuccess: async data => {
      toast.success(t('auth.success'))
      saveTokenStorage(data.access_token)

      try {
        await authApi.sendVerificationEmail(data.access_token)
        setIsModalOpen(true)
      } catch (notifyError) {
        console.error('Error sending email:', notifyError)
      }

      console.log(data)
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
