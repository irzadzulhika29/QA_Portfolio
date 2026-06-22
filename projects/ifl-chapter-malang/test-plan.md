# Test Plan — IFL Chapter Malang Website

> **Project:** Website IFL Chapter Malang (Indonesian Future Leaders)
> **Repo:** https://github.com/irzadzulhika29/fe_iflchaptermalang
> **Document Version:** v1.0
> **Date:** 2026-06-22
> **Prepared By:** Muhammad Irza Dzulhika (QA Intern Candidate)
> **Template:** Based on BINUS University Test Plan Framework (Mulyanto, 2018)

---

## Document Information

| Field | Value |
|---|---|
| **Project Name** | IFL Chapter Malang Website (`website-ifl`) |
| **Document Version** | v1.0 |
| **Date** | 2026-06-22 |
| **Prepared By** | Muhammad Irza Dzulhika |
| **Reviewed By** | _(to be assigned)_ |
| **Approved By** | _(to be assigned)_ |
| **Repo** | `github.com/irzadzulhika29/fe_iflchaptermalang` |
| **Live URL** | https://iflchaptermalang.org/ |
| **Tech Stack** | Vite 5 + React 18 + JavaScript |

---

## 1. Introduction (Pendahuluan)

### 1.1. Rencana Pengujian
Dokumen ini menjabarkan rencana pengujian untuk **Website IFL Chapter Malang** — platform
resmi chapter Indonesian Future Leaders di Malang. Website ini berfungsi sebagai pusat
informasi chapter, platform donasi (dengan payment gateway Midtrans), portal blog/artikel,
manajemen event, dan recruitment volunteer. Pengujian akan mencakup 7 modul fitur utama
(authentication, blog, campaign, donation, event, profile, volunteer) + chatbot donasi
sebagai fitur paling kompleks. **Status awal: 0% test coverage** — strategi pengujian
akan dimulai dengan setup fondasi test (Vitest + Playwright + RTL) sebelum eksekusi.

### 1.2. Tujuan Pengujian
- **Membangun fondasi testing** dari 0% (saat ini tidak ada test file sama sekali)
- **Memvalidasi alur donasi end-to-end** (paling kritis karena ada payment gateway Midtrans)
- **Memverifikasi role-based access** (admin / bismar / copywriter) di 3 level proteksi
- **Mengurangi risiko regression** saat ada update konten / event baru
- **Memenuhi standar kualitas** untuk apply magang QA di organisasi IT/NGO

### 1.3. Metodologi Pengujian
| Metode | Tools | Coverage Target |
|---|---|---|
| **Black-box functional** | Manual + Postman | Semua fitur user-facing |
| **Component unit** | Vitest + React Testing Library | Target 50% coverage dalam 3 bulan |
| **End-to-end** | Playwright | Critical paths: Auth, Donasi, Blog, Event |
| **Security** | OWASP ZAP, manual probing | Auth flow, role bypass, JWT |
| **Payment testing** | Midtrans sandbox | Transaction success/failure/timeout |
| **A11y** | axe-core (planned) | Form labels, keyboard nav |
| **Visual regression** | Percy / Chromatic (planned) | Public pages, donation flow |

### 1.4. Objek Pengujian
| Layer | Technology | Test Scope |
|---|---|---|
| **Frontend** | Vite 5.4 + React 18.2 (SPA) | Full UI + client logic |
| **Routing** | React Router DOM 6.17 (client-side) | 33 routes (16 public, 5 auth, 10 protected, 2 error) |
| **State** | TanStack React Query 5.8 | Server state caching |
| **HTTP Client** | Axios 1.7 + jwt-decode | All API calls |
| **Auth** | JWT (custom) + Google OAuth | Login, register, role guard |
| **Rich text** | CKEditor 5 | Blog authoring |
| **Image** | ImageKit CDN | Image upload/transform |
| **Payment** | Midtrans Snap | Donation flow |
| **Backend (out of scope)** | External API (IFL backend) | E2E only |

### 1.5. Arsitektur Sistem yang Diuji

