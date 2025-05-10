import { axiosBase } from '@/shared/api'
import { saveTokenStorage } from '@/shared/utils'

interface AuthResponse {
  access_token: string
}

export const refreshTokens = async (): Promise<AuthResponse> => {
  const response = await axiosBase.post<AuthResponse>('/refresh-token', {})
  const { access_token } = response.data

  if (access_token) {
    saveTokenStorage(access_token)
  }

  return response.data
}
