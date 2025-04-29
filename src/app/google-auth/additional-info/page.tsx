'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GoogleRegisterFormSchema, GoogleRegisterFormValues } from '@/features/auth/lib'
import { StepProfile } from '@/features/auth/ui/step-profile'
import { authApi } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'
import { Form } from '@/shared/ui/common/form'
import { toast } from 'react-toastify'

const AdditionalInfoPage = () => {
  const { t } = useTranslation()
  const router = useRouter()

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
      await authApi.saveGoogleInfo({
        nativeLanguage: data.nativeLanguage,
        englishLevel: data.englishLevel,
        goals: data.goals,
      })

      toast.success(t('auth.success'))
      router.push('/chats')
    } catch (error) {
      console.error('Failed to save additional info:', error)
    }
  }

  return (
    <div className='px-8 py-8 w-full max-w-[500px] bg-white rounded-2xl overflow-hidden shadow-xl'>
      <h1 className='mb-3 text-center text-3xl font-semibold text-foreground'>Almost there!</h1>
      <h2 className='mb-8 text-center text-lg text-foreground'>
        Please fill in the additional information to complete your registration.
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <StepProfile form={form} />

          <Button type='submit' className='mt-8 w-full' disabled={form.formState.isSubmitting}>
            
            Complete registration
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AdditionalInfoPage
