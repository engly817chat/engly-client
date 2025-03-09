export const AppConfig = {
  apiUrl: 'https://favourable-rodie-java-service-b82e5859.koyeb.app',
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
} as const

export const nativeLangs = [
  { value: NativeLangEnum.English, label: 'English' },
  { value: NativeLangEnum.Japanese, label: 'Japanese' },
  { value: NativeLangEnum.Hindi, label: 'Hindi' },
  { value: NativeLangEnum.Russian, label: 'Russian' },
  { value: NativeLangEnum.Spanish, label: 'Spanish' },
  { value: NativeLangEnum.Portuguese, label: 'Portuguese' },
  { value: NativeLangEnum.German, label: 'German' },
  { value: NativeLangEnum.French, label: 'French' },
  { value: NativeLangEnum.Arabic, label: 'Arabic' },
  { value: NativeLangEnum.Chinese, label: 'Chinese' },
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
  { value: EngLevelEnum.A1, label: 'A1 - Beginner' },
  { value: EngLevelEnum.A2, label: 'A2 - Elementary' },
  { value: EngLevelEnum.B1, label: 'B1 - Intermediate' },
  { value: EngLevelEnum.B2, label: 'B2 - Upper Intermediate' },
  { value: EngLevelEnum.C1, label: 'C1 - Advanced' },
  { value: EngLevelEnum.C2, label: 'C2 - Proficient' },
] as const

export const TokenTypeEnum = {
  Bearer: 'Bearer',
  Basic: 'Basic',
} as const

export const StorageKeyEnum = {
  AccessToken: 'engly_accessToken',
  RefreshToken: 'engly_refreshToken',
} as const
