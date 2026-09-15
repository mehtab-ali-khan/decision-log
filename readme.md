# Decision Log

A small app for recording project decisions: what was decided, why, when, and whether it's still active.

## Stack

- React + Vite + TypeScript
- react-router-dom
- Lifted `useState` / `useReducer` (no third-party state library)
- react-hot-toast
- lucide-react
- Tailwind CSS

## Scope

- No authentication, backend, or database
- No persistence: data resets on refresh
- Data layer is a dummy API (in-memory data, simulated network delay via `setTimeout`, returns Promises) so a real backend can later be swapped in without touching components

## Features

- Project-scoped decisions (project field is a hybrid select/text input, auto-suggests next default project name e.g. `Project1`, `Project2`)
- Create, edit, delete decisions
- Toggle decision active/inactive status
- Single search bar across all fields, plus status and project filters
- Pagination (10 per page)
- Responsive: list view on desktop, card view on mobile
- Skeleton loaders, toast notifications, confirm dialog on delete

## Development

```
npm install
npm run dev
```

## Build

```
npm run build
```

## Deploy

Deployed via GitHub Pages.

## Design

Modern SaaS, clean and minimal: restrained over decorative. Grayscale UI with a single accent color, system font stack, one border-radius value, minimal purposeful animation (hover/focus transitions, toast enter/exit, skeleton shimmer only).

- Primary: `#2450E0`
- Background: `#FAFAFA`
- Surface: `#FFFFFF`, border `#E5E5E5`
- Text: `#171717` primary, `#6B6B6B` secondary
- Font: system stack (no Google Fonts)
- Border-radius: `6px` everywhere
- No gradients, no emoji, no icon-only buttons

All values live in `src/theme` as the single source of truth.

## Project Structure

```
src/
  api/         dummy API functions (decisions, projects, mock data)
  components/  UI components
  hooks/       state hooks (useDecisions, etc.)
  pages/       route-level pages (landing, app)
  theme/       single theme config (colors, spacing, font, radius)
  types/       shared TypeScript interfaces
```