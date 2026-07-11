// ============================================================================
// SEEDER CONFIGURATION — Constants and seed data for both lowongan and career notes
// ============================================================================

// ---------------------------------------------------------------------------
// LOWONGAN SEED DATA — Job listing templates
// ---------------------------------------------------------------------------

export const JUDUL_PEKERJAAN: string[] = [
  'Frontend Developer',
  'Backend Engineer',
  'Fullstack Developer',
  'UI/UX Designer',
  'Data Analyst',
  'Data Scientist',
  'Digital Marketer',
  'Mobile Developer',
  'DevOps Engineer',
  'Quality Assurance',
  'AI Engineer',
  'Product Manager',
];

export const PERUSAHAAN: { id: number; nama: string }[] = [
  { id: 1, nama: 'PT Telkom Indonesia (Persero) Tbk' },
  { id: 3, nama: 'PT Bank Negara Indonesia (Persero) Tbk' },
  { id: 4, nama: 'PT Bank Mandiri (Persero) Tbk' },
  { id: 5, nama: 'PT Pertamina (Persero)' },
  { id: 6, nama: 'PT Bank Rakyat Indonesia (Persero) Tbk' },
  { id: 7, nama: 'PT PLN (Persero)' },
  { id: 8, nama: 'PT Garuda Indonesia (Persero) Tbk' },
  { id: 9, nama: 'PT Perusahaan Listrik Negara (Persero)' },
  { id: 10, nama: 'PT Angkasa Pura I (Persero)' },
  { id: 11, nama: 'PT Bio Farma (Persero)' },
];

