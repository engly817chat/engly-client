import { axiosBase, axiosWithAuth } from '@/shared/api'
import { TokenTypeEnum } from '@/shared/constants'
import type { SignalOptions } from '@/shared/types'
import type {
  AuthResponse,
  AvailableResponse,
  LoginRequestDto,
  RegisterRequestDto,
  GoogleRegisterRequest,
  FirstLoginResponse
} from './types'

const endpoints = {
  register: '/sign-up',
  login: '/sign-in',
  checkUsername: '/valid/check-username?username=',
  refreshToken: '/refresh-token',
  saveGoogleInfo: '/api/addition_info/for-google',
  firstLogin: '/valid/first-login',
  sendVerification: '/api/notify',
  confirmEmail: '/api/notify/check',
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

  sendVerificationEmail: async (accessToken: string): Promise<void> => {
    await axiosBase.post(
      endpoints.sendVerification,
      {},
      {
        headers: {
          Authorization: `${TokenTypeEnum.Bearer} ${accessToken}`,
        },
      },
    )
  },

  confirmEmail: async (email: string, token: string, accessToken: string | null) => {
    const response = await axiosBase.get<AuthResponse>(endpoints.confirmEmail, {
      params: { email, token },
      headers: {
        Authorization: `${TokenTypeEnum.Bearer} ${accessToken}`,
      },
    })

    return response.data
  },

  logout: async (): Promise<void> => {
    // TODO: Implement logout logic
  },

  saveGoogleInfo: async (
    data: GoogleRegisterRequest
  ): Promise<void> => {
    await axiosWithAuth.post(endpoints.saveGoogleInfo, data)
  },

  isFirstLogin: async (): Promise<FirstLoginResponse> => {
    const response = await axiosWithAuth.get(endpoints.firstLogin)
    return response.data 
  },
} as const
