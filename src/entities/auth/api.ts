import { axiosBase, axiosWithAuth } from '@/shared/api'
import { TokenTypeEnum } from '@/shared/constants'
import type { SignalOptions } from '@/shared/types'
import type {
  AuthResponse,
  AvailableResponse,
  FirstLoginResponse,
  GoogleRegisterRequest,
  LoginRequestDto,
  RegisterRequestDto,
  UserProfile,
} from './types'

const endpoints = {
  register: '/sign-up',
  login: '/sign-in',
  checkUsername: '/valid/check-username?username=',
  checkEmail: 'valid/check-email?email=',
  refreshToken: '/refresh-token',
  saveGoogleInfo: '/api/addition_info/for-google',
  firstLogin: '/valid/first-login',
  sendVerification: '/api/notify',
  confirmEmail: '/api/notify/check',
  getProfile: 'api/profile/check',
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

  checkUsername: async (username: string): Promise<AvailableResponse> => {
    const response = await axiosBase.get<AvailableResponse>(
      `${endpoints.checkUsername}${username}`,
    )

    return response.data
  },

  checkEmail: async (email: string): Promise<AvailableResponse> => {
    const response = await axiosBase.get<AvailableResponse>(
      `${endpoints.checkEmail}${email}`,
    )

    return response.data
  },

  sendVerificationEmail: async (): Promise<void> => {
    await axiosWithAuth.post(endpoints.sendVerification)
  },

  confirmEmail: async (token: string) => {
    const response = await axiosWithAuth.get<AuthResponse>(endpoints.confirmEmail, {
      params: { token },
    })

    return response.data
  },

  logout: async (): Promise<void> => {
    // TODO: Implement logout logic
  },

  saveGoogleInfo: async (data: GoogleRegisterRequest): Promise<AuthResponse> => {
    const response = await axiosWithAuth.post<AuthResponse>(
      endpoints.saveGoogleInfo,
      data,
    )
    return response.data
  },

  isFirstLogin: async (): Promise<FirstLoginResponse> => {
    const response = await axiosWithAuth.get(endpoints.firstLogin)
    return response.data
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosWithAuth.get<UserProfile>(endpoints.getProfile)
    return response.data
  },
} as const
