# Test Plan — Akademi Competition

## 1. Identitas Dokumen

| Item | Detail |
|---|---|
| **Nama Proyek** | Akademi Competition |
| **Repositori** | https://github.com/irzadzulhika29/ac_fe (branch: `dev`) |
| **Website** | https://akademicompetition.id |
| **Tipe Aplikasi** | Web SPA (Vite + React 19, Tailwind CSS v4) |
| **Role Pengguna** | Public, User (Mahasiswa), Admin, Mentor, Marketing |
| **Tester** | [Nama Tester] |
| **Tanggal** | Juni 2026 |

## 2. Ruang Lingkup

### 2.1 Modul yang Di-Test

| Modul | Prioritas | Tipe Test | Halaman Terkait |
|---|---|---|---|
| **Artikel (Social Forum)** | Tinggi | Manual + API | `/user/social-forum`, `/user/create-article`, `/user/article-detail/:id` |
| **Team Matchmaking** | Tinggi | Manual + API | Tab Team Builder di User Dashboard, CreateLobbyModal |
| **Selection Form** | Sedang | API | Admin dashboard (Add/Edit bootcamp → selection config) |

### 2.2 Di Luar Lingkup (Iterasi Ini)
- Modul lain (Class, Cart/Checkout, Certificate, Calendar, Live Bootcamp, Admin CRUD selain selection)
- Mentor dashboard
- Marketing referral
- Entrance animation / bootstrap

## 3. Jadwal

| Aktivitas | Durasi |
|---|---|
| Test case design & review | 2 hari |
| Manual testing (UI) | 3 hari |
| API testing | 2 hari |
| Bug reporting & retest | 2 hari |

## 4. Modul 1: Artikel (Social Forum)

### 4.1 Halaman & Fitur

| Halaman | Deskripsi |
|---|---|
| **Social Forum** (`/user/social-forum`) | Feed artikel: tab For You, Following, My Articles, Saved; search, filter by tags |
| **Create Article** (`/user/create-article`) | Editor rich text (Quill-like), cover image upload, tag selector, visibility (public/private) |
| **Article Detail** (`/user/detail-article/:id`) | Halaman detail artikel, like/unlike, save/unsave, komentar, author info |

### 4.2 API Endpoints (Artikel)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/articles` | Tidak | List artikel publik (pagination, search, tagIds) |
| GET | `/articles/trending` | Tidak | Artikel trending |
| GET | `/articles/tags` | Tidak | Daftar tag artikel |
| GET | `/articles/:slug` | Tidak | Detail artikel (by slug) |
| GET | `/articles/:id/comments` | Tidak | Komentar artikel publik |
| GET | `/users/articles` | Ya | Artikel saya sendiri |
| GET | `/users/articles/saved` | Ya | Artikel yang disimpan |
| GET | `/users/articles/following` | Ya | Artikel dari yang diikuti |
| GET | `/users/articles/:id` | Ya | Detail artikel saya |
| POST | `/users/articles` | Ya | Buat artikel baru (multipart) |
| PUT | `/users/articles/:id` | Ya | Update artikel (multipart) |
| DELETE | `/users/articles/:id` | Ya | Hapus artikel |
| POST | `/users/articles/:id/like` | Ya | Like artikel |
| DELETE | `/users/articles/:id/like` | Ya | Unlike artikel |
| POST | `/users/articles/:id/save` | Ya | Simpan artikel |
| DELETE | `/users/articles/:id/save` | Ya | Batal simpan |
| POST | `/users/articles/:id/comments` | Ya | Tambah komentar |
| DELETE | `/users/articles/comments/:id` | Ya | Hapus komentar |

### 4.3 Skenario Test Manual (Artikel)

