# Test Plan — Arteri E-Learning (Stuudi)

> **Project:** Arteri E-Learning Platform (frontend repo: `stuudi-frontend`)
> **Repo:** https://github.com/irzadzulhika29/stuudi-frontend
> **Document Version:** v1.0
> **Date:** 2026-06-21
> **Prepared By:** Muhammad Irza Dzulhika (QA Intern Candidate)
> **Template:** Based on BINUS University Test Plan Framework (Mulyanto, 2018)

---

## Document Information

| Field | Value |
|---|---|
| **Project Name** | Arteri E-Learning Platform (codename: Stuudi) |
| **Document Version** | v1.0 |
| **Date** | 2026-06-21 |
| **Prepared By** | Muhammad Irza Dzulhika |
| **Reviewed By** | _(to be assigned)_ |
| **Approved By** | _(to be assigned)_ |
| **Frontend Repo** | `github.com/irzadzulhika29/stuudi-frontend` |
| **Backend Repo** | `github.com/azmiagr/lms-project` (out of scope) |
| **Live URL** | `https://stuudi.vercel.app` |

---

## 1. Introduction (Pendahuluan)

### 1.1. Rencana Pengujian
Dokumen ini menjabarkan rencana pengujian komprehensif untuk platform **Arteri E-Learning** — aplikasi
web berbasis Next.js 16 yang dirancang untuk mempersiapkan siswa menghadapi olimpiade sains nasional.
Pengujian akan mencakup 4 area utama: **CBT (Computer-Based Testing) engine**, **autentikasi & role
management**, **manajemen kursus & konten**, dan **dashboard admin/teacher**. Pengujian dilakukan
pada frontend (Next.js) dengan fokus pada functional, integration, dan end-to-end testing.

### 1.2. Tujuan Pengujian
Tujuan pengujian platform Arteri adalah:
- **Memastikan CBT engine** (fitur paling kritis) berjalan sempurna untuk ujian olimpiade nasional
  - Tab switch detection + 3-lives anti-cheat system berfungsi
  - Auto-save jawaban saat network failure
  - Timer countdown akurat
  - 5 tipe soal (single, multiple, true/false, matching, short_answer) berjalan sesuai spek
- **Memvalidasi role-based access** (student vs teacher vs admin) sesuai `src/middleware.ts`
- **Memverifikasi integrasi API** dengan backend `lms-project` (60+ endpoint di `API_ENDPOINTS`)
- **Mengurangi regression** dengan E2E automation + unit test yang sudah ada
- **Memenuhi standar kualitas** untuk apply magang QA IT

### 1.3. Metodologi Pengujian
| Metode | Tools | Coverage |
|---|---|---|
| **Black-box functional testing** | Manual + Postman (API) | Semua fitur user-facing |
| **Component unit testing** | Vitest + Testing Library | 13 test files existing (CBT-focused) |
| **End-to-end testing** | Playwright | 5 spec files existing |
| **Security testing** | OWASP ZAP, manual probing | Auth flow, role bypass, JWT |
| **Performance testing** | k6 (planned) | CBT engine load test |
| **Accessibility testing** | axe-core (planned) | Form labels, keyboard nav, contrast |

### 1.4. Objek Pengujian
| Layer | Technology | Test Scope |
|---|---|---|
| **Frontend** | Next.js 16.0.10 (App Router) + React 19.2.1 | Full UI + client logic |
| **API Client** | Axios 1.13 (with JWT interceptor) | All 60+ endpoints |
| **State Management** | Redux Toolkit + React Query | Auth slice, exam slice, UI slice |
| **CBT Engine** | Custom React + Redux (5 question types) | Full functional |
| **Auth Middleware** | Next.js middleware.ts (JWT decode) | Role-based redirect |
| **Backend (proxy)** | `lms-project` (Go/Python) | E2E only (out of scope) |

### 1.5. Arsitektur Sistem yang Diuji