```
┌─────────────────────────────────────────────────────────────────┐
│         Browser (SPA — Client-side rendered)                    │
│              Vite 5 + React 18.2 + JavaScript                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  src/App.jsx          (Router utama, 33 routes)       │      │
│  │  src/routes/          (ProtectedRoute 3 level)        │      │
│  │  src/components/      (67 components)                 │      │
│  │    └── chatbot/       (13 components, donation flow) │      │
│  │  src/features/        (7 modul: auth, blog, dll)      │      │
│  │  src/page/            (root/dashboard/auth pages)     │      │
│  │  src/layouts/         (9 layouts)                     │      │
│  │  src/libs/api         (Axios instance)                │      │
│  │  src/libs/midtrans    (Payment integration)          │      │
│  └──────────────────────────────────────────────────────┘      │
└────────────┬────────────────────┬──────────────────┬────────────┘
             │ HTTPS             │ HTTPS            │ HTTPS
             ▼                   ▼                  ▼
┌─────────────────────┐  ┌────────────────┐  ┌────────────────┐
│ IFL Backend API     │  │ Midtrans       │  │ Google OAuth   │
│ (external,          │  │ Payment Gateway│  │ (login sosial) │
│  out of scope)      │  │                │  │                │
└─────────────────────┘  └────────────────┘  └────────────────┘
             │
             ▼
┌─────────────────────┐
│ ImageKit CDN        │
│ (image storage)     │
└─────────────────────┘
```

### 1.6. Pembagian Sistem untuk Pengujian Unit dan Integrasi
| Test Level | Target | Tools | Lokasi |
|---|---|---|---|
| **Unit test** | Pure functions, isolated components | Vitest + RTL | `src/**/__tests__/` (to be created) |
| **Component integration** | Component + React Query | Vitest + RTL | `src/**/__tests__/` |
| **Hook test** | Custom hooks (auth, blog, dll) | Vitest + RTL | `src/features/*/hooks/__tests__/` |
| **API integration** | Axios calls mocked via MSW | Vitest | `src/libs/api/__tests__/` |
| **E2E** | Full user flow | Playwright | `e2e/*.spec.ts` (to be created) |
| **Manual** | Visual, exploratory | Manual + screenshots | Staging |

---

## 2. Test Items (Item Pengujian)

### 2.1. Item yang Akan Diuji

#### A. **Authentication & Authorization** (HIGH PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| AUTH-01 | Login form (email + password) | UI/Functional | `src/features/authentication/` |
| AUTH-02 | Register form (validation) | UI/Functional | `src/page/auth/RegisterPage.jsx` |
| AUTH-03 | Forgot password flow | UI/Functional | `src/page/auth/ForgotPasswordPage.jsx` |
| AUTH-04 | Email verification | Integration | `src/page/auth/VerifyPage.jsx` |
| AUTH-05 | Google OAuth callback | Integration | `src/page/auth/GoogleCallbackPage.jsx` |
| AUTH-06 | JWT token storage & refresh | Integration | `src/libs/api` + `jwt-decode` |
| AUTH-07 | Logout (clear token, redirect) | UI/Functional | `src/features/authentication/` |
| AUTH-08 | ProtectedToken route guard | Integration | `src/routes/ProtectedToken.jsx` |
| AUTH-09 | ProtectedDashboard route guard | Integration | `src/routes/ProtectedDashboard.jsx` |
| AUTH-10 | ProtectedRoles (admin/bismar/copywriter) | Security | `src/routes/ProtectedRoles.jsx` |

#### B. **Public Pages** (MEDIUM PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| PUB-01 | Home page (hero, about, programs) | UI/Visual | `src/page/root/HomePage.jsx` |
| PUB-02 | About page | UI/Visual | `src/page/root/AboutPage.jsx` |
| PUB-03 | Event listing | UI/Functional | `src/page/root/EventPage.jsx` |
| PUB-04 | Project listing | UI/Functional | `src/page/root/ProjectPage.jsx` |
| PUB-05 | Department pages (nondept, cdsi, bismar, dpp, hrd, comper) | UI/Visual | `src/page/root/` |
| PUB-06 | Blog listing | UI/Functional | `src/page/root/BlogPage.jsx` |
| PUB-07 | Single blog post (rich text) | UI/Functional | `src/page/root/SingleBlogPage.jsx` |
| PUB-08 | Donation listing | UI/Functional | `src/page/root/DonationPage.jsx` |
| PUB-09 | Single donation campaign | UI/Functional | `src/page/root/SingleDonationPage.jsx` |
| PUB-10 | 404 Not Found page | UI/Visual | `src/page/NotFoundPage.jsx` |
| PUB-11 | Coming Soon page | UI/Visual | `src/page/ComingSoon.jsx` |

