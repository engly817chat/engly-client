import { type UseFormReturn } from 'react-hook-form'
import { authApi } from '@/entities/auth'
import { RegisterFormValues } from '@/features/auth'

export const checkFieldAvailability = async (
  fieldName: 'username' | 'email',
  value: string,
  form: UseFormReturn<RegisterFormValues>,
  t: (key: string) => string,
  setCheckedState: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof RegisterFormValues, boolean>>>
  >
) => {
  try {
    const isValid = await form.trigger(fieldName)
    if (!isValid) return

    const res =
      fieldName === 'username'
        ? await authApi.checkUsername(value)
        : await authApi.checkEmail(value)

    if (!res.available) {
      form.setError(fieldName, {
        type: 'manual',
        message: t(`auth.validation.${fieldName}Taken`),
      })
      setCheckedState(prev => ({ ...prev, [fieldName]: false }))
    } else {
      setCheckedState(prev => ({ ...prev, [fieldName]: true }))
    }
  } catch (error) {
    console.error(`Error checking ${fieldName}:`, error)
  }
}