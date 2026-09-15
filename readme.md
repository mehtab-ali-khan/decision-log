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
- Date-grouped card timeline, responsive at every breakpoint
- Skeleton loaders, toast notifications, undo-on-delete

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