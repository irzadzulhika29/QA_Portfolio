# Arteri E-Learning (Stuudi)

Test artifacts & documentation for the **Arteri E-Learning Platform** — a Next.js 16 web app
for national olympiad (lomba olimpiade sains) exam preparation.

## Project Info

- **Display name:** Arteri
- **Codename / repo:** stuudi-frontend
- **Repo:** https://github.com/irzadzulhika29/stuudi-frontend
- **Backend:** lms-project (https://github.com/azmiagr/lms-project)
- **Live URL:** https://stuudi.vercel.app
- **Tech stack:** Next.js 16, React 19, TypeScript 5, Redux Toolkit, TanStack Query,
  Axios, Tailwind 4, Tiptap, KaTeX, Vitest 4, Playwright 1.61

## What's in this folder

| File | Purpose |
|---|---|
| `test-plan.md` | Comprehensive Test Plan (BINUS framework, 19 sections) |

## Test Inventory (existing, in source repo)

| Type | Count | Location |
|---|---|---|
| UI Test Cases | 76 TC (47 positive, 29 negative) | Google Sheet |
| API Test Cases | 100 TC (64 positive, 36 negative) | Google Sheet |
| E2E specs (Playwright) | 5 files (49 tests) | `e2e/*.spec.ts` in stuudi-frontend |
| Unit tests (Vitest) | 13 files (35 tests) | `src/**/__tests__/` in stuudi-frontend |
| CI/CD pipeline | 1 workflow | `.github/workflows/e2e.yml` in stuudi-frontend |

## Key Testing Focus

🔴 **CBT (Computer-Based Testing) Engine** — highest priority
- Tab switch detection + 3-lives anti-cheat
- Auto-save (network failure recovery)
- Timer countdown + auto-submit
- 5 question types: single, multiple, true_false, matching, short_answer
- Math rendering (KaTeX)
- Image questions

🟡 **Auth & Role-based Access** — high priority
- JWT token flow (cookie + localStorage)
- Role redirect (teacher → /dashboard-admin, student → /dashboard)
- 401 auto-logout

🟢 **Course Management & Admin Dashboard** — medium priority
- Course CRUD, content blocks, exam management, participants

## Source Repo Structure (for reference)

```
stuudi-frontend/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/login/     # Public
│   │   ├── (landing)/        # Public
│   │   ├── (user)/           # Student (protected)
│   │   ├── (admin)/          # Teacher (protected)
│   │   └── cbt/              # CBT engine (critical)
│   ├── features/             # Feature modules
│   │   ├── auth/
│   │   ├── user/ (cbt, courses, dashboard, teams)
│   │   ├── admin/ (dashboard, courses, home, participant)
│   │   └── public/ (landing)
│   ├── shared/               # Shared utilities
│   │   ├── api/              # Axios client + JWT interceptor
│   │   ├── components/       # UI library
│   │   ├── config/           # Routes, API_ENDPOINTS, env
│   │   ├── store/            # Redux (auth, exam, ui slices)
│   │   └── types/
│   └── middleware.ts         # JWT decode + role guard
├── e2e/                      # Playwright tests
└── docs/                     # Internal docs
```

## Related Documents

- [Test Plan](./test-plan.md) — 19-section comprehensive test plan
- Test Cases & API Test Cases — Google Sheet
  https://docs.google.com/spreadsheets/d/1Y8emF2b34iH-bxRbeD5mDtD89hG7z2ucQAc7WbTSc9w
- Test Plan Template — `../../docs/test-plan-template.md`
- E2E Patterns skill — `../../skills/e2e-testing-patterns/SKILL.md`
- JS Testing Patterns skill — `../../skills/javascript-testing-patterns/SKILL.md`
