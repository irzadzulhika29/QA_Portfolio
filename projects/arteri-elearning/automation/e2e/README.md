# 🧪 Stuudi (Arteri) - E2E Automation Tests

Playwright End-to-End tests for the Stuudi (Arteri) learning platform.

## 📁 Structure

```
e2e/
├── fixtures.ts                  # Test users, routes, helpers
├── auth.spec.ts                 # Login/Auth flows
├── student-dashboard.spec.ts    # Student dashboard & courses
├── cbt-exam.spec.ts             # CBT (exam engine) - critical path
├── admin.spec.ts                # Admin dashboard & course management
├── api.spec.ts                  # Direct API smoke tests
└── utils/
    └── fixtures.ts
```

## 🚀 Quick Start

```bash
# 1. Install Playwright browsers
npx playwright install chromium firefox

# 2. Set up test environment
cp .env.example .env.test
# Edit .env.test with your test user credentials

# 3. Run tests
npm run test:e2e           # all tests, headless
npm run test:e2e:ui        # interactive UI mode
npm run test:e2e:debug     # step-by-step debug
npm run test:e2e:headed    # see browser
npm run test:e2e:auth      # auth tests only
npm run test:e2e:cbt       # CBT tests only
npm run test:e2e:api       # API tests only
npm run test:e2e:chromium  # specific browser

# 4. View report
npx playwright show-report
```

## 🔧 Configuration

### Environment Variables

Create `.env.test` (or use `.env`):

```bash
BASE_URL=http://localhost:3000              # Frontend URL
API_BASE_URL=http://localhost:8080/api/v1   # Backend API

STUDENT_USER=student.test@stuudi.id
STUDENT_PASSWORD=Test1234!
TEACHER_USER=teacher.test@stuudi.id
TEACHER_PASSWORD=Test1234!
```

## 📊 Test Coverage

### ✅ Auth (`auth.spec.ts`)
- Login with valid student credentials
- Login with valid teacher credentials
- Toggle password visibility
- Wrong password error
- Non-existent user error
- Empty form validation
- Invalid email format
- Unauthenticated dashboard redirect
- Student blocked from admin routes
- Network error handling

### ✅ Student Dashboard (`student-dashboard.spec.ts`)
- Dashboard loads with main sections
- Sidebar navigation
- Exam code input
- Invalid exam code rejection
- Notifications display
- Logout flow
- Course list & search
- Course enrollment

### ✅ CBT Exam Engine (`cbt-exam.spec.ts`)
- System check page (camera + fullscreen)
- Camera permission requirement
- Fullscreen requirement
- Exam interface (timer, header, sidebar)
- Question answering
- Tab switch violation detection
- Submit confirmation

### ✅ Admin (`admin.spec.ts`)
- Dashboard with stats cards
- Exam selector dropdown
- Courses navigation
- Participants page
- Create course form validation
- CSV upload button

### ✅ API Smoke (`api.spec.ts`)
- All public endpoints
- Auth login (positive & negative)
- Token-based protected endpoints
- Role-based access control

## 🎯 CI/CD Integration

The tests are configured to run in CI:
- `forbidOnly: true` (no `.only` commits)
- `retries: 2` in CI
- Screenshots on failure
- Traces on retry
- HTML + JSON reports

## 📝 Writing New Tests

```typescript
import { test, expect } from "@playwright/test";
import { login, TEST_USERS, ROUTES } from "./fixtures";

test.describe("My Feature", () => {
  test("should do something", async ({ page }) => {
    await page.goto(ROUTES.login);
    await login(page, TEST_USERS.student);
    // ... your test
  });
});
```

## 🐛 Debugging Tips

- Use `test.only()` to focus on one test
- Run with `--headed` to see the browser
- Use `page.pause()` to step through
- Check `playwright-report/` for traces/screenshots
- Use `--debug` mode for DevTools inspector