const formAlertDOM = document.querySelector('.form-alert');
const btnSaveDOM = document.querySelector('.save');

//pendaftaran
const namaPendaftaranTadikaDOM = document.getElementById('nama-pendaftaran-tadika');
const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
const bangsaPendaftaranTadikaDOM = document.getElementById('bangsa-pendaftaran-tadika');
const kelasPendaftaranTadikaDOM = document.getElementById('kelas-pendaftaran-tadika');
const namaTaskaTadikaPendaftaranTadikaDOM = document.getElementById('nama-taskatadika-pendaftaran-tadika');
const baruPendaftaranTadikaDOM = document.getElementById('baru-pendaftaran-tadika');
const ulanganPendaftaranTadikaDOM = document.getElementById('ulangan-pendaftaran-tadika');
const engganPendaftaranTadikaDOM = document.getElementById('enggan-pendaftaran-tadika');
const tidakHadirPendaftaranTadikaDOM = document.getElementById('tidak-hadir-pendaftaran-tadika');
const adaPendaftaranTadikaDOM = document.getElementById('ada-pendaftaran-tadika');
const tiadaPendaftaranTadikaDOM = document.getElementById('tiada-pendaftaran-tadika');
const namaOperatorPendaftaranTadikaDOM = document.getElementById('nama-operator-pendaftaran-tadika');
const namaPasukanBergerakPendaftaranTadikaDOM = document.getElementById('nama-pasukan-bergerak-pendaftaran-tadika');

//pemeriksaan awal
const adaCleftPemeriksaanAwalTadikaDOM = document.getElementById('ada-cleft-pemeriksaan-awal-tadika');
const rujukPemeriksaanAwalTadikaDOM = document.getElementById('rujuk-pemeriksaan-awal-tadika');
const adaDenturePemeriksaanAwalTadikaDOM = document.getElementById('ada-denture-pemeriksaan-awal-tadika');
const perluPemeriksaanAwalTadikaDOM = document.getElementById('perlu-pemeriksaan-awal-tadika');
const perluBaruPemeriksaanAwalTadikaDOM = document.getElementById('perlu-baru-pemeriksaan-awal-tadika');
const perluSemulaPemeriksaanAwalTadikaDOM = document.getElementById('perlu-semula-pemeriksaan-awal-tadika');
const toothSurfaceLossPemeriksaanAwalTadikaDOM = document.getElementById('tooth-surface-loss-pemeriksaan-awal-tadika');
const kecederaanGigiAnteriorPemeriksaanAwalTadikaDOM = document.getElementById('kecederaan-gigi-anterior-pemeriksaan-awal-tadika');
const tisuLembutPemeriksaanAwalTadikaDOM = document.getElementById('tisu-lembut-pemeriksaan-awal-tadika');
const tisuKerasPemeriksaanAwalTadikaDOM = document.getElementById('tisu-keras-pemeriksaan-awal-tadika');
const kebersihanMulutPemeriksaanAwalTadikaDOM = document.getElementById('kebersihan-mulut-pemeriksaan-awal-tadika');
const GISSkorPemeriksaanAwalTadikaDOM = document.getElementById('GIS-skor-pemeriksaan-awal-tadika');


const decayDesidusPemeriksaanAwalTadikaDOM = document.getElementById('decay-desidus-pemeriksaan-awal-tadika');
const missingDesidusPemeriksaanAwalTadikaDOM = document.getElementById('missing-desidus-pemeriksaan-awal-tadika');
const filledDesidusPemeriksaanAwalTadikaDOM = document.getElementById('filled-desidus-pemeriksaan-awal-tadika');
const forExtractionDesidusPemeriksaanAwalTadikaDOM = document.getElementById('for-extraction-desidus-pemeriksaan-awal-tadika');

