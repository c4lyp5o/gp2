# Changelog

### 11/5/2023 (v2.1.0)

#### Added

- Membuka submodul Sekolah di modul Pengguna
- Membuka submodul Kohort Kotak di modul Pengguna
- Pentadbir daerah boleh memilih sekolah di modul Pentadbir
- Mengemaskini soalan-soalan FAQ sistem Gi-Ret 2.0

#### Removed

- Tidak memaparkan email di notifikasi ketika ingin log masuk ke dalam modul Pentadbir bagi semua peringkat

### 17/4/2023 (v2.0.19)

#### Changed

- Pengguna perlu menjawab pemilihan penggunaan KPB / MPB ya atau tidak ketika mengisi borang pesakit umum sekiranya pesakit berkenaan berada di dalam tarikh penggunaan KPB / MPB bagi fasiliti tersebut

#### e-Reporting

- Menambah pilihan reten TOD 02 Pin. 1/2022 untuk dijana di semua peringkat pentadbir

### 5/4/2023 (v2.0.18)

#### Added

- Menambah submodul Carian Promosi di modul Pengguna

#### Changed

- Perubahan pada cara memasukan kod taska dan tadika di modul Pentadbir bagi Pentadbir Daerah
- Senarai promosi yang dipaparkan di submodul Promosi Individu adalah berdasarkan kepada operator yang log masuk ke dalam modul Pengguna
- Tindakan untuk menghapuskan reten promosi klinik & promosi individu diubah kepada submodul Carian Promosi dan dibuka hanya kepada pentadbir klinik atau pegawai promosi klinik

#### Removed

- Membuang butang hapus bagi reten promosi klinik & promosi individu di bawah submodul Pengisian Data

#### e-Reporting

- Pembetulan pada reten PG206 & PG207 supaya mengambil data bagi rawatan operator lain dengan lebih tepat
- Memperbetulkan data yang tidak dipaparkan di kolum Pameran/Kempen, Radio dan Cetak bagi reten PGPRO 01 Pind. 2/2022 FFR dan reten PGPRO 01 Pind. 2/2022 Kod Program
- Reten promosi yang telah dihapuskan tidak akan dipaparkan di dalam reten PGPRO 01 Pind. 2/2022 FFR dan reten PGPRO 01 Pind. 2/2022 Kod Program

### 26/3/2023 (v2.0.17)

#### Fixed

- Operator yang mempunyai peranan sebagai pentadbir yang telah dihapuskan tidak akan ada di dalam pilihan semasa ingin log masuk di modul Pentadbir bagi Pentadbir Klinik
- Pembetulan supaya tidak mengeluarkan operator yang telah dihapuskan di pemilihan operator semasa penjanaan reten PG206 & PG207 bagi peringkat Pentadbir Daerah & Pentadbir Negeri
- Menambah baik prestasi aplikasi yang melibatkan apa-apa operasi bagi pegawai & juruterapi pergigian di setiap peringkat pentadbir

### 22/3/2023 (v2.0.16)

#### Fixed

- Memperbetulkan pemilihan di tetingkap penjanaan reten bagi yang mempunyai pilihan fasiliti KKIA/KD, Program Komuniti, KPB/MPB atau individu di semua peringkat pentadbir
- Menambah baik prestasi aplikasi secara keseluruhan

#### Removed

- Membuang pilihan Program Pergigian Sekolah Sesi 2022/2023 kerana sesi telah tamat dan telah bermula sesi yang baru

### 15/3/2023 (v2.0.15)

#### Changed

- Pesakit baru yang dihapuskan sekiranya didaftarkan semula akan mendapat nombor pendaftaran yang asal tetapi kedatangan adalah baru
- Pesakit ulangan yg tidak mendapatkan pemeriksaan pada kedatangan baru kini boleh diisi pemeriksaan pada kedatangan ulangan
- Turutan senarai pesakit di modul Pendaftaran akan dipaparkan bermula mengikut pesakit yang terakhir sekali didaftarkan

#### Security

- Menambahbaik sekuriti di dalam sistem

#### e-Reporting

- Memperbetulkan pelbagai formula bagi semua reten-reten di setiap peringkat pentadbir

### 6/3/2023 (v2.0.14)

#### Added

- Menambah kotak penandaan pesakit _oncall_ ketika mendaftarkan pesakit bagi fasiliti klinik pergigian di modul Pendaftaran
- Penambahan cara carian di senarai daftar pesakit di modul Pendaftaran dengan cara carian tanpa tarikh atau dengan tarikh

