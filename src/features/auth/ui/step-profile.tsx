'use client'

import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/common/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/common/select'
import { cn } from '@/shared/utils'
import { getSortedItems } from '../lib/getSortedItems'
import { profileStepData } from '../model'

interface StepProfileProps<T extends FieldValues> {
  form: UseFormReturn<T>
}

export const StepProfile = <T extends FieldValues>({ form }: StepProfileProps<T>) => {
  const { t } = useTranslation()
  return (
    <div className='space-y-5 xl:space-y-3'>
      {profileStepData.map(i => (
        <FormField
          key={i.name}
          control={form.control}
          name={i.name as Path<T>}
          render={({ field }) => (
            <FormItem className='space-y-1 md:space-y-3'>
              <FormLabel className='form-label required'>{t(i.label)}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      'form-input',
                      !field.value && '!text-foreground/30',
                      form.formState.errors[i.name] && '!border-destructive',
                    )}
                  >
                    <SelectValue placeholder={t(i.placeholder)} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getSortedItems(i.items, t).map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {t(label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className='form-error' />
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}