```
┌────────────────────────────────────────────────────────────────┐
│                    Browser (Chrome/Firefox/Safari)              │
│              Next.js 16 SPA + Server Components                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  src/app/          (Routes — App Router)              │    │
│  │    (auth)/login    (Public)                          │    │
│  │    (landing)/      (Public)                          │    │
│  │    (user)/         (Student — protected)             │    │
│  │    (admin)/        (Teacher — protected)             │    │
│  │    cbt/            (CBT — protected, critical)       │    │
│  │  src/middleware.ts (JWT decode + role guard)         │    │
│  │  src/features/     (auth, user, admin, public)       │    │
│  │  src/shared/       (api, components, store, hooks)   │    │
│  └──────────────────────────────────────────────────────┘    │
│         │ HTTPS / Bearer JWT                                   │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────────┐
│     Backend (lms-project) — out of scope for this plan        │
│     Endpoints: /auth/*, /student/*, /teacher/*, /exams/*      │
└────────────────────────────────────────────────────────────────┘
```

### 1.6. Pembagian Sistem untuk Pengujian Unit dan Integrasi
| Test Level | Target | Tools | Lokasi |
|---|---|---|---|
| **Unit test** | Pure functions, hooks, isolated components | Vitest + Testing Library | `src/**/__tests__/` |
| **Component integration** | Component + Redux + hooks | Vitest + Testing Library | `src/**/__tests__/` |
| **API integration** | Axios calls mocked via MSW or mock | Vitest | `src/services/__tests__/` |
| **E2E** | Full flow (UI → API → DB) | Playwright | `e2e/*.spec.ts` |
| **Manual** | Visual regression, exploratory | Manual + screenshots | Staging environment |

---

## 2. Test Items (Item Pengujian)

### 2.1. Item yang Akan Diuji

#### A. **Authentication & Authorization** (HIGH PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| AUTH-01 | Login form validation & submit | UI/Functional | `src/features/auth/login/` |
| AUTH-02 | JWT token storage (cookie + localStorage) | Integration | `src/middleware.ts` |
| AUTH-03 | Role-based redirect (teacher→admin, student→dashboard) | Integration | `src/middleware.ts` |
| AUTH-04 | 401 auto-logout via Axios interceptor | Integration | `src/shared/api/api.ts` |
| AUTH-05 | Cross-role access block (student→admin routes) | Security | `src/middleware.ts` |

#### B. **CBT (Computer-Based Testing) Engine** (HIGHEST PRIORITY — CRITICAL)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| CBT-01 | Exam intro screen & start action | UI/Functional | `src/features/user/cbt/` |
| CBT-02 | Question rendering (5 types) | UI/Functional | `src/features/user/cbt/components/` |
| CBT-03 | Answer state management (Redux) | State | `src/features/user/cbt/utils/answerState.ts` |
| CBT-04 | Auto-save on answer change | Integration | `src/features/user/cbt/hooks/useAutoSave.ts` |
| CBT-05 | Timer countdown + auto-submit | Critical | `src/features/user/cbt/hooks/useExamTimer.ts` |
| CBT-06 | **Tab switch detection + 3-lives system** | Critical | `src/features/user/cbt/hooks/useFullscreenGuard.ts` + `examService.recordTabSwitch` |
| CBT-07 | Question navigation (skip, mark, review) | UI/Functional | `src/features/user/cbt/components/QuestionNavigation.tsx` |
| CBT-08 | Exam summary screen | UI/Functional | `src/features/user/cbt/components/ExamSummary.tsx` |
| CBT-09 | Submit exam & result | Integration | `examService.submitExam` |
| CBT-10 | Resume from snapshot (localStorage cache) | Edge case | `examService.transformExamToReduxPayload` |
| CBT-11 | Math rendering (KaTeX) | UI | `src/shared/components/math/` |
| CBT-12 | Image question rendering | UI | `QuestionCard.tsx` |

#### C. **Student Dashboard & Course Management** (MEDIUM PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| STU-01 | Student dashboard (upcoming exam, courses) | UI/Functional | `src/features/user/dashboard/` |
| STU-02 | Browse courses (search, filter, pagination) | UI/Functional | `src/features/user/courses/` |
| STU-03 | Course detail & topic tree | UI/Functional | `src/features/user/courses/` |
| STU-04 | Course content (text/media/quiz blocks) | UI/Functional | `src/features/user/courses/` |
| STU-05 | Quiz flow (start, answer, submit, result) | Integration | `COURSES.QUIZ.*` endpoints |
| STU-06 | Notes per topic (CRUD) | UI/Functional | `COURSES.TOPIC_NOTES` endpoint |
| STU-07 | Notifications (list, mark read, delete) | UI/Functional | `COURSES.NOTIFICATIONS*` |
| STU-08 | Team details view | UI/Functional | `src/features/user/teams/` |