#### C. **Donation & Payment** (HIGHEST PRIORITY — CRITICAL)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| DON-01 | Browse donation campaigns | UI/Functional | `src/features/donation/` |
| DON-02 | View campaign detail | UI/Functional | `src/page/root/SingleDonationPage.jsx` |
| DON-03 | **Start chatbot donation flow** | Critical | `src/page/root/ChatbotPage.jsx` |
| DON-04 | Chatbot composer (input) | UI/Functional | `src/components/chatbot/chatcomposer/` |
| DON-05 | Chatbot quick replies | UI/Functional | `src/components/chatbot/quickreply/` |
| DON-06 | Chatbot validation feedback | UI/Functional | `src/components/chatbot/validationfeddback/` |
| DON-07 | Chatbot summary card | UI/Functional | `src/components/chatbot/summarycard/` |
| DON-08 | **Midtrans payment integration** | Critical | `src/libs/midtrans/` |
| DON-09 | Payment info display | UI/Functional | `src/components/chatbot/paymentinfo/` |
| DON-10 | Payment success page | UI/Functional | `src/page/root/PaymentSuccessPage.jsx` |
| DON-11 | Payment timeout/failure | Edge case | `src/components/chatbot/successmodal/` |
| DON-12 | QRIS donation flow | UI/Functional | `src/components/donationpayment/` |
| DON-13 | Donation confirmation modal | UI/Functional | `src/components/chatbot/successmodal/` |

#### D. **Blog & Content** (MEDIUM PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| BLG-01 | Blog listing (pagination) | UI/Functional | `src/features/blog/` |
| BLG-02 | Single blog post view | UI/Functional | `src/page/root/SingleBlogPage.jsx` |
| BLG-03 | Search blog posts | UI/Functional | `src/components/searchbar/` |
| BLG-04 | Blog categories filter | UI/Functional | `src/features/blog/` |
| BLG-05 | **Admin: Add blog (CKEditor)** | UI/Functional | `src/page/dashboard/AddBlogPage.jsx` |
| BLG-06 | **Admin: Edit blog** | UI/Functional | `src/page/dashboard/EditBlogPage.jsx` |
| BLG-07 | **Admin: Delete blog** | Integration | `src/features/blog/services/` |
| BLG-08 | CKEditor 5 content authoring | UI/Functional | `@ckeditor/ckeditor5-react` |
| BLG-09 | Blog image upload (ImageKit) | Integration | `imagekitio-react` |
| BLG-10 | Blog categories management | UI/Functional | `src/page/dashboard/BlogCategories.jsx` |
| BLG-11 | Blog detail admin view | UI/Functional | `src/page/dashboard/DetailBlogPage.jsx` |

#### E. **Event Management** (MEDIUM PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| EVT-01 | Public event listing | UI/Functional | `src/page/root/EventPage.jsx` |
| EVT-02 | Event detail page | UI/Functional | `src/features/event/` |
| EVT-03 | **Admin: Event management** | UI/Functional | `src/page/dashboard/EventManagementPage.jsx` |
| EVT-04 | Event registration flow | Integration | `src/features/event/services/` |
| EVT-05 | Event categories & filters | UI/Functional | `src/features/event/` |
| EVT-06 | Event chatbot (jika ada) | UI/Functional | `src/layouts/event/chatbot/` |

#### F. **Volunteer Management** (MEDIUM PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| VOL-01 | Public volunteer info | UI/Visual | `src/components/volunteer/` |
| VOL-02 | Volunteer registration form | UI/Functional | `src/features/volunteer/` |
| VOL-03 | **Admin: Volunteer list** | UI/Functional | `src/page/dashboard/VolunteerPage.jsx` |
| VOL-04 | Volunteer approval/rejection | Integration | `src/features/volunteer/services/` |
| VOL-05 | Volunteer profile matching | Integration | `src/features/volunteer/api/` |

