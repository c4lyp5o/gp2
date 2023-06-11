# Changelog

### 9/6/2023 (v1.6.4)

[countHelperRegular]
Lengkapkan pengiraan KEPP

[countHelperKomuniti]
Lengkapkan pengiraan OAP
Lengkapkan pengiraan LiputanOAP
Lengkapkan pengiraan KPBMPBBulanan
UTCRTC tukar nama jadi UTC, UTC atau RTC boleh kira skali dlm function tu

[countHelperParams]
Tambah params untuk 211KPB
Oter params UTC RTC, RTC Tunjung

[countHelperFuser]
Tambah version kononnya

[generateRetenController]
Betulkan generate KEPP, LiputanOAP, KPBMPBBulanan, KOM, UTCRTC, 214, PPKPS

### 30/5/2023 (v1.6.3)

[countHelperRegular]
PG101A untuk KP skrg keluar KKIA skali
PG101A kalau tiada jantina, auto lelaki

[countHelperFuser]
Tambah version kononnya

[generateRetenController]
Buat worksheet setiap kkia/kd kalau generate adalah klinik

### 26/5/2023 (v1.6.2)

[countHelper]
Deprecated

[countHelperRegular]
Isi sama mcm countHelper lama sans params
Fix BPE nk tgk first BPE je
Fix TPR MMI di 201
Fix masa buang reten salah
Fix 214
Ah berapa bnyk fix da aku x ingt sila tgk code

[countHelperKomuniti]
Tambah reten KOM

[countHelperFuser]
Fuse countHelperRegular dan countHelperKomuniti
Tambah version kononnya

[generateRetenController]
Tambah pembuatan reten KOM

### 18/5/2023 (v1.6.1)

[countHelper]
[countPGS203] Pengiraan semula jumlahFasiliti di lawati

[generateRetenController]
[makePGS203P2] Guna null coallescing operator untuk handle error

### 16/5/2023 (v1.6) - I might've skipped a few version

[countHelper]
[countPG214] Fix guna custom stage. 59 - 60 kena tgk baru ulangan kalau alih umur. Yg lain biasa.
[countPGS203] Buang console.log.
[countPG201P] Tambah jumlahFasilitiDilawati aggregate. Sekarang tgk statusReten === 'telah diisi' baru kira. Susun sikit.

[generateRetenController]
[makePG214] Ubah writer.
[makePGS203P2] Enrolmen kalau tiada data, tulis belum diisi.
