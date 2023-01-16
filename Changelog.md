# Changelog

### 11/1/2023 (v2.0.8)

#### Added

- Penambahan 4 kod program promosi (PRO1022, PRO6007, PRO8010, PRO8011)
- Menambah pilihan lihat semua ketika mengisi reten promosi
- Mewujudkan penetapan syarat-syarat TPR ketika mengisi borang pesakit umum
- Fungsi penjanaan reten dibuka untuk Pentadbir Negeri

#### Changed

- GIS skor dibuka semula tanpa ada apa-apa kondisi untuk pengisian

### Fixed

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