| ID | Skenario | Langkah | Hasil Diharapkan |
|---|---|---|---|
| A-C-01 | Melihat feed artikel (For You) | 1. Login user 2. Buka Social Forum 3. Tab "For You" aktif | Artikel tampil dalam bentuk card, infinite scroll berfungsi |
| A-C-02 | Search artikel | 1. Ketik kata kunci di search bar | Artikel sesuai keyword tampil |
| A-C-03 | Filter by tag | 1. Klik filter tag 2. Pilih 1+ tag | Artikel difilter sesuai tag |
| A-C-04 | Melihat trending artikel | Scroll ke trending sidebar | Trending artikel tampil |
| A-C-05 | Membuat artikel baru | 1. Klik "Buat Artikel" 2. Isi title, body (rich text) 3. Upload cover image 4. Pilih tag 5. Set visibility 6. Publish | Artikel sukses dibuat, muncul di feed |
| A-C-06 | Membuat artikel tanpa cover image | Coba publish tanpa gambar cover | Validasi: cover image required |
| A-C-07 | Melihat detail artikel | Klik salah satu artikel | Halaman detail tampil (title, body, cover, author, komentar) |
| A-C-08 | Like artikel | Klik tombol like | Icon like berubah, count +1 |
| A-C-09 | Unlike artikel | Klik tombol unlike | Icon kembali, count -1 |
| A-C-10 | Save artikel | Klik tombol save | Artikel tersimpan |
| A-C-11 | Melihat saved articles | Pindah tab "Saved" | Artikel yang disave tampil |
| A-C-12 | Tambah komentar | Tulis komentar lalu submit | Komentar muncul di thread |
| A-C-13 | Hapus komentar | Klik hapus pada komentar sendiri | Komentar terhapus |
| A-C-14 | My Articles tab | Buka tab "My Articles" | Hanya artikel milik sendiri |
| A-C-15 | Edit artikel | Buka artikel sendiri, klik edit, ubah judul, save | Perubahan tersimpan |
| A-C-16 | Hapus artikel | Hapus artikel dari my articles | Artikel terhapus dari feed |

## 5. Modul 2: Team Matchmaking

### 5.1 Halaman & Fitur

| Halaman | Deskripsi |
|---|---|
| **Team Builder Tab** (di User Dashboard) | Daftar lobby, filter, create lobby, join lobby |
| **Create Lobby Modal** (3-step wizard) | Step 1: Pilih kompetisi (manual/catalog) — Step 2: Info tim — Step 3: Roles & deadline |
| **Lobby Detail Modal** | Detail lobby, daftar anggota, apply/join, leave requests |

### 5.2 API Endpoints (Team Matchmaking)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/competitions` | Ya | Daftar kompetisi untuk filter |
| GET | `/universities` | Ya | Daftar universitas |
| GET | `/lobbies/stats` | Tidak | Statistik lobby (total lobby, dll) |
| GET | `/users/matchmaking/lobbies` | Ya | List lobby (dengan filter) |
| GET | `/users/matchmaking/lobbies/me` | Ya | Lobby milik saya |
| GET | `/users/matchmaking/lobbies/:id` | Ya | Detail lobby |
| POST | `/users/matchmaking/lobbies` | Ya | Buat lobby baru |
| DELETE | `/users/matchmaking/lobbies/:id` | Ya | Hapus lobby (owner only) |
| POST | `/users/matchmaking/lobbies/:id/apply` | Ya | Apply/join lobby |
| PATCH | `/users/matchmaking/lobbies/:id/applications/:appId` | Ya | Review applicant (approve/reject) |
| POST | `/users/matchmaking/lobbies/:id/leave-requests` | Ya | Request leave dari lobby |
| GET | `/users/matchmaking/lobbies/:id/leave-requests` | Ya | List leave requests (owner) |
| PATCH | `/users/matchmaking/lobbies/:id/leave-requests/:userId` | Ya | Review leave request (approve/reject) |
| DELETE | `/users/matchmaking/lobbies/:id/members/:userId` | Ya | Kick member (owner only) |
| GET | `/users/matchmaking/rooms` | Ya | List matchmaking rooms |
| GET | `/users/matchmaking/rooms/me` | Ya | My active room |
| POST | `/users/matchmaking/rooms/:id/ws-ticket` | Ya | Create WebSocket ticket |

### 5.3 Skenario Test Manual (Team Matchmaking)