#### G. **User Profile** (LOW PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| PROF-01 | View own profile | UI/Functional | `src/page/root/ProfilePage.jsx` |
| PROF-02 | Edit profile | UI/Functional | `src/features/profile/` |
| PROF-03 | Profile picture upload (ImageKit) | Integration | `react-cropper` + `imagekitio-react` |
| PROF-04 | Profile picture crop | UI/Functional | `react-cropper` |

#### H. **Admin Dashboard** (MEDIUM PRIORITY)
| ID | Item | Tipe | Modul Path |
|---|---|---|---|
| ADM-01 | Admin dashboard home | UI/Functional | `src/page/dashboard/DashboardPage.jsx` |
| ADM-02 | User management (admin only) | UI/Functional | `src/page/dashboard/UserPage.jsx` |
| ADM-03 | Campaign management (admin + bismar) | UI/Functional | `src/page/dashboard/CampaignPage.jsx` |
| ADM-04 | Donation history (admin + bismar) | UI/Functional | `src/page/dashboard/DonationHistory.jsx` |
| ADM-05 | Campaign categories | UI/Functional | `src/page/dashboard/CampaignCategories.jsx` |
| ADM-06 | Proposal management | UI/Functional | `src/page/dashboard/proposal/` |
| ADM-07 | Products (soon) | — | `src/page/dashboard/products/` |
| ADM-08 | Orders (soon) | — | `src/page/dashboard/orders/` |

### 2.2. Item yang TIDAK Akan Diuji
- **IFL Backend API** (external) — di luar scope, hanya black-box test
- **Midtrans Payment Gateway** (3rd party) — hanya test integration, bukan internal Midtrans
- **Google OAuth provider** — 3rd party, hanya test callback flow
- **ImageKit CDN** — 3rd party, hanya test upload/transform response
- **Email delivery** (verification, forgot password) — out of scope
- **Mobile native app** — tidak ada, hanya web responsive
- **Cross-browser legacy** (IE11) — target browser modern
- **Performance under 10K concurrent** — akan diukur terpisah
- **Penetration testing** — out of scope

### 2.3. Definisi Istilah Penting
| Istilah | Definisi |
|---|---|
| **IFL** | Indonesian Future Leaders — organisasi |
| **Chapter** | Cabang daerah (Malang) |
| **Chatbot Donasi** | UI conversational untuk input nominal donasi |
| **Midtrans** | Payment gateway Indonesia (Snap, Core API) |
| **Snap** | Midtrans pop-up payment UI |
| **QRIS** | Quick Response Code Indonesia Standard (payment) |
| **Campaign** | Program donasi yang punya target nominal |
| **Bismar** | Role internal IFL untuk tim campaign/donasi |
| **Copywriter** | Role internal IFL untuk content writer |
| **CKEditor** | Rich text editor untuk blog admin |
| **ImageKit** | CDN + image transformation service |
| **ProtectedRoute** | HOC React Router untuk guard role-based |
| **React Query** | Library untuk server state management |

---

## 3. Special Terminology (Istilah Khusus)

| Istilah | Definisi |
|---|---|
| **Snap Token** | Token dari Midtrans untuk membuka pop-up payment |
| **Transaction ID** | ID unik untuk satu transaksi donasi |
| **Settlement** | Proses Midtrans mengirim dana ke rekening IFL |
| **Donor** | User yang berdonasi |
| **Quick reply** | Tombol pilihan cepat di chatbot |
| **Composer** | Area input user di chatbot |
| **Validation feedback** | Pesan error/success di chatbot |
| **CDA** | Continuous Donor Acquisition |
| **Recurring donation** | Donasi rutin (bulanan) — planned feature |
| **Voucher** | Kode diskon / promo donasi |
| **Token JWT** | JSON Web Token untuk authentication (custom impl) |
| **SPA** | Single Page Application — semua routing client-side |

---

## 4. Testing Location (Lokasi Pengujian)

| Environment | URL | Tujuan | Akses |
|---|---|---|---|
| **Local dev** | `http://localhost:5173` (Vite default) | Development | Developer laptop |
| **Staging** | _(to be set up)_ | Pre-production QA | QA team |
| **Production** | `https://iflchaptermalang.org/` | Smoke test only | Public |
| **Midtrans sandbox** | `https://app.sandbox.midtrans.com` | Payment testing | Test cards |
| **Mock backend** | MSW (Mock Service Worker) | Unit test isolation | Test runner |

