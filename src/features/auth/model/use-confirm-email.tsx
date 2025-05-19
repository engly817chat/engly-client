'use client'

import { authApi, useAuth } from "@/entities/auth"
import { saveTokenStorage } from "@/shared/utils"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from 'next/navigation'

export function useConfirmEmail() {
  const router = useRouter()
  const { setUser } = useAuth()

  const confirmEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await authApi.confirmEmail(token)
      if (res.access_token) {
        saveTokenStorage(res.access_token)
        const userData = await authApi.getProfile()
        setUser(userData)
      }
      return res
    },
    onSuccess: () => {
      setTimeout(() => router.push('/'), 3000)
    },
    onError: error => {
      console.error('Email confirmation failed:', error)
    },
  })

  return confirmEmailMutation
}