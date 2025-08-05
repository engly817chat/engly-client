import type { TFunction } from 'i18next'

export const getTranslatedCategory = (slug: string, t: TFunction): string => {
  if (!slug || typeof slug !== 'string') return ''

  const normalizedSlug = slug.toLowerCase().replace(/^\/|\/$/g, '') 
  const translation = t(`chatCategoryPage.categories.${normalizedSlug}`, {
    defaultValue: '',
  })

  if (translation && translation !== `chatCategoryPage.categories.${normalizedSlug}`) {
    return translation
  }

  return formattedSlugFallback(normalizedSlug)
}


const formattedSlugFallback = (slug: string): string =>
  slug
    .replace(/_+/g, ' ')
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase())
