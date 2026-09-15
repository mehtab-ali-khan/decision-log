# AGENTS.md

Guidance for any AI coding agent working in this repository.

## Ground rules

- Do not introduce libraries beyond what is already listed in `README.md`. If something seems missing, ask before adding it.
- Do not persist data to `localStorage`, `sessionStorage`, cookies, or any storage that survives a page refresh. Data must reset on refresh by design.
- Do not build a real backend, API route, or database connection. All data access goes through the dummy API layer in `src/api/`.
- Do not scaffold files, components, hooks, or functions for features that do not exist yet in the current phase (see `ROADMAP.md`). No placeholder or speculative code.
- Do not add code comments unless explicitly asked. Code should be self-explanatory through naming and structure.
- Only write code, don't run any commands, install anything, or start the dev server.
- Don't write or create any tests.
- If a command is needed (install, run, etc.), just tell me what it is, don't execute it.

## Architecture rules

- All data reads/writes go through `src/api/*` functions, which simulate network calls with `setTimeout` and return Promises. Components and pages must never read or mutate mock data directly.
- State is managed with `useReducer` behind custom hooks (e.g. `useDecisions`). No third-party state management library.
- All colors, spacing, font sizes, and radii must reference the single theme config in `src/theme`. No hardcoded style values in components.
- IDs are generated once at creation with `crypto.randomUUID()`. Never use array index as an ID or React key.
- Every data-driven view must explicitly handle loading, empty, and error states: not just the happy path.
- Destructive actions (delete) must always go through a confirm step.

## Style rules

- TypeScript throughout, no `any`.
- Controlled form inputs only.
- Semantic HTML elements (`button`, `label`, etc.), not `div` with click handlers.
- Follow the phase plan in `ROADMAP.md`: implement one phase at a time, do not jump ahead or combine phases.

## Design rules

- The UI must not look AI-generated or templated. Avoid default component library aesthetics.
- All visual decisions trace back to the single theme file, no hardcoded values.
- No gradients. No emoji in UI copy. No icon-only buttons.
- One border-radius value used everywhere.
- One accent color only.
- One subtle shadow at most.
- Animation is limited to hover/focus transitions, toast enter/exit, and skeleton shimmer. Nothing bouncing, scaling in, or decorative.

## Design tokens

- Primary: `#2450E0`
- Background: `#FAFAFA`
- Surface: `#FFFFFF`, border `#E5E5E5`
- Text primary: `#171717`
- Text secondary: `#6B6B6B`
- Border/divider: `#E5E5E5`
- Font: system stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- Border-radius: `6px`, applied consistently
- Status color: plain word + color dot (not icon-only)

## UX rules

- Larger tap targets, generous spacing, labels alongside any icon (no icon-only buttons)
- Confirm dialogs use plain language, e.g. "Delete this decision? This can't be undone."
- Empty states explain the next action in one sentence, not just "No data"