#### D. **Admin/Teacher Dashboard** (MEDIUM PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| ADM-01 | Admin dashboard home (stats) | UI/Functional | `src/features/admin/dashboard/home/` |
| ADM-02 | Courses management (CRUD) | Integration | `TEACHER.COURSES*` endpoints |
| ADM-03 | Topic & content management | Integration | `TEACHER.ADD_TOPIC/UPDATE_TOPIC/DELETE_TOPIC` |
| ADM-04 | Quiz authoring (Tiptap editor) | UI/Functional | `src/features/admin/dashboard/courses/` |
| ADM-05 | Block editor (text/media/quiz) | UI/Functional | `TEACHER.ADD_*_BLOCK` endpoints |
| ADM-06 | Exam management (CRUD) | Integration | `TEACHER.EXAM*` endpoints |
| ADM-07 | Exam dashboard (analytics) | UI/Functional | `TEACHER.GET_EXAM_DASHBOARD` |
| ADM-08 | Cheating report (per exam) | UI/Functional | `src/app/(admin)/dashboard-admin/cheating-report/` |
| ADM-09 | Disqualified participants list | UI/Functional | `TEACHER.DISQUALIFIED_PARTICIPANTS` |
| ADM-10 | Participants management (bulk upload) | Integration | `TEACHER.ADD_PARTICIPANT_BULK` |

#### E. **Public / Landing** (LOW PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| PUB-01 | Landing page (home) | UI/Visual | `src/features/public/landing/` |
| PUB-02 | Product page | UI/Visual | `src/app/(landing)/produk/` |
| PUB-03 | About us page | UI/Visual | `src/app/(landing)/tentang-kami/` |

### 2.2. Item yang TIDAK Akan Diuji
- **Backend API implementation** (lms-project) — di luar scope frontend testing
- **Email delivery** (notification system) — out of scope
- **Payment gateway** — tidak ada di project ini
- **Mobile native app** — tidak ada, hanya web responsive
- **Performance under 10K concurrent users** — akan diukur terpisah dengan k6
- **Penetration testing** — out of scope, akan dilakukan oleh security team
- **Cross-browser legacy** (IE11, Safari < 14) — target browser modern saja

### 2.3. Definisi Istilah Penting
| Istilah | Definisi |
|---|---|
| **CBT** | Computer-Based Testing — sistem ujian digital olimpiade |
| **JWT** | JSON Web Token untuk authentication |
| **Attempt** | Sesi pengerjaan ujian oleh satu siswa untuk satu exam |
| **Lives** | "Nyawa" siswa (max 3) — berkurang saat terdeteksi tab switch |
| **Snapshot** | Cache soal di localStorage untuk recovery saat resume |
| **Block** | Unit konten dalam course (text / media / quiz) |
| **Topic** | Sub-bab dalam Course |
| **Course** | Mata pelajaran / paket pembelajaran |
| **Examination** | Ujian yang dijadwalkan teacher untuk student |
| **Disqualified** | Student yang kehabisan lives (3 tab switches) |

---

## 3. Special Terminology (Istilah Khusus)

| Istilah | Definisi |
|---|---|
| **Tab switch** | Aksi keluar dari halaman ujian ke tab lain (window.blur) |
| **Fullscreen guard** | Hook yang memaksa fullscreen + detect escape |
| **Auto-save** | Mekanisme simpan jawaban otomatis setiap X detik |
| **Resume** | Lanjut ujian setelah disconnect (data dari localStorage) |
| **Question type** | Tipe soal: `single`, `multiple`, `true_false`, `matching`, `short_answer` |
| **Matching pair** | Pasangan sisi kiri-kanan untuk soal matching |
| **Side** | Posisi opsi di soal matching (`left` / `right`) |
| **Bearer token** | Format `Authorization: Bearer <token>` |
| **Route group** | Next.js folder `(name)` yang tidak masuk URL (untuk layout grouping) |
| **App Router** | Next.js 13+ routing system (vs legacy Pages Router) |

---

## 4. Testing Location (Lokasi Pengujian)