| ID | Skenario | Langkah | Hasil Diharapkan |
|---|---|---|---|
| T-C-01 | Melihat daftar lobby | Buka Team Builder tab | Lobby cards tampil (nama, kompetisi, role yg dicari, deadline) |
| T-C-02 | Filter lobby by kompetisi | Pilih filter kompetisi | Lobby terfilter sesuai kompetisi |
| T-C-03 | Filter lobby by universitas | Pilih filter universitas | Lobby dari universitas tertentu |
| T-C-04 | Create lobby (catalog mode) | 1. Klik "Buat Lobby" 2. Pilih kompetisi dari katalog 3. Isi info tim 4. Atur roles & deadline | Lobby berhasil dibuat |
| T-C-05 | Create lobby (manual mode) | 1. Pilih manual mode 2. Input nama kompetisi manual 3. Info tim 4. Roles & deadline | Lobby manual berhasil |
| T-C-06 | Validasi create lobby - nama wajib | Submit tanpa nama tim | Validasi error |
| T-C-07 | Validasi create lobby - deadline lewat | Set deadline di masa lalu | Validasi error |
| T-C-08 | Join lobby (apply) | Klik "Apply" pada lobby | Application terkirim, status pending |
| T-C-09 | Review applicant (approve) | Sebagai owner, approve aplikasi | Applicant masuk anggota lobby |
| T-C-10 | Review applicant (reject) | Sebagai owner, reject aplikasi | Applicant ditolak |
| T-C-11 | Melihat detail lobby | Klik lobby card | Detail: anggota, roles, deadline, status |
| T-C-12 | Delete lobby (owner) | Sebagai owner, hapus lobby | Lobby terhapus |
| T-C-13 | Request leave lobby | Sebagai anggota, request leave | Request terkirim ke owner |
| T-C-14 | Approve leave request | Owner approve leave | Anggota keluar dari lobby |
| T-C-15 | Kick member | Owner kick anggota | Anggota dikeluarkan |
| T-C-16 | My lobbies tab | Lihat "Lobby Saya" | Hanya lobby milik user |
| T-C-17 | Matchmaking rooms | Cek tab rooms setelah match | Room aktif tampil jika sudah match |
| T-C-18 | Lobby stats | Buka Team Builder | Statistik: total lobby, active members, dll |

## 6. Modul 3: Selection Form

### 6.1 Fitur
Selection form adalah konfigurasi admin untuk menambahkan form seleksi pendaftaran ke bootcamp/class. Admin dapat:
- Mengaktifkan/menonaktifkan seleksi pendaftaran
- Mengatur judul & deskripsi form seleksi
- Menambahkan pertanyaan (question builder)
- Mengatur pertanyaan wajib / opsional

### 6.2 API Endpoints terkait

