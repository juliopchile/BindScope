<!--
  User QA notes (source of requirements for the UI Refresh track).
  Implementation plan: PLAN.md (phases UR1–UR5). Decision: DECISIONS.md D13.
  Do not treat this file as architecture; permanent design lives in STYLES.md / PROJECT_STRUCTURE.md.
-->

El Keyboard debería estar más arriba. Debería estar como cosa principal de la pantalla debajo del header y ocupar más espacio horizontal. Falta un selector de tipo de teclado y también mostrar el mouse, similar a los screenshots de referencia "example_csbinds.png" y "example_keybindr.png".

Actualmente hay partes del keyboard que no se logran visualizar porque se trunca su vista horizontalmente.

El color de tecla disponible debería ser transparente o gris. no verde. Más similar a keybindr.

La interfaz en si es medio fea, faltan menús. Poder desplegar abriendo o cerrando menús.

Falta un selector de tipo de teclado y también mostrar el mouse, similar a los screenshots de referencia "example_csbinds.png" y "example_keybindr.png".

Deberiamos de tener un layout más similar al de [keybindr](https://keybindr.github.io/). Es importante que se realice un análisis de la página web, su javascript y html en su totalidad al igual que test de exploración para entender mejor lo que ellos hacen y como parecernos más.

Solo como referencia se utilizó una extensión de chromium para obtener un DESIGN.md de la página de Keybindr, aclaro que esto no es el DESIGN.md real, es algo obtenido de forma automática con una extensión y se desconoce si es la real.

```
# Keybindr

## Mission
Create implementation-ready, token-driven UI guidance for Keybindr that is optimized for consistency, accessibility, and fast delivery across dashboard web app.

## Brand
- Product/brand: Keybindr
- URL: https://keybindr.github.io/
- Audience: authenticated users and operators
- Product surface: dashboard web app

## Style Foundations
- Visual style: structured, tokenized, content-first
- Main font style: `font.family.primary=Inter`, `font.family.stack=Inter, system-ui, sans-serif`, `font.size.base=13px`, `font.weight.base=400`, `font.lineHeight.base=normal`
- Typography scale: `font.size.xs=11px`, `font.size.sm=12px`, `font.size.md=13px`, `font.size.lg=13.33px`, `font.size.xl=14px`, `font.size.2xl=15px`, `font.size.3xl=16px`, `font.size.4xl=28px`
- Color palette: `color.text.primary=#d0d0d0`, `color.text.secondary=#888888`, `color.surface.base=#000000`, `color.text.inverse=#f0c060`, `color.surface.muted=#3d3420`, `color.surface.raised=#2e2e2e`, `color.surface.strong=#1a1a1a`, `color.border.default=rgb(208, 208, 208) rgb(208, 208, 208) rgb(42, 42, 42)`, `color.border.muted=#3a3a3a`
- Spacing scale: `space.1=2px`, `space.2=4px`, `space.3=6px`, `space.4=7px`, `space.5=8px`, `space.6=10px`, `space.7=12px`, `space.8=14px`
- Radius/shadow/motion tokens: `radius.xs=3px`, `radius.sm=4px`, `radius.md=6px`, `radius.lg=50px` | `motion.duration.instant=100ms`, `motion.duration.fast=150ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: buttons (44), links (3), inputs (2), tables (2), navigation (1).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.

```