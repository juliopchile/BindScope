import type { InputProfile } from '../types'

export type ConfigFormat = 'ini' | 'cfg' | 'xml'

/** Future: parse game config files into InputProfile bindings. */
export interface ConfigFormatParser {
  readonly format: ConfigFormat
  canParse(filename: string, content: string): boolean
  parse(content: string, options?: { gameId?: string; profileName?: string }): InputProfile
}

export const CONFIG_PARSER_PLACEHOLDERS: ConfigFormatParser[] = [
  {
    format: 'ini',
    canParse: (filename) => filename.endsWith('.ini'),
    parse: () => {
      throw new Error('INI parser not implemented')
    },
  },
  {
    format: 'cfg',
    canParse: (filename) => filename.endsWith('.cfg'),
    parse: () => {
      throw new Error('CFG parser not implemented')
    },
  },
  {
    format: 'xml',
    canParse: (filename) => filename.endsWith('.xml'),
    parse: () => {
      throw new Error('XML parser not implemented')
    },
  },
]
