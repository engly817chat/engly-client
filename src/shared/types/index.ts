import type {
  EngLevelEnum,
  NativeLangEnum,
  StorageKeyEnum,
  TokenTypeEnum,
} from '../constants'

export type TokenType = (typeof TokenTypeEnum)[keyof typeof TokenTypeEnum]
export type NativeLangType = (typeof NativeLangEnum)[keyof typeof NativeLangEnum]
export type EngLevelType = (typeof EngLevelEnum)[keyof typeof EngLevelEnum]
export type StorageKeyType = (typeof StorageKeyEnum)[keyof typeof StorageKeyEnum]

export type SignalOptions = {
  signal: AbortSignal
}