| Environment | URL | Tujuan | Akses |
|---|---|---|---|
| **Local** | `http://localhost:3000` + `http://localhost:8080/api/v1` | Development testing | Developer laptop |
| **Staging** | `https://staging.stuudi.app` (planned) | Pre-production QA | QA team |
| **Production** | `https://stuudi.vercel.app` | Smoke test only | Public |
| **Mock backend** | MSW (Mock Service Worker) | Unit test isolation | Test runner |

**Diagram setup pengujian:**
```
┌────────────────────────────────────────────────────────────────┐
│  QA Tester                                                       │
│  (Browser Chrome 120+, Firefox 120+, Safari 17+)                 │
└────────────┬───────────────────────────────────────────────────┘
             │ HTTPS
             ▼
┌────────────────────────────────────────────────────────────────┐
│  Staging (https://staging.stuudi.app)                            │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │  Next.js 16      │ ──────► │  lms-project     │              │
│  │  (Arteri FE)     │ HTTPS   │  (Arteri BE)     │              │
│  └──────────────────┘         └──────────────────┘              │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Testing Schedule (Jadwal Pengujian)

| No | Kegiatan | Tanggal Mulai | Tanggal Selesai | PIC | Status |
|---|---|---|---|---|---|
| 1 | Test Plan Review | 2026-06-21 | 2026-06-22 | Irza | ✅ Done |
| 2 | Test Case Creation (existing) | 2026-06-19 | 2026-06-20 | Irza | ✅ Done (76 TC) |
| 3 | API Test Case Creation (existing) | 2026-06-20 | 2026-06-20 | Irza | ✅ Done (100 TC) |
| 4 | E2E Automation Setup (Playwright) | 2026-06-20 | 2026-06-21 | Irza | ✅ Done (5 specs) |
| 5 | **Iterasi 1: CBT engine full test** | 2026-06-22 | 2026-06-28 | QA Team | ⏳ Planned |
| 6 | **Iterasi 2: Auth & role-based** | 2026-06-29 | 2026-07-03 | QA Team | ⏳ Planned |
| 7 | **Iterasi 3: Course & content** | 2026-07-06 | 2026-07-10 | QA Team | ⏳ Planned |
| 8 | **Iterasi 4: Admin dashboard** | 2026-07-13 | 2026-07-17 | QA Team | ⏳ Planned |
| 9 | Regression Test (full) | 2026-07-20 | 2026-07-22 | QA Team | ⏳ Planned |
| 10 | UAT (User Acceptance Test) | 2026-07-23 | 2026-07-24 | Stakeholder | ⏳ Planned |
| 11 | Sign-off & Release v1.0 | 2026-07-25 | 2026-07-25 | PM | ⏳ Planned |

---

## 6. Testing Quality Criteria (Kriteria Kualitas Pengujian)

| Kriteria | Target |
|---|---|
| Kesiapan environment (staging) | 100% deployed & smoke test passed |
| Ketersediaan test data | Akun student + teacher test tersedia di staging |
| Build stability | Build sukses tanpa critical blocker |
| Kesiapan test case | 176 TC finalized (76 UI + 100 API) ✅ |
| Code coverage (unit) | Target minimal 70% untuk CBT engine |
| E2E coverage | Minimal 1 happy-path + 1 sad-path per fitur critical |
| Dokumentasi | Test plan + test summary report |

---

## 7. Entry Criteria (Kriteria Masuk)

- [x] Spesifikasi kebutuhan (requirements) sudah didokumentasikan di `API_ENDPOINTS`
- [x] Test case UI sudah dibuat (76 TC) di Google Sheet
- [x] Test case API sudah dibuat (100 TC) di Google Sheet
- [x] Environment pengujian (local + staging) tersedia
- [x] Test data (akun student + teacher test) sudah dibuat
- [x] Tools testing terinstall (Vitest, Playwright, Postman, VS Code)
- [x] Backend `lms-project` running di `localhost:8080` (untuk E2E)
- [x] E2E automation setup (5 spec files) sudah dibuat

---

## 8. Exit / Suspension Criteria (Kriteria Keluar / Penangguhan)

**Suspension (pengujian ditunda):**
- Build gagal deploy ke staging
- Backend `lms-project` down > 30 menit
- Ada critical bug yang block > 50% test case CBT
- Test environment tidak stabil (sering timeout)

**Resume (pengujian dilanjutkan):**
- Build sudah stabil di staging
- Backend sudah running normal
- Critical bug sudah diperbaiki
- Environment sudah stabil minimal 1 jam

---

## 9. Completion Criteria (Kriteria Penyelesaian)

- [ ] **100% CBT test case** dieksekusi (highest priority, 18 TC)
- [ ] Minimal **95% test case** total dieksekusi (167 dari 176)
- [ ] **0 critical bug** open
- [ ] **0 high-priority bug** open (atau di-defer untuk v1.1)
- [ ] Semua **regression test** passed
- [ ] Test summary report sudah dibuat
- [ ] Sign-off dari stakeholder

---

## 10. Environmental Requirements (Kebutuhan Lingkungan)

### 10.1. Perangkat Keras (Hardware)
| Device | Spec | Jumlah |
|---|---|---|
| Laptop Tester | RAM 16GB, SSD 512GB, i5 ke atas | 1 (QA) |
| Smartphone (Android) | Android 13+, 6GB RAM (responsive test) | 1 |
| Tablet (iPad) | iPad Air, iOS 17+ (responsive test) | 1 |

### 10.2. Perangkat Lunak (Software)
| Software | Versi | Kegunaan |
|---|---|---|
| Node.js | 18+ | Runtime |
| Google Chrome | 120+ | Browser testing (primary) |
| Firefox | 120+ | Cross-browser |
| Safari | 17+ | macOS testing |
| Playwright | 1.61+ | E2E test runner |
| Vitest | 4.0+ | Unit test runner |
| Postman | Latest | API testing (manual) |
| Newman | Latest | Postman CLI (automation) |
| VS Code | Latest | Code editor |
| k6 | Latest | Load testing (planned) |
| axe-core | Latest | Accessibility testing (planned) |

### 10.3. Jaringan
- Internet min. 10 Mbps (untuk akses staging & API eksternal)
- Tidak ada VPN yang dibutuhkan (semua public)

### 10.4. Konfigurasi Environment
| Variable | Value | Keterangan |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | Frontend dev |
| `NEXT_PUBLIC_BASE_API` | `http://localhost:8080/api/v1` | Backend API |
| `API_BASE_URL` | `http://localhost:8080/api/v1` | E2E test config |
| `STUDENT_USER` | `student.test@stuudi.id` | Test student |
| `TEACHER_USER` | `teacher.test@stuudi.id` | Test teacher |
| Cookie name | `access_token` | JWT storage |

