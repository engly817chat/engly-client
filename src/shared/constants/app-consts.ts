export const AppConfig = {
  apiUrl: 'https://engly-server-latest.onrender.com',
  isClient: typeof window !== 'undefined',
} as const

export const NativeLangEnum = {
  English: 'ENGLISH',
  Japanese: 'JAPANESE',
  Hindi: 'HINDI',
  Russian: 'RUSSIAN',
  Spanish: 'SPANISH',
  Portuguese: 'PORTUGUESE',
  German: 'GERMAN',
  French: 'FRENCH',
  Arabic: 'ARABIC',
  Chinese: 'CHINESE',
  Ukrainian: 'UKRAINIAN',
} as const

export const nativeLangs = [
  { value: NativeLangEnum.English, label: 'auth.nativeLanguage.items.eng' },
  { value: NativeLangEnum.Japanese, label: 'auth.nativeLanguage.items.jap' },
  { value: NativeLangEnum.Hindi, label: 'auth.nativeLanguage.items.hin' },
  { value: NativeLangEnum.Russian, label: 'auth.nativeLanguage.items.rus' },
  { value: NativeLangEnum.Spanish, label: 'auth.nativeLanguage.items.spa' },
  { value: NativeLangEnum.Portuguese, label: 'auth.nativeLanguage.items.por' },
  { value: NativeLangEnum.German, label: 'auth.nativeLanguage.items.ger' },
  { value: NativeLangEnum.French, label: 'auth.nativeLanguage.items.fre' },
  { value: NativeLangEnum.Arabic, label: 'auth.nativeLanguage.items.ara' },
  { value: NativeLangEnum.Chinese, label: 'auth.nativeLanguage.items.chi' },
  { value: NativeLangEnum.Ukrainian, label: 'auth.nativeLanguage.items.ukr' },
] as const

export const GenderEnum = {
  Female: 'FEMALE',
  Male: 'MALE',
} as const

export const EngLevelEnum = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
} as const

export const engLevels = [
  { value: EngLevelEnum.A1, label: 'auth.englishLevel.items.A1' },
  { value: EngLevelEnum.A2, label: 'auth.englishLevel.items.A2' },
  { value: EngLevelEnum.B1, label: 'auth.englishLevel.items.B1' },
  { value: EngLevelEnum.B2, label: 'auth.englishLevel.items.B2' },
  { value: EngLevelEnum.C1, label: 'auth.englishLevel.items.C1' },
  { value: EngLevelEnum.C2, label: 'auth.englishLevel.items.C2' },
] as const

export const TokenTypeEnum = {
  Bearer: 'Bearer',
  Basic: 'Basic',
} as const

export const StorageKeyEnum = {
  AccessToken: 'engly_accessToken',
  RefreshToken: 'engly_refreshToken',
} as const
