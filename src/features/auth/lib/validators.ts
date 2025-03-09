import { type UseFormReturn } from 'react-hook-form'
import type { RegisterFormValues } from './schema'

export const validatePasswords = (form: UseFormReturn<RegisterFormValues>): boolean => {
  const { password, confirm } = form.getValues()

  if (!password || !confirm) {
    form.setError('confirm', {
      type: 'manual',
      message: 'Required field',
    })
    return false
  }

  if (password !== confirm) {
    form.setError('confirm', {
      type: 'manual',
      message: 'Passwords must match!',
    })
    return false
  }

  return true
}