---

## 11. Test Systems (Sistem Pengujian)

| Komponen | Deskripsi | Status |
|---|---|---|
| **Test case UI** | Google Sheet "Test Cases" — 76 TC (47 positif, 29 negatif) | ✅ Ada |
| **Test case API** | Google Sheet "API Test Cases" — 100 TC (64 positif, 36 negatif) | ✅ Ada |
| **Test plan** | Dokumen ini (`test-plan.md`) | ✅ Ada |
| **E2E scripts** | `e2e/*.spec.ts` — 5 spec files (49 test) | ✅ Ada |
| **Unit tests** | `src/**/__tests__/*.test.ts(x)` — 13 files (35 test) | ✅ Ada |
| **Test runner** | Vitest config + Playwright config | ✅ Ada |
| **CI/CD pipeline** | `.github/workflows/e2e.yml` (Playwright) | ✅ Ada |
| **API client (Postman)** | _Belum dibuat_ — planned | ⏳ Planned |
| **k6 load test** | _Belum dibuat_ — planned | ⏳ Planned |

---

## 12. External Factors (Faktor Eksternal)

- **Backend `lms-project`** — harus running untuk E2E test
  - Disimpan terpisah (bukan bagian dari frontend repo)
  - Endpoint contract harus stabil; breaking change perlu dikoordinasikan
- **Supabase** — digunakan untuk image storage (CDN `dllvucwgezsuhwktkwxd.supabase.co`)
  - Reliability: tergantung Supabase SLA
- **Image CDN (unsplash, ui-avatars)** — untuk avatar & demo content
  - Reliability: 99.9% SLA
- **Vercel** — hosting frontend
  - Reliability: 99.99% SLA
- **Tiptap editor** — untuk authoring konten (dari npm)
  - Update berkala, perlu cek breaking changes

---