export const DESKRIPSI_PER_JUDUL: Record<string, { id_perusahaan: number; deskripsi: string }[]> = {
  'Frontend Developer': [
    { id_perusahaan: 1, deskripsi: 'Tim digital MyIndiHome butuh orang yang bisa bikin antarmuka pengguna yang cepat dan responsif. Kamu akan kerja bareng tim UI/UX dan backend buat ngebangun fitur baru di platform IndiHome, mulai dari halaman langganan sampai dashboard pelanggan. Stack utama kita React + TypeScript + Next.js, jadi pastikan kamu nyaman dengan itu. Pengalaman bikin komponen reusable dan paham accessibility jadi nilai plus.' },
    { id_perusahaan: 3, deskripsi: 'Kami di divisi digital banking BNI lagi cari frontend developer yang bisa bantu bikin aplikasi mobile banking yang smooth dan aman. Pekerjaan sehari-hari termasuk bikin fitur transfer, pembayaran, dan halaman profil nasabah. Kamu akan pakai React, Redux, dan Tailwind CSS. Yang bikin beda di sini: kamu harus paham bagaimana cara bikin UI yang tetap cepat meskipun koneksi internet pengguna lambat.' },
    { id_perusahaan: 5, deskripsi: 'Dashboard monitoring operasional hulu migas Pertamina butuh tampilan baru yang lebih modern dan informatif. Di posisi ini, kamu akan merancang dan mengembangkan antarmuka untuk memvisualisasikan data produksi minyak dan gas secara real-time. Kita pakai Vue.js 3, Vite, dan Ant Design. Kerja di Jakarta, status karyawan tetap, dan kamu akan langsung berkolaborasi dengan tim data engineer.' },
    { id_perusahaan: 4, deskripsi: 'Divisi teknologi Mandiri sedang membangun ulang beberapa layanan perbankan jadi aplikasi mobile yang lebih baik. Kami butuh frontend developer yang bisa bikin antarmuka yang clean dan intuitif menggunakan React Native. Kamu harus paham state management (Redux Toolkit atau Zustand) dan bisa kerja dengan sprint dua mingguan. Fresh graduate dipersilakan kalau punya portofolio yang kuat.' },
    { id_perusahaan: 6, deskripsi: 'Tim transformasi digital BRI sedang mencari frontend developer untuk ikut mengembangkan dashboard internal dan eksternal. Kamu akan pakai Next.js setiap hari, mulai dari bikin halaman laporan sampai fitur administrasi. Kami sangat menghargai developer yang peduli sama performa dan SEO. BRI menyediakan pelatihan bersertifikat untuk semua karyawan, jadi kamu bisa terus berkembang.' },
  ],
  'Backend Engineer': [
    { id_perusahaan: 1, deskripsi: 'Arsitektur microservices Telkom menangani jutaan request setiap hari, dan kami butuh backend engineer yang bisa maintain sekaligus mengembangkan sistem ini. Kamu akan menulis API dengan Node.js dan Golang, terkadang juga bikin worker untuk message broker Kafka. Kami mengharapkan kamu paham clean architecture, bisa nulis unit test yang komprehensif, dan nyaman kerja dengan PostgreSQL.' },
    { id_perusahaan: 3, deskripsi: 'Sistem transaksi perbankan inti BNI menangani ribuan transaksi per detik, dan setiap baris kode harus bisa diandalkan. Di posisi ini, kamu akan mengembangkan dan memelihara service yang berhubungan dengan transfer, pembayaran, dan rekonsiliasi. Kami pakai Java Spring Boot dan Node.js. Yang paling penting: kamu harus paham betul soal ACID transaction, idempotency, dan keamanan data sensitif.' },
    { id_perusahaan: 5, deskripsi: 'ERP internal Pertamina dipakai oleh ribuan karyawan di seluruh Indonesia untuk mengelola operasi harian. Kami butuh backend engineer yang bisa bikin service baru dan optimasi yang lama. Stack utama: Go, PostgreSQL, dan Redis. Pengalaman menangani high-availability system adalah syarat mutlak — sistem ini harus jalan 24/7 tanpa downtime.' },
    { id_perusahaan: 4, deskripsi: 'Tim fraud detection Mandiri sedang membangun sistem deteksi kecurangan yang bisa bekerja secara real-time. Kamu akan membangun pipeline data yang memproses jutaan transaksi per hari dan menandai aktivitas mencurigakan. Teknologi yang dipakai: Apache Kafka untuk streaming, MongoDB untuk log, dan Node.js untuk service layer. Pengalaman dengan event-driven architecture sangat kami butuhkan.' },
    { id_perusahaan: 9, deskripsi: 'Platform layanan pelanggan PLN melayani lebih dari 80 juta pelanggan di seluruh Indonesia. Kami butuh backend engineer yang bisa bantu bangun dan optimasi RESTful API untuk sistem ini. Pekerjaan mencakup integrasi dengan sistem pembayaran pihak ketiga, optimasi query database, dan bikin service untuk pelaporan gangguan. Penempatan di kantor pusat Jakarta.' },
  ],
  'Fullstack Developer': [
    { id_perusahaan: 1, deskripsi: 'Tim internal tools Telkom butuh fullstack developer yang bisa handle semuanya — dari desain antarmuka sampai deployment. Kamu akan mengembangkan aplikasi manajemen proyek yang dipakai oleh ribuan karyawan. Frontend pakai Next.js, backend pakai Prisma + PostgreSQL. Kamu harus bisa kerja end-to-end: bikin API, bikin halaman, setup CI/CD, dan debug di production.' },
    { id_perusahaan: 3, deskripsi: 'Proyek digital onboarding nasabah BNI memungkinkan orang buka rekening dari rumah. Kamu akan mengembangkan seluruh flow ini, dari halaman pendaftaran sampai verifikasi identitas. Frontend React, backend Node.js, database MySQL. Kamu juga harus bisa setup Docker untuk development environment. Ini proyek yang impact-nya besar — jutaan nasabah baru pakai fitur ini setiap bulan.' },
    { id_perusahaan: 5, deskripsi: 'Pertamina punya komitmen besar terhadap keberlanjutan, dan kamu akan bantu membangun platform pelaporan ESG (Environmental, Social, and Governance). Di posisi ini, kamu akan bikin frontend dengan Vue.js, backend dengan Laravel, dan database PostgreSQL. Yang menarik: kamu juga akan kerja dengan data spasial dan peta interaktif untuk visualisasi dampak lingkungan.' },
    { id_perusahaan: 6, deskripsi: 'BRImo adalah super-app perbankan BRI yang dipakai oleh puluhan juta orang. Kamu akan bergabung dengan tim pengembangan fitur end-to-end — dari bikin API sampai bikin UI yang responsif. Stack: React Native, Node.js, MongoDB. Kami kerja dengan sprint dua mingguan, jadi kamu harus bisa deliver fitur yang quality-nya bagus dalam waktu singkat.' },
    { id_perusahaan: 8, deskripsi: 'Sistem manajemen operasional penerbangan Garuda menangani jadwal penerbangan, crew assignment, dan tracking pesawat secara real-time. Kamu akan mengembangkan dan memelihara sistem ini menggunakan Next.js, Express, dan PostgreSQL. Karena ini sistem kritikal, kamu harus siap on-call dan bisa troubleshoot masalah dengan cepat.' },
  ],
  'UI/UX Designer': [
    { id_perusahaan: 1, deskripsi: 'Aplikasi layanan pelanggan IndiHome perlu dirombak total dari sisi pengalaman pengguna. Kamu akan memimpin proses desain dari riset sampai prototype interaktif. Kami butuh designer yang jago Figma, paham design system, dan bisa melakukan user research sendiri. Tunjukkan proses desainmu di portofolio — kami mau lihat bagaimana kamu berpikir, bukan cuma hasil akhirnya.' },
    { id_perusahaan: 3, deskripsi: 'Mobile banking BNI dipakai oleh jutaan nasabah setiap hari, dan setiap perubahan kecil di UI bisa berdampak besar. Di posisi ini, kamu akan mendesain fitur-fitur baru, bikin wireframe dan prototype, serta menjalankan usability testing. Kami sangat menghargai designer yang paham design token dan bisa bikin dark mode yang konsisten.' },
    { id_perusahaan: 4, deskripsi: 'Mandiri sedang membangun dashboard analitik baru untuk tim internal, dan kami butuh UI/UX Designer yang paham aksesibilitas. Kamu akan merancang antarmuka yang bisa dipakai oleh semua orang, termasuk penyandang disabilitas. Standar WCAG 2.1 adalah acuan utama kami. Kalau kamu punya pengalaman dengan desain inklusif, kamu adalah kandidat yang kami cari.' },
    { id_perusahaan: 5, deskripsi: 'Sistem monitoring operasional Pertamina menampilkan data dari ribuan sensor di seluruh Indonesia. Kamu akan merancang antarmuka yang bisa menyajikan data kompleks dengan cara yang mudah dipahami oleh operator di lapangan. Pengalaman bikin visualisasi data dan mengelola component library adalah syarat utama.' },
    { id_perusahaan: 6, deskripsi: 'Tim inovasi digital BRI butuh UI/UX Designer yang bisa jadi jembatan antara kebutuhan bisnis dan pengalaman pengguna. Kamu akan melakukan riset pengguna, membuat user flow, dan berkolaborasi erat dengan developer. Kami mencari designer yang portofolionya menunjukkan proses desain yang kuat, bukan hanya visual yang bagus.' },
  ],
  'Data Analyst': [
    { id_perusahaan: 1, deskripsi: 'Data pelanggan Telkom tersebar di berbagai sistem, dan kami butuh seseorang yang bisa menyatukan semuanya jadi insight yang berguna. Kamu akan menulis query SQL yang kompleks, bikin dashboard di Tableau, dan presentasi hasil analisis ke manajemen. Kami mencari analyst yang tidak hanya bisa mengolah data, tapi juga bisa bercerita dari data tersebut.' },
    { id_perusahaan: 3, deskripsi: 'Setiap hari ada jutaan transaksi perbankan yang terjadi di BNI, dan di balik angka-angka itu ada pola perilaku nasabah yang menarik untuk dipecahkan. Kamu akan menganalisis data transaksi, bikin segmentasi nasabah, dan memberikan rekomendasi ke tim bisnis. Kami pakai Google BigQuery untuk query dan Looker untuk visualisasi.' },
    { id_perusahaan: 5, deskripsi: 'Rantai pasok bahan bakar Pertamina melibatkan distribusi dari kilang ke ribuan SPBU di seluruh Indonesia. Kamu akan menganalisis data distribusi, memantau KPI operasional, dan memberikan rekomendasi untuk efisiensi. Pekerjaan ini butuh orang yang teliti dan bisa bekerja dengan dataset besar menggunakan SQL dan Excel.' },
    { id_perusahaan: 4, deskripsi: 'Tim marketing Mandiri butuh data analyst yang bisa mengukur efektivitas kampanye pemasaran secara akurat. Kamu akan bekerja dengan Google Analytics, SQL, dan Google Sheets untuk menganalisis data akuisisi nasabah. Laporan mingguanmu akan langsung dipakai oleh CMO untuk mengambil keputusan strategis.' },
    { id_perusahaan: 9, deskripsi: 'PLN mengumpulkan data konsumsi listrik dari 80 juta pelanggan setiap bulan. Kamu akan menganalisis pola pemakaian, memprediksi lonjakan permintaan, dan bikin dashboard pemantauan yang dipakai oleh tim operasional. Pengalaman dengan Metabase atau Apache Superset sangat diharapkan.' },
  ],
  'Data Scientist': [
    { id_perusahaan: 1, deskripsi: 'Churn prediction adalah salah satu masalah paling kritis di bisnis telekomunikasi. Kamu akan membangun model machine learning untuk memprediksi pelanggan mana yang berpotensi pindah ke kompetitor. Stack: Python, TensorFlow, dan MLflow untuk experiment tracking. Pengalaman dengan NLP dan sistem rekomendasi akan sangat berguna di proyek-proyek selanjutnya.' },
    { id_perusahaan: 3, deskripsi: 'BNI menangani jutaan transaksi per hari, dan di antara transaksi-transaksi itu ada yang fraud. Kamu akan membangun model yang bisa mendeteksi kecurangan secara real-time. Tantangan utamanya: dataset sangat tidak seimbang (fraud hanya 0.01%), jadi kamu harus paham teknik oversampling, undersampling, dan feature engineering yang kreatif.' },
    { id_perusahaan: 5, deskripsi: 'Peralatan di kilang minyak Pertamina menghasilkan ribuan data sensor setiap detik. Kamu akan membangun model predictive maintenance untuk mendeteksi kerusakan sebelum terjadi. Ini berarti kamu akan bekerja dengan time series data dan harus bisa deploy model ke edge device. Kalau kamu suka tantangan IoT + ML, ini posisi yang tepat.' },
    { id_perusahaan: 4, deskripsi: 'Mandiri ingin memberikan rekomendasi produk yang personal untuk setiap nasabah. Kamu akan membangun sistem rekomendasi menggunakan collaborative filtering dan content-based filtering. Data yang diproses sangat besar, jadi kami pakai PySpark dan Google BigQuery. Kamu juga akan bekerja sama dengan tim product untuk menguji rekomendasi ini dengan A/B testing.' },
    { id_perusahaan: 11, deskripsi: 'Bio Farma adalah produsen vaksin terbesar di Indonesia, dan kami membutuhkan data scientist untuk mendukung riset pengembangan vaksin baru. Kamu akan menganalisis data genomik dan data klinis menggunakan Python dan R. Latar belakang di bioinformatika atau biologi komputasional sangat diutamakan.' },
  ],
  'Digital Marketer': [
    { id_perusahaan: 1, deskripsi: 'Produk digital Telkom seperti IndiHome dan MyTelkomsel perlu dipasarkan secara lebih agresif di ruang digital. Kamu akan mengelola kampanye Google Ads dan Facebook Ads, bikin strategi konten, dan analisis ROI setiap kampanye. Kami butuh marketer yang data-driven dan punya sertifikasi Google Analytics atau Google Ads.' },
    { id_perusahaan: 3, deskripsi: 'BNI sedang gencar-gencarnya menarik nasabah baru melalui kanal digital. Kamu akan bertanggung jawab atas strategi akuisisi nasabah melalui SEO, email marketing, dan media sosial. Tools yang dipakai: SEMrush untuk riset keyword, Mailchimp untuk email campaign, dan Meta Business Suite untuk social media management.' },
    { id_perusahaan: 4, deskripsi: 'Tim growth Mandiri butuh digital marketer yang bisa mengelola anggaran iklan secara efisien. Kamu akan menjalankan A/B testing di landing page, mengoptimalkan conversion funnel, dan melaporkan performa kampanye setiap minggu. Kami mencari orang yang comfortable dengan data dan bisa mengambil keputusan berdasarkan angka, bukan asumsi.' },
    { id_perusahaan: 5, deskripsi: 'Pertamina punya program CSR dan kemitraan yang perlu dikomunikasikan ke publik. Kamu akan mengelola konten untuk portal CSR, menulis artikel, mengelola media sosial perusahaan, dan kadang juga ikut kegiatan lapangan untuk dokumentasi. Penempatan di Jakarta.' },
    { id_perusahaan: 8, deskripsi: 'Garuda Indonesia terbang ke lebih dari 60 destinasi internasional, dan kami butuh digital marketer yang bisa memasarkan rute-rute ini secara digital. Kamu akan mengelola iklan di Google, mengoptimasi konten website, dan berkolaborasi dengan agen perjalanan online. Kemampuan bahasa Inggris aktif adalah syarat wajib karena sebagian besar target pasar adalah wisatawan asing.' },
  ],
  'Mobile Developer': [
    { id_perusahaan: 1, deskripsi: 'Aplikasi penyimpanan awan Telkom Cloud membutuhkan developer Android yang bisa bikin fitur upload, preview, dan sharing file dengan lancar. Kamu akan pakai Kotlin dan Jetpack Compose setiap hari, dengan arsitektur MVVM sebagai fondasi. Pengalaman dengan Firebase untuk push notification dan authentication sangat diutamakan.' },
    { id_perusahaan: 3, deskripsi: 'Aplikasi mobile banking BNI di iOS perlu terus diperbaiki dan ditambah fitur-fitur barunya. Kamu akan mengembangkan fitur seperti biometric login, transfer antar bank, dan pembayaran QRIS. Kami pakai SwiftUI dan Combine Framework. Kamu juga harus terbiasa dengan proses review App Store yang ketat.' },
    { id_perusahaan: 4, deskripsi: 'Mandiri sedang mengembangkan beberapa aplikasi mobile dengan Flutter untuk mempercepat delivery di iOS dan Android sekaligus. Kamu harus menguasai state management dengan BLoC atau Riverpod dan tahu cara bikin platform channel yang benar. Pengalaman dengan arsitektur modular sangat kami hargai karena codebase kami cukup besar.' },
    { id_perusahaan: 6, deskripsi: 'BRImo dipakai oleh puluhan juta orang setiap bulan, dan kami butuh React Native developer yang bisa bikin aplikasi yang cepat dan stabil. Kamu akan mengoptimasi performa, mengintegrasikan fitur biometric authentication, dan bikin animasi yang smooth. Pengalaman dengan Hermes Engine dan Reanimated library adalah syarat yang kami cari.' },
    { id_perusahaan: 5, deskripsi: 'Aplikasi layanan SPBU Pertamina membutuhkan developer Android yang bisa bikin fitur pelacakan lokasi GPS dan integrasi peta. Kamu juga akan mengembangkan fitur pemesanan BBM dan logistik distribusi. Sistem ini harus bisa bekerja secara offline karena tidak semua SPBU punya koneksi internet yang stabil.' },
  ],
  'DevOps Engineer': [
    { id_perusahaan: 1, deskripsi: 'Telkom Cloud adalah platform cloud milik Telkom yang melayani berbagai layanan internal dan eksternal. Kamu akan mengelola infrastruktur Kubernetes cluster, bikin pipeline CI/CD, dan memastikan semua service berjalan dengan lancar. Pengalaman dengan Terraform untuk infrastructure-as-code, Istio untuk service mesh, dan Prometheus untuk monitoring adalah nilai plus.' },
    { id_perusahaan: 3, deskripsi: 'BNI sedang membangun platform orkestrasi kontainer untuk mempercepat deployment aplikasi perbankan. Kamu akan mengelola klaster Kubernetes, merencanakan disaster recovery, dan mengelola kapasitas infrastruktur. Sertifikasi CKA (Certified Kubernetes Administrator) atau AWS Solutions Architect akan menjadi pertimbangan kuat.' },
    { id_perusahaan: 4, deskripsi: 'Tim platform engineering Mandiri mengelola infrastruktur yang dipakai oleh ratusan developer setiap hari. Kamu akan setup dan maintain GitLab CI pipeline, mengelola ArgoCD untuk GitOps deployment, dan membangun observability stack. Kami juga mengharapkan kamu bisa menerapkan policy-as-code menggunakan OPA.' },
    { id_perusahaan: 5, deskripsi: 'Infrastruktur Pertamina adalah hybrid cloud — gabungan antara on-premise dan cloud publik. Kamu akan mengelola keduanya menggunakan Ansible dan Packer. Kami juga pakai Vault untuk secret management. Tantangan utamanya: menjaga keamanan infrastruktur yang sangat kritikal untuk operasional energi nasional.' },
    { id_perusahaan: 9, deskripsi: 'Sistem SCADA PLN mengontrol distribusi listrik ke seluruh Jawa dan Bali. Kamu akan mengelola deployment sistem ini dan juga platform IoT yang memantau jaringan listrik. Pekerjaan ini butuh orang yang paham komputasi tepi (edge computing) dan protokol MQTT. Kami juga mengharapkan kamu bisa bikin otomatisasi untuk provisioning infrastruktur.' },
  ],
  'Quality Assurance': [
    { id_perusahaan: 1, deskripsi: 'Produk digital Telkom diluncurkan ke jutaan pengguna, jadi kualitas harus terjaga. Kamu akan menulis skenario uji, menjalankan pengujian manual dan otomatis menggunakan Cypress atau Playwright, serta mengintegrasikan test suite ke pipeline CI/CD. Kami butuh QA yang bisa berpikir seperti pengguna akhir sekaligus seperti developer.' },
    { id_perusahaan: 3, deskripsi: 'Sistem perbankan digital BNI harus bekerja dengan sempurna — satu bug kecil bisa berdampak pada jutaan transaksi. Kamu akan menguji API menggunakan Postman, menjalankan load testing dengan k6, dan melakukan security testing dasar. Kami mencari QA yang teliti, sistematis, dan tidak takut untuk speak up kalau menemukan masalah.' },
    { id_perusahaan: 4, deskripsi: 'Mandiri punya suite pengujian otomatis yang cukup besar, dan kamu akan bertanggung jawab untuk memeliharanya. Stack: Selenium untuk UI testing, TestNG sebagai test framework, dan Jenkins untuk menjalankan test secara otomatis. Kamu juga akan menguji integrasi database dan memastikan konsistensi data setelah setiap deployment.' },
    { id_perusahaan: 5, deskripsi: 'Sistem ERP Pertamina dipakai oleh ribuan karyawan untuk mengelola operasi harian. Kamu akan membuat rencana uji, melakukan exploratory testing, dan melaporkan defect dengan dokumentasi yang jelas. Pengalaman dengan JIRA dan pemahaman tentang SDLC adalah syarat wajib.' },
    { id_perusahaan: 6, deskripsi: 'Tim mobile banking BRI butuh QA yang bisa menguji aplikasi di berbagai perangkat dan kondisi jaringan. Kamu akan pakai Appium atau Detox untuk mobile testing dan Postman untuk API testing. Kami kerja dengan sprint dua mingguan, jadi kamu harus bisa adaptasi dengan cepat dan deliver test result tepat waktu.' },
  ],
  'AI Engineer': [
    { id_perusahaan: 1, deskripsi: 'Tim AI Telkom sedang mengembangkan solusi computer vision untuk inspeksi infrastruktur jaringan dan chatbot berbasis NLP untuk layanan pelanggan. Kamu akan training model, optimize inference, dan deploy ke production menggunakan TensorFlow Serving atau ONNX Runtime. Kami butuh engineer yang tidak hanya bisa bikin model, tapi juga bisa memastikan modelnya berjalan cepat di production.' },
    { id_perusahaan: 3, deskripsi: 'Verifikasi dokumen kredit di BNI masih banyak yang manual, dan kami ingin mengotomatisasinya dengan AI. Kamu akan membangun sistem OCR dan document layout analysis untuk membaca KTP, slip gaji, dan dokumen pendukung lainnya. Kami juga sedang mengeksplorasi fine-tuning large language model untuk ekstraksi informasi dari dokumen.' },
    { id_perusahaan: 5, deskripsi: 'Optimasi rantai pasok BBM Pertamina adalah masalah yang sangat kompleks — ada ribuan SPBU, depot, dan kilang yang harus terkoordinasi. Kamu akan mengembangkan model reinforcement learning untuk optimasi distribusi. Stack: MLflow untuk experiment tracking, Kubeflow untuk pipeline, dan Python untuk semuanya.' },
    { id_perusahaan: 4, deskripsi: 'AI Center of Excellence di Mandiri sedang membangun beberapa solusi AI, termasuk chatbot layanan nasabah dan sistem rekomendasi produk. Kamu akan mengembangkan model NLP yang bisa memahami bahasa Indonesia dengan baik dan membangun inference pipeline yang real-time menggunakan Apache Kafka dan Redis.' },
    { id_perusahaan: 11, deskripsi: 'Bio Farma sedang mengembangkan platform analisis data klinis berbasis AI untuk mendukung uji klinis vaksin. Kamu akan membangun model deep learning untuk analisis citra medis dan data klinis. Kami mencari engineer yang punya latar belakang di computer vision atau NLP dan paham MLOps menggunakan MLflow dan Docker.' },
  ],
  'Product Manager': [
    { id_perusahaan: 1, deskripsi: 'Platform MyIndiHome dipakai oleh jutaan pelanggan untuk mengelola langganan internet dan TV mereka. Kamu akan bertanggung jawab atas peta jalan produk, mulai dari riset kebutuhan pengguna sampai koordinasi dengan tim engineering dan design. Pengalaman mengelola produk digital dengan basis pengguna besar adalah syarat utama.' },
    { id_perusahaan: 3, deskripsi: 'Aplikasi mobile banking BNI terus berkembang dengan fitur-fitur baru. Kamu akan mengelola product backlog, menulis user stories, dan menjalankan A/B testing untuk memvalidasi fitur. Kamu juga harus paham regulasi perbankan digital dari OBI karena setiap fitur harus comply.' },
    { id_perusahaan: 4, deskripsi: 'Tim digital lending Mandiri sedang membangun produk pinjaman online yang bisa diakses dari aplikasi mobile. Kamu akan melakukan riset pasar, menetapkan OKR produk, dan memastikan fitur dikirim tepat waktu. Kami butuh PM yang punya minimal 3 tahun pengalaman di produk keuangan berbasis teknologi.' },
    { id_perusahaan: 5, deskripsi: 'Platform ERP Pertamina adalah sistem besar yang dipakai oleh seluruh direktorat. Kamu akan mengelola roadmap pengembangan, berkoordinasi dengan pemangku kepentingan dari berbagai divisi, dan memastikan setiap perubahan tidak mengganggu operasional. Pemahaman tentang BPMN dan sertifikasi Scrum PSPO adalah nilai tambah.' },
    { id_perusahaan: 6, deskripsi: 'BRImo adalah salah satu super-app perbankan terbesar di Indonesia. Kamu akan melakukan product discovery, usability testing, dan berkolaborasi dengan tim engineering untuk mengirim fitur yang bermanfaat. Kami butuh PM yang data-driven dan terbiasa menggunakan tools seperti Amplitude, Mixpanel, atau Firebase Analytics untuk mengambil keputusan.' },
  ],
};

