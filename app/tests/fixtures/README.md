# Sample config files for PD6 parsers

BindScope imports real game/tool configs **client-side** (no upload). Parsers live under
`app/src/lib/parsers/` and are isolated from React. Valid binds become an `InputProfile` with
`sourceType: 'imported'` and feed the same override / availability path as JSON import.

## Formats

| Format | Extension | Parser | Notes |
|---|---|---|---|
| BindScope JSON | `.json` | `lib/importExport.ts` | Multi-profile v1 document (unchanged) |
| Source CFG | `.cfg` | `parsers/cfg.ts` | `bind "KEY" "cmd"` — CS2 / Source-engine style |
| Simple INI | `.ini` | `parsers/ini.ts` | `[Section]` + `key=action`; `Ctrl+W=…` for modifiers |
| BindScope XML | `.xml` | `parsers/xml.ts` | `<bind key="…" action="…" modifiers="ctrl"/>` |

Auto-detect prefers the file extension, then sniffs content (`bind …`, `<bind`, `{…}`, `key=value`).

## Target game UX

- **JSON:** `gameId` comes from the document; the Import panel target select is ignored.
- **CFG / INI / XML:** single profile. The Import panel **Target game** select applies:
  1. A catalog / selected title, or
  2. **From filename** — slugify the basename; if it matches a catalog id or alias (e.g. `cs2.cfg` →
     `counter-strike-2`), use that; otherwise use the slug as a new id (`autoexec` → game id
     `autoexec`).

## Samples in this folder

| File | Format |
|---|---|
| `sample-cs2.cfg` | Source CFG with movement / mouse / wheel binds |
| `sample-binds.ini` | Sectioned INI with one chord line |
| `sample-binds.xml` | BindScope XML including invalid keys (skipped) |

Copies also live under `docs/samples/` for documentation browsing without opening `app/tests/`.
