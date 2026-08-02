# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current track:** none open — **V2.5 Visual polish is complete**.

**Next authorization:** **V3** (Steam sync, cloud profiles adapter, game detection). Do not start
V3 until the user explicitly authorizes it.

**Context:** MVP, UI Refresh (UR1–UR5), Product Depth (PD1–PD7), and V2.5 are complete. Competitive
brief remains `docs/keybindr-analysis.md` (D13).

---

## Just completed — V2.5 Visual polish

Three workstreams shipped (see `PROJECT_ROADMAP.md` for the condensed record):

| Workstream | Outcome |
|---|---|
| V2.5-A | Even row/cluster gaps; PrtSc / ScrLk / Pause / NumLk on full/TKL as appropriate; overlap-free geometry |
| V2.5-B | Layout select shares toolbar baseline (aria-label only); tighter header↔stage spacing |
| V2.5-C | Binding-layer toggles horizontal flex-wrap under each selected game |

QA archive: `qa.md` + `screenshot_*.png`.

---

## Explicit Non-Goals (until V3 opens)

- Steam sync, cloud profiles, game detection.
- V4 recommendations.
- Catalog growth, new parsers, new locales (unless chrome needs a string).

---

## Later phases (not open)

| Phase | Scope |
|---|---|
| **V3** | Steam sync, cloud profiles (adapter — D3), game detection |
| **V4** | Recommendations (“best push-to-talk key for your library”) |

---

## Immediate Next Step

Authorize **V3** when ready. Do not implement V3 until then.

## Verification Commands

```sh
make test
make lint
make build
make e2e
```
