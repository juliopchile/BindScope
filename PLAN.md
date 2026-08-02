# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current track:** **SF — Support footer** (documented; **not authorized for implementation yet**).

**Context:** MVP, UI Refresh (UR1–UR5), Product Depth (PD1–PD7), and V2.5 are complete. This track
adds a Keybindr-style site footer for donations and project links. Competitive IA note: Keybindr
footer (Ko-fi / source / bug) is listed as open chrome in `docs/keybindr-analysis.md` §3.1 — adopt
the **pattern**, not the brand (D13).

**Next after this track:** authorize **V3** (Steam sync, cloud profiles adapter, game detection). Do
not start V3 until the user explicitly authorizes it.

**Implementation gate:** do **not** implement SF until the user authorizes this plan and resolves
the open questions below (Ko-fi URL, crypto address / chain).

---

## Goal

Add a compact, centered footer under the main app shell with three actions, matching the Keybindr
footer density (hairline top border, inline row, `|` separators, light/dark token-friendly chrome):

1. **Donate / Support** — primary control that offers donation methods:
   - **Ko-fi** — open the project Ko-fi page in a new tab.
   - **Cryptocurrency** — donate via a browser wallet (e.g. MetaMask / `window.ethereum` when
     present) **and/or** copy/show a public receive address for manual transfer.
2. **Source code** — navigate to the GitHub repository.
3. **Report issue** — navigate to the GitHub Issues page.

Reference mock / Keybindr look: outlined accent “Support on Ko-fi” control + plain text links for
source and bug report. BindScope may label the first control more generically (“Support” /
“Donate”) because it exposes more than Ko-fi.

---

## Scope (SF1)

| Workstream | Deliverable |
|---|---|
| SF1-A. Footer chrome | `App` footer region: top hairline, centered row, separators, responsive wrap on narrow viewports; theme tokens (no ad-hoc Keybindr orange clone — BindScope accent tokens, D11/D13) |
| SF1-B. External links | Source → `https://github.com/juliopchile/BindScope`; Report → `https://github.com/juliopchile/BindScope/issues` (`target="_blank"` + `rel="noopener noreferrer"`) |
| SF1-C. Donate disclosure | Clicking Support opens a small popover/dialog (or exclusive disclosure) with Ko-fi action + crypto options; Escape / outside click closes; focus return |
| SF1-D. Crypto UX | Show configured public address + **Copy**; optional **Connect wallet** when `window.ethereum` is available (request accounts / suggest send — no server). Clear fallback when no wallet is installed |
| SF1-E. i18n + a11y | All chrome strings in locale catalogs (en/es/pt/fr/zh/de/ja); meaningful `aria-*` on disclosure and links; operable by keyboard |

Config for Ko-fi URL, receive address, and chain/network label should live as a single typed constant
module (e.g. under `app/src/data/` or `app/src/lib/`) — not scattered in components. Values are
supplied by the project owner at implementation time (see Open Questions).

---

## Explicit Non-Goals

- Steam sync, cloud profiles, game detection (**V3**).
- V4 recommendations.
- Payment processors beyond Ko-fi + on-chain receive (no Stripe, PayPal, etc.).
- Custodial backend, transaction indexing, or “verify donation” flows.
- Hard dependency on MetaMask — wallet connect is progressive enhancement only.
- Catalog growth, new parsers, or new locales (except new chrome message keys for this footer).
- Cloning Keybindr brand/colors (D13).

---

## Constraints (must hold)

- **Static-only (D2):** no server, no required network beyond user-initiated navigation / optional
  wallet RPC the browser already provides.
- **Domain stays pure (D5):** footer is presentation + prefs/config only; do not touch
  `domain/availability`.
- **i18n (D10):** no hardcoded user-facing chrome strings in components.
- **Theme tokens (D11):** support light / dark / system; do not convey meaning by color alone on
  interactive controls (visible labels remain).
- **Responsive (D12):** footer remains usable on phone (wrap or stack); touch targets adequate.

---

## Open Questions (block implementation)

Resolve with the user before coding:

1. **Ko-fi URL** — exact page (e.g. `https://ko-fi.com/…`). Placeholder until provided.
2. **Crypto receive** — public address, chain(s) (e.g. Ethereum mainnet, Polygon, …), and whether
   ENS/name is shown.
3. **Wallet behaviour** — copy-address-only vs attempt `eth_sendTransaction` / deep-link after
   connect; preferred networks if wallet is connected to the wrong chain.
4. **Support control label** — keep Keybindr-like “Support on Ko-fi” vs generic “Support” /
   “Donate” that opens the method picker.
5. **Authorization** — confirm SF1 is the next implementation track ahead of V3.

---

## Suggested file touch list (when authorized)

- `app/src/App.tsx` — mount footer below stage/chrome
- New component(s) under `app/src/components/` (e.g. `SiteFooter`, donate popover)
- Config constants for URLs / address
- `app/src/i18n/locales/*` — new message keys (all seven locales)
- `app/src/styles/index.css` / `STYLES.md` — footer + donate disclosure tokens
- Optional: thin unit test for config shape / copy helper; e2e smoke assert footer links exist
- Docs on close: condense into `PROJECT_ROADMAP.md`; clear this file; update `STYLES.md` shell
  hierarchy

---

## Later phases (not open)

| Phase | Scope |
|---|---|
| **V3** | Steam sync, cloud profiles (adapter — D3), game detection |
| **V4** | Recommendations (“best push-to-talk key for your library”) |

---

## Immediate Next Step

1. User answers Open Questions (Ko-fi URL, crypto address/chain, wallet UX preference).
2. User authorizes **SF1** implementation.
3. Implement SF1-A → SF1-E; then `make test`, `make lint`, `make build` (and `make e2e` if footer
   assertions are added).

## Verification Commands

```sh
make test
make lint
make build
make e2e
```
