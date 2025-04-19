import { type TFunction } from 'i18next'
import { type UseFormReturn } from 'react-hook-form'
import type { RegisterFormValues } from './schema'

export const validatePasswords = (
  form: UseFormReturn<RegisterFormValues>,
  t: TFunction,
): boolean => {
  const { password, confirm } = form.getValues()

  if (!password || !confirm) {
    form.setError('confirm', {
      type: 'manual',
      message: t('auth.validation.required'),
    })
    return false
  }

  if (password !== confirm) {
    form.setError('confirm', {
      type: 'manual',
      message: t('auth.validation.passwordsMustMatch'),
    })
    return false
  }

  return true
}
