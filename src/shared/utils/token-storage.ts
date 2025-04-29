import Cookies from 'js-cookie'
import { storageKeys } from '@/shared/constants'

export const getAccessToken = () => {
  const accessToken = Cookies.get(storageKeys.accessToken)
  return accessToken || null
}

export const saveTokenStorage = (accessToken: string) => {
  Cookies.set(storageKeys.accessToken, accessToken, {
    sameSite: 'strict',
    expires: 1,
  })
}

export const removeFromStorage = () => {
  Cookies.remove(storageKeys.accessToken)
}