**Diagram setup pengujian:**
```
┌────────────────────────────────────────────────────────────────┐
│  QA Tester                                                       │
│  (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+)              │
└────────────┬───────────────────────────────────────────────────┘
             │ HTTPS
             ▼
┌────────────────────────────────────────────────────────────────┐
│  Staging (https://staging.iflchaptermalang.org)                   │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │  Vite + React    │ ──────► │  IFL Backend API │              │
│  │  (website-ifl)   │ HTTPS   │  (external)      │              │
│  └──────────────────┘         └──────────────────┘              │
│         │                                                       │
│         │ HTTPS                                                 │
│         ▼                                                       │
│  ┌──────────────────┐                                           │
│  │  Midtrans Snap   │ (sandbox for testing)                      │
│  └──────────────────┘                                           │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Testing Schedule (Jadwal Pengujian)

| No | Kegiatan | Tanggal Mulai | Tanggal Selesai | PIC | Status |
|---|---|---|---|---|---|
| 1 | Test Plan Review | 2026-06-22 | 2026-06-22 | Irza | ✅ Done |
| 2 | **Phase 0: Setup test framework** (Vitest + RTL + Playwright) | 2026-06-23 | 2026-06-25 | Dev | ⏳ Planned |
| 3 | **Phase 1: Smoke test critical paths** (E2E) | 2026-06-26 | 2026-06-28 | QA | ⏳ Planned |
| 4 | **Phase 2: Auth & role-based** | 2026-06-29 | 2026-07-01 | QA | ⏳ Planned |
| 5 | **Phase 3: Donasi + Midtrans** | 2026-07-02 | 2026-07-08 | QA | ⏳ Planned |
| 6 | **Phase 4: Blog + CKEditor** | 2026-07-09 | 2026-07-13 | QA | ⏳ Planned |
| 7 | **Phase 5: Event + Volunteer** | 2026-07-14 | 2026-07-18 | QA | ⏳ Planned |
| 8 | **Phase 6: Public pages** | 2026-07-19 | 2026-07-22 | QA | ⏳ Planned |
| 9 | **Phase 7: Admin dashboard** | 2026-07-23 | 2026-07-27 | QA | ⏳ Planned |
| 10 | Regression Test (full) | 2026-07-28 | 2026-07-30 | QA | ⏳ Planned |
| 11 | UAT (User Acceptance Test) | 2026-07-31 | 2026-08-01 | Stakeholder | ⏳ Planned |
| 12 | Sign-off & Release v2.0 | 2026-08-02 | 2026-08-02 | PM | ⏳ Planned |

---

## 6. Testing Quality Criteria (Kriteria Kualitas Pengujian)

| Kriteria | Target |
|---|---|
| Kesiapan environment (staging) | 100% deployed & smoke test passed |
| Ketersediaan test data | Akun 3 role tersedia di staging |
| Build stability | Build sukses tanpa critical blocker |
| **Kesiapan test framework** | **0% → 100% dalam Phase 0** |
| **Code coverage (unit)** | **0% → 30% di akhir Phase 1, 50% di akhir** |
| E2E coverage | Minimal 1 happy-path + 1 sad-path per fitur critical |
| Dokumentasi | Test plan + test summary report |

---

## 7. Entry Criteria (Kriteria Masuk)

- [x] Test plan sudah dibuat dan di-review
- [ ] **Test framework sudah terinstall** (Vitest + RTL + Playwright) — Phase 0
- [ ] **Test config files** sudah ada (`vitest.config.js`, `playwright.config.js`) — Phase 0
- [ ] **CI/CD untuk test** sudah ada di `.github/workflows/` — Phase 0
- [ ] **Test data** (3 akun role: admin, bismar, copywriter) tersedia di staging
- [ ] **Midtrans sandbox** account aktif dengan test cards
- [ ] Tools testing terinstall (Vitest, Playwright, Postman, VS Code)
- [ ] Backend IFL running di staging
- [ ] ImageKit credentials tersedia
- [ ] Google OAuth client ID/Secret tersedia

---

## 8. Exit / Suspension Criteria (Kriteria Keluar / Penangguhan)

**Suspension (pengujian ditunda):**
- Build gagal deploy ke staging
- Backend IFL API down > 30 menit
- Midtrans sandbox down
- Ada critical bug yang block > 50% test case Donasi
- ImageKit CDN error

**Resume (pengujian dilanjutkan):**
- Build sudah stabil
- Backend & payment gateway sudah normal
- Critical bug sudah diperbaiki
- Environment sudah stabil minimal 1 jam

---

## 9. Completion Criteria (Kriteria Penyelesaian)

- [ ] **Test framework setup 100%** (Vitest + RTL + Playwright + CI)
- [ ] **100% Donasi test case** dieksekusi (highest priority, 13 TC)
- [ ] **100% Auth test case** dieksekusi (10 TC)
- [ ] Minimal **80% test case** total dieksekusi (seluruh fase)
- [ ] **Code coverage ≥ 30%** (dari baseline 0%)
- [ ] **0 critical bug** open
- [ ] **0 high-priority bug** open
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
| Edge | 120+ | Cross-browser |
| **Playwright** | **1.40+** | **E2E test runner (planned)** |
| **Vitest** | **1.0+** | **Unit test runner (planned)** |
| **React Testing Library** | **14+** | **Component testing (planned)** |
| Postman | Latest | API testing (manual) |
| Newman | Latest | Postman CLI (automation) |
| VS Code | Latest | Code editor |

### 10.3. Jaringan
- Internet min. 10 Mbps
- Akses ke Midtrans sandbox & ImageKit CDN

### 10.4. Konfigurasi Environment
| Variable | Value | Keterangan |
|---|---|---|
| `VITE_API_URL` | `https://api.iflchaptermalang.org` | Backend API |
| `VITE_MIDTRANS_CLIENT_KEY` | _(sandbox key)_ | Midtrans Snap |
| `VITE_MIDTRANS_MERCHANT_ID` | _(sandbox ID)_ | Midtrans |
| `VITE_IMAGEKIT_PUBLIC_KEY` | _(public key)_ | ImageKit upload |
| `VITE_GOOGLE_CLIENT_ID` | _(OAuth ID)_ | Google login |
| `VITE_BASE_URL` | `https://iflchaptermalang.org` | Site URL |

