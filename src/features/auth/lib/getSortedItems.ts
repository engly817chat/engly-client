import { TFunction } from 'i18next'

export const getSortedItems = (
  items: readonly { value: string; label: string }[],
  t: TFunction
) => {
  return [...items].sort((a, b) => {
    const aLabel = t(a.label).toLowerCase()
    const bLabel = t(b.label).toLowerCase()
    return aLabel.localeCompare(bLabel)
  })
}
