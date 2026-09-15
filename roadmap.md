# Roadmap

Standalone phases.

## Phase 0: Project scaffold
- [x] Vite + React + TypeScript init
- [x] Install react-router-dom, react-hot-toast, lucide-react, tailwindcss
- [x] Folder structure: `src/{pages,components,hooks,api,types,theme}`
- [x] Tailwind wired to a single theme config using the design tokens in `README.md` / `AGENTS.md` (primary `#2450E0`, neutral grays, system font stack, `6px` radius)

## Phase 1: Types + mock data + dummy API layer
- [x] `types/decision.ts`, `types/project.ts`
- [x] `api/mockData.ts`: in-memory seed data
- [x] `api/decisions.ts`, `api/projects.ts`: async functions with simulated delay

## Phase 2: State layer
- [x] `hooks/useDecisions.ts` backed by `useReducer`
- [x] Actions: fetch start/success/error, add, update, delete, toggle status

## Phase 3: Routing skeleton
- [x] `/` landing placeholder, `/app` Decision Log

## Phase 4: Decision Log core UI (desktop list)
- [ ] List view, all fields, newest-first, paginated (10/page)
- [ ] Skeleton loader, empty state

## Phase 5: Create decision
- [ ] Form: default current date, project (hybrid select/text, auto-increment default), decision text, reason, active toggle default true
- [ ] Toast on success

## Phase 6: Edit / delete / toggle active
- [ ] Edit form (prefilled, project changeable)
- [ ] Delete with confirm dialog + toast
- [ ] Inline active/inactive toggle + toast

## Phase 7: Search + filters
- [ ] Single search bar across all fields
- [ ] Status filter, project filter

## Phase 8: Responsive mobile view
- [ ] Card layout for mobile breakpoint, pagination retained

## Phase 9: Landing page
- [ ] Static content, single "Try Now" action to `/app`

## Phase 10: SEO + polish
- [ ] Title, meta description, Open Graph tags
- [ ] Final visual pass against theme file

## Phase 11: Deploy
- [ ] GitHub Pages config (base path, deploy workflow)