#### Fixed

- Pengiraan umur pesakit dibetulkan sekiranya pesakit lahir pada hari yang sama dengan tarikh hari semasa hari kedatangan
- Penambahbaikan cara paparan maklumat di submodul Rekod Regawai di modul Pengguna

#### e-Reporting

- Memaparkan tarikh & bulan yang betul di _stamping_ bagi reten Gender & reten Tekanan Darah
- Memperbetulkan pelbagai formula bagi semua reten-reten di setiap peringkat pentadbir

### 17/2/2023 (v2.0.13)

#### Added

- Menambah ruangan waktu janji temu sekiranya kotak pesakit janji temu ditanda semasa mendaftarkan pesakit bagi fasiliti klinik pergigian

#### Fixed

- Token di modul Pentadbir akan dipaparkan kepada jumlah yang baru selepas penolakan berlaku selepas penjanaan reten
- Format tarikh pendaftaran pesakit diperbetulkan di bahagian _server_ juga sekiranya dihantar dengan format yang salah daripada pelayar internet pengguna supaya tiada pesakit yang hilang selepas didaftarkan

#### e-Reporting

- Penambahbaikan PG101 dan PG211 untuk UTC
- Penambahbaikan reten PG101A dan PG101C
- Pembetulan penjanaan reten PG101C untuk KPB/MPB
- Penambahbaikan PG214, PG206 dan PG207
- Penambahbaikan reten BP, MASA dan PGPRO
- Penambahbaikan menyeluruh pada label bulan di semua reten
- Kemaskini reten PGPRO dan MASA
- Penjanaan untuk individu dibuka bagi PG206, PG207 dan PGPRO di modul Pentadbir untuk penjanaan menggunakan token
- Nama setiap file reten diperbetulkan mengikut reten yang dijana
- Penjanaan reten mempunyai dua mod, (mod penjanaan menggunakan limitasi token & mod penjanaan secara bulanan yang telah siap dikira sebagai reten akhir pada setiap 7 haribulan bulan berikutnya)

### 10/2/2023 (v2.0.12)

#### Added

- Catatan dipaparkan di submodul Status Harian bagi modul Pengguna

#### Changed

- Perubahan cara carian bagi submodul Promosi Klinik & Promosi Individu bagi modul Pengguna
- Jumlah DMFX tidak lagi dikira bersama E di borang pesakit umum

#### Fixed

- Sistem akan mengesan secara automatik sekiranya nama pengguna di tab yang berlainan telah berubah
- Sistem akan log keluar secara automatik sekiranya pengguna telah log keluar di tab yang berlainan
- Waktu dipanggil tidak boleh kurang atau sama dengan waktu sampai semasa mengisi borang pesakit umum bagi pesakit fasiliti klinik pergigian
- Submodul Program Pergigian Sekolah 2022/2023 diperbetulkan untuk setiap pesakit yang didaftarkan di bawah Program Pergigian Sekolah Sesi 2022/2023

#### Removed

- Kemaskini nama & tarikh lahir ditutup di modul Pentadbir kerana keperluan yang sangat rendah

#### e-Reporting

- Setiap reten yang dijana mempunyai _stamping_ dari sistem yang betul
- Penjanaan reten dibuka di modul Pentadbir bagi Pentadbir Negeri, Pentadbir Daerah & Pentadbir Klinik
- Diperbetulkan nama bulan bagi reten PG101A di modul Pendaftaran bagi submodul Klinik Pergigian

### 7/2/2023 (v2.0.11)

#### Added

- Menambah ruangan maklumat tambahan yang mengandungi no telefon & email pesakit di submodul Senarai Daftar Pesakit di modul Pendaftaran
- Mengeluarkan kiraan perbezaan waktu sampai & waktu dipanggil di borang pesakit umum bagi pesakit fasiliti klinik pergigian

#### Changed

- Notifikasi amaran "Taska/Tadika Telah Wujud" ketika menambah taska/tadika yang mempunyai kod Taska/Tadika yang sama di modul Pentadbir bagi Pentadbir Daerah diubah kepada "Kod Taska/Tadika ini telah wujud"
- Pengenalan diri pesakit dipaparkan dengan huruf besar atau huruf kecil yang asal di semua modul yang berkaitan
- Waktu dipanggil wajib diisi hanya untuk pesakit fasiliti klinik pergigian sahaja

#### Fixed

