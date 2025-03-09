import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Login | Engly',
  description:
    'Login to your account to start learning English. Sign in now and start learning English with Engly.',
  keywords: 'login, sign in, engly',
}

export default function LoginPage() {
  return <LoginForm />
}
