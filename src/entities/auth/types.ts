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
  emailVerified: boolean
  provider: string
  additionalInfo: {
    englishLevel: string
    nativeLanguage: string
    goal: string
  }
}
