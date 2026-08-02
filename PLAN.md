# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**No active implementation track.** **SF — Support footer (SF1)** is complete.

**Next authorization:** **V3** (Steam sync, cloud profiles adapter, game detection). Do not start V3
until the user explicitly authorizes it.

---

## SF close-out (complete)

Site footer + upgraded Support donate modal:

- Owner endpoints in `supportConfig.ts` (Ko-fi, five networks, GitHub)
- Modal actions: Ko-fi profile link; MetaMask EVM send (ETH/BNB); manual network picker + copy + QR
- No permanent Ko-fi overlay widget; no mandatory third-party script on page load
- Seven locale catalogs; unit + smoke coverage

Condensed record: `PROJECT_ROADMAP.md`. Shell hierarchy: `STYLES.md`.