/** Fallback generic descriptions when needed */
export const DESKRIPSI_FALLBACK: string[] = [
  'Perusahaan BUMN terkemuka membuka kesempatan bagi talenta profesional untuk bergabung dan berkontribusi dalam pengembangan bisnis perusahaan. Lingkungan kerja yang profesional dengan jenjang karir yang jelas serta fasilitas pengembangan kompetensi secara berkelanjutan.',
  'Lowongan resmi dibuka untuk posisi ini. Kandidat yang terpilih akan ditempatkan di kantor pusat dengan sistem kerja hybrid. Perusahaan menyediakan remunerasi yang kompetitif, tunjangan BPJS Kesehatan dan Ketenagakerjaan, serta program pengembangan diri secara berkala.',
  'Kesempatan berkarir di perusahaan BUMN dengan reputasi terbaik di Indonesia. Perusahaan mencari individu yang berintegritas tinggi, inovatif, dan siap memberikan kontribusi nyata. Paket manfaat lengkap meliputi asuransi kesehatan, program dana pensiun, dan bonus kinerja tahunan.',
  'Mari bergabung dan menjadi bagian dari transformasi digital perusahaan BUMN terdepan di Indonesia. Perusahaan membuka kesempatan bagi para profesional muda yang ambisius dan memiliki semangat belajar tinggi. Seluruh proses seleksi dilaksanakan secara transparan dan berdasarkan kompetensi.',
];

export { CAREER_NOTES, categoryColors, CAREER_NOTE_INDICATORS } from './career_notes_data.js';