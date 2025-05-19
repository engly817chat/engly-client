'use client'

import { authApi } from "@/entities/auth"
import { useQueryParams } from "@/shared/hooks/useQueryParams"
import { saveTokenStorage } from "@/shared/utils"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useHandleGoogleCallback() {
  const params = useQueryParams()
  const accessToken = params?.get('access_token')
  const router = useRouter()

  useEffect(() => {
    if (!params) return

    if (accessToken) {
      saveTokenStorage(accessToken)
      authApi
        .isFirstLogin()
        .then(response => {
          if (!response.userExists) {
            router.push('/google-auth/additional-info')
          } else {
            router.push('/')
          }
        })
        .catch(error => {
          console.error('Error checking first login:', error)
          router.push('/login')
        })
    } else {
      router.push('/login')
    }
  }, [params, accessToken, router])
}