- Umur dikira semula dengan betul sekiranya pendaftaran menggunakan maklumat pesakit sedia ada
- Masa & tarikh di dalam sistem diperbetulkan dengan lebih kemas supaya penentuan tarikh, _timezone_ & masa adalah betul dan ditetapkan daripada sistem

#### e-Reporting

- PG101A yang dijana dari modul Pendaftaran diperbetulkan sususan dan _alignment_ setiap kolum
- PG101A yang dijana dari modul Pendaftaran mempunyai _stamping_ dari sistem yang betul

### 31/1/2023 (v2.0.10)

#### Added

- Penambahan kotak penandaan Pendebridmen Akar di borang pesakit umum bagi pilihan rawatan Terapi Periodontium
- Penambahan kotak penandaan Rujukan Ke Klinik Kesihatan di borang pesakit umum bagi pilihan rawatan Rujukan
- Carian pesakit umum di submodul Umum juga boleh menggunakan Nama Program
- Pilihan penggunaan KPB/MPB akan ada di borang pesakit Umum sekiranya pesakit tersebut datang di dalam lingkungan tarikh penggunaan KPB/MPB tersebut
- Penambahan kotak penandaan Ada Sejarah Darah Tinggi di borang pesakit umum
- Menambah jenis fasiliti & nama program di bahagian atas borang pendaftaran ketika mendaftarkan pesakit
- Penjanaan PG101A dibuka di modul Pendaftaran bagi submodul Klinik Pergigian sahaja

#### Changed

- Borang pesakit umum disusun dengan lebih kemas
- Konfirmasi kedua semasa mendaftarkan pesakit diubah warna latar kepada warna yang berlainan
- Enrolmen bagi institusi semasa mengemaskini program komuniti di modul Pentadbir bagi Pentadbir Klinik ditukar kepada tidak wajib
- Boleh memilih jenis fasiliti ketika membuat penetapan tarikh penggunaan KPB/MPB di modul Pentadbir bagi Pentadbir Klinik
- Pilihan jenis fasiliti untuk tarikh penggunaan KPB/MPB adalah fasiliti daripada seluruh negeri tersebut
- Waktu sampai tidak perlu diisi bagi pesakit yang didaftarkan di fasiliti selain klinik pergigian
- Tekanan darah akan bertukar daripada 0 kepada tiada apa-apa sekiranya di klik untuk diisi di borang pesakit umum

#### Fixed

- Carian nama pesakit diperbetulkan sekiranya menggunakan huruf besar di modul Pengguna bagi submodul Umum & submodul Carian
- Pegawai promosi klinik boleh menghapuskan promosi individu dan juga promosi klinik

#### Security

- Menambahbaik sekuriti secara keseluruhan untuk sistem

### 17/1/2023 (v2.0.9)

#### Added

- Skroll ke bawah secara automatik selepas memilih pesakit di submodul umum
- Carian pesakit di submodul umum & submodul carian boleh menggunakan nama, ic atau operator bagi pesakit tersebut

#### Changed

- Ringkasan beban kerja di submodul rekod pegawai diperkemaskan untuk memaparkan jumlah-jumlah pesakit yang berkaitan

#### Fixed

- Menyahaktifkan kebolehan untuk mengubah taska/tadika dan KKIA/KD apabila mengemaskini pesakit di hari yang sama di modul pendaftaran
- Membetulkan penggunaan 'Menggunakan data sedia ada' di modul Pendaftaran supaya pesakit yang didaftarkan di _Environment Training_ tidak berkongsi data bersama pesakit di _Environment Production_
- Pembaikan bagi senarai-senarai PP, JP, Fasiliti KP & Fasiliti KKIA/KD menggunakan data yang lebih efisien
- Pembaikan bagi sesetengah operator yang tidak dapat masuk ke dalam modul Pengguna bagi yang sudah mempunyai beban kerja yang banyak
- Pilihan aktiviti yang dijalankan bagi promosi klinik & promosi individu dibetulkan perbezaannya ketika mengisi borang promosi individu & promosi klinik

### 11/1/2023 (v2.0.8)

#### Added

- Penambahan 4 kod program promosi (PRO1022, PRO6007, PRO8010, PRO8011)
- Menambah pilihan 'Lihat semua' ketika mengisi reten promosi
- Mewujudkan penetapan syarat-syarat TPR ketika mengisi borang pesakit umum
- Fungsi penjanaan reten dibuka untuk Pentadbir Negeri

#### Changed

- GIS skor dibuka semula tanpa ada apa-apa kondisi untuk pengisian

#### Fixed

