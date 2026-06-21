# Test Plan Template

> Generic Test Plan template based on the **BINUS University – School of Information Systems**
> framework (Mulyanto, 2018) which references Myers, Sandler & Badgett's *The Art of Software
> Testing* (2012). 19-section structure covering the full testing lifecycle for web/mobile
> applications.

---

## Document Information

| Field | Value |
|---|---|
| **Project Name** | `[Isi nama project, misal: Stuudi - Adaptive Learning Platform]` |
| **Document Version** | `[v1.0]` |
| **Date** | `[YYYY-MM-DD]` |
| **Prepared By** | `[Nama QA / Tim Penguji]` |
| **Reviewed By** | `[Nama reviewer / lead]` |
| **Approved By** | `[Nama project manager / stakeholder]` |

---

## 1. Introduction (Pendahuluan)

Bagian ini menjelaskan secara umum rencana pengujian.

### 1.1. Rencana Pengujian
> *Ringkasan 2-3 paragraf tentang rencana pengujian yang akan dilaksanakan pada project ini. Jelaskan scope iterasi / release yang di-test.*

### 1.2. Tujuan Pengujian
> *Sebutkan tujuan spesifik pengujian. Contoh: "Memastikan fitur CBT (Computer-Based Testing) berjalan sesuai requirement untuk launch olimpiade nasional."*

### 1.3. Metodologi Pengujian
> *Jelaskan metode yang dipakai. Contoh: Black-box testing, Functional testing, Regression testing, Performance testing.*

### 1.4. Objek Pengujian
> *Sebutkan aplikasi / modul / fitur yang diuji. Contoh: "Web application Stuudi — fitur Authentication, CBT Engine, Admin Dashboard."*

### 1.5. Arsitektur Sistem yang Diuji
> *Jelaskan arsitektur singkat (frontend, backend, database, third-party). Bisa tambahkan diagram.*

### 1.6. Pembagian Sistem untuk Pengujian Unit dan Integrasi
> *Jelaskan batasan: bagian mana yang di-test sebagai unit test, integration test, atau E2E test.*

---

## 2. Test Items (Item Pengujian)

### 2.1. Item yang Akan Diuji
> *Daftar fitur / modul / API endpoint yang akan diuji dalam iterasi ini.*

| No | Item | Tipe | Prioritas |
|---|---|---|---|
| 1 | `[misal: Login Page]` | UI / Functional | High |
| 2 | `[misal: CBT Engine — Start Exam]` | E2E / Critical | High |
| 3 | ... | ... | ... |

### 2.2. Item yang TIDAK Akan Diuji
> *Sebutkan fitur yang berada di luar scope pengujian. Contoh: "Modul reporting belum diuji karena masih dalam development."*

### 2.3. Definisi Istilah Penting
> *Daftar glossary istilah teknis yang dipakai di dokumen ini. Contoh: CBT, SDET, Token JWT, Idempotency Key.*

---

## 3. Special Terminology (Istilah Khusus)

> *Lanjutan dari section 2.3, definisikan istilah-istilah khusus yang muncul dalam proses pengujian. Susun dalam bentuk tabel.*

| Istilah | Definisi |
|---|---|
| `[misal: CBT]` | Computer-Based Testing — sistem ujian berbasis komputer |
| `[misal: Token JWT]` | JSON Web Token untuk authentication |
| ... | ... |

---

## 4. Testing Location (Lokasi Pengujian)

> *Jelaskan lokasi fisik / virtual tempat pengujian dilakukan. Untuk project modern, ini bisa berupa environment (Staging, UAT, Production) atau device lab.*

| Environment | URL / Lokasi | Tujuan |
|---|---|---|
| Local | `http://localhost:3000` | Development testing |
| Staging | `https://staging.stuudi.app` | Pre-production |
| Production | `https://stuudi.vercel.app` | Smoke test only |

**Diagram setup pengujian (opsional):**

```
[Tester] → [Browser/Device] → [Staging Server] → [Test Database]
                                       ↓
                                  [External APIs]
```

---

## 5. Testing Schedule (Jadwal Pengujian)

> *Jadwal pengujian berdasarkan work-breakdown-structure. Fokus pada high-level milestone dan delivery.*

| No | Kegiatan | Tanggal Mulai | Tanggal Selesai | PIC |
|---|---|---|---|---|
| 1 | Test Plan Review | `[YYYY-MM-DD]` | `[YYYY-MM-DD]` | `[Nama]` |
| 2 | Test Case Creation | `[YYYY-MM-DD]` | `[YYYY-MM-DD]` | `[Nama]` |
| 3 | Test Execution (Iterasi 1) | `[YYYY-MM-DD]` | `[YYYY-MM-DD]` | `[Nama]` |
| 4 | Bug Fixing & Re-test | `[YYYY-MM-DD]` | `[YYYY-MM-DD]` | `[Dev Team]` |
| 5 | Regression Testing | `[YYYY-MM-DD]` | `[YYYY-MM-DD]` | `[QA Team]` |
| 6 | UAT (User Acceptance Test) | `[YYYY-MM-DD]` | `[YYYY-MM-DD]` | `[Stakeholder]` |
| 7 | Sign-off & Release | `[YYYY-MM-DD]` | `[YYYY-MM-DD]` | `[PM]` |

