import { TFunction } from 'i18next'
import { z } from 'zod'
import { EngLevelEnum, NativeLangEnum, regex } from '@/shared/constants'
import type { EngLevelType, NativeLangType } from '@/shared/types'

const maxUsernameLength = 50
const maxEmailLength = 50
const maxPasswordLength = 50
const minPasswordLength = 8

export const RegisterFormSchema = (t: TFunction) =>
  z
    .object({
      username: z
        .string()
        .min(2, {
          message: t('auth.validation.usernameMin'),
        })
        .max(maxUsernameLength, {
          message: t('auth.validation.usernameMax', { max: maxUsernameLength }),
        })
        .regex(new RegExp(regex.username), {
          message: t('auth.validation.usernameRegex'),
        }),
      email: z
        .string()
        .max(maxEmailLength, {
          message: t('auth.validation.emailMax', { max: maxEmailLength }),
        })
        .email({
          message: t('auth.validation.emailInvalid'),
        }),
      password: z
        .string()
        .min(1, {
          message: t('auth.validation.required'),
        })
        .min(minPasswordLength, {
          message: t('auth.validation.passwordMin', { min: minPasswordLength }),
        })
        .max(maxPasswordLength, {
          message: t('auth.validation.passwordMax', { max: maxPasswordLength }),
        })
        .regex(new RegExp(regex.password), {
          message: t('auth.validation.passwordRegex'),
        }),
      confirm: z
        .string({
          required_error: t('auth.validation.required'),
        })
        .min(1, {
          message: t('auth.validation.required'),
        })
        .max(maxPasswordLength, {
          message: t('auth.validation.passwordMax', { max: maxPasswordLength }),
        }),
      nativeLanguage: z.enum(
        Object.values(NativeLangEnum) as [NativeLangType, ...NativeLangType[]],
        {
          required_error: t('auth.validation.required'),
          invalid_type_error: t('auth.validation.nativeInvalid'),
        },
      ),
      englishLevel: z.enum(
        Object.values(EngLevelEnum) as [EngLevelType, ...EngLevelType[]],
        {
          required_error: t('auth.validation.required'),
          invalid_type_error: t('auth.validation.englishInvalid'),
        },
      ),
      goals: z.string().min(1, {
        message: t('auth.validation.required'),
      }),
    })
    .refine(
      values => {
        return values.password === values.confirm
      },
      {
        message: t('auth.validation.passwordsMustMatch'),
        path: ['confirm'],
      },
    )

export type RegisterFormValues = z.infer<ReturnType<typeof RegisterFormSchema>>

export const LoginFormSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t('auth.validation.required'),
      })
      .email({
        message: t('auth.validation.emailInvalid'),
      }),
    password: z.string().min(1, {
      message: t('auth.validation.required'),
    }),
  })

export type LoginFormValues = z.infer<ReturnType<typeof LoginFormSchema>>

export const GoogleRegisterFormSchema = (t: TFunction) =>
  z.object({
    nativeLanguage: z.enum(
      Object.values(NativeLangEnum) as [NativeLangType, ...NativeLangType[]],
      {
        required_error: t('auth.validation.required'),
        invalid_type_error: t('auth.validation.nativeInvalid'),
      },
    ),
    englishLevel: z.enum(
      Object.values(EngLevelEnum) as [EngLevelType, ...EngLevelType[]],
      {
        required_error: t('auth.validation.required'),
        invalid_type_error: t('auth.validation.englishInvalid'),
      },
    ),
    goals: z.string().min(1, {
      message: t('auth.validation.required'),
    }),
  })

export type GoogleRegisterFormValues = z.infer<
  ReturnType<typeof GoogleRegisterFormSchema>
>
