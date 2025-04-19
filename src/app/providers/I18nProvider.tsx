'use client'

import '@shared/lib/i18n'
import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@shared/lib/i18n'

export default function I18nProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}