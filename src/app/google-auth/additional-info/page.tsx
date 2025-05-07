'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { authApi } from '@/entities/auth'
import { Button } from '@/shared/ui/common/button'
import { Form } from '@/shared/ui/common/form'
import { toast } from 'react-toastify'
import { GoogleRegisterFormSchema, GoogleRegisterFormValues, StepProfile } from '@/features/auth'
import { saveTokenStorage } from '@/shared/utils'

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
      const res = await authApi.saveGoogleInfo({
        nativeLanguage: data.nativeLanguage,
        englishLevel: data.englishLevel,
        goals: data.goals,
      })
  
      if (res.access_token) {
        saveTokenStorage(res.access_token)
      }

      toast.success(t('auth.success'))
      router.push('/')
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
        <StepProfile<GoogleRegisterFormValues> form={form} />

          <Button type='submit' className='mt-8 w-full' disabled={form.formState.isSubmitting}>
            
            Complete registration
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AdditionalInfoPage