---

## 6. Testing Quality Criteria (Kriteria Kualitas Pengujian)

> *Sistem yang diuji harus memenuhi kualifikasi sebelum organisasi penguji menjalankan pengujian secara efektif dan efisien.*

| Kriteria | Target |
|---|---|
| Kesiapan environment (staging) | 100% deployed & smoke test passed |
| Ketersediaan test data | Semua skenario punya data representative |
| Build stability | Build sukses tanpa critical blocker |
| Kesiapan test case | Minimal 80% test case finalized & peer-reviewed |

---

## 7. Entry Criteria (Kriteria Masuk)

> *Syarat yang harus dipenuhi agar pengujian bisa dimulai.*

- [ ] Spesifikasi kebutuhan (requirements) sudah disetujui stakeholder
- [ ] Test case sudah dibuat dan di-review
- [ ] Environment pengujian (staging) sudah tersedia dan stabil
- [ ] Build aplikasi sudah deployed ke staging
- [ ] Test data sudah disiapkan
- [ ] Tools testing sudah terinstall dan terkonfigurasi

---

## 8. Exit / Suspension Criteria (Kriteria Keluar / Penangguhan)

> *Kondisi di mana pengujian harus dihentikan atau ditunda.*

**Suspension (pengujian ditunda):**
- Build gagal deploy ke staging
- Environment tidak stabil / sering down
- Ada critical bug yang block > 50% test case
- Spesifikasi berubah signifikan tanpa update

**Resume (pengujian dilanjutkan):**
- Build sudah stabil di staging
- Environment sudah normal
- Critical bug sudah diperbaiki
- Spesifikasi sudah direvisi

---

## 9. Completion Criteria (Kriteria Penyelesaian)

> *Kriteria yang menunjukkan bahwa pengujian sudah selesai dan dianggap berhasil.*

- [ ] Minimal **95% test case** sudah dieksekusi
- [ ] **0 critical bug** open
- [ ] **0 high-priority bug** open (atau sudah disetujui untuk release)
- [ ] Semua **regression test** passed
- [ ] Test summary report sudah dibuat
- [ ] Sign-off dari stakeholder

---

## 10. Environmental Requirements (Kebutuhan Lingkungan)

> *Dokumentasikan kebutuhan hardware, software, jaringan, dan konfigurasi.*

### 10.1. Perangkat Keras (Hardware)
| Device | Spec | Jumlah |
|---|---|---|
| Laptop Tester | RAM 16GB, SSD 512GB, i5 ke atas | `[jumlah]` |
| Smartphone (Android) | Minimal Android 11, 4GB RAM | `[jumlah]` |
| Smartphone (iOS) | iPhone 11 ke atas, iOS 15+ | `[jumlah]` |

### 10.2. Perangkat Lunak (Software)
| Software | Versi | Kegunaan |
|---|---|---|
| Node.js | 18+ | Runtime untuk test framework |
| Google Chrome | Latest | Browser testing |
| Firefox | Latest | Cross-browser testing |
| Playwright | Latest | E2E test runner |
| Postman | Latest | API testing |
| VS Code | Latest | Code editor |

### 10.3. Jaringan
- Internet min. 10 Mbps (untuk akses staging & API external)
- VPN kantor (jika ada)

### 10.4. Konfigurasi Environment
| Variable | Value | Keterangan |
|---|---|---|
| `BASE_URL` | `https://staging.stuudi.app` | Endpoint staging |
| `API_URL` | `https://api-staging.stuudi.app` | Backend API |
| `DATABASE` | PostgreSQL 14 (test instance) | Database testing |

---

## 11. Test Systems (Sistem Pengujian)

> *Komponen-komponen yang diperlukan untuk menjalankan pengujian.*

| Komponen | Deskripsi | Status |
|---|---|---|
| **Test cases** | Dokumen test case (Excel/Google Sheets/TCMS) | `[Ada/Belum]` |
| **Test tools** | Postman, Playwright, k6, axe-core | `[Installed?]` |
| **Test procedures** | Script automasi E2E & API | `[Ada/Belum]` |
| **Test suites** | Kumpulan test case per fitur | `[Ada/Belum]` |
| **Automated test scripts** | File `.spec.ts` / `.test.ts` | `[Ada/Belum]` |

---

## 12. External Factors (Faktor Eksternal)

> *Faktor-faktor eksternal yang dapat mempengaruhi pengujian.*

- **Third-party API**: `[misal: payment gateway, OAuth provider]`
- **Sistem eksternal yang bergantung**: `[misal: LMS eksternal, SSO universitas]`
- **Service uptime SLA**: `[misal: 99.5% — perlu fallback strategy]`
- **Regulasi**: `[misal: GDPR, UU PDP Indonesia]`

---

## 13. Team Composition (Komposisi Tim)

