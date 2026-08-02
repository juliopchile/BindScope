export { parseSourceCfg } from './cfg'
export { parseSimpleIni } from './ini'
export { parseBindXml } from './xml'
export { detectImportFormat, isConfigFormat } from './detect'
export {
  configBindingsToProfile,
  resolveGameIdFromFileName,
  type ConfigImportParseResult,
} from './toProfile'
export type {
  ConfigFormat,
  ConfigImportOptions,
  ConfigBindingsResult,
  ImportFormat,
  RawConfigBinding,
} from './types'

import { parseSourceCfg } from './cfg'
import { parseSimpleIni } from './ini'
import { parseBindXml } from './xml'
import { configBindingsToProfile } from './toProfile'
import type { ConfigFormat, ConfigImportOptions } from './types'
import type { ConfigImportParseResult } from './toProfile'

/** Parse a CFG / INI / XML config into an imported profile. */
export function parseConfigFormat(
  raw: string,
  format: ConfigFormat,
  options: ConfigImportOptions,
): ConfigImportParseResult {
  const parsed =
    format === 'cfg'
      ? parseSourceCfg(raw)
      : format === 'ini'
        ? parseSimpleIni(raw)
        : parseBindXml(raw)
  return configBindingsToProfile(parsed, options)
}
