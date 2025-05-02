import poster1_img from '@/shared/assets/images/auth/auth-cover1.jpg'
import poster2_img from '@/shared/assets/images/auth/auth-cover2.jpg'
import poster3_img from '@/shared/assets/images/auth/auth-cover3.jpg'
import { engLevels, nativeLangs } from '@/shared/constants'

export const authSlidePosters = [
  { id: 1, src: poster1_img, alt: 'Auth cover image' },
  { id: 2, src: poster2_img, alt: 'Auth cover image' },
  { id: 3, src: poster3_img, alt: 'Auth cover image' },
] as const

export const RegisterStepEnum = {
  Credentials: 0,
  Profile: 1,
} as const

export type RegisterStepType = (typeof RegisterStepEnum)[keyof typeof RegisterStepEnum]

export const credentialStepData = [
  {
    type: 'text',
    name: 'username',
    label: 'auth.username.label',
    placeholder: 'auth.username.placeholder',
    showPasswordToggle: false,
  },
  {
    type: 'text',
    name: 'email',
    label: 'auth.email.label',
    placeholder: 'auth.email.placeholder',
    showPasswordToggle: false,
  },
  {
    type: 'password',
    name: 'password',
    label: 'auth.password.label',
    placeholder: 'auth.password.placeholder',
    showPasswordToggle: true,
  },
  {
    type: 'password',
    name: 'confirm',
    label: 'auth.confirm.label',
    placeholder: 'auth.confirm.placeholder',
    showPasswordToggle: true,
  },
] as const

export const profileStepData = [
  {
    name: 'nativeLanguage',
    label: 'auth.nativeLanguage.label',
    placeholder: 'auth.nativeLanguage.placeholder',
    type: 'select',
    items: nativeLangs,
  },
  {
    name: 'englishLevel',
    label: 'auth.englishLevel.label',
    placeholder: 'auth.goals.placeholder',
    type: 'select',
    items: engLevels,
  },
  {
    name: 'goals',
    label: 'auth.goals.label',
    placeholder: 'auth.goals.placeholder',
    type: 'select',
    items: [
      { value: 'IMPROVE_ENGLISH', label: 'auth.goals.items.improveEng' },
      { value: 'LEARN_NEW_LANGUAGE', label: 'auth.goals.items.learnNewLang' },
      { value: 'MEET_NEW_PEOPLE', label: 'auth.goals.items.meetPeople' },
    ],
  },
] as const

export const loginData = [
  {
    type: 'text',
    name: 'email',
    label: 'login.email.label',
    placeholder: 'login.email.placeholder',
    showPasswordToggle: false,
  },
  {
    type: 'password',
    name: 'password',
    label: 'login.password.label',
    placeholder: 'login.password.placeholder',
    showPasswordToggle: true,
  },
] as const
