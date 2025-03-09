import { axiosBase } from '@/shared/api'
import { TokenTypeEnum } from '@/shared/constants'
import type { SignalOptions } from '@/shared/types'
import type {
  AuthResponse,
  AvailableResponse,
  LoginRequestDto,
  RegisterRequestDto,
} from './types'

const endpoints = {
  register: '/sign-up',
  login: '/sign-in',
  checkUsername: '/check-username?username=',
  refreshToken: '/refresh-token',
} as const

export const authApi = {
  register: async (
    data: RegisterRequestDto,
    { signal }: SignalOptions,
  ): Promise<AuthResponse> => {
    const response = await axiosBase.post<AuthResponse>(
      endpoints.register,
      { ...data, dateOfBirth: '2025-02-19' },
      {
        signal,
      },
    )

    return response.data
  },

  login: async (
    data: LoginRequestDto,
    { signal }: SignalOptions,
  ): Promise<AuthResponse> => {
    const encodedCredentials = btoa(`${data.email}:${data.password}`)

    const response = await axiosBase.post<AuthResponse>(
      endpoints.login,
      {},
      {
        signal,
        headers: {
          Authorization: `${TokenTypeEnum.Basic} ${encodedCredentials}`,
        },
      },
    )

    return response.data
  },

  refreshTokens: async (): Promise<AuthResponse> => {
    const response = await axiosBase.post<AuthResponse>(
      endpoints.refreshToken,
      {},
      {
        headers: {
          // TODO: Implement getRefreshToken() method
          // Authorization: `Bearer ${getRefreshToken()}`,
        },
      },
    )

    return response.data
  },

  checkUsername: async (username: string): Promise<AvailableResponse> => {
    const response = await axiosBase.get<AvailableResponse>(
      `${endpoints.checkUsername}${username}`,
    )

    return response.data
  },

  logout: async (): Promise<void> => {
    // TODO: Implement logout logic
  },
} as const
