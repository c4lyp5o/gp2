const formAlertDOM = document.querySelector('.form-alert');
const btnSaveDOM = document.querySelector('.save');
const namaOperator = localStorage.getItem('namaOperator');
const namaFasiliti = localStorage.getItem('namaFasiliti');
console.log(namaFasiliti);
console.log(namaOperator);

//pendaftaran
const namaPendaftaranTadikaDOM = document.getElementById('nama-pendaftaran-tadika');
const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
const bangsaPendaftaranTadikaDOM = document.getElementById('bangsa-pendaftaran-tadika');
const kelasPendaftaranTadikaDOM = document.getElementById('kelas-pendaftaran-tadika');
const namaTaskaTadikaPendaftaranTadikaDOM = document.getElementById('nama-taska/tadika-pendaftaran-tadika');
// const baruPendaftaranTadikaDOM = document.getElementById('baru-pendaftaran-tadika');
// const ulanganPendaftaranTadikaDOM = document.getElementById('ulangan-pendaftaran-tadika');
// const engganPendaftaranTadikaDOM = document.getElementById('enggan-pendaftaran-tadika');
// const tidakHadirPendaftaranTadikaDOM = document.getElementById('tidak-hadir-pendaftaran-tadika');
// const adaPendaftaranTadikaDOM = document.getElementById('ada-pendaftaran-tadika');
// const tiadaPendaftaranTadikaDOM = document.getElementById('tiada-pendaftaran-tadika');
// const namaOperatorPendaftaranTadikaDOM = document.getElementById('nama-operator-pendaftaran-tadika');
// const namaPasukanBergerakPendaftaranTadikaDOM = document.getElementById('nama-pasukan-bergerak-pendaftaran-tadika');
// //pemeriksaan awal
// const adaCleftPemeriksaanAwalTadikaDOM = document.getElementById('ada-cleft-pemeriksaan-awal-tadika');
// const rujukPemeriksaanAwalTadikaDOM = document.getElementById('rujuk-pemeriksaan-awal-tadika');
// const adaDenturePemeriksaanAwalTadikaDOM = document.getElementById('ada-denture-pemeriksaan-awal-tadika');
// const perluPemeriksaanAwalTadikaDOM = document.getElementById('perlu-pemeriksaan-awal-tadika');
// const perluBaruPemeriksaanAwalTadikaDOM = document.getElementById('perlu-baru-pemeriksaan-awal-tadika');
// const perluSemulaPemeriksaanAwalTadikaDOM = document.getElementById('perlu-semula-pemeriksaan-awal-tadika');
// const toothSurfaceLossPemeriksaanAwalTadikaDOM = document.getElementById('tooth-surface-loss-pemeriksaan-awal-tadika');
// const kecederaanGigiAnteriorPemeriksaanAwalTadikaDOM = document.getElementById('kecederaan-gigi-anterior-pemeriksaan-awal-tadika');
// const tisuLembutPemeriksaanAwalTadikaDOM = document.getElementById('tisu-lembut-pemeriksaan-awal-tadika');
// const tisuKerasPemeriksaanAwalTadikaDOM = document.getElementById('tisu-keras-pemeriksaan-awal-tadika');
// const kebersihanMulutPemeriksaanAwalTadikaDOM = document.getElementById('kebersihan-mulut-pemeriksaan-awal-tadika');
// const GISSkorPemeriksaanAwalTadikaDOM = document.getElementById('GIS-skor-pemeriksaan-awal-tadika');
// const decayDesidusPemeriksaanAwalTadikaDOM = document.getElementById('decay-desidus-pemeriksaan-awal-tadika');
// const missingDesidusPemeriksaanAwalTadikaDOM = document.getElementById('missing-desidus-pemeriksaan-awal-tadika');
// const filledDesidusPemeriksaanAwalTadikaDOM = document.getElementById('filled-desidus-pemeriksaan-awal-tadika');
// const forExtractionDesidusPemeriksaanAwalTadikaDOM = document.getElementById('for-extraction-desidus-pemeriksaan-awal-tadika');
// const decayKekalPemeriksaanAwalTadikaDOM = document.getElementById('decay-kekal-pemeriksaan-awal-tadika');
// const missingKekalPemeriksaanAwalTadikaDOM = document.getElementById('missing-kekal-pemeriksaan-awal-tadika');
// const filledKekalPemeriksaanAwalTadikaDOM = document.getElementById('filled-kekal-pemeriksaan-awal-tadika');
// const forExtractionKekalPemeriksaanAwalTadikaDOM = document.getElementById('for-extraction-kekal-pemeriksaan-awal-tadika');
// const faktorRisikoPemeriksaanAwalTadikaDOM = document.getElementById('faktor-risiko-pemeriksaan-awal-tadika');
// const class1DPemeriksaanAwalTadikaDOM = document.getElementById('class1-d-pemeriksaan-awal-tadika');
// const class2DPemeriksaanAwalTadikaDOM = document.getElementById('class2-d-pemeriksaan-awal-tadika');
// const class1FPemeriksaanAwalTadikaDOM = document.getElementById('class1-f-pemeriksaan-awal-tadika');
// const class2FPemeriksaanAwalTadikaDOM = document.getElementById('class1-f-pemeriksaan-awal-tadika');
// const gicLepasPemeriksaanAwalTadikaDOM = document.getElementById('gic-lepas-pemeriksaan-awal-tadika');
// const resinLepasPemeriksaanAwalTadikaDOM = document.getElementById('resin-lepas-pemeriksaan-awal-tadika');
// const lainLainLepasPemeriksaanAwalTadikaDOM = document.getElementById('lain-lain-lepas-pemeriksaan-awal-tadika');
// const gicIntactPemeriksaanAwalTadikaDOM = document.getElementById('gic-intact-pemeriksaan-awal-tadika');
// const resinIntactPemeriksaanAwalTadikaDOM = document.getElementById('resin-intact-pemeriksaan-awal-tadika');
// const lainLainIntactPemeriksaanAwalTadikaDOM = document.getElementById('lain-lain-intact-pemeriksaan-awal-tadika');
// //perludibuat
// const baruJumlahGigiPerluFsPerluDibuatTadikaDOM = document.getElementById('baru-jumlah-gigi-perlu-fs-perlu-dibuat-tadika');
// const semulaJumlahGigiPerluFsPerluDibuatTadikaDOM = document.getElementById('semula-jumlah-gigi-perlu-fs-perlu-dibuat-tadika');
// const failedJumlahGigiPerluFsPerluDibuatTadikaDOM = document.getElementById('failed-jumlah-gigi-perlu-fs-perlu-dibuat-tadika');
// const yaPerluFvPerluDibuatTadikaDOM = document.getElementById('ya-perlu-fv-perlu-dibuat-tadika');
// const tidakPerluFvPerluDibuatTadikaDOM = document.getElementById('tidak-perlu-fv-perlu-dibuat-tadika');
// const baruJumlahGigiPerluPrrPerluDibuatTadikaDOM = document.getElementById('baru-jumlah-gigi-perlu-prr-perlu-dibuat-tadika');
// const semulaJumlahGigiPerluPrrPerluDibuatTadikaDOM = document.getElementById('semula-jumlah-gigi-perlu-prr-perlu-dibuat-tadika');
// const gdBaruAnteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gd-baru-anterior-sewarna-perlu-dibuat-tadika');
// const gdSemulaAnteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gd-semula-anterior-sewarna-perlu-dibuat-tadika');
// const gkBaruAnteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gk-baru-anterior-sewarna-perlu-dibuat-tadika');
// const gkSemulaAnteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gk-semula-anterior-sewarna-perlu-dibuat-tadika');
// const gdBaruPosteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gd-baru-posterior-sewarna-perlu-dibuat-tadika');
// const gdSemulaPosteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gd-semula-posterior-sewarna-perlu-dibuat-tadika');
// const gkBaruPosteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gk-baru-posterior-sewarna-perlu-dibuat-tadika');
// const gkSemulaPosteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gk-semula-posterior-sewarna-perlu-dibuat-tadika');