Selection form dikirim bersamaan dengan operasi class/bootcamp:

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/operational/add-competitions` | Admin | Simpan kompetisi dengan selection config |
| PATCH | `/operational/update-competitions/:id` | Admin | Update kompetisi + selection |

### 6.3 Skenario Test Manual (Selection Form — Admin)

| ID | Skenario | Langkah | Hasil Diharapkan |
|---|---|---|---|
| S-C-01 | Buka form add bootcamp/class | Login admin, buka add bootcamp | Form tampil dengan opsi selection |
| S-C-02 | Aktifkan selection form | Toggle selection enabled | Form builder pertanyaan muncul |
| S-C-03 | Tambah pertanyaan selection | Klik "Tambah Pertanyaan" | Input field pertanyaan baru |
| S-C-04 | Isi semua field selection | Judul, deskripsi, pertanyaan | Semua tersimpan |
| S-C-05 | Validasi - judul kosong | Aktifkan selection, judul kosong, submit | Validasi error "Judul wajib diisi" |
| S-C-06 | Validasi - tanpa pertanyaan | Aktifkan selection, 0 pertanyaan, submit | Validasi error "Minimal 1 pertanyaan" |
| S-C-07 | Validasi - pertanyaan kosong | Tambah pertanyaan tanpa text | Validasi error |
| S-C-08 | Hapus pertanyaan | Hapus salah satu pertanyaan | Pertanyaan terhapus dari list |
| S-C-09 | Reorder pertanyaan | Drag & drop urutan | Urutan berubah |
| S-C-10 | Nonaktifkan selection | Toggle off | Form builder hilang, data selection tidak ikut terkirim |
| S-C-11 | Edit selection (update) | Edit bootcamp, lihat selection form | Data selection yang sudah ada muncul |
| S-C-12 | User registrasi dengan selection | User daftar bootcamp dengan selection | Form seleksi muncul sebelum konfirmasi |

## 7. API Test Cases (Cross-Module Positif & Negatif)

### 7.1 Auth
| ID | Skenario | Method | Endpoint | Status |
|---|---|---|---|---|
| API-A-01 | Login valid | POST | `/auth/login` | 200 |
| API-A-02 | Login invalid password | POST | `/auth/login` | 401 |
| API-A-03 | Register valid | POST | `/auth/register` | 201 |
| API-A-04 | Register duplicate email | POST | `/auth/register` | 409 |

### 7.2 Artikel API
| ID | Skenario | Method | Endpoint | Status |
|---|---|---|---|---|
| API-ART-01 | Get articles (no auth) | GET | `/articles` | 200 |
| API-ART-02 | Get articles with pagination | GET | `/articles?page=1&limit=10` | 200 |
| API-ART-03 | Get articles with search | GET | `/articles?search=olimpiade` | 200 |
| API-ART-04 | Get articles with tag filter | GET | `/articles?tag_id=1` | 200 |
| API-ART-05 | Get trending articles | GET | `/articles/trending` | 200 |
| API-ART-06 | Get article tags | GET | `/articles/tags` | 200 |
| API-ART-07 | Get article detail (valid slug) | GET | `/articles/:slug` | 200 |
| API-ART-08 | Get article detail (invalid slug) | GET | `/articles/invalid-slug` | 404 |
| API-ART-09 | Get my articles (no auth) | GET | `/users/articles` | 401 |
| API-ART-10 | Get my articles (with auth) | GET | `/users/articles` | 200 |
| API-ART-11 | Get saved articles (auth) | GET | `/users/articles/saved` | 200 |
| API-ART-12 | Get following articles (auth) | GET | `/users/articles/following` | 200 |
| API-ART-13 | Create article (valid, multipart) | POST | `/users/articles` | 201 |
| API-ART-14 | Create article (no cover image) | POST | `/users/articles` | 422 |
| API-ART-15 | Create article (empty title) | POST | `/users/articles` | 422 |
| API-ART-16 | Create article (no auth) | POST | `/users/articles` | 401 |
| API-ART-17 | Update article (owner) | PUT | `/users/articles/:id` | 200 |
| API-ART-18 | Update article (not owner) | PUT | `/users/articles/:id` | 403 |
| API-ART-19 | Delete article (owner) | DELETE | `/users/articles/:id` | 200 |
| API-ART-20 | Delete article (no auth) | DELETE | `/users/articles/:id` | 401 |
| API-ART-21 | Like article | POST | `/users/articles/:id/like` | 200 |
| API-ART-22 | Unlike article | DELETE | `/users/articles/:id/like` | 200 |
| API-ART-23 | Like article twice (idempotent) | POST | `/users/articles/:id/like` | 200 (already liked) |
| API-ART-24 | Unlike without like (idempotent) | DELETE | `/users/articles/:id/like` | 200 |
| API-ART-25 | Save article | POST | `/users/articles/:id/save` | 200 |
| API-ART-26 | Unsave article | DELETE | `/users/articles/:id/save` | 200 |
| API-ART-27 | Add comment to article | POST | `/users/articles/:id/comments` | 201 |
| API-ART-28 | Add comment (empty content) | POST | `/users/articles/:id/comments` | 422 |
| API-ART-29 | Get article comments | GET | `/articles/:id/comments` | 200 |
| API-ART-30 | Delete own comment | DELETE | `/users/articles/comments/:id` | 200 |
| API-ART-31 | Delete comment (not owner) | DELETE | `/users/articles/comments/:id` | 403 |

### 7.3 Team Matchmaking API

| ID | Skenario | Method | Endpoint | Status |
|---|---|---|---|---|
| API-TM-01 | Get competitions list | GET | `/competitions` | 200 |
| API-TM-02 | Get universities list | GET | `/universities` | 200 |
| API-TM-03 | Get lobby stats | GET | `/lobbies/stats` | 200 |
| API-TM-04 | Get all lobbies (with filters) | GET | `/users/matchmaking/lobbies` | 200 |
| API-TM-05 | Get all lobbies (no auth) | GET | `/users/matchmaking/lobbies` | 401 |
| API-TM-06 | Get my lobbies | GET | `/users/matchmaking/lobbies/me` | 200 |
| API-TM-07 | Get lobby detail | GET | `/users/matchmaking/lobbies/:id` | 200 |
| API-TM-08 | Get lobby detail (invalid id) | GET | `/users/matchmaking/lobbies/invalid` | 404 |
| API-TM-09 | Create lobby (valid) | POST | `/users/matchmaking/lobbies` | 201 |
| API-TM-10 | Create lobby (empty name) | POST | `/users/matchmaking/lobbies` | 422 |
| API-TM-11 | Create lobby (no auth) | POST | `/users/matchmaking/lobbies` | 401 |
| API-TM-12 | Delete own lobby | DELETE | `/users/matchmaking/lobbies/:id` | 200 |
| API-TM-13 | Delete lobby (not owner) | DELETE | `/users/matchmaking/lobbies/:id` | 403 |
| API-TM-14 | Apply to lobby | POST | `/users/matchmaking/lobbies/:id/apply` | 200 |
| API-TM-15 | Apply to lobby (already member) | POST | `/users/matchmaking/lobbies/:id/apply` | 409 |
| API-TM-16 | Review applicant (approve) | PATCH | `/users/matchmaking/lobbies/:id/applications/:appId` | 200 |
| API-TM-17 | Review applicant (reject) | PATCH | `/users/matchmaking/lobbies/:id/applications/:appId` | 200 |
| API-TM-18 | Review applicant (not owner) | PATCH | `/users/matchmaking/lobbies/:id/applications/:appId` | 403 |
| API-TM-19 | Request leave lobby | POST | `/users/matchmaking/lobbies/:id/leave-requests` | 200 |
| API-TM-20 | Get leave requests (owner) | GET | `/users/matchmaking/lobbies/:id/leave-requests` | 200 |
| API-TM-21 | Approve leave request | PATCH | `/users/matchmaking/lobbies/:id/leave-requests/:userId` | 200 |
| API-TM-22 | Reject leave request | PATCH | `/users/matchmaking/lobbies/:id/leave-requests/:userId` | 200 |
| API-TM-23 | Kick member (owner) | DELETE | `/users/matchmaking/lobbies/:id/members/:userId` | 200 |
| API-TM-24 | Kick member (not owner) | DELETE | `/users/matchmaking/lobbies/:id/members/:userId` | 403 |
| API-TM-25 | Get rooms | GET | `/users/matchmaking/rooms` | 200 |
| API-TM-26 | My active room | GET | `/users/matchmaking/rooms/me` | 200 |
| API-TM-27 | Create WS ticket | POST | `/users/matchmaking/rooms/:id/ws-ticket` | 200 |

### 7.4 Selection Form API

| ID | Skenario | Method | Endpoint | Status |
|---|---|---|---|---|
| API-SF-01 | Add competition with selection | POST | `/operational/add-competitions` | 201 |
| API-SF-02 | Add competition without selection | POST | `/operational/add-competitions` | 201 |
| API-SF-03 | Add competition (no auth) | POST | `/operational/add-competitions` | 401 |
| API-SF-04 | Update competition selection | PATCH | `/operational/update-competitions/:id` | 200 |
| API-SF-05 | Update with empty questions | PATCH | `/operational/update-competitions/:id` | 422 |

## 8. Lingkungan Test

| Item | Detail |
|---|---|
| **BE API** | `{{vps}}` (variable di Postman) |
| **FE URL** | `https://akademicompetition.id` (production) / `localhost:5173` (dev) |
| **Database** | Production / Staging |
| **Browser** | Chrome, Firefox, Edge (desktop) |
| **Tools** | Postman, Playwright, Browser DevTools |

## 9. Kriteria Kelulusan

- ✅ Semua critical flow berjalan: create artikel, like/save, create lobby, apply lobby, selection form
- ✅ Tidak ada error 500 pada endpoint publik
- ✅ Auth guard berfungsi: endpoint terproteksi return 401 tanpa token
- ✅ Validasi input berfungsi: field required, format invalid return 422
- ✅ Role-based access: user non-admin tidak bisa akses admin endpoint