- Pembetulan bagi operator yang dihapuskan di modul Pentadbir Daerah, operator akan boleh dicari semula sekiranya telah dihapuskan
- Memperbaiki tetingkap pengesahan ketika ingin menghapuskan data di semua peringkat modul Pentadbir
- Pembetulan notifikasi mesej yang dikeluarkan sekiranya program komuniti yang ingin dihapuskan adalah daripada peringkat Pentadbir Daerah

#### Removed

- Pengisian BPE tidak lagi perlu diisi bagi pesakit yang didaftarkan di bawah Program Pergigian Sekolah Sesi 2022/2023
- Menutup fungsi muat naik gambar di modul Pentadbir & modul Pengguna sehingga pengoptimuman fungsi dapat dilaksanakan

### 9/1/2023 (v2.0.7)

#### Added

- Menambah 3 jenis enrolmen ketika mengemaskini taska & tadika di modul Pentadbir bagi Pentadbir Klinik (diminta semua Pentadbir Klinik mengemaskini semula enrolmen taska/tadika di modul Pentadbir)
- Perubahan-perubahan di dalam sistem didokumentasikan dan pautan tersebut boleh didapatkan di sebelah pautan meja bantuan

#### Changed

- Sekiranya skor BPE pesakit adalah 4 & memilih tidak bagi pakar periodontik di rujukan berkaitan terapi periodontium, pilihan jawapan "Enggan" atau "Lain-lain" bagi rujukan tersebut adalah wajib
- Menggunakan format tarikh DD/MM/YYYY bagi laman pertama di modul Pentadbir

#### Fixed

- Penstrukturan semula cara pengendalian data bagi submodul media sosial di modul Pentadbir bagi Pentadbir Klinik, Pentadbir Daerah & Pentadbir Negeri
- Membetulkan nama label yang sama bagi lain-lain di terapi periodontium & rawatan lain periodontik
- Tidak boleh memilih KPB atau MPB yang sama bagi penggunaan yang ke-2 & ke-3
- Sekiranya penggunaan KPB atau MPB tidak ditanda, penggunaan KPB & MPB yang ke-2 dan ke-3 dijadikan kosong semula
- Menyenaraikan penggunaan KPB & MPB yang ke-2 dan ke-3 di dalam senarai program komuniti di modul Pentadbir bagi Pentadbir Klinik
- Memperbaiki penggunaan _auto fill_ bagi pesakit yang menggunakan data sedia ada supaya perincian pesakit dalam penyemakan semula semasa pendaftaran adalah betul

#### Removed

- Enrolmen taska & tadika tidak lagi perlu dimasukkan di modul Pentadbir bagi Pentadbir Daerah
- Butang penjanaan reten PG101 di submodul senarai daftar pesakit ditutup buat sementara waktu untuk penambahbaikan yang terakhir
- Membuang carta-carta pesakit di paparan masuk pertama selepas Pentadbir Daerah & Pentadbir Negeri log masuk di modul Pentadbir
- Menutup penjanaan reten di semua modul di dalam sistem sehingga pemberitahuan semula kelak

### 7/1/2023 (v2.0.6)

#### Added:

- Submodul media sosial & follower di modul Pentadbir bagi Pentadbir Klinik, Pentadbir Daerah & Pentadbir Negeri sedia untuk digunakan
- Menambah pilihan Klinik Pergigian Statik bagi program komuniti jenis Program Pergigian Sekolah Sesi 2022/2023
- Mengeluarkan maklumat-maklumat penting di laman pertama selepas log masuk modul Pentadbir Klinik

#### Changed:

- Memberi peringatan dalam bentuk animasi butang di kemaskini program komuniti supaya tarikh mula & tarikh akhir program komuniti perlu dikemaskini bagi membolehkan pesakit didaftarkan untuk program komuniti tersebut
- Pesakit yang dihapus akan tetap disenaraikan di PG101 dengan catatan "PESAKIT YANG DIHAPUS"
- Maksima tampalan sementara desidus adalah bergantung kepada jumlah d
- Rujukan ke Pakar Periodontik wajib diisi ya atau tidak sekiranya BPE = 4
- Senarai rawatan yang dilakukan dikeluarkan secara terus apabila pengguna memilih lihat reten
- Kotak penandaan kelas toddler hanya keluar apabila jenis fasiliti yang dipilih adalah tadika di borang pendaftaran pesakit bagi fasiliti taska/tadika
- Pemilihan gravida & pemilihan didaftarkan di KKIA pada tahun semasa adalah wajib sekiranya pesakit ditanda sebagai ibu mengandung

