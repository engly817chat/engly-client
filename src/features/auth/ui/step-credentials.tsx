'use client'

import { useState } from 'react'
import { CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/common/form'
import { Input } from '@/shared/ui/common/input'
import { CircleAlertIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils'
import { validatePasswords, type RegisterFormValues } from '../lib'
import { credentialStepData } from '../model'
import { checkFieldAvailability } from '../lib/checkFieldAvailability'

interface StepCredentialsProps {
  form: UseFormReturn<RegisterFormValues>
}

export const StepCredentials = ({ form }: StepCredentialsProps) => {
  const { t } = useTranslation()
  const [checkedState, setCheckedState] = useState<
    Partial<Record<keyof RegisterFormValues, boolean>>
  >({})
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    password: false,
    confirm: false,
  })

  const toggleVisibility = (fieldName: string) => {
    setVisibleFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  return (
    <div className='space-y-1'>
      {credentialStepData.map(i => (
        <FormField
          key={i.name}
          control={form.control}
          name={i.name}
          render={({ field }) => (
            <FormItem className='space-y-1 md:space-y-1.5'>
              <FormLabel className='form-label required'>{t(i.label)}</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    className={cn(
                      'form-input',
                      form.formState.errors[i.name]
                        ? '!border-destructive'
                        : form.formState.touchedFields[i.name] && '!border-success',
                    )}
                    type={
                      i.type === 'password'
                        ? visibleFields[i.name]
                          ? 'text'
                          : 'password'
                        : i.type
                    }
                    placeholder={t(i.placeholder)}
                    {...field}
                    onChange={async e => {
                      field.onChange(e)
                      const isValid = await form.trigger(i.name)
                      setCheckedState(prev => ({ ...prev, [i.name]: isValid }))
                    }}
                    onBlur={async () => {
                      field.onBlur()
                      if (i.name === 'username' || i.name === 'email') {
                        await checkFieldAvailability(i.name, field.value, form, t, setCheckedState)
                      }
                      if (i.name === 'confirm') {
                        const isValid = validatePasswords(form, t)
                        setCheckedState(prev => ({ ...prev, [i.name]: isValid }))
                      }
                    }}
                  />

                  <div className='absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2'>
                    {i.showPasswordToggle && (
                      <button
                        type='button'
                        onClick={() => toggleVisibility(i.name)}
                        className='text-gray-500 hover:text-gray-700'
                        aria-label={
                          visibleFields[i.name] ? 'Скрыть пароль' : 'Показать пароль'
                        }
                      >
                        {visibleFields[i.name] ? (
                          <EyeOffIcon className='h-5 w-5 stroke-1' />
                        ) : (
                          <EyeIcon className='h-5 w-5 stroke-1' />
                        )}
                      </button>
                    )}
                    {form.formState.errors[i.name] && (
                      <CircleAlertIcon className='text-destructive' />
                    )}

                    {checkedState[i.name] && <CheckIcon className='text-foreground' />}
                  </div>
                </div>
              </FormControl>
              <div className='min-h-[16px]'>
                <FormMessage className='form-error' />
              </div>
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}
