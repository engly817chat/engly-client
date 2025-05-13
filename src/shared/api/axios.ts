import axios, {
  CreateAxiosDefaults,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { refreshTokens } from '@/shared/api/refresh'
import { AppConfig } from '@/shared/constants'
import { getAccessToken, removeFromStorage } from '@/shared/utils'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _isRetry?: boolean
  }
}

interface ApiErrorResponse {
  message?: string | string[]
}

const getContentType = () => ({
  'Content-Type': 'application/json',
})

const errorCatch = (error: AxiosError<ApiErrorResponse>): string => {
  const message = error?.response?.data?.message

  return message ? (Array.isArray(message) ? message[0] : message) : error.message
}

const options: CreateAxiosDefaults = {
  baseURL: AppConfig.apiUrl,
  headers: getContentType(),
  withCredentials: true,
}

export const axiosBase = axios.create(options)
export const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
  const accessToken = getAccessToken()

  if (config?.headers && accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`

  return config
})

const isTokenError = (errorMessage: string) =>
  ['jwt expired', 'jwt must be provided', 'refresh token not passed'].some(msg =>
    errorMessage.toLowerCase().includes(msg.toLowerCase())
  )

axiosWithAuth.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig

    const message = errorCatch(error)
    const status = error?.response?.status

    if (
      ([401, 406].includes(status || 0) || isTokenError(message)) &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true

      try {
        await refreshTokens()
        return axiosWithAuth(originalRequest)
      } catch (refreshError) {
        if (axios.isAxiosError<ApiErrorResponse>(refreshError)) {
          if (isTokenError(errorCatch(refreshError))) {
            removeFromStorage()
          }
        } else {
          console.error('Unknown error:', refreshError)
        }
      }
    }

    throw error
  }
)
