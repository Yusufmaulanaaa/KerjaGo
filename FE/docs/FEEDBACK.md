# Feedback Laporan UAS Pemweb 2

## Nama: Yusuf Hilmi Akbar
## NIM: 312210349

## 1. Fitur yang Berhasil Diimplementasikan
- [x] Autentikasi pengguna (login/register) dengan JWT
- [x] Manajemen lowongan pekerjaan (CRUD lowongan untuk rekruter)
- [x] Melamar lowongan (pelamar dapat melamar lowongan)
- [x] Sistem rekomendasi pekerjaan berdasarkan kategori dan lokasi
- [x] Manajemen profil pengguna (pelamar dan rekruter)
- [x] Career notes (catatan karier untuk pelamar)
- [x] Notifikasireal-time (sederhana) untuk pelamar dan rekruter
- [x] Filter dan pencarian lowongan berdasarkan kategori, lokasi, dan gaji
- [x] Responsif design untuk mobile dan desktop

## 2. Fitur yang Tidak Diimplementasikan
- [ ] Sistem verifikasi email untuk verifikasi akun baru
- [ ] Pengunggahan CV/file pelamar saat melamar lowongan
- [ ] Chat real-time antara pelamar dan rekruter
- [ ] Analytics dan laporan untuk rekruter (lihat pelamar, statistik lamaran)
- [ ] Sistem pelamar yang disarankan untuk rekruter berdasarkan kriteria lowongan
- [ ] Integrasi dengan layanan pihak ketiga (misalnya LinkedIn, Google Sign-In)
- [ ] Sistem pembayaran untuk fitur premium (misalnya, promocian lowongan)
- [ ] Sistem pelaporan dan moderasi konten yang dilaporkan
- [ ] Dukungan untuk bahasa internasional (i18n) dan lokalisasi (l10n)

## 3. Kendala yang Dihadapi selama Pengembangan
- **Keterbatasan Waktu**: Waktu yang terbatas untuk menyelesaikan semua fitur yang diinginkan, sehingga beberapa fitur harus diprioritaskan atau ditinggalkan.
- **Keterbatasan Pengetahuan**: Kurangnya pengalaman dalam mengimplementasikan fitur-fitur tertentu seperti real-time chat atau sistem pembayaran.
- **Masalah Integrasi Backend-Frontend**: Kadang-kadang terjadi ketidaksesuaian antara data yang diharapkan frontend dan yang diberikan backend, menyebabkan perlu dilakukan pensesuaian pada API atau struktur data.
- **Debugging yang Rumit**: Kesulitan dalam men-debug masalah yang terkait dengan asynchronous operations dan state management dalam aplikasi React yang cukup kompleks.
- **Keterbatasan Resource**: Keterbatasan akses ke layanan backend yang stabil selama pengembangan (misalnya, server backend kadang tidak tersedia atau lambat).
- **Keterbatasan Dokumentasi**: Dokumentasi backend yang kurang lengkap terkadang menyebabkan keraguan mengenai format data yang diharapkan atau struktur endpoint.

## 4. Pembelajaran yang Didapat
- **Pengembangan Full-Stack**: Saya belajar bagaimana membangun aplikasi full-stack menggunakan React untuk frontend dan Node.js/Express untuk backend, serta bagaimana keduanya berkomunikasi melalui RESTful API.
- **State Management**: Saya mempelajari penggunaan React Context API dan hooks untuk mengelola state aplikasi yang kompleks, termasuk autentikasi dan data yang bersifat global.
- **Autentikasi dan Keamanan**: Saya belajar mengimplementasikan autentikasi berbasis JWT, termasuk penyimpanan token yang aman di cookie dan mekanisme refresh token.
- **Integrasi API**: Saya terlatih dalam melakukan HTTP request ke backend menggunakan axios, menangani respons dan kesalahan, serta menyinkronkan state frontend dengan data dari backend.
- **Desain Responsif**: Saya memperkuat keterampilan dalam membuat antarmuka yang responsif dan mobile-friendly menggunakan CSS modern dan teknik seperti flexbox dan grid.
- **Penggunaan Alat Pengembangan**: SIA lebih terlatih menggunakan VS Code, Git untuk version control, dan berbagai alat pengembang seperti ESLint dan Prettier untuk menjaga kualitas kode.
- **Problem Solving dan Debugging**: Saya lebih mahir dalam mengidentifikasi dan memperbaiki bugs, serta menggunakan alat-alat seperti React DevTools dan console untuk debugging.
- **Manajemen Waktu dan Prioritas**: Saya belajar untuk menyetel prioritas fitur berdasarkan waktu yang tersedia dan dampaknya terhadap fungsionalitas inti aplikasi.
- **Kolaborasi dan Dokumentasi**: Meskipun ini adalah proyek individu, saya belajar pentingnya dokumentasi kode dan komit yang jelas untuk memudahkan pengembangan dan debugging di masa depan.

## 5. Saran untuk Peningkatan dalam Masa Depan
- **Manajemen State yang Lebih Canggih**: Pertimbangkan menggunakan Redux atau Zustand untuk pengelolaan state yang lebih kompleks dan terdistribusi.
- **Pengujian Otomatis**: Terapkan unit testing dan integration testing menggunakan Jest dan React Testing Library untuk menjamin kualitas kode.
- **CI/CD Pipeline**: Siapkan continuous integration dan continuous deployment menggunakan GitHub Actions atau layanan serupa untuk otomatisasi testing dan deployment.
- **Dokumentasi API yang Lengkap**: Gunakan alat seperti Swagger/OpenAPI untuk dokumentasi backend yang lebih terstruktur.
- **Arsitektur yang Lebih Modular**: Refaktor kodebackend dan frontend menjadi lebih modular dan mudah dipelihara.
- **Penggunaan TypeScript**: Jika belum menggunakan TypeScript, pertimbangkan untuk bermigrasi ke TypeScript untuk tipe yang lebih baik dan pengembangan yang lebih aman.
- **Optimasi Performa**: Lakukan code-splitting, lazy loading, dan optimasi gambar untuk memperbaiki waktu muat aplikasi.
- **Aksesibilitas**: Pastikan aplikasi dapat diakses oleh pengguna dengan disabilitas dengan mengikuti pedoman WCAG.
- **Keamanan yang Lebih Ketat**: Lakukan security audit dan terapkan praktik terbaik seperti helmet, rate limiting, dan sanitasi input.
- **Feedback Loop dari Pengguna**: Tambahkan mekanisme untuk mengumpulkan feedback dari pengguna akhir untuk perbaikan berkelanjutan.

## 6. Refleksi Singkat
Proyek UAS Pemweb 2 ini telah menjadi pengalaman belajar yang sangat berharga bagi saya. Meski ada banyak tantangan dan keterbatasan, saya berhasil membangun aplikasi web full-stack yang fungsional dengan banyak fitur inti yang berjalan dengan baik. Saya merasa telah tumbuh signifikan dalam kemampuan saya sebagai pengembang web, khususnya dalam mengintegrasikan frontend dan backend, managing state kompleks, dan menyelesaikan masalah secara mandiri. Meskipun ada beberapa fitur yang tidak dapat saya implementasi karena kendala waktu dan pengetahuan, saya merasa yakin bahwa fondasi yang telah saya bangun kuat untuk pengembangan lebih lanjut. Proyek ini juga mengajarkan saya pentingnya perencanaan, dokumentasi, dan pengujian dalam pengembangan perangkat lunak, pelajaran yang akan saya bawa ke proyek-proyek masa depan saya.

Terima kasih atas kesempatan belajar ini.