// const gdBaruPosteriorAmalgamPerluDibuatTadikaDOM = document.getElementById('gd-baru-posterior-amalgam-perlu-dibuat-tadika');
// const gdSemulaPosteriorAmalgamPerluDibuatTadikaDOM = document.getElementById('gd-semula-posterior-amalgam-perlu-dibuat-tadika');
// const gkBaruPosteriorAmalgamPerluDibuatTadikaDOM = document.getElementById('gk-baru-posterior-amalgam-perlu-dibuat-tadika');
// const gkSemulaPosteriorAmalgamPerluDibuatTadikaDOM = document.getElementById('gk-semula-posterior-amalgam-perlu-dibuat-tadika');

btnSaveDOM.addEventListener('click', async () => {
    //pendaftaran
    const namaPendaftaranTadika = namaPendaftaranTadikaDOM.value;
    const umurPendaftaranTadika = umurPendaftaranTadikaDOM.value;
    const bangsaPendaftaranTadika = bangsaPendaftaranTadikaDOM.value;
    const kelasPendaftaranTadika = kelasPendaftaranTadikaDOM.value;
    const namaTaskaTadikaPendaftaranTadika = namaTaskaTadikaPendaftaranTadikaDOM.value;
    // const baruPendaftaranTadika = baruPendaftaranTadikaDOM.value;
    // const ulanganPendaftaranTadika = ulanganPendaftaranTadikaDOM.value;
    // const engganPendaftaranTadika = engganPendaftaranTadikaDOM.value;
    // const tidakHadirPendaftaranTadika = tidakHadirPendaftaranTadikaDOM.value;
    // const adaPendaftaranTadika = adaPendaftaranTadikaDOM.value;
    // const tiadaPendaftaranTadika = tiadaPendaftaranTadikaDOM.value;
    // const namaOperatorPendaftaranTadika = namaOperatorPendaftaranTadikaDOM.value;
    // const namaPasukanBergerakPendaftaranTadika = namaPasukanBergerakPendaftaranTadikaDOM.value;
    // //pemeriksaan awal
    // const adaCleftPemeriksaanAwalTadika = adaCleftPemeriksaanAwalTadikaDOM.value;
    // const rujukPemeriksaanAwalTadika = rujukPemeriksaanAwalTadikaDOM.value;
    // const adaDenturePemeriksaanAwalTadika = adaDenturePemeriksaanAwalTadikaDOM.value;
    // const perluPemeriksaanAwalTadika = perluPemeriksaanAwalTadikaDOM.value;
    // const perluBaruPemeriksaanAwalTadika = perluBaruPemeriksaanAwalTadikaDOM.value;
    // const perluSemulaPemeriksaanAwalTadika = perluSemulaPemeriksaanAwalTadikaDOM.value;
    // const toothSurfaceLossPemeriksaanAwalTadika = toothSurfaceLossPemeriksaanAwalTadikaDOM.value;
    // const kecederaanGigiAnteriorPemeriksaanAwalTadika = kecederaanGigiAnteriorPemeriksaanAwalTadikaDOM.value;
    // const tisuLembutPemeriksaanAwalTadika = tisuLembutPemeriksaanAwalTadikaDOM.value;
    // const tisuKerasPemeriksaanAwalTadika = tisuKerasPemeriksaanAwalTadikaDOM.value;
    // const kebersihanMulutPemeriksaanAwalTadika = kebersihanMulutPemeriksaanAwalTadikaDOM.value;
    // const GISSkorPemeriksaanAwalTadika = GISSkorPemeriksaanAwalTadikaDOM.value;
    // const decayDesidusPemeriksaanAwalTadika = decayDesidusPemeriksaanAwalTadikaDOM.value;
    // const missingDesidusPemeriksaanAwalTadika = missingDesidusPemeriksaanAwalTadikaDOM.value;
    // const filledDesidusPemeriksaanAwalTadika = filledDesidusPemeriksaanAwalTadikaDOM.value;
    // const forExtractionDesidusPemeriksaanAwalTadika = forExtractionDesidusPemeriksaanAwalTadikaDOM.value;
    // const decayKekalPemeriksaanAwalTadika = decayKekalPemeriksaanAwalTadikaDOM.value;
    // const missingKekalPemeriksaanAwalTadika = missingKekalPemeriksaanAwalTadikaDOM.value;
    // const filledKekalPemeriksaanAwalTadika = filledKekalPemeriksaanAwalTadikaDOM.value;
    // const forExtractionKekalPemeriksaanAwalTadika = forExtractionKekalPemeriksaanAwalTadikaDOM.value;
    // const faktorRisikoPemeriksaanAwalTadika = faktorRisikoPemeriksaanAwalTadikaDOM.value;
    // const class1DPemeriksaanAwalTadika = class1DPemeriksaanAwalTadikaDOM.value;
    // const class2DPemeriksaanAwalTadika = class2DPemeriksaanAwalTadikaDOM.value;
    // const class1FPemeriksaanAwalTadika = class1FPemeriksaanAwalTadikaDOM.value;
    // const class2FPemeriksaanAwalTadika = class2FPemeriksaanAwalTadikaDOM.value;
    // const gicLepasPemeriksaanAwalTadika = gicLepasPemeriksaanAwalTadikaDOM.value;
    // const resinLepasPemeriksaanAwalTadika = resinLepasPemeriksaanAwalTadikaDOM.value;
    // const lainLainLepasPemeriksaanAwalTadika = lainLainLepasPemeriksaanAwalTadikaDOM.value;
    // const gicIntactPemeriksaanAwalTadika = gicIntactPemeriksaanAwalTadikaDOM.value;
    // const resinIntactPemeriksaanAwalTadika = resinIntactPemeriksaanAwalTadikaDOM.value;
    // const lainLainIntactPemeriksaanAwalTadika = lainLainLepasPemeriksaanAwalTadikaDOM.value;
    // //perludibuat
    // const baruJumlahGigiPerluFsPerluDibuatTadika = baruJumlahGigiPerluFsPerluDibuatTadikaDOM.value;
    // const semulaJumlahGigiPerluFsPerluDibuatTadika = semulaJumlahGigiPerluFsPerluDibuatTadikaDOM.value;
    // const failedJumlahGigiPerluFsPerluDibuatTadika = failedJumlahGigiPerluFsPerluDibuatTadikaDOM.value;
    // const yaPerluFvPerluDibuatTadika = yaPerluFvPerluDibuatTadikaDOM.value;
    // const tidakPerluFvPerluDibuatTadika = tidakPerluFvPerluDibuatTadikaDOM.value;
    // const baruJumlahGigiPerluPrrPerluDibuatTadika = baruJumlahGigiPerluPrrPerluDibuatTadikaDOM.value;
    // const semulaJumlahGigiPerluPrrPerluDibuatTadika = semulaJumlahGigiPerluPrrPerluDibuatTadikaDOM.value;
    // const gdBaruAnteriorSewarnaPerluDibuatTadika = gdBaruAnteriorSewarnaPerluDibuatTadikaDOM.value;
    // const gdSemulaAnteriorSewarnaPerluDibuatTadika = gdSemulaAnteriorSewarnaPerluDibuatTadikaDOM.value;
    // const gkBaruAnteriorSewarnaPerluDibuatTadika = gkBaruAnteriorSewarnaPerluDibuatTadikaDOM.value;
    // const gkSemulaAnteriorSewarnaPerluDibuatTadika = gkSemulaAnteriorSewarnaPerluDibuatTadikaDOM.value;
    // const gdBaruPosteriorSewarnaPerluDibuatTadika = gdBaruPosteriorSewarnaPerluDibuatTadikaDOM.value;
    // const gdSemulaPosteriorSewarnaPerluDibuatTadika = gdSemulaPosteriorSewarnaPerluDibuatTadikaDOM.value;
    // const gkBaruPosteriorSewarnaPerluDibuatTadika = gkBaruPosteriorSewarnaPerluDibuatTadikaDOM.value;
    // const gkSemulaPosteriorSewarnaPerluDibuatTadika = gkSemulaPosteriorSewarnaPerluDibuatTadikaDOM.value;
    // const gdBaruPosteriorAmalgamPerluDibuatTadika = gdBaruPosteriorAmalgamPerluDibuatTadikaDOM.value;
    // const gdSemulaPosteriorAmalgamPerluDibuatTadika = gdSemulaPosteriorAmalgamPerluDibuatTadikaDOM.value;
    // const gkBaruPosteriorAmalgamPerluDibuatTadika = gkBaruPosteriorAmalgamPerluDibuatTadikaDOM.value;
    // const gkSemulaPosteriorAmalgamPerluDibuatTadika = gkSemulaPosteriorAmalgamPerluDibuatTadikaDOM.value;
    
    try {
        await axios.post('/api/v1/tadika', { 
            namaOperator,
            namaFasiliti,
            namaPendaftaranTadika,
            umurPendaftaranTadika,
            bangsaPendaftaranTadika,
            kelasPendaftaranTadika,
            namaTaskaTadikaPendaftaranTadika
            // baruPendaftaranTadika,
            // ulanganPendaftaranTadika,
            // engganPendaftaranTadika,
            // tidakHadirPendaftaranTadika,
            // adaPendaftaranTadika,
            // tiadaPendaftaranTadika,
            // namaOperatorPendaftaranTadika,
            // namaPasukanBergerakPendaftaranTadika,
            // //pemeriksaan awal
            // adaCleftPemeriksaanAwalTadika,
            // rujukPemeriksaanAwalTadika,
            // adaDenturePemeriksaanAwalTadika,
            // perluPemeriksaanAwalTadika,
            // perluBaruPemeriksaanAwalTadika,
            // perluSemulaPemeriksaanAwalTadika,
            // toothSurfaceLossPemeriksaanAwalTadika,
            // kecederaanGigiAnteriorPemeriksaanAwalTadika,
            // tisuLembutPemeriksaanAwalTadika,
            // tisuKerasPemeriksaanAwalTadika,
            // kebersihanMulutPemeriksaanAwalTadika,
            // GISSkorPemeriksaanAwalTadika,
            // decayDesidusPemeriksaanAwalTadika,
            // missingDesidusPemeriksaanAwalTadika,
            // filledDesidusPemeriksaanAwalTadika,
            // forExtractionDesidusPemeriksaanAwalTadika,
            // decayKekalPemeriksaanAwalTadika,
            // missingKekalPemeriksaanAwalTadika,
            // filledKekalPemeriksaanAwalTadika,
            // forExtractionKekalPemeriksaanAwalTadika,
            // faktorRisikoPemeriksaanAwalTadika,
            // class1DPemeriksaanAwalTadika,
            // class2DPemeriksaanAwalTadika,
            // class1FPemeriksaanAwalTadika,
            // class2FPemeriksaanAwalTadika,
            // gicLepasPemeriksaanAwalTadika,
            // resinLepasPemeriksaanAwalTadika,
            // lainLainLepasPemeriksaanAwalTadika,
            // gicIntactPemeriksaanAwalTadika,
            // resinIntactPemeriksaanAwalTadika,
            // lainLainIntactPemeriksaanAwalTadika,
            // //perludibuat
            // baruJumlahGigiPerluFsPerluDibuatTadika,
            // semulaJumlahGigiPerluFsPerluDibuatTadika,
            // failedJumlahGigiPerluFsPerluDibuatTadika,
            // yaPerluFvPerluDibuatTadika,
            // tidakPerluFvPerluDibuatTadika,
            // baruJumlahGigiPerluPrrPerluDibuatTadika,
            // semulaJumlahGigiPerluPrrPerluDibuatTadika,
            // gdBaruAnteriorSewarnaPerluDibuatTadika,
            // gdSemulaAnteriorSewarnaPerluDibuatTadika,
            // gkBaruAnteriorSewarnaPerluDibuatTadika,
            // gkSemulaAnteriorSewarnaPerluDibuatTadika,
            // gdBaruPosteriorSewarnaPerluDibuatTadika,
            // gdSemulaPosteriorSewarnaPerluDibuatTadika,
            // gkBaruPosteriorSewarnaPerluDibuatTadika,
            // gkSemulaPosteriorSewarnaPerluDibuatTadika,
            // gdBaruPosteriorAmalgamPerluDibuatTadika,
            // gdSemulaPosteriorAmalgamPerluDibuatTadika,
            // gkBaruPosteriorAmalgamPerluDibuatTadika,
            // gkSemulaPosteriorAmalgamPerluDibuatTadika,
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        // clearing all value after creating person
        namaPendaftaranTadikaDOM.value = '';
        umurPendaftaranTadikaDOM.value = '';
        bangsaPendaftaranTadikaDOM.value = '';
        // baruPendaftaranTadikaDOM.value = '';
        // ulanganPendaftaranTadikaDOM.value = '';
        // engganPendaftaranTadikaDOM.value = '';
        // tidakHadirPendaftaranTadikaDOM.value = '';
        // adaPendaftaranTadikaDOM.value = '';
        // tiadaPendaftaranTadikaDOM.value = '';
        // namaOperatorPendaftaranTadikaDOM.value = '';
        // namaPasukanBergerakPendaftaranTadikaDOM.value = '';
        // //pemeriksaan awal
        // adaCleftPemeriksaanAwalTadikaDOM.value = '';
        // rujukPemeriksaanAwalTadikaDOM.value = '';
        // adaDenturePemeriksaanAwalTadikaDOM.value = '';
        // perluPemeriksaanAwalTadikaDOM.value = '';
        // perluBaruPemeriksaanAwalTadikaDOM.value = '';
        // perluSemulaPemeriksaanAwalTadikaDOM.value = '';
        // toothSurfaceLossPemeriksaanAwalTadikaDOM.value = '';
        // kecederaanGigiAnteriorPemeriksaanAwalTadikaDOM.value = '';
        // tisuLembutPemeriksaanAwalTadikaDOM.value = '';
        // tisuKerasPemeriksaanAwalTadikaDOM.value = '';
        // kebersihanMulutPemeriksaanAwalTadikaDOM.value = '';
        // GISSkorPemeriksaanAwalTadikaDOM.value = '';
        // decayDesidusPemeriksaanAwalTadikaDOM.value = '';
        // missingDesidusPemeriksaanAwalTadikaDOM.value = '';
        // filledDesidusPemeriksaanAwalTadikaDOM.valuev
        // forExtractionDesidusPemeriksaanAwalTadikaDOM.value = '';
        // decayKekalPemeriksaanAwalTadikaDOM.value = '';
        // missingKekalPemeriksaanAwalTadikaDOM.value = '';        
        // filledKekalPemeriksaanAwalTadikaDOM.value = '';
        // forExtractionKekalPemeriksaanAwalTadikaDOM.value = '';
        // faktorRisikoPemeriksaanAwalTadikaDOM.value = '';
        // class1DPemeriksaanAwalTadikaDOM.value = '';
        // class2DPemeriksaanAwalTadikaDOM.value = '';
        // class1FPemeriksaanAwalTadikaDOM.value = '';
        // class2FPemeriksaanAwalTadikaDOM.value = '';
        // gicLepasPemeriksaanAwalTadikaDOM.value = '';
        // resinLepasPemeriksaanAwalTadikaDOM.value = '';
        // lainLainLepasPemeriksaanAwalTadikaDOM.value = '';
        // gicIntactPemeriksaanAwalTadikaDOM.value = '';
        // resinIntactPemeriksaanAwalTadikaDOM.value = '';
        // lainLainIntactPemeriksaanAwalTadikaDOM.value = '';
        // //perludibuat
        // baruJumlahGigiPerluFsPerluDibuatTadikaDOM.value = '';
        // semulaJumlahGigiPerluFsPerluDibuatTadikaDOM.value = '';
        // failedJumlahGigiPerluFsPerluDibuatTadikaDOM.value = '';
        // yaPerluFvPerluDibuatTadikaDOM.value = '';
        // tidakPerluFvPerluDibuatTadikaDOM.value = '';
        // baruJumlahGigiPerluPrrPerluDibuatTadikaDOM.value = '';
        // semulaJumlahGigiPerluPrrPerluDibuatTadikaDOM.value = '';
        // gdBaruAnteriorSewarnaPerluDibuatTadikaDOM.value = '';
        // gdSemulaAnteriorSewarnaPerluDibuatTadikaDOM.value = '';
        // gkBaruAnteriorSewarnaPerluDibuatTadika.value = '';
        // gkSemulaAnteriorSewarnaPerluDibuatTadikaDOM.value = '';
        // gdBaruPosteriorSewarnaPerluDibuatTadikaDOM.value = '';
        // gdSemulaPosteriorSewarnaPerluDibuatTadikaDOM.value = '';
        // gkBaruPosteriorSewarnaPerluDibuatTadika.value = '';
        // gkSemulaPosteriorSewarnaPerluDibuatTadikaDOM.value = '';
        // gdBaruPosteriorAmalgamPerluDibuatTadikaDOM.value = '';
        // gdSemulaPosteriorAmalgamPerluDibuatTadikaDOM.value = '';
        // gkBaruPosteriorAmalgamPerluDibuatTadika.value = '';
        // gkSemulaPosteriorAmalgamPerluDibuatTadikaDOM.value = '';
        
        // ----------------------------------------

        formAlertDOM.style.display = 'block';
        formAlertDOM.classList.add('text-success');
        formAlertDOM.textContent = 'Success, data added';
    } catch (error) {
        console.log(error);
        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = 'Please fill all data correctly';
    }
    setTimeout(() => {
        formAlertDOM.style.display = 'none';
        formAlertDOM.classList.remove('text-success');
    }, 3000);
});