---

## 11. Test Systems (Sistem Pengujian)

| Komponen | Deskripsi | Status |
|---|---|---|
| **Test plan** | Dokumen ini (`test-plan.md`) | ✅ Ada |
| **Test framework** | Vitest + RTL + Playwright | ❌ **Belum di-setup** |
| **Test config** | `vitest.config.js` + `playwright.config.js` | ❌ **Belum ada** |
| **Test case UI** | _(to be created)_ — akan disimpan di Google Sheet | ⏳ Planned |
| **Test case API** | _(to be created)_ — akan disimpan di Google Sheet | ⏳ Planned |
| **CI/CD pipeline** | `.github/workflows/test.yml` | ❌ **Belum ada** (cuma deploy.yml) |
| **Mock backend** | MSW setup | ⏳ Planned |
| **Test data** | 3 akun role (admin, bismar, copywriter) + donor | ⏳ Planned |
| **Pre-commit hook** | Husky | ❌ **Belum ada** |

---

## 12. External Factors (Faktor Eksternal)

- **IFL Backend API** — harus running untuk E2E test
  - Disimpan terpisah (bukan bagian dari frontend repo)
  - Contract stability tergantung tim backend
- **Midtrans Payment Gateway** — 3rd party
  - Sandbox tersedia untuk testing (`app.sandbox.midtrans.com`)
  - Reliability: 99.9% SLA (production), bisa ada downtime
  - Test cards: tersedia untuk Visa, MC, QRIS, GoPay, OVO, DANA, ShopeePay
- **ImageKit CDN** — image hosting
  - Reliability: 99.9% SLA
  - Free tier: 20GB bandwidth/bulan
- **Google OAuth** — login sosial
  - Reliability: 99.9% SLA
- **cPanel** — hosting (bukan Vercel)
  - Deployment via FTP dari GitHub Actions
  - Custom domain: iflchaptermalang.org

---

## 13. Team Composition (Komposisi Tim)