## 13. Team Composition (Komposisi Tim)

| Nama | Peran | Tanggung Jawab |
|---|---|---|
| **Irza** (Muhammad Irza Dzulhika) | QA Lead / Tester | Test planning, execution, automation |
| **Alfi** (dev) | Frontend Developer | Bug fixing, E2E spec review |
| **Dzaki** | Support contact | Issue escalation |
| **Nopal** | Support contact | Issue escalation |
| **Pak Aminul** (PKL supervisor) | Reviewer | Test plan review (academic) |

**External Participants:** Guru/dosen pembimbing olimpiade (untuk UAT CBT)

**Hand-off Points:**
- Developer → QA: setiap sprint / iterasi (via PR)
- QA → Stakeholder: setiap release untuk UAT

---

## 14. Revision Handover Management (Manajemen Penyerahan Revisi)

- **Version control**: Git (GitHub)
- **Build deployment**: otomatis via Vercel (per push ke `main`)
- **QA testing window**: minimal 1x24 jam setelah build baru di staging
- **Changelog format**:
  ```
  [v0.1.X] 2026-06-21
  - FIXED: Bug #123 - Login error 500 on expired token
  - ADDED: CBT tab switch counter UI
  - CHANGED: Redesign QuestionCard with new layout
  - TESTED: 18 CBT test cases executed
  ```
- **Notifikasi**: GitHub Issues + Slack `#qa-coordination` (planned)

---

## 15. Test Suite Execution (Eksekusi Test Suite)

### Strategi per fase:
| Fase | Test Suite | Strategi | Tools |
|---|---|---|---|
| **Smoke** | 5 critical-path tests | Automated on every PR | Playwright |
| **CBT regression** | 18 CBT test cases (UI) + 7 CBT E2E | Automated on every PR to CBT module | Vitest + Playwright |
| **Auth regression** | 10 auth test cases (UI) + 10 auth E2E | Automated | Playwright |
| **Functional** | Per fitur (per modul) | Manual + Postman untuk API | Manual + Postman |
| **Regression** | Full suite | Automated nightly | Playwright + Vitest |
| **Performance** | Load test (k6) | Manual weekly | k6 (planned) |
| **Security** | OWASP Top 10 checklist | Manual + automated | OWASP ZAP (planned) |
| **Accessibility** | axe-core scan | Automated | axe-core (planned) |

### Cara eksekusi (Arteri-specific):

```bash
# Setup lokal
cd stuudi-frontend
cp .env.example .env.local
# Update NEXT_PUBLIC_BASE_API di .env.local

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Unit tests
npm test                  # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report

# E2E tests (per module)
npm run test:e2e:auth     # Login & auth
npm run test:e2e:cbt      # CBT (priority)
npm run test:e2e:api      # API integration
npm run test:e2e:admin    # Admin dashboard
npm run test:e2e:student-dashboard  # Student area

# E2E cross-browser
npm run test:e2e:chromium
npm run test:e2e:firefox

# E2E with UI for debugging
npm run test:e2e:ui
npm run test:e2e:debug
npm run test:e2e:headed

# Full E2E suite
npm run test:e2e

# API testing (after Postman collection ready)
newman run arteri-api.postman_collection.json
```

---

## 16. Potential Risks (Risiko Potensial)

| Risiko | Dampak | Probabilitas | Mitigasi |
|---|---|---|---|
| **Backend lms-project down** | E2E test gagal semua | Medium | Mock backend dengan MSW untuk unit test; fallback ke manual |
| **Staging environment down** | Testing delay | Medium | Local Docker compose backup (planned) |
| **CBT tab switch logic berubah** | Existing test jadi invalid | Low | Baca PR diff sebelum re-run |
| **JWT secret rotation** | Test token invalid | Low | Auto-generate test token via login API |
| **Kurangnya test data untuk matching question** | Coverage rendah | Medium | Auto-generate matching question di seed script |
| **Tight deadline** | Test terburu-buru | High | Prioritas CBT (highest impact) |
| **Tim QA single person (Irza)** | Coverage tidak maksimal | High | Risk-based testing; fokus CBT |
| **Backend API contract berubah tanpa notice** | Integration test gagal | Medium | Strict TS types → tangkap saat compile |
| **Math rendering (KaTeX) edge cases** | Soal matematika broken | Low | Dedicated test untuk math |
| **Concurrent tab switch (race condition)** | Lives counter bug | Medium | Stress test dengan 5 tab |

