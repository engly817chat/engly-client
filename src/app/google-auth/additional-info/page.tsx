'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  GoogleRegisterFormSchema,
  GoogleRegisterFormValues,
  StepProfile,
  useSaveAdditionalInfo,
} from '@/features/auth'
import { Button } from '@/shared/ui/common/button'
import { Form } from '@/shared/ui/common/form'

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

  const { mutate, isPending } = useSaveAdditionalInfo()

  const onSubmit = async (data: GoogleRegisterFormValues) => {
    mutate(data, {
      onSuccess: () => {
        router.push('/')
      },
    })
  }

  return (
    <div className='w-full max-w-[500px] overflow-hidden rounded-2xl bg-white px-8 py-8 shadow-xl'>
      <h1 className='mb-3 text-center text-3xl font-semibold text-foreground'>
        {t('additionalInfo.title')}
      </h1>
      <h2 className='mb-8 text-center text-lg text-foreground'>
        {t('additionalInfo.description')}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <StepProfile<GoogleRegisterFormValues> form={form} />

          <Button type='submit' className='mt-8 w-full' disabled={isPending}>
            {t('additionalInfo.completeRegister')}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AdditionalInfoPage
