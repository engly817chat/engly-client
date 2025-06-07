import { z } from 'zod'

export const CreateChatSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('auth.validation.required')),
    description: z.string().optional(),
  })

export type CreateChatFormValues = z.infer<ReturnType<typeof CreateChatSchema>>
