import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Register | Engly',
  description:
    'Create an account to start learning English. Register now and start learning English with Engly.',
  keywords: 'register, sign up, create account, engly',
}

export default function RegisterPage() {
  return <RegisterForm />
}
