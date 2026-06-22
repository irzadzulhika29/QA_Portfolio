# IFL Chapter Malang

Test artifacts & documentation for the **Indonesian Future Leaders Chapter Malang** website.

## Project Info

- **Display name:** IFL Chapter Malang
- **Codename:** website-ifl
- **Repo:** https://github.com/irzadzulhika29/fe_iflchaptermalang
- **Live URL:** https://iflchaptermalang.org/
- **Tech stack:** Vite 5, React 18, JavaScript (not TypeScript), Tailwind 3,
  TanStack React Query, Axios, CKEditor 5, ImageKit CDN, Midtrans payment, Framer Motion

## What's in this folder

| File | Purpose |
|---|---|
| `test-plan.md` | Comprehensive Test Plan (BINUS framework, 19 sections) |
| `test-plan.pdf` | Print-ready PDF version |

## Test Inventory (current state)

| Type | Count | Status |
|---|---|---|
| UI Test Cases | 0 | ❌ Not yet created |
| API Test Cases | 0 | ❌ Not yet created |
| E2E specs (Playwright) | 0 | ❌ Not yet created |
| Unit tests (Vitest) | 0 | ❌ Not yet created |
| Test framework | — | ❌ **Not installed** |
| CI/CD test pipeline | 0 | ❌ Only deploy.yml exists |
| **Test coverage** | **0%** | 🚨 **Critical gap** |

## Key Testing Focus

🔴 **Donation + Midtrans Payment** — highest priority (revenue stream)
- Chatbot donation flow (13 components!)
- Midtrans Snap integration
- Payment success/failure/timeout
- QRIS donation
- Donation history

🟡 **Authentication & 3-Level Role Protection** — high priority
- Login (email/password + Google OAuth)
- 3 roles: admin, bismar, copywriter
- ProtectedToken, ProtectedDashboard, ProtectedRoles

🟢 **Blog + CKEditor + Admin** — medium priority
- Blog CRUD with rich text editor
- Image upload via ImageKit
- Category management

🟢 **Event & Volunteer Management** — medium priority
- Public event listing
- Event registration
- Volunteer recruitment

⚪ **Public Pages** — lower priority
- Home, About, Project, Department pages
- 404 Not Found, Coming Soon

## Roadmap (Phase 0-12)

| Phase | Focus | Duration |
|---|---|---|
| 0 | Setup test framework (Vitest + RTL + Playwright) | 3 days |
| 1 | Smoke test critical paths (E2E) | 3 days |
| 2 | Auth & role-based | 3 days |
| 3 | Donasi + Midtrans | 7 days |
| 4 | Blog + CKEditor | 5 days |
| 5 | Event + Volunteer | 5 days |
| 6 | Public pages | 4 days |
| 7 | Admin dashboard | 5 days |
| — | Regression + UAT + Sign-off | 5 days |
| **Total** | | **~6 weeks** |

## Source Repo Structure (for reference)

```
fe_iflchaptermalang/
├── src/
│   ├── components/      67 components (chatbot = 13!)
│   ├── features/        7 modul (auth, blog, campaign, donation, event, profile, volunteer)
│   ├── page/            3 jenis page (root, dashboard, auth)
│   ├── layouts/         9 layouts
│   ├── routes/          ProtectedRoute (3 level: Token, Dashboard, Roles)
│   ├── libs/            api/, midtrans/
│   ├── utils/, assets/, fonts/, static/
│   └── App.jsx          (Router utama, 33 routes)
├── .github/workflows/
│   └── deploy.yml       (FTP deploy to cPanel — no test pipeline yet!)
├── public/
└── package.json
```

## Key Architectural Differences from Arteri E-Learning

| Aspect | Arteri (Stuudi) | IFL Malang |
|---|---|---|
| Framework | Next.js 16 (SSR) | Vite + React 18 (SPA) |
| Language | TypeScript | JavaScript |
| Test files | 18 (13 unit + 5 E2E) | **0** |
| Test framework | Vitest + Playwright | Not set up |
| State | Redux + React Query | React Query only |
| Rich text | Tiptap | CKEditor 5 |
| Image | Native + Supabase | ImageKit CDN |
| Payment | — | Midtrans |
| Critical feature | CBT engine | Donasi + Chatbot |
| Hosting | Vercel | cPanel (FTP) |

## Related Documents

- [Test Plan](./test-plan.md) — 19-section comprehensive test plan
- [Test Plan Template](../../docs/test-plan-template.md)
- [Stuudi Test Plan](../arteri-elearning/test-plan.md) — reference for comparison
- [JS Testing Patterns](../../skills/javascript-testing-patterns/SKILL.md)
- [E2E Testing Patterns](../../skills/e2e-testing-patterns/SKILL.md)
