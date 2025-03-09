import type { EngLevelType, GenderType, NativeLangType, TokenType } from '@/shared/types'

export interface RegisterRequestDto {
  username: string
  email: string
  password: string
  englishLevel: EngLevelType
  nativeLanguage: NativeLangType
  goals: string
  gender: GenderType
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
