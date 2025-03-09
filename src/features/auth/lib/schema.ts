import { z } from 'zod'
import { EngLevelEnum, GenderEnum, NativeLangEnum, regex } from '@/shared/constants'
import type { EngLevelType, GenderType, NativeLangType } from '@/shared/types'

const maxUsernameLength = 50
const maxEmailLength = 50
const maxPasswordLength = 30
const minPasswordLength = 8

export const RegisterFormSchema = z
  .object({
    username: z
      .string()
      .min(1, {
        message: 'Required field',
      })
      .min(2, {
        message: 'Username must be at least 2 characters',
      })
      .max(maxUsernameLength, {
        message: `Username must be less than ${maxUsernameLength} characters`,
      })
      .regex(new RegExp(regex.username), {
        message:
          'Username must start with a letter and can contain only letters, numbers, dots, underscores and hyphens',
      }),
    email: z
      .string()
      .max(maxEmailLength, {
        message: `Email must be less than ${maxEmailLength} characters`,
      })
      .email({
        message: 'Invalid email address',
      }),
    password: z
      .string()
      .min(1, {
        message: 'Required field',
      })
      .min(minPasswordLength, {
        message: `Password must be at least ${minPasswordLength} characters`,
      })
      .max(maxPasswordLength, {
        message: `Password must be less than ${maxPasswordLength} characters`,
      })
      .regex(new RegExp(regex.password), {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      }),
    confirm: z.string().min(1, {
      message: 'Required field',
    }),
    nativeLanguage: z.enum(
      Object.values(NativeLangEnum) as [NativeLangType, ...NativeLangType[]],
      {
        required_error: 'Required field',
        invalid_type_error: 'Please select valid native language',
      },
    ),
    englishLevel: z.enum(
      Object.values(EngLevelEnum) as [EngLevelType, ...EngLevelType[]],
      {
        required_error: 'Required field',
        invalid_type_error: 'Please select valid English level',
      },
    ),
    gender: z.enum(Object.values(GenderEnum) as [GenderType, ...GenderType[]], {
      required_error: 'Required field',
      invalid_type_error: 'Please select valid gender',
    }),
    goals: z.string().min(1, {
      message: 'Required field',
    }),
  })
  .refine(
    values => {
      return values.password === values.confirm
    },
    {
      message: 'Passwords must match!',
      path: ['confirm'],
    },
  )

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address',
  }),
  password: z.string().min(1, {
    message: 'Required field',
  }),
})

export type LoginFormValues = z.infer<typeof LoginFormSchema>
