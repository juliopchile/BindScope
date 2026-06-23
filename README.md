# BindScope

BindScope is a fully client-side static web application that lets you select multiple games, overlay their default or custom keymaps, and instantly see which keyboard keys remain available across all selected profiles.

## Features

- Search and select from 24 seeded games with multiple input profiles
- SVG keyboard visualization (ANSI Full, TKL, Compact)
- Per-key states: free, single use, shared, partial conflict, heavy conflict, reserved
- Side panel with binding details per game/profile
- Filters, legend with patterns (not color-only), import/export JSON
- Pure domain logic with Vitest coverage
- GitHub Pages-ready static build

## Data model

| Type                   | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `Game`                 | Catalog entry with aliases, tags, and linked profile IDs             |
| `InputProfile`         | Versioned binding set for a game (official/community/custom)         |
| `Binding`              | Key, action, optional context/modifiers, source metadata, confidence |
| `KeyboardLayout`       | Data-driven key positions for SVG rendering                          |
| `ReservedKeyRule`      | OS/global shortcuts to mark as reserved                              |
| `ConflictSummary`      | Aggregated availability and per-key metadata                         |
| `ImportExportDocument` | Versioned JSON envelope for custom profiles                          |

Bindings use canonical `KeyboardKey` identifiers (Web `KeyboardEvent.code` style, e.g. `KeyW`, `Space`, `F1`).

## Local development

```bash
npm install
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`). For local dev without a subpath, run:

```bash
VITE_BASE_PATH=/ npm run dev
```

## Build for static deployment

```bash
npm run build
npm run preview
```

The default base path is `/BindScope/` for GitHub Pages project sites. Override with:

```bash
VITE_BASE_PATH=/ npm run build
```

Output is written to `dist/`.

## GitHub Pages deployment

1. Enable GitHub Pages for the repository (Settings → Pages → GitHub Actions or deploy `dist`).
2. Build with the project base path (default):

```bash
npm run build
```

3. Publish `dist/` to Pages. Example workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

For a user/organization site (`username.github.io`), set `VITE_BASE_PATH=/` before building.

## Running tests

```bash
npm test           # Vitest unit/component tests
npm run lint       # ESLint
npm run format:check
npm run test:e2e   # Playwright (builds + preview first)
```

## Adding a new game

1. Add a `Game` entry to `src/data/games.ts` with a unique `id` and `profileIds`.
2. Add one or more `InputProfile` objects with bindings using canonical keys.
3. Use helper `b('KeyE', 'Interact')` for concise binding definitions.
4. Keys are normalized via `src/utils/keyNormalization.ts` — prefer labels like `W`, `Space`, `F1` or canonical codes.

## Adding a custom profile

**In the UI:** use Import / Export → paste or load a JSON document.

**In code:** append to `PROFILES` in `src/data/games.ts` and link from the game's `profileIds`.

**JSON format:**

```json
{
  "schemaVersion": 1,
  "exportedAt": "2026-06-23T12:00:00.000Z",
  "profiles": [
    {
      "id": "my-game-custom",
      "gameId": "my-game",
      "name": "My Layout",
      "sourceType": "custom",
      "verificationStatus": "custom",
      "bindings": [{ "key": "E", "action": "Use" }]
    }
  ]
}
```

Validation lives in `src/lib/importExport.ts` (Zod).

## Availability computation

Pure functions in `src/domain/availability.ts` take:

- selected `InputProfile[]`
- active `KeyboardLayout`
- `ReservedKeyRule[]`
- optional profile precedence list

For each layout key:

1. Collect bindings from all selected profiles (deduped by profile/action/modifiers).
2. Apply profile precedence when duplicate bindings exist.
3. If a reserved rule matches the bare key, mark `reserved`.
4. Otherwise classify:
   - **free** — no bindings
   - **single** — one profile
   - **shared** — multiple profiles, same action + modifiers
   - **partial** — two profiles disagree
   - **heavy** — three or more profiles disagree
5. Bindings for keys outside the layout are reported as `unknown`.

## Reserved keys

`src/data/reservedKeys.ts` defines rules such as Alt+F4, Alt+Tab, Win+L, and common Ctrl shortcuts. Reserved keys are flagged even when no game uses them, so you avoid planning binds on OS-critical chords.

Future work: modifier-aware reserved matching and per-OS scoping in the UI.

## Future backend evolution

Extension points (not implemented):

| Module                       | Interface                                             |
| ---------------------------- | ----------------------------------------------------- |
| `src/lib/databaseAdapter.ts` | `ProfileDatabaseAdapter` for remote/local persistence |
| `src/lib/configParsers.ts`   | INI/CFG/XML parsers → `InputProfile`                  |
| `src/lib/extensionPoints.ts` | ISO/JIS layouts, modifier-aware display               |

The app currently loads bundled seed data only. Swapping in a DB adapter or static fetch layer can happen behind the same types without UI changes.

## Tech stack

- React 19 + TypeScript (strict)
- Vite 8
- Tailwind CSS 4
- Zod
- Vitest + Testing Library
- Playwright
- ESLint + Prettier

## License

MIT