btnSaveDOM.addEventListener('click', async () => {
    //pendaftaran
    const namaPendaftaranTadika = namaPendaftaranTadikaDOM.value;
    const umurPendaftaranTadika = umurPendaftaranTadikaDOM.value;
    const kelasPendaftaranTadika = kelasPendaftaranTadikaDOM.value;
    const namaTaskaTadikaPendaftaranTadika = namaTaskaTadikaPendaftaranTadikaDOM.value;
    const baruPendaftaranTadika = baruPendaftaranTadikaDOM.value;
    const ulanganPendaftaranTadika = ulanganPendaftaranTadikaDOM.value;
    const engganPendaftaranTadika = engganPendaftaranTadikaDOM.value;
    const tidakHadirPendaftaranTadika = tidakHadirPendaftaranTadikaDOM.value;
    const adaPendaftaranTadika = adaPendaftaranTadikaDOM.value;
    const tiadaPendaftaranTadika = tiadaPendaftaranTadikaDOM.value;
    const namaOperatorPendaftaranTadika = namaOperatorPendaftaranTadikaDOM.value;
    const namaPasukanBergerakPendaftaranTadika = namaPasukanBergerakPendaftaranTadikaDOM.value;
    //pemeriksaan awal
    const adaCleftPemeriksaanAwalTadika = adaCleftPemeriksaanAwalTadikaDOM.value;
    const rujukPemeriksaanAwalTadika = rujukPemeriksaanAwalTadikaDOM.value;
    const adaDenturePemeriksaanAwalTadika = adaDenturePemeriksaanAwalTadikaDOM.value;
    const perluPemeriksaanAwalTadika = perluPemeriksaanAwalTadikaDOM.value;
    const perluBaruPemeriksaanAwalTadika = perluBaruPemeriksaanAwalTadikaDOM.value;
    const perluSemulaPemeriksaanAwalTadika = perluSemulaPemeriksaanAwalTadikaDOM.value;
    const toothSurfaceLossPemeriksaanAwalTadika = toothSurfaceLossPemeriksaanAwalTadikaDOM.value;
    const kecederaanGigiAnteriorPemeriksaanAwalTadika = kecederaanGigiAnteriorPemeriksaanAwalTadikaDOM.value;
    const tisuLembutPemeriksaanAwalTadika = tisuLembutPemeriksaanAwalTadikaDOM.value;
    const tisuKerasPemeriksaanAwalTadika = tisuKerasPemeriksaanAwalTadikaDOM.value;
    const kebersihanMulutPemeriksaanAwalTadika = kebersihanMulutPemeriksaanAwalTadikaDOM.value;
    const GISSkorPemeriksaanAwalTadika = GISSkorPemeriksaanAwalTadikaDOM.value;
    const decayDesidusPemeriksaanAwalTadika = decayDesidusPemeriksaanAwalTadikaDOM.value;
    const missingDesidusPemeriksaanAwalTadika = missingDesidusPemeriksaanAwalTadikaDOM.value;
    const filledDesidusPemeriksaanAwalTadika = filledDesidusPemeriksaanAwalTadikaDOM.value;
    const forExtractionDesidusPemeriksaanAwalTadika = forExtractionDesidusPemeriksaanAwalTadikaDOM.value;
    try {
        await axios.post('/api/v1/tadika', { namaPendaftaranTadika,
            umurPendaftaranTadika,
            kelasPendaftaranTadika,
            namaTaskaTadikaPendaftaranTadika,
            baruPendaftaranTadika,
            ulanganPendaftaranTadika,
            engganPendaftaranTadika,
            tidakHadirPendaftaranTadika,
            adaPendaftaranTadika,
            tiadaPendaftaranTadika,
            namaOperatorPendaftaranTadika,
            namaPasukanBergerakPendaftaranTadika,
            //pemeriksaan awal
            adaCleftPemeriksaanAwalTadika,
            rujukPemeriksaanAwalTadika,
            adaDenturePemeriksaanAwalTadika,
            perluPemeriksaanAwalTadika,
            perluBaruPemeriksaanAwalTadika,
            perluSemulaPemeriksaanAwalTadika,
            toothSurfaceLossPemeriksaanAwalTadika,
            kecederaanGigiAnteriorPemeriksaanAwalTadika,
            tisuLembutPemeriksaanAwalTadika,
            tisuKerasPemeriksaanAwalTadika,
            kebersihanMulutPemeriksaanAwalTadika,
            GISSkorPemeriksaanAwalTadika,
            decayDesidusPemeriksaanAwalTadika,
            missingDesidusPemeriksaanAwalTadika,
            filledDesidusPemeriksaanAwalTadika,
            forExtractionDesidusPemeriksaanAwalTadika,
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        // clearing all value after creating person
        namaPendaftaranTadikaDOM.value = '';
        umurPendaftaranTadikaDOM.value = '';
        baruPendaftaranTadikaDOM.value = '';
        ulanganPendaftaranTadikaDOM.value = '';
        engganPendaftaranTadikaDOM.value = '';
        tidakHadirPendaftaranTadikaDOM.value = '';
        adaPendaftaranTadikaDOM.value = '';
        tiadaPendaftaranTadikaDOM.value = '';
        namaOperatorPendaftaranTadikaDOM.value = '';
        namaPasukanBergerakPendaftaranTadikaDOM.value = '';
        //pemeriksaan awal
        adaCleftPemeriksaanAwalTadikaDOM.value = '';
        rujukPemeriksaanAwalTadikaDOM.value = '';
        adaDenturePemeriksaanAwalTadikaDOM.value = '';
        perluPemeriksaanAwalTadikaDOM.value = '';
        perluBaruPemeriksaanAwalTadikaDOM.value = '';
        perluSemulaPemeriksaanAwalTadikaDOM.value = '';
        toothSurfaceLossPemeriksaanAwalTadikaDOM.value = '';
        kecederaanGigiAnteriorPemeriksaanAwalTadikaDOM.value = '';
        tisuLembutPemeriksaanAwalTadikaDOM.value = '';
        tisuKerasPemeriksaanAwalTadikaDOM.value = '';
        kebersihanMulutPemeriksaanAwalTadikaDOM.value = '';
        GISSkorPemeriksaanAwalTadikaDOM.value = '';
        // kelasPendaftaranTadikaDOM.value = '';
        // namaTaskaTadikaPendaftaranTadikaDOM.value = '';
        // ----------------------------------------

        formAlertDOM.style.display = 'block';
        formAlertDOM.classList.add('text-success');
        formAlertDOM.textContent = 'Success, data added';
    } catch (error) {
        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = 'Please fill all data correctly';
    }
    setTimeout(() => {
        formAlertDOM.style.display = 'none';
        formAlertDOM.classList.remove('text-success');
    }, 3000);
});