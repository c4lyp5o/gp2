# Changelog

### 16/5/2023 (v1.6) - I might've skipped a few version

#### Changes

[countHelper]
[countPG214] Fix guna custom stage. 59 - 60 kena tgk baru ulangan kalau alih umur. Yg lain biasa.
[countPGS203] Buang console.log.
[countPG201P] Tambah jumlahFasilitiDilawati aggregate. Sekarang tgk statusReten === 'telah diisi' baru kira. Susun sikit.

[generateRetenController]
[makePG214] Ubah writer.
[makePGS203P2] Enrolmen kalau tiada data, tulis belum diisi.
Changelog

16/5/2023 (v1.6) - I might've skipped a few versions
Changes

[countHelper]
[countPG214]: Fixed the usage of the custom stage. For ages 59-60, now checking if there's a change in age. For other ages, following the usual process.
[countPGS203]: Removed unnecessary console.log statements.
[countPG201P]: Added an aggregate for counting visited facilities. Now counting only when statusReten === 'telah diisi'. Also, rearranged the code for improved readability.
[generateRetenController]
[makePG214]: Updated the writer functionality.
[makePGS203P2]: If no data is available, it now writes 'belum diisi' (not yet filled).
