# BindScope

> AI agents: start with [`AGENTS.md`](AGENTS.md). Progress and active work live in
> [`PROJECT_ROADMAP.md`](PROJECT_ROADMAP.md) and [`PLAN.md`](PLAN.md) — not here.

BindScope lets you select several games at once, overlay their default or custom keymaps on an
interactive keyboard and mouse, and instantly see **which keys are still free** across all of them.

## The problem

PC players bind keys outside their games: overlays like MSI Afterburner, push-to-talk, recording
hotkeys, macros, and operating system shortcuts. Those bindings silently collide with in-game
defaults, and you find out mid-match when one key does two things.

No tool answers the question that matters:

> **Which keys are still safe across the games I actually play?**

Existing tools (KeyBindr, ED KB Map, Visual Keymap, PCGamingWiki) show **one** game or **one**
profile at a time. None compute the intersection across several.

## What BindScope does

The core idea is not “display keybinds” but **computing the intersection of unused keys across
several games and profiles**:

```
available = allKeys − union(usedKeys)
```

That line is the entire engine. Everything else is data quality and UX.

**Typical flow:** select Skyrim, Genshin Impact, and Warframe. BindScope overlays the three keymaps
on a keyboard and mouse and shows keys used by every title, keys used by some, keys free across all
of them, and keys reserved by the OS or by BindScope’s own safety rules. Import a custom profile for
any title and the result updates immediately.

### Capabilities

- Curated catalog of games and tools (OBS, Afterburner, Discord, ShareX, …) with toggleable binding
  layers
- Interactive SVG keyboard (Full, TKL, 60%, ISO Full) and mouse, with free / partial / heavy /
  reserved states
- Modifier-chord marks and action-name search across the selection or the full catalog
- Import and export: BindScope JSON, Source CFG, simple INI, BindScope XML; export the current safe
  (free) key set
- UI languages: English, Spanish, Portuguese, French, Chinese, German, Japanese
- Light, dark, and system theme; preferences and selection persist in the browser
- Fully static — no backend, no account, no required network calls at runtime

## Getting started

Requires Node.js. From the repository root:

```sh
make install   # npm install inside app/
make run       # http://127.0.0.1:8080 with HMR
make help      # list all targets
```

Useful targets:

```sh
make test         # Vitest unit tests
make lint         # ESLint
make build        # static artifact in app/dist
make serve        # same as run, without opening a browser
make e2e-install  # once: download Playwright Chromium
make e2e          # build + Playwright smoke against Vite preview
```

The application lives in `app/`. Repository documentation is never part of the Vite app root or the
deployed site.

### Configuration

`make run` / `make serve` default to `127.0.0.1:8080`. Override on the command line
(`make run PORT=8090`) or with an optional git-ignored `.env` in the repo root:

```sh
PORT=8090
HOST=0.0.0.0   # reach the dev server from another device on your network
```

`VITE_BASE_PATH` defaults to `/`; CI sets `/BindScope/` for project GitHub Pages.

Locale, theme, layout, mouse/chord preferences, and the current game selection persist in
`localStorage` (`bindscope.locale`, `bindscope.theme`, `bindscope.layout`, `bindscope.showMouse`,
`bindscope.showChordMarks`, `bindscope.selection`). Seed binding action names stay in their curated
language. First visit starts with an empty selection.

## Deployment

Everything deployable lives in `app/`. On push to `main`, GitHub Actions builds `app/` with
`VITE_BASE_PATH=/BindScope/` and publishes `app/dist` to GitHub Pages. Enable
**Settings → Pages → Source: GitHub Actions** once on the repository.

Local production preview: `make build`, then `npm --prefix app run preview`.

## Further documentation

| File | Audience | Contents |
|---|---|---|
| [`AGENTS.md`](AGENTS.md) | AI agents | Reading order, invariants, commands |
| [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) | Contributors | Architecture, data model, conventions |
| [`PROJECT_ROADMAP.md`](PROJECT_ROADMAP.md) | Maintainers / agents | Completed work, pending phases, history |
| [`PLAN.md`](PLAN.md) | Maintainers / agents | Active implementation work only (when any) |
| [`DECISIONS.md`](DECISIONS.md) | Contributors | Architecture decisions and rationale |
| [`STYLES.md`](STYLES.md) | Contributors | Theme tokens, key-state cues, breakpoints |
| [`LICENSE`](LICENSE) | Everyone | MIT License |

Stable product knowledge belongs in the permanent docs above. In-flight implementation detail belongs
in `PLAN.md`. Roadmap status and stage history belong in `PROJECT_ROADMAP.md` — keep them out of this
README so it stays useful as a human product entry point.

## License

BindScope is released under the [MIT License](LICENSE).