| Nama | Peran | Tanggung Jawab |
|---|---|---|
| **Irza** (Muhammad Irza Dzulhika) | QA Lead / Tester | Test planning, execution, automation |
| **Dev Frontend** | Frontend Developer | Bug fixing, test framework setup |
| **Bismar Team** | Internal Role | Campaign management (uji alur donasi) |
| **Copywriter Team** | Internal Role | Blog content (uji alur blog admin) |
| **Admin IFL** | Administrator | UAT, sign-off |

**External Participants:** Member IFL (uji alur volunteer registration)

**Hand-off Points:**
- Developer → QA: setiap sprint / iterasi
- QA → Bismar/Copywriter: untuk UAT per role

---

## 14. Revision Handover Management (Manajemen Penyerahan Revisi)

- **Version control**: Git (GitHub)
- **Build deployment**: otomatis via cPanel FTP dari `.github/workflows/deploy.yml`
- **QA testing window**: minimal 1x24 jam setelah build baru di staging
- **Changelog format**:
  ```
  [v1.0.X] 2026-06-22
  - FIXED: Bug #123 - Donation timeout error
  - ADDED: Recurring donation feature
  - CHANGED: Redesign chatbot composer
  - TESTED: 13 donation test cases executed
  ```
- **Notifikasi**: GitHub Issues + WhatsApp group IFL Malang

---

## 15. Test Suite Execution (Eksekusi Test Suite)

### Strategi per fase:
| Fase | Test Suite | Strategi | Tools |
|---|---|---|---|
| **Smoke** | 5 critical-path tests | Automated on every PR | Playwright |
| **Donasi regression** | 13 donasi test cases | Automated on every PR | Playwright + Vitest |
| **Auth regression** | 10 auth test cases | Automated | Playwright |
| **Functional** | Per fitur (per modul) | Manual + Postman untuk API | Manual + Postman |
| **Regression** | Full suite | Automated nightly | Playwright + Vitest |
| **Payment** | Midtrans sandbox scenarios | Manual + automated | Playwright + Midtrans |
| **Security** | OWASP Top 10 checklist | Manual + automated | OWASP ZAP (planned) |
| **Accessibility** | axe-core scan | Automated | axe-core (planned) |

### Cara eksekusi (IFL-specific):

```bash
# Setup lokal
cd fe_iflchaptermalang
cp .env.example .env.local
# Update VITE_API_URL, VITE_MIDTRANS_CLIENT_KEY, dll di .env.local

# Install dependencies
npm install

# === PHASE 0: Setup test framework (one-time) ===
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event @playwright/test jsdom msw

# Buat vitest.config.js & playwright.config.js (template)

# === Unit tests (setelah setup) ===
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage

# === E2E tests (setelah setup) ===
npx playwright install      # First time only

npm run test:e2e            # All E2E
npm run test:e2e:auth       # Auth flow
npm run test:e2e:donation   # Donasi + Midtrans
npm run test:e2e:blog       # Blog + CKEditor
npm run test:e2e:event      # Event management

# === E2E debugging ===
npm run test:e2e:ui         # Interactive UI mode
npm run test:e2e:debug      # Debug mode
npm run test:e2e:headed     # See browser

# === API testing (after Postman collection ready) ===
newman run ifl-api.postman_collection.json
```

---

## 16. Potential Risks (Risiko Potensial)

| Risiko | Dampak | Probabilitas | Mitigasi |
|---|---|---|---|
| **Setup test framework dari 0%** | Timeline Phase 0 molor | High | Pakai template yang sudah ada (Arteri E-Learning) |
| **Backend IFL API down** | E2E test gagal | Medium | Mock backend dengan MSW untuk unit test |
| **Midtrans sandbox error** | Payment test gagal | Low | Backup test cards, retry dengan exponential backoff |
| **JavaScript (no TS)** | Bug type tidak tertangkap saat compile | High | Strict ESLint + PropTypes + gradual TS migration |
| **ImageKit CDN rate limit** | Image upload test gagal | Low | Mock ImageKit response di test |
| **Tight volunteer** | Coverage tidak maksimal | High | Risk-based testing; fokus Donasi (highest impact) |
| **Tim QA single person (Irza)** | Bottleneck di review | High | Pair dengan dev untuk code review test |
| **CKEditor 5 bug** | Blog authoring broken | Low | Pin versi, test scenario terbatas |
| **3 icon library (Phosphor + Lucide + React Icons)** | Bundle bengkak, conflict | Medium | Audit & konsolidasi ke 1 library |
| **cPanel FTP deploy** | Build lama, error-prone | Medium | Monitor deploy log, retry script |
| **Google OAuth client quota** | Login test gagal | Low | Mock OAuth di unit test |
| **No TypeScript** | Runtime error lebih sering | High | Strict prop validation + JSDoc |

