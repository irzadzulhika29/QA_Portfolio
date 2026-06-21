# Stuudi (Arteri) — Testing

Test artifacts for the [Stuudi](https://github.com/irzadzulhika29/stuudi-frontend) project.
Adaptive learning platform for olimpiade (national science olympiad) preparation.

## What's here

This is a **snapshot** of test files from the Stuudi source repo. The source code itself lives
in `stuudi-frontend/` — only test artifacts + config are kept here for reference and reuse.

```
stuudi/
├── e2e/                    # Playwright E2E (copied from stuudi-frontend/e2e/)
│   ├── auth.spec.ts        # 10 tests — login/logout/registration
│   ├── student-dashboard.spec.ts  # 9 tests
│   ├── cbt-exam.spec.ts    # 7 tests — CBT critical path (PRIORITY)
│   ├── admin.spec.ts       # 8 tests
│   ├── api.spec.ts         # 15 tests
│   ├── utils/fixtures.ts   # test data + auth helpers
│   └── README.md
├── unit/                   # Vitest unit tests (copied from src/**/__tests__/)
│   ├── INDEX.md            # list of all 13 test files
│   └── features/...        # actual test files
├── playwright.config.ts    # Playwright config
├── vitest.config.ts        # Vitest config
├── .env.example            # env template
└── .github/workflows/e2e.yml  # CI/CD pipeline
```

## How to run

```bash
# Unit tests (Vitest)
npm test
npm run test:coverage    # with coverage report

# E2E tests (Playwright)
npx playwright install   # first time only
npm run test:e2e         # all E2E tests
npm run test:e2e:ui      # interactive UI mode
npm run test:e2e:debug   # debug mode

# Targeted E2E (per feature)
npm run test:e2e:auth
npm run test:e2e:cbt
npm run test:e2e:api
npm run test:e2e:admin

# Cross-browser
npm run test:e2e:chromium
npm run test:e2e:firefox
```

## CBT (Computer-Based Testing) — Priority

The CBT engine is the **most critical** feature of Stuudi (national olympiad exam). It has
dedicated test coverage in `e2e/cbt-exam.spec.ts` covering:
- Fullscreen detection & tab-switch prevention
- Timer countdown & auto-submit
- Auto-save (network failure recovery)
- Question navigation (skip, mark, review)
- Answer state persistence
- Camera/microphone permission flow

## Test counts

| Type | Files | Tests |
|---|---|---|
| E2E (Playwright) | 5 specs + 1 fixture | 49 |
| Unit (Vitest) | 13 | 35 |
| **Total** | **19** | **84** |

(Last verified against `stuudi-frontend` HEAD.)

## Source

- Repo: https://github.com/irzadzulhika29/stuudi-frontend
- E2E live: https://stuudi.vercel.app
- Backend: lms-project (separate repo)

## Related

- See [`../../skills/e2e-testing-patterns`](../../skills/e2e-testing-patterns/SKILL.md) for
  Playwright patterns used here
- See [`../../skills/javascript-testing-patterns`](../../skills/javascript-testing-patterns/SKILL.md)
  for Vitest/Testing Library patterns used in the unit tests
