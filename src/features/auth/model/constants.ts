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
    label: 'Username',
    placeholder: 'Enter username',
    showPasswordToggle: false,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    showPasswordToggle: false,
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    showPasswordToggle: true,
  },
  {
    type: 'password',
    name: 'confirm',
    label: 'Confirm password',
    placeholder: 'Confirm password',
    showPasswordToggle: true,
  },
] as const

export const profileStepData = [
  {
    name: 'nativeLanguage',
    label: 'Native language',
    placeholder: 'Select your native language',
    type: 'select',
    items: nativeLangs,
  },
  {
    name: 'englishLevel',
    label: 'Native language',
    placeholder: 'Select your English level',
    type: 'select',
    items: engLevels,
  },
  {
    name: 'goals',
    label: 'Goals',
    placeholder: 'Select your goals',
    type: 'select',
    items: [
      { value: 'DEFAULT', label: 'Default' },
      { value: 'IMPROVE_ENGLISH', label: 'Improve English' },
      { value: 'LEARN_NEW_LANGUAGE', label: 'Learn new language' },
      { value: 'MEET_NEW_PEOPLE', label: 'Meet new people' },
    ],
  },
] as const

export const loginData = [
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    showPasswordToggle: false,
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    showPasswordToggle: true,
  },
] as const