#### Fixed:

- Pemilihan di dalam senarai KPB & MPB ketika kemaskini program komuniti di modul Pentadbir Klinik adalah wajib dipilih sekiranya penggunaan KPB & MPB ditanda
- Menyahaktifkan butang penghantaran reten semasa menghantar reten supaya pengguna tidak boleh menghantar dua kali reten semasa notifikasi "Menghantar reten..." dikeluarkan
- Penetapan tarikh-tarikh yang digunakan di dalam sistem adalah daripada _server_

#### Removed:

- Waktu selesai daftar tidak lagi perlu diisi semasa mendaftarkan pesakit

### 5/1/2023 (v2.0.5)

- Tidak boleh hapus program komuniti yang telah terdapat pesakit yang didaftarkan di bawahnya
- Kemaskini resit & catatan di modul Pendaftaran -> Senarai Daftar Pesakit dibuka untuk 3 hari (termasuk hujung minggu untuk skrg ini)
- Tukar semua perkataan "Waktu Tiba" kepada "Waktu Sampai" di modul Pendaftaran & modul Pengguna
- Mengurangkan penggunaan network bagi Status Harian & Senarai Daftar Pesakit ("Loading" lebih cepat & mengurangkan beban jalur lebar server kepada pengguna)
- Reten PG101 di Senarai Daftar Pesakit dijana tanpa menunjukkan pesakit yang telah dihapus
- Tidak membenarkan perubahan nama program komuniti selepas didaftarkan di Pentadbir Daerah & Pentadbir Klinik

### 4/1/2023 (v2.0.4)

- Reten PG101 yang dijana menggunakan kod fasiliti bagi mengelakkan dua KP yang sama nama berada di dalam satu reten
- Penggunaan KPB & MPB boleh lebih daripada satu semasa mengemaskini program komuniti di modul Pentadbir Klinik
- Menambah status pesakit /BW di semua table bagi modul Pendaftaran & Pengguna
- Meletakkan dua kali amaran pengesahan semasa mendaftarkan pesakit di modul Pendaftaran serta membesarkan tulisan bagi IC, Tarikh Lahir & Umur di amaran pengesahan pendaftaran
- Menyahaktifkan butang pendaftaran pesakit semasa sistem sedang menyemak pesakit yang ingin didaftarkan untuk memberikan amaran sekiranya pesakit telah didaftarkan pada hari ini
- Mewujudkan submodul "Program Pergigian Sekolah Sesi 2022/2023" di modul Pengguna
- Mewujudkan soalan "Pesakit Mempunyai Gigi Desidus/Kekal?" di borang pesakit umum bagi memastikan pengguna memasukkan maklumat gigi yang ada atau tiada dengan tepat
- Menambah ruangan "Waktu Selesai Daftar" di amaran kedua pengesahan semasa mendaftarkan pesakit
- Membuang kebolehan untuk mengubah waktu tiba semasa mengemaskini pesakit kerana waktu tiba tidak boleh melebihi waktu selesai daftar yang telah dimasukkan semasa mendaftarkan pesakit

### 3/1/2023 (v2.0.3)

- Mengeluarkan status pesakit /OKU di semua table bagi modul Pendaftaran & Pengguna
- Membuang butang kemaskini bagi KPB & MPB di Pentadbir Klinik

### 2/1/2023 (v2.0.2)

- Ruangan bayaran di borang pendaftaran tetap ada sekiranya pesakit bertatus pesara
- Mengeluarkan peringatan "Environment Training" sekiranya membuka laman https://bit.ly/giret-training
- Di borang pesakit umum, nilai cabutan gigi disebabkan perio kembali kepada 0 sekiranya nilai cabutan gigi kekal diubah
- Di borang pendaftaran, diletakkan perkataan anak di hadapan perkataan tarikh lahir sekiranya jenis IC yang dipilih adalah "Baby Of"

### 1/1/2023 (v2.0.1)

- Timezone bagi sistem diperbetulkan untuk mengikut UTC+8 Singapore/Malaysia
- Pembetulan di semakan sebelum penghantaran reten daripada "Rujukan Pakar Patologi Mulut dan Perubatan Mulut" kepada "Rujukan Pakar Bedah Mulut dan Maksilofasial"
- Di borang pesakit umum, umur pesakit 15 tahun dan ke atas mempunyai soalan berkaitan perio, sekiranya pesakit adalah baru, BPE adalah mandatori sebelum reten dihantar, bagi pesakit ulangan BPE adalah tidak mandatori untuk menghantar reten