---

## 17. Documentation of Changes (Dokumentasi Perubahan)

| Versi | Tanggal | Penulis | Perubahan |
|---|---|---|---|
| v1.0 | 2026-06-21 | Irza | Initial Test Plan — berdasarkan analisis codebase arteri_elearning |

---

## 18. Appendix (Lampiran)

Dokumen pendukung:
- **Test Case UI (76 TC)** — [Google Sheet](https://docs.google.com/spreadsheets/d/1Y8emF2b34iH-bxRbeD5mDtD89hG7z2ucQAc7WbTSc9w)
- **Test Case API (100 TC)** — [Google Sheet](https://docs.google.com/spreadsheets/d/1Y8emF2b34iH-bxRbeD5mDtD89hG7z2ucQAc7WbTSc9w)
- **Frontend repo** — https://github.com/irzadzulhika29/stuudi-frontend
- **Backend repo** — https://github.com/azmiagr/lms-project
- **E2E spec files** — `e2e/*.spec.ts` di repo
- **Unit test files** — `src/**/__tests__/` di repo
- **API contract** — `src/shared/config/constants.ts` (`API_ENDPOINTS`)

---

## 19. FAQ (Pertanyaan Umum)

**Q: Mengapa CBT engine diprioritaskan?**
A: CBT adalah fitur paling kritis — ini untuk **ujian olimpiade nasional**. Bug di CBT bisa
menggagalkan ujian ribuan siswa. Lives system + auto-save + timer = critical path.

**Q: Bagaimana cara testing tab switch detection di E2E?**
A: Pakai Playwright `page.evaluate()` untuk trigger `window.dispatchEvent(new Event('blur'))`
atau switch ke tab lain via `context.newPage()`. Verify lives counter decrement via API call.

**Q: Kapan pakai unit test vs E2E test?**
A: **Unit test** untuk logic (timer, answer state, normalization). **E2E test** untuk full flow
(start exam → answer → save → submit → result). Jangan duplikat.

**Q: Bagaimana cara test auto-save tanpa tunggu 30 detik?**
A: Mock timer di Vitest (`vi.useFakeTimers()`). Di E2E, set interval auto-save pendek (override
via env) atau tunggu real time.

**Q: Apa beda `useExamTimer` vs `useAutoSave` vs `useFullscreenGuard`?**
A:
- `useExamTimer` — countdown ujian, auto-submit saat habis
- `useAutoSave` — simpan jawaban ke server periodik
- `useFullscreenGuard` — paksa fullscreen + detect escape/tab switch

**Q: Kenapa pakai Vitest bukan Jest?**
A: Vitest lebih cepat (Vite-based), zero-config untuk Vite/Next.js, dan support TypeScript
native tanpa babel.

**Q: Test mana yang harus automated duluan?**
A: Prioritas (sesuai risiko):
1. CBT tab switch + auto-save + submit (critical path)
2. Auth login + role-based redirect
3. Course enrollment + content access
4. Admin exam creation

**Q: Berapa lama test plan ini berlaku?**
A: Berlaku per release (v1.0). Update setiap ada perubahan arsitektur besar (misal: migrasi
Next.js Pages Router → App Router sudah dilakukan; migrasi berikut mungkin ke React Server
Component penuh).

---

## Referensi

- Mulyanto, A. (2018). *Test Plan*. BINUS University – School of Information Systems.
- Myers, G. J., Sandler, C., & Badgett, T. (2012). *The Art of Software Testing* (3rd ed.).
  John Wiley & Sons, Inc.
- IEEE 829 — Standard for Software Test Documentation
- ISTQB Foundation Level Syllabus v4.0
- Next.js Testing Best Practices — https://nextjs.org/docs/app/building-your-application/testing
- Playwright Documentation — https://playwright.dev/docs/intro
- Vitest Documentation — https://vitest.dev/

---

## Change Log (Dokumen Ini)

| Versi | Tanggal | Perubahan |
|---|---|---|
| v1.0 | 2026-06-21 | Initial Test Plan — instantiated dari template BINUS, diisi spesifik untuk Arteri E-Learning berdasarkan analisis codebase |