---

## 17. Documentation of Changes (Dokumentasi Perubahan)

| Versi | Tanggal | Penulis | Perubahan |
|---|---|---|---|
| v1.0 | 2026-06-22 | Irza | Initial Test Plan — berdasarkan analisis codebase IFL Chapter Malang |

---

## 18. Appendix (Lampiran)

Dokumen pendukung:
- **Source repo** — https://github.com/irzadzulhika29/fe_iflchaptermalang
- **Live site** — https://iflchaptermalang.org/
- **Test plan template** — `../../docs/test-plan-template.md`
- **Stuudi reference** — `../arteri-elearning/test-plan.md` (pembanding)
- **JS testing patterns** — `../../skills/javascript-testing-patterns/SKILL.md`
- **E2E patterns** — `../../skills/e2e-testing-patterns/SKILL.md`

---

## 19. FAQ (Pertanyaan Umum)

**Q: Kenapa test plan ini ditulis padahal test belum ada?**
A: Karena **best practice** — test plan harus dibuat sebelum coding test. Tanpa test plan, setup
test framework bisa salah arah. Dokumen ini jadi panduan Phase 0.

**Q: Kenapa prioritas Donasi (bukan Auth)?**
A: Karena **Donasi = revenue stream + payment gateway integration**. Bug di donasi = kerugian
finansial langsung. Auth juga penting, tapi biasanya lebih mature pattern-nya.

**Q: Bagaimana cara test Midtrans di lokal?**
A: Midtrans punya **sandbox** terpisah (`app.sandbox.midtrans.com`). Pakai client key sandbox +
test cards (Visa: 4811 1111 1111 1114, dll). Transaksi sandbox tidak benar-benar dipotong.

**Q: Kenapa tidak ada test sama sekali? Apa kendalanya?**
A: Belum sempat di-setup. Project fokus ke feature delivery dulu. Sekarang dengan test plan ini,
mulai di-setup fondasi (Phase 0).

**Q: JavaScript atau TypeScript — perlu migrasi?**
A: Untuk **jangka panjang** TypeScript sangat membantu (type safety, IntelliSense, fewer bugs).
Untuk **jangka pendek** (magang QA), cukup strict ESLint + PropTypes. Migrasi TS bisa jadi
proyek terpisah.

**Q: 3 icon library (Phosphor + Lucide + React Icons) — kenapa?**
A: Kemungkinan karena refactor bertahap. Bundle jadi bengkak. Quick win: konsolidasi ke 1
library (rekomendasi: **Lucide** — paling ringan & modern).

**Q: Berapa lama test plan ini berlaku?**
A: Berlaku untuk **v2.0** (Phase 0-12 ≈ 6 minggu). Update setiap ada perubahan arsitektur
besar atau setelah milestone tercapai.

**Q: Apakah ada CI/CD untuk test?**
A: **Belum**. Saat ini cuma ada `deploy.yml` (FTP deploy). Akan ditambah `test.yml` di Phase 0.

---

## Referensi

- Mulyanto, A. (2018). *Test Plan*. BINUS University – School of Information Systems.
- Myers, G. J., Sandler, C., & Badgett, T. (2012). *The Art of Software Testing* (3rd ed.).
- IEEE 829 — Standard for Software Test Documentation
- ISTQB Foundation Level Syllabus v4.0
- React Testing Library Docs — https://testing-library.com/docs/react-testing-library/intro
- Playwright Documentation — https://playwright.dev/docs/intro
- Vitest Documentation — https://vitest.dev/
- Midtrans Sandbox — https://docs.midtrans.com/en/technical-reference/sandbox-test

---

## Change Log (Dokumen Ini)

| Versi | Tanggal | Perubahan |
|---|---|---|
| v1.0 | 2026-06-22 | Initial Test Plan — di-instantiate dari template BINUS, diisi spesifik untuk IFL Chapter Malang. Fokus utama: setup test framework dari 0% + donasi flow + role-based access. |
