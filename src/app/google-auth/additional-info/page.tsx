'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
  GoogleRegisterFormSchema,
  GoogleRegisterFormValues,
  StepProfile,
} from '@/features/auth'
import { authApi, useAuth } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'
import { Form } from '@/shared/ui/common/form'
import { saveTokenStorage } from '@/shared/utils'

const AdditionalInfoPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { setUser } = useAuth()

  const form = useForm<GoogleRegisterFormValues>({
    resolver: zodResolver(GoogleRegisterFormSchema(t)),
    defaultValues: {
      nativeLanguage: undefined,
      englishLevel: undefined,
      goals: '',
    },
  })

  const onSubmit = async (data: GoogleRegisterFormValues) => {
    try {
      const res = await authApi.saveGoogleInfo({
        nativeLanguage: data.nativeLanguage,
        englishLevel: data.englishLevel,
        goals: data.goals,
      })

      if (res.access_token) {
        saveTokenStorage(res.access_token)
        const user = await authApi.getProfile()
        setUser(user)
      }

      toast.success(t('auth.success'))
      router.push('/')
    } catch (error) {
      console.error('Failed to save additional info:', error)
    }
  }

  return (
    <div className='w-full max-w-[500px] overflow-hidden rounded-2xl bg-white px-8 py-8 shadow-xl'>
      <h1 className='mb-3 text-center text-3xl font-semibold text-foreground'>
        Almost there!
      </h1>
      <h2 className='mb-8 text-center text-lg text-foreground'>
        Please fill in the additional information to complete your registration.
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <StepProfile<GoogleRegisterFormValues> form={form} />

          <Button
            type='submit'
            className='mt-8 w-full'
            disabled={form.formState.isSubmitting}
          >
            Complete registration
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AdditionalInfoPage