| Nama | Peran | Kontak | Tanggung Jawab |
|---|---|---|---|
| `[Nama]` | QA Lead | `[email/phone]` | Test planning, coordination, reporting |
| `[Nama]` | QA Tester | `[email/phone]` | Test execution, bug reporting |
| `[Nama]` | Developer | `[email/phone]` | Bug fixing, technical support |
| `[Nama]` | PM / Stakeholder | `[email/phone]` | UAT, sign-off |

**External Participants:** `[misal: konsultan, user perwakilan sekolah]`

**Hand-off Points:**
- Developer → QA: setiap sprint / iterasi
- QA → Stakeholder: setiap release untuk UAT

---

## 14. Revision Handover Management (Manajemen Penyerahan Revisi)

> *Prosedur penyerahan revisi dari developer ke QA agar tidak kacau.*

- Gunakan **version control** (Git) untuk semua perubahan kode
- Build baru di-deploy ke staging **minimal 1x24 jam** sebelum testing
- QA wajib mencatat versi build yang diuji
- Komunikasi via Slack channel `#qa-coordination`
- Format changelog:

```
[v1.2.3] 2026-06-21
  - FIXED: Bug #123 - Login error 500
  - ADDED: Fitur auto-save CBT
  - CHANGED: Redesign dashboard admin
```

---

## 15. Test Suite Execution (Eksekusi Test Suite)

> *Strategi eksekusi test suite pada setiap fase pengujian.*

| Fase | Test Suite | Strategi | Tools |
|---|---|---|---|
| Smoke | 5-10 test critical path | Manual + automated | Playwright |
| Functional | Per fitur / modul | Manual (terutama) | Manual + Postman (API) |
| Regression | Full suite | Automated | Playwright + Vitest |
| Performance | Load test | Automated | k6 |
| Security | OWASP Top 10 checklist | Manual + automated | OWASP ZAP |

**Cara eksekusi (contoh untuk Stuudi):**

```bash
# Smoke test
npx playwright test e2e/auth.spec.ts --project=chromium

# Full E2E
npm run test:e2e

# Unit + integration
npm test

# API (Postman via Newman)
newman run stuudi-api.postman_collection.json
```

---

## 16. Potential Risks (Risiko Potensial)

| Risiko | Dampak | Probabilitas | Mitigasi |
|---|---|---|---|
| Staging environment down | Testing delay | Medium | Backup local Docker compose |
| Third-party API down | Test gagal | Medium | Mock response dengan MSW |
| Kurang test data | Coverage rendah | High | Auto-generate test data (Faker.js) |
| Tight deadline | Test terburu-buru | High | Prioritas fitur critical path |
| Tim QA terbatas | Coverage tidak maksimal | Medium | Risk-based testing |
| Spec berubah | Test case invalid | Medium | Review spec setiap sprint |

---

## 17. Documentation of Changes (Dokumentasi Perubahan)

> *Catatan revisi dokumen Test Plan.*

| Versi | Tanggal | Penulis | Perubahan |
|---|---|---|---|
| v1.0 | `[YYYY-MM-DD]` | `[Nama]` | Initial document |
| v1.1 | `[YYYY-MM-DD]` | `[Nama]` | Tambah test case CBT, update schedule |
| ... | ... | ... | ... |

---

## 18. Appendix (Lampiran)

Dokumen pendukung yang dapat disertakan:
- **Design specifications** — link ke Figma / dokumen desain
- **Requirements** — link ke PRD / user stories
- **Test suites** — link ke Google Sheets Test Cases / GitHub
- **Quality risk analysis** — file risk register
- **Test execution report** — summary hasil testing
- **Tools setup guide** — link ke README Playwright/Postman

---

## 19. FAQ (Pertanyaan Umum)

> *Daftar pertanyaan yang sering muncul saat pengujian.*

**Q: Bagaimana cara membuat test case baru?**
A: Ikuti template: ID, Modul, Skenario, Pre-condition, Steps, Expected Result, Status. Simpan di Google Sheet.

**Q: Apa beda antara Severity dan Priority bug?**
A: **Severity** = dampak teknis (Critical/High/Medium/Low). **Priority** = urgensi fix (P0/P1/P2/P3).

**Q: Kapan harus regression testing?**
A: Setelah ada perubahan code yang menyentuh fitur existing, atau sebelum release.

**Q: Test mana yang harus automated duluan?**
A: Smoke test → Critical path E2E (login, payment, CBT) → API contract → Performance.

**Q: Berapa lama test plan ini berlaku?**
A: Berlaku per release / iterasi. Update setiap ada perubahan scope besar.

---

## Referensi

- Mulyanto, A. (2018). *Test Plan*. BINUS University – School of Information Systems.
  Retrieved from https://sis.binus.ac.id/2018/07/29/test-plan-2/
- Myers, G. J., Sandler, C., & Badgett, T. (2012). *The Art of Software Testing* (3rd ed.).
  John Wiley & Sons, Inc.
- IEEE 829 — Standard for Software Test Documentation

---

## Change Log

| Versi | Tanggal | Perubahan |
|---|---|---|
| v1.0 | 2026-06-21 | Initial template (ported from BINUS framework) |
