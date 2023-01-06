# Changelog since 1st January 2023

### 1/1/2023 (v2.0.1)

- Timezone bagi sistem diperbetulkan untuk mengikut UTC+8 Singapore/Malaysia
- Pembetulan di semakan sebelum penghantaran reten daripada "Rujukan Pakar Patologi Mulut dan Perubatan Mulut" kepada "Rujukan Pakar Bedah Mulut dan Maksilofasial"
- Di borang pesakit umum, umur pesakit 15 tahun dan ke atas mempunyai soalan berkaitan perio, sekiranya pesakit adalah baru, BPE adalah mandatori sebelum reten dihantar, bagi pesakit ulangan BPE adalah tidak mandatori untuk menghantar reten

### 2/1/2023 (v2.0.2)

- Ruangan bayaran di borang pendaftaran tetap ada sekiranya pesakit bertatus pesara
- Mengeluarkan peringatan "Environment Training" sekiranya membuka laman https://bit.ly/giret-training
- Di borang pesakit umum, nilai cabutan gigi disebabkan perio kembali kepada 0 sekiranya nilai cabutan gigi kekal diubah
- Di borang pendaftaran, diletakkan perkataan anak di hadapan perkataan tarikh lahir sekiranya jenis IC yang dipilih adalah "Baby Of"

### 3/1/2023 (v2.0.3)

- Mengeluarkan status pesakit /OKU di semua table bagi modul Pendaftaran & Pengguna
- Membuang butang kemaskini bagi KPB & MPB di Pentadbir Klinik

### 4/1/2023 (v2.0.4)

- Reten PG101 yang dijana menggunakan kodFasiliti bagi mengelakkan dua KP yang sama nama berada di dalam satu reten
- Penggunaan KPB & MPB boleh lebih daripada satu semasa mengemaskini program komuniti di modul Pentadbir Klinik
- Menambah status pesakit /BW di semua table bagi modul Pendaftaran & Pengguna
- Meletakkan dua kali amaran pengesahan semasa mendaftarkan pesakit di modul Pendaftaran serta membesarkan tulisan bagi IC, Tarikh Lahir & Umur di amaran pengesahan pendaftaran
- Menyahaktifkan butang pendaftaran pesakit semasa sistem sedang menyemak pesakit yang ingin didaftarkan untuk memberikan amaran sekiranya pesakit telah didaftarkan pada hari ini
- Mewujudkan submodul "Program Pergigian Sekolah Sesi 2022/2023" di modul Pengguna
- Mewujudkan soalan "Pesakit Mempunyai Gigi Desidus/Kekal?" di borang pesakit umum bagi memastikan pengguna memasukkan maklumat gigi yang ada atau tiada dengan tepat
- Menambah ruangan "Waktu Selesai Daftar" di amaran kedua pengesahan semasa mendaftarkan pesakit
- Membuang kebolahan untuk mengubah waktu tiba semasa mengemaskini pesakit kerana waktu tiba tidak boleh melebihi waktu selesai daftar yang telah dimasukkan semasa mendaftarkan pesakit

### 5/1/2023 (v2.0.5)

- Tidak boleh hapus program komuniti yang telah terdapat pesakit yang didaftarkan di bawahnya
- Kemaskini resit & catatan di modul Pendaftaran -> Senarai Daftar Pesakit dibuka untuk 3 hari (termasuk hujung minggu untuk skrg ini)
- Tukar semua perkataan "Waktu Tiba" kepada "Waktu Sampai" di modul Pendaftaran & modul Pengguna
- Mengurangkan penggunaan network bagi Status Harian & Senarai Daftar Pesakit ("Loading" lebih cepat & mengurangkan beban jalur lebar server kepada pengguna)
- Reten PG101 di Senarai Daftar Pesakit dijana tanpa menunjukkan pesakit yang telah dihapus
- Tidak membenarkan perubahan nama program komuniti selepas didaftarkan di Pentadbir Daerah & Pentadbir Klinik
