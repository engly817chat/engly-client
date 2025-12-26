import { axiosBase, axiosWithAuth } from '@/shared/api'
import type { SignalOptions } from '@/shared/types'
import type {
  AuthResponse,
  AvailableResponse,
  FirstLoginResponse,
  GoogleRegisterRequest,
  LoginRequestDto,
  RegisterRequestDto,
  UpdateProfileRequest,
  UpdateSettingsRequest,
  UserProfile,
} from './types'

const endpoints = {
  register: '/sign-up',
  login: '/sign-in',
  checkUsername: '/valid/check-username?username=',
  checkEmail: 'valid/check-email?email=',
  refreshToken: '/refresh-token',
  logout: '/logout',
  saveGoogleInfo: '/api/addition_info/for-google',
  firstLogin: '/valid/first-login',
  sendVerification: '/api/email-verify',
  confirmEmail: '/api/email-verify/check',
  getProfile: '/api/profile/check',
  updateProfile: '/api/profile',
  updateSettings: '/api/user-settings',
  resetPasswordSend: '/api/password-reset/send',
  resetPasswordConfirm: '/api/password-reset',
} as const

export const authApi = {
  register: async (
    data: RegisterRequestDto,
    { signal }: SignalOptions,
  ): Promise<AuthResponse> => {
    const response = await axiosBase.post<AuthResponse>(
      endpoints.register,
      { ...data },
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
    const response = await axiosBase.post<AuthResponse>(
      endpoints.login,
      {
        email: data.email,
        password: data.password,
      },
      {
        signal,
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
    await axiosWithAuth.delete(endpoints.logout)
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
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await axiosWithAuth.put<UserProfile>(endpoints.updateProfile, data)
    return response.data
  },
  updateSettings: async (data: UpdateSettingsRequest): Promise<UserProfile> => {
    const response = await axiosWithAuth.put<UserProfile>(endpoints.updateSettings, data)
    return response.data
  },
  sendResetLink: async (email: string): Promise<void> => {
    await axiosBase.post(endpoints.resetPasswordSend, null, {
      params: { email },
    })
  },
  setNewPassword: async (newPassword: string, token: string): Promise<void> => {
    await axiosBase.post(endpoints.resetPasswordConfirm, { newPassword, token })
  },
} as const
