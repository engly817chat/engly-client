import type { EngLevelType, NativeLangType, TokenType } from '@/shared/types'

export interface RegisterRequestDto {
  username: string
  email: string
  password: string
  englishLevel: EngLevelType
  nativeLanguage: NativeLangType
  goals: string
  avatar?: File
}

export interface LoginRequestDto {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  access_token_expiry: number
  token_type: TokenType
  user_name: string
  refresh_token: string
}

export interface AvailableResponse {
  available: boolean
}

export interface GoogleRegisterRequest {
  nativeLanguage: string;
  englishLevel: string;
  goals: string;
}

export interface UpdateProfileRequest {
  username?: string
  goal?: string
  englishLevel?: string
  nativeLanguage?: string
}

export interface UpdateSettingsRequest {
  theme?: string
  interfaceLanguage?: string
  notifications?: boolean
}

export interface FirstLoginResponse {
  userExists: boolean
}

export interface UserProfile {
  id: string
  username: string
  email: string
  providerId: string
  createdAt: string
  roles: string
  imgUrl: string | null
  emailVerified: boolean
  updatedAt: string
  lastLogin: string
  provider: string
  additionalInfo: {
    id: string
    englishLevel: string
    nativeLanguage: string
    goal: string
  }
  userSettings: {
    id: string
    theme: string
    notifications: boolean
    interfaceLanguage: string
  }
}
