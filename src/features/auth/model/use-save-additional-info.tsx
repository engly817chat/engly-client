'use client'

import { authApi, useAuth } from "@/entities/auth"
import { saveTokenStorage } from "@/shared/utils"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

export function useSaveAdditionalInfo () {
	  const { t } = useTranslation()
  const { setUser } = useAuth()

	return useMutation({
		mutationFn: authApi.saveGoogleInfo,
		onSuccess: async (data) => {
			if(data.access_token) {
				saveTokenStorage(data.access_token)
				const user = await authApi.getProfile()
				setUser(user)
			}
			toast.success(t('auth.success'))
		},
		 onError: (error) => {
      console.error('Failed to save additional info:', error)
      toast.error(t('errors.unknownError'))
    },
	})
}