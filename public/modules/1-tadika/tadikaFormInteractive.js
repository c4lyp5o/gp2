window.addEventListener('DOMContentLoaded', function(){
    // tadika
    pendaftaranTadika();
    pemeriksaanAwalTadika();
    perluDibuatTadika();
    penyataAkhir1Tadika();
    penyataAkhir2Tadika();
});

function pendaftaranTadika(){
    const btnPendaftaran = document.querySelector('.pendaftaran-header-tadika');
    const formPendaftaran = document.querySelector('.form-pendaftaran-tadika');
    const iconPlusPendaftaran = '<i class="fas fa-plus"></i> Pendaftaran';
    const iconMinusPendaftaran = '<i class="fas fa-minus"></i> Pendaftaran';

    btnPendaftaran.addEventListener('click', function(){
        if (formPendaftaran.classList.contains('close')) {
            formPendaftaran.classList.remove('close');
            btnPendaftaran.innerHTML = iconMinusPendaftaran;
        } else {
            formPendaftaran.classList.add('close');
            btnPendaftaran.innerHTML = iconPlusPendaftaran;
        }
        // to close other form when opening this form ----------
        // close pemeriksaan awal
        const btnPemeriksaanAwalTadika = document.querySelector('.pemeriksaan-awal-header-tadika');
        const formPemeriksaanAwal = document.querySelector('.form-pemeriksaan-awal-tadika');
        btnPemeriksaanAwalTadika.innerHTML = '<i class="fas fa-plus"></i> Pemeriksaan Awal';
        formPemeriksaanAwal.classList.add('close');

        // close perlu dibuat
        const btnPerluDibuat = document.querySelector('.perlu-dibuat-header-tadika');
        const formPerluDibuat = document.querySelector('.form-perlu-dibuat-tadika');
        btnPerluDibuat.innerHTML = '<i class="fas fa-plus"></i> Perlu Dibuat';
        formPerluDibuat.classList.add('close');

        // close penyata akhir 1
        const btnPenyataAkhir1 = document.querySelector('.penyata-akhir-1-header-tadika');
        const formPenyataAkhir1 = document.querySelector('.form-penyata-akhir-1-tadika');
        btnPenyataAkhir1.innerHTML = '<i class="fas fa-plus"></i> Penyata Akhir 1';
        formPenyataAkhir1.classList.add('close');

        // close penyata akhir 2
        const btnPenyataAkhir2 = document.querySelector('.penyata-akhir-2-header-tadika');
        const formPenyataAkhir2 = document.querySelector('.form-penyata-akhir-2-tadika');
        btnPenyataAkhir2.innerHTML = '<i class="fas fa-plus"></i> Penyata Akhir 2';
        formPenyataAkhir2.classList.add('close');

    });

    // const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
    // const taskaTadikaPraSekolahPendaftaranTadikaDOM = document.getElementById('taska-tadika-pra-sekolah-pendaftaran-tadika');

    // umurPendaftaranTadikaDOM.addEventListener('click', function() {
    //     if (umurPendaftaranTadikaDOM.value === '0' ||
    //         umurPendaftaranTadikaDOM.value === '1' ||
    //         umurPendaftaranTadikaDOM.value === '1.5' ||
    //         umurPendaftaranTadikaDOM.value === '2' ||
    //         umurPendaftaranTadikaDOM.value === '3' ||
    //         umurPendaftaranTadikaDOM.value === '4') {
    //         taskaTadikaPraSekolahPendaftaranTadikaDOM.innerHTML = ` <option value="0"></option>
    //                                                                 <option value="taska">Taska</option>`
    //     }
    // });

    // umurPendaftaranTadikaDOM.addEventListener('click', function() {
    //     if (umurPendaftaranTadikaDOM.value === '5' ||
    //         umurPendaftaranTadikaDOM.value === '6') {
    //         taskaTadikaPraSekolahPendaftaranTadikaDOM.innerHTML = ` <option value="0"></option>
    //                                                                 <option value="tadika">Tadika</option>`
    //     }
    // });

    // umurPendaftaranTadikaDOM.addEventListener('click', function() {
    //     if (umurPendaftaranTadikaDOM.value === '') {
    //         taskaTadikaPraSekolahPendaftaranTadikaDOM.innerHTML = ` <option value="0">Hensem</option>`
    //     }
    // });

    const chkbxEngganPendaftaranTadikaDOM = document.getElementById('enggan-pendaftaran-tadika');
    const chkbxTidakHadirPendaftaranTadikaDOM = document.getElementById('tidak-hadir-pendaftaran-tadika');
    const fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM = document.getElementById('fieldset-pemeriksaan-ada-tiada-pendaftaran-tadika');

    chkbxEngganPendaftaranTadikaDOM.addEventListener('click', function() {
        if (chkbxEngganPendaftaranTadikaDOM.checked === true) {
            fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM.style.display = 'block';
        } else if (chkbxEngganPendaftaranTadikaDOM.checked === false && chkbxTidakHadirPendaftaranTadikaDOM.checked === false){
            fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM.style.display = 'none';
        }
    });
    chkbxTidakHadirPendaftaranTadikaDOM.addEventListener('click', function() {
        if (chkbxTidakHadirPendaftaranTadikaDOM.checked === true) {
            fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM.style.display = 'block';
        } else if (chkbxEngganPendaftaranTadikaDOM.checked === false && chkbxTidakHadirPendaftaranTadikaDOM.checked === false){
            fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM.style.display = 'none';
        }
    })
}

function pemeriksaanAwalTadika(){
    const btnPemeriksaanAwalTadika = document.querySelector('.pemeriksaan-awal-header-tadika');
    const formPemeriksaanAwal = document.querySelector('.form-pemeriksaan-awal-tadika');
    const iconPlusPemeriksaanAwal = '<i class="fas fa-plus"></i> Pemeriksaan Awal';
    const iconMinusPemeriksaanAwal = '<i class="fas fa-minus"></i> Pemeriksaan Awal';

    btnPemeriksaanAwalTadika.addEventListener('click', function(){
        if (formPemeriksaanAwal.classList.contains('close')) {
            formPemeriksaanAwal.classList.remove('close');
            btnPemeriksaanAwalTadika.innerHTML = iconMinusPemeriksaanAwal;
        } else {
            formPemeriksaanAwal.classList.add('close');
            btnPemeriksaanAwalTadika.innerHTML = iconPlusPemeriksaanAwal;
        }
        // to close other form when opening this form ----------
        // close pendaftaran
        const btnPendaftaran = document.querySelector('.pendaftaran-header-tadika');
        const formPendaftaran = document.querySelector('.form-pendaftaran-tadika');
        btnPendaftaran.innerHTML = '<i class="fas fa-plus"></i> Pendaftaran';
        formPendaftaran.classList.add('close');

        // close perlu dibuat
        const btnPerluDibuat = document.querySelector('.perlu-dibuat-header-tadika');
        const formPerluDibuat = document.querySelector('.form-perlu-dibuat-tadika');
        btnPerluDibuat.innerHTML = '<i class="fas fa-plus"></i> Perlu Dibuat';
        formPerluDibuat.classList.add('close');

        // close penyata akhir 1
        const btnPenyataAkhir1 = document.querySelector('.penyata-akhir-1-header-tadika');
        const formPenyataAkhir1 = document.querySelector('.form-penyata-akhir-1-tadika');
        btnPenyataAkhir1.innerHTML = '<i class="fas fa-plus"></i> Penyata Akhir 1';
        formPenyataAkhir1.classList.add('close');

        // close penyata akhir 2
        const btnPenyataAkhir2 = document.querySelector('.penyata-akhir-2-header-tadika');
        const formPenyataAkhir2 = document.querySelector('.form-penyata-akhir-2-tadika');
        btnPenyataAkhir2.innerHTML = '<i class="fas fa-plus"></i> Penyata Akhir 2';
        formPenyataAkhir2.classList.add('close');

    });
    
    const btnAdaTiadaGigiDesidus = document.querySelector('.btn-status-gigi-desidus-tadika');
    const jikaAdaDesidus = document.querySelector('.jika-ada-desidus');
    const statusGigiDesidus = document.querySelector('.status-gigi-desidus-tadika');

    btnAdaTiadaGigiDesidus.addEventListener('click', function(){
        if (btnAdaTiadaGigiDesidus.classList.contains('tiada')){
            btnAdaTiadaGigiDesidus.classList.remove('tiada');
            btnAdaTiadaGigiDesidus.classList.add('ada');
            btnAdaTiadaGigiDesidus.textContent = 'Ada';
            jikaAdaDesidus.style.display = 'none';
            statusGigiDesidus.style.display = 'block';
        } else {
            btnAdaTiadaGigiDesidus.classList.remove('ada');
            btnAdaTiadaGigiDesidus.classList.add('tiada');
            btnAdaTiadaGigiDesidus.textContent = 'Tiada';
            statusGigiDesidus.style.display = 'none';
            jikaAdaDesidus.style.display = 'block';
        }
    });

    const btnAdaTiadaGigiKekal = document.querySelector('.btn-status-gigi-kekal-tadika');
    const jikaAdaKekal = document.querySelector('.jika-ada-kekal');
    const statusGigiKekal = document.querySelector('.status-gigi-kekal-tadika');

    btnAdaTiadaGigiKekal.addEventListener('click', function(){
        if (btnAdaTiadaGigiKekal.classList.contains('tiada')){
            btnAdaTiadaGigiKekal.classList.remove('tiada');
            btnAdaTiadaGigiKekal.classList.add('ada');
            btnAdaTiadaGigiKekal.textContent = 'Ada';
            jikaAdaKekal.style.display = 'none';
            statusGigiKekal.style.display = 'block';
        } else {
            btnAdaTiadaGigiKekal.classList.remove('ada');
            btnAdaTiadaGigiKekal.classList.add('tiada');
            btnAdaTiadaGigiKekal.textContent = 'Tiada';
            jikaAdaKekal.style.display = 'block';
            statusGigiKekal.style.display = 'none';
        }
    });
}
function perluDibuatTadika(){
    const btnPerluDibuat = document.querySelector('.perlu-dibuat-header-tadika');
    const formPerluDibuat = document.querySelector('.form-perlu-dibuat-tadika');
    const iconPlusPerluDibuat = '<i class="fas fa-plus"></i> Perlu Dibuat';
    const iconMinusPerluDibuat = '<i class="fas fa-minus"></i> Perlu Dibuat';

    btnPerluDibuat.addEventListener('click', function(){
        if (formPerluDibuat.classList.contains('close')) {
            formPerluDibuat.classList.remove('close');
            btnPerluDibuat.innerHTML = iconMinusPerluDibuat;
        } else {
            formPerluDibuat.classList.add('close');
            btnPerluDibuat.innerHTML = iconPlusPerluDibuat;
        }
        // to close other form when opening this form ----------
        // close pendaftaran
        const btnPendaftaran = document.querySelector('.pendaftaran-header-tadika');
        const formPendaftaran = document.querySelector('.form-pendaftaran-tadika');
        btnPendaftaran.innerHTML = '<i class="fas fa-plus"></i> Pendaftaran';
        formPendaftaran.classList.add('close');

        // close pemeriksaan awal
        const btnPemeriksaanAwalTadika = document.querySelector('.pemeriksaan-awal-header-tadika');
        const formPemeriksaanAwal = document.querySelector('.form-pemeriksaan-awal-tadika');
        btnPemeriksaanAwalTadika.innerHTML = '<i class="fas fa-plus"></i> Pemeriksaan Awal';
        formPemeriksaanAwal.classList.add('close');

        // close penyata akhir 1
        const btnPenyataAkhir1 = document.querySelector('.penyata-akhir-1-header-tadika');
        const formPenyataAkhir1 = document.querySelector('.form-penyata-akhir-1-tadika');
        btnPenyataAkhir1.innerHTML = '<i class="fas fa-plus"></i> Penyata Akhir 1';
        formPenyataAkhir1.classList.add('close');

        // close penyata akhir 2
        const btnPenyataAkhir2 = document.querySelector('.penyata-akhir-2-header-tadika');
        const formPenyataAkhir2 = document.querySelector('.form-penyata-akhir-2-tadika');
        btnPenyataAkhir2.innerHTML = '<i class="fas fa-plus"></i> Penyata Akhir 2';
        formPenyataAkhir2.classList.add('close');

    });
    const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
    // const taskaTadikaPraSekolahPendaftaranTadikaDOM = document.getElementById('taska-tadika-pra-sekolah-pendaftaran-tadika');
    const toddler = document.getElementById('input-wrap-todd-fv-penyata-akhir-1');
    const prasekolahPrr = document.getElementById('input-wrap-prasekolah-prr-perlu-dibuat');
    const prasekolahFs = document.getElementById('input-wrap-prasekolah-fs-perlu-dibuat');

    umurPendaftaranTadikaDOM.addEventListener('click', function() {
        if (umurPendaftaranTadikaDOM.value === '0' ||
            umurPendaftaranTadikaDOM.value === '1' ||
            umurPendaftaranTadikaDOM.value === '1.5' ||
            umurPendaftaranTadikaDOM.value === '2' ||
            umurPendaftaranTadikaDOM.value === '3' ||
            umurPendaftaranTadikaDOM.value === '4') {
            toddler.style.display = 'block';
            prasekolahPrr.style.display = 'none';
            prasekolahFs.style.display = 'none';
        } else if (umurPendaftaranTadikaDOM.value === '5' ||
            umurPendaftaranTadikaDOM.value === '6') {
            toddler.style.display = 'none';
            prasekolahPrr.style.display = 'block';
            prasekolahFs.style.display = 'block';
        }
    });
    // clear all perlu dibuat field on page load
    const baruJumlahGigiPerluFsPerluDibuatTadikaDOM = document.getElementById('baru-jumlah-gigi-perlu-fs-perlu-dibuat-tadika');
    const semulaJumlahGigiPerluFsPerluDibuatTadikaDOM = document.getElementById('semula-jumlah-gigi-perlu-fs-perlu-dibuat-tadika');
    const failedJumlahGigiPerluFsPerluDibuatTadikaDOM = document.getElementById('failed-jumlah-gigi-perlu-fs-perlu-dibuat-tadika');
    const perluFvPerluDibuatTadikaDOM = document.getElementById('perlu-fv-perlu-dibuat-tadika');
    // const tidakPerluFvPerluDibuatTadikaDOM = document.getElementById('tidak-perlu-fv-perlu-dibuat-tadika');
    const baruJumlahGigiPerluPrrPerluDibuatTadikaDOM = document.getElementById('baru-jumlah-gigi-perlu-prr-perlu-dibuat-tadika');
    const semulaJumlahGigiPerluPrrPerluDibuatTadikaDOM = document.getElementById('semula-jumlah-gigi-perlu-prr-perlu-dibuat-tadika');
    const gdBaruAnteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gd-baru-anterior-sewarna-perlu-dibuat-tadika');
    const gdSemulaAnteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gd-semula-anterior-sewarna-perlu-dibuat-tadika');
    const gkBaruAnteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gk-baru-anterior-sewarna-perlu-dibuat-tadika');
    const gkSemulaAnteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gk-semula-anterior-sewarna-perlu-dibuat-tadika');
    const gdBaruPosteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gd-baru-posterior-sewarna-perlu-dibuat-tadika');
    const gdSemulaPosteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gd-semula-posterior-sewarna-perlu-dibuat-tadika');
    const gkBaruPosteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gk-baru-posterior-sewarna-perlu-dibuat-tadika');
    const gkSemulaPosteriorSewarnaPerluDibuatTadikaDOM = document.getElementById('gk-semula-posterior-sewarna-perlu-dibuat-tadika');

    const gdBaruPosteriorAmalgamPerluDibuatTadikaDOM = document.getElementById('gd-baru-posterior-amalgam-perlu-dibuat-tadika');
    const gdSemulaPosteriorAmalgamPerluDibuatTadikaDOM = document.getElementById('gd-semula-posterior-amalgam-perlu-dibuat-tadika');
    const gkBaruPosteriorAmalgamPerluDibuatTadikaDOM = document.getElementById('gk-baru-posterior-amalgam-perlu-dibuat-tadika');
    const gkSemulaPosteriorAmalgamPerluDibuatTadikaDOM = document.getElementById('gk-semula-posterior-amalgam-perlu-dibuat-tadika');

        baruJumlahGigiPerluFsPerluDibuatTadikaDOM.value = '';
        semulaJumlahGigiPerluFsPerluDibuatTadikaDOM.value = '';
        failedJumlahGigiPerluFsPerluDibuatTadikaDOM.value = '';
        perluFvPerluDibuatTadikaDOM.value = '0';
        baruJumlahGigiPerluPrrPerluDibuatTadikaDOM.value = '';
        semulaJumlahGigiPerluPrrPerluDibuatTadikaDOM.value = '';
        gdBaruAnteriorSewarnaPerluDibuatTadikaDOM.value = '';
        gdSemulaAnteriorSewarnaPerluDibuatTadikaDOM.value = '';
        gkBaruAnteriorSewarnaPerluDibuatTadikaDOM.value = '';
        gkSemulaAnteriorSewarnaPerluDibuatTadikaDOM.value = '';
        gdBaruPosteriorSewarnaPerluDibuatTadikaDOM.value = '';
        gdSemulaPosteriorSewarnaPerluDibuatTadikaDOM.value = '';
        gkBaruPosteriorSewarnaPerluDibuatTadikaDOM.value = '';
        gkSemulaPosteriorSewarnaPerluDibuatTadikaDOM.value = '';
        gdBaruPosteriorAmalgamPerluDibuatTadikaDOM.value = '';
        gdSemulaPosteriorAmalgamPerluDibuatTadikaDOM.value = '';
        gkBaruPosteriorAmalgamPerluDibuatTadikaDOM.value = '';
        gkSemulaPosteriorAmalgamPerluDibuatTadikaDOM.value = '';    
}
function penyataAkhir1Tadika(){
    const btnPenyataAkhir1 = document.querySelector('.penyata-akhir-1-header-tadika');
    const formPenyataAkhir1 = document.querySelector('.form-penyata-akhir-1-tadika');
    const iconPlusPenyataAkhir1 = '<i class="fas fa-plus"></i> Penyata Akhir 1';
    const iconMinusPenyataAkhir1 = '<i class="fas fa-minus"></i> Penyata Akhir 1';

    btnPenyataAkhir1.addEventListener('click', function(){
        if (formPenyataAkhir1.classList.contains('close')) {
            formPenyataAkhir1.classList.remove('close');
            btnPenyataAkhir1.innerHTML = iconMinusPenyataAkhir1;
        } else {
            formPenyataAkhir1.classList.add('close');
            btnPenyataAkhir1.innerHTML = iconPlusPenyataAkhir1;
        }
        // to close other form when opening this form ----------
        // close pendaftaran
        const btnPendaftaran = document.querySelector('.pendaftaran-header-tadika');
        const formPendaftaran = document.querySelector('.form-pendaftaran-tadika');
        btnPendaftaran.innerHTML = '<i class="fas fa-plus"></i> Pendaftaran';
        formPendaftaran.classList.add('close');

        // close pemeriksaan awal
        const btnPemeriksaanAwalTadika = document.querySelector('.pemeriksaan-awal-header-tadika');
        const formPemeriksaanAwal = document.querySelector('.form-pemeriksaan-awal-tadika');
        btnPemeriksaanAwalTadika.innerHTML = '<i class="fas fa-plus"></i> Pemeriksaan Awal';
        formPemeriksaanAwal.classList.add('close');

        // close perlu dibuat
        const btnPerluDibuat = document.querySelector('.perlu-dibuat-header-tadika');
        const formPerluDibuat = document.querySelector('.form-perlu-dibuat-tadika');
        btnPerluDibuat.innerHTML = '<i class="fas fa-plus"></i> Perlu Dibuat';
        formPerluDibuat.classList.add('close');

        // close penyata akhir 2
        const btnPenyataAkhir2 = document.querySelector('.penyata-akhir-2-header-tadika');
        const formPenyataAkhir2 = document.querySelector('.form-penyata-akhir-2-tadika');
        btnPenyataAkhir2.innerHTML = '<i class="fas fa-plus"></i> Penyata Akhir 2';
        formPenyataAkhir2.classList.add('close');

    });
    const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
    // const taskaTadikaPraSekolahPendaftaranTadikaDOM = document.getElementById('taska-tadika-pra-sekolah-pendaftaran-tadika');
    const toddler = document.getElementById('input-wrap-todd-fv-penyata-akhir-1');
    const prasekolahPrr = document.getElementById('input-wrap-prasekolah-prr-jenis-1-penyata-akhir-1');
    const prasekolahFv = document.getElementById('input-wrap-prasekolah-fv-penyata-akhir-1');
    const prasekolahFs = document.getElementById('input-wrap-prasekolah-fs-penyata-akhir-1');

    umurPendaftaranTadikaDOM.addEventListener('click', function() {
        if (umurPendaftaranTadikaDOM.value === '0' ||
            umurPendaftaranTadikaDOM.value === '1' ||
            umurPendaftaranTadikaDOM.value === '1.5' ||
            umurPendaftaranTadikaDOM.value === '2' ||
            umurPendaftaranTadikaDOM.value === '3' ||
            umurPendaftaranTadikaDOM.value === '4') {
            toddler.style.display = 'block';
            prasekolahPrr.style.display = 'none';
            prasekolahFv.style.display = 'none';
            prasekolahFs.style.display = 'none';
        } else if (umurPendaftaranTadikaDOM.value === '5' ||
            umurPendaftaranTadikaDOM.value === '6') {
            toddler.style.display = 'none';
            prasekolahPrr.style.display = 'block';
            prasekolahFv.style.display = 'block';
            prasekolahFs.style.display = 'block';
        }
    });
    // clear all penyata akhir 1 field on page load
    // FISUR SELAN
    const baruJumlahGigiTelahDibuatFSPenyataAkhirDOM = document.getElementById('baru-jumlah-gigi-telah-dibuat-fs-penyata-akhir-1-tadika');
    const semulaJumlahGigiTelahDibuatFSPenyataAkhirDOM = document.getElementById('semula-jumlah-gigi-telah-dibuat-fs-penyata-akhir-1-tadika');
    // FV TODD
    const sesiFvPerluDibuatPenyataAkhir1TadikaDOM = document.getElementById('sesi-fv-perlu-dibuat-penyata-akhir-1-tadika');
    // const sesiFvPerludiBuatSATUPenyataAkhirSatuTadikaDOM = document.getElementById('sesi-fv-perlu-dibuat-1-penyata-akhir-1-tadika');
    // const sesiFvPerludiBuatDUAPenyataAkhirSatuTadikaDOM = document.getElementById('sesi-fv-perlu-dibuat-2-penyata-akhir-1-tadika');
    // const sesiFvPerludiBuatTIGAPenyataAkhirSatuTadikaDOM = document.getElementById('sesi-fv-perlu-dibuat-3-penyata-akhir-1-tadika');
    // const sesiFvPerludiBuatEMPATPenyataAkhirSatuTadikaDOM = document.getElementById('sesi-fv-perlu-dibuat-4-penyata-akhir-1-tadika');
    // FV PRASEKOLAH
    const baruJumlahGigiTelahDibuatFVPenyataAkhirSATUTadikaDOM = document.getElementById('baru-jumlah-gigi-telah-dibuat-fv-penyata-akhir-1-tadika');
    const semulaJumlahGigiTelahDibuatFVPenyataAkhirSATUTadikaDOM = document.getElementById('semula-jumlah-gigi-telah-dibuat-fv-penyata-akhir-1-tadika');
    // PRR JENIS 1
    const baruJumlahGigiTelahDibuatPrrPenyataAkhirSATUTadikaDOM = document.getElementById('baru-jumlah-gigi-telah-dibuat-prr-penyata-akhir-1-tadika');
    const semulaJumlahGigiTelahDibuatPrrPenyataAkhirSATUTadikaDOM = document.getElementById('semula-jumlah-gigi-telah-dibuat-prr-penyata-akhir-1-tadika');
    // JUMLAH TAMPALAN TELAH DILAKUKAN
    // GD ANTERIOR SEWARNA
    const gdBaruAnteriorSewarnaPenyataAkhirSATUTadikaDOM = document.getElementById('gd-baru-anterior-sewarna-penyata-akhir-1-tadika');
    const gdSemulaAnteriorSewarnaPenyataAkhirSATUTadikaDOM = document.getElementById('gd-semula-anterior-sewarna-penyata-akhir-1-tadika');
    // GK ANT SEWARNA
    const gkBaruAnteriorSewarnaPenyataAkhirSATUTadikaDOM = document.getElementById('gk-baru-anterior-sewarna-penyata-akhir-1-tadika');
    const gkSemulaAnteriorSewarnaPenyataAkhirSATUTadikaDOM = document.getElementById('gk-semula-anterior-sewarna-penyata-akhir-1-tadika');
    // GD POST SEWARNA
    const gdBaruPosteriorSewarnaPenyataAkhirSATUTadikaDOM = document.getElementById('gd-baru-posterior-sewarna-penyata-akhir-1-tadika');
    const gdSemulaPosteriorSewarnaPenyataAkhirSATUTadikaDOM = document.getElementById('gd-semula-posterior-sewarna-penyata-akhir-1-tadika');
    //GK POST SEWARNA
    const gkBaruPosteriorSewarnaPenyataAkhirSATUTadikaDOM = document.getElementById('gk-baru-posterior-sewarna-penyata-akhir-1-tadika');
    const gkSemulaPosteriorSewarnaPenyataAkhirSATUTadikaDOM = document.getElementById('gk-semula-posterior-sewarna-penyata-akhir-1-tadika');
    // GD POST AMALGAM
    const gdBaruPosteriorAmalgamPenyataAkhirSATUTadikaDOM = document.getElementById('gd-baru-posterior-amalgam-penyata-akhir-1-tadika');
    const gdSemulaPosteriorAmalgamPenyataAkhirSATUTadikaDOM = document.getElementById('gd-semula-posterior-amalgam-penyata-akhir-1-tadika');
    // GK POST AMALGAM
    const gkBaruPosteriorAmalgamPenyataAkhirSATUTadikaDOM = document.getElementById('gk-baru-posterior-amalgam-penyata-akhir-1-tadika');
    const gkSemulaPosteriorAmalgamPenyataAkhirSATUTadikaDOM = document.getElementById('gk-semula-posterior-amalgam-penyata-akhir-1-tadika');

        // FS
        baruJumlahGigiTelahDibuatFSPenyataAkhirDOM.value = '';
        semulaJumlahGigiTelahDibuatFSPenyataAkhirDOM.value = '';
        // FV TODD
        sesiFvPerluDibuatPenyataAkhir1TadikaDOM.value = '0';
        // sesiFvPerludiBuatSATUPenyataAkhirSatuTadikaDOM.value = '';
        // sesiFvPerludiBuatDUAPenyataAkhirSatuTadikaDOM.value = '';
        // sesiFvPerludiBuatTIGAPenyataAkhirSatuTadikaDOM.value = '';
        // sesiFvPerludiBuatEMPATPenyataAkhirSatuTadikaDOM.value = '';
        // FV PRASEKOLAH
        baruJumlahGigiTelahDibuatFVPenyataAkhirSATUTadikaDOM.value = '';
        semulaJumlahGigiTelahDibuatFVPenyataAkhirSATUTadikaDOM.value = '';
        // PRR 1
        baruJumlahGigiTelahDibuatPrrPenyataAkhirSATUTadikaDOM.value = '';
        semulaJumlahGigiTelahDibuatPrrPenyataAkhirSATUTadikaDOM.value = '';
        // GD ANT SEWARNA
        gdBaruAnteriorSewarnaPenyataAkhirSATUTadikaDOM.value = '';
        gdSemulaAnteriorSewarnaPenyataAkhirSATUTadikaDOM.value = '';
        // GK ANT SEWARNA
        gkBaruAnteriorSewarnaPenyataAkhirSATUTadikaDOM.value = '';
        gkSemulaAnteriorSewarnaPenyataAkhirSATUTadikaDOM.value = '';
        // GD POST SEWARNA
        gdBaruPosteriorSewarnaPenyataAkhirSATUTadikaDOM.value = '';
        gdSemulaPosteriorSewarnaPenyataAkhirSATUTadikaDOM.value = '';
        //GK POST SEWARNA
        gkBaruPosteriorSewarnaPenyataAkhirSATUTadikaDOM.value = '';
        gkSemulaPosteriorSewarnaPenyataAkhirSATUTadikaDOM.value = '';
        //GD POST AMALGAM
        gdBaruPosteriorAmalgamPenyataAkhirSATUTadikaDOM.value = '';
        gdSemulaPosteriorAmalgamPenyataAkhirSATUTadikaDOM.value = '';
        //GK POST AMALGAM
        gkBaruPosteriorAmalgamPenyataAkhirSATUTadikaDOM.value = '';
        gkSemulaPosteriorAmalgamPenyataAkhirSATUTadikaDOM.value = '';;
}
function penyataAkhir2Tadika(){
    const btnPenyataAkhir2 = document.querySelector('.penyata-akhir-2-header-tadika');
    const formPenyataAkhir2 = document.querySelector('.form-penyata-akhir-2-tadika');
    const iconPlusPenyataAkhir2 = '<i class="fas fa-plus"></i> Penyata Akhir 2';
    const iconMinusPenyataAkhir2 = '<i class="fas fa-minus"></i> Penyata Akhir 2';

    btnPenyataAkhir2.addEventListener('click', function(){
        if (formPenyataAkhir2.classList.contains('close')) {
            formPenyataAkhir2.classList.remove('close');
            btnPenyataAkhir2.innerHTML = iconMinusPenyataAkhir2;
        } else {
            formPenyataAkhir2.classList.add('close');
            btnPenyataAkhir2.innerHTML = iconPlusPenyataAkhir2;
        }
        // to close other form when opening this form ----------
        // close pendaftaran
        const btnPendaftaran = document.querySelector('.pendaftaran-header-tadika');
        const formPendaftaran = document.querySelector('.form-pendaftaran-tadika');
        btnPendaftaran.innerHTML = '<i class="fas fa-plus"></i> Pendaftaran';
        formPendaftaran.classList.add('close');
        
        // close pemeriksaan awal
        const btnPemeriksaanAwalTadika = document.querySelector('.pemeriksaan-awal-header-tadika');
        const formPemeriksaanAwal = document.querySelector('.form-pemeriksaan-awal-tadika');
        btnPemeriksaanAwalTadika.innerHTML = '<i class="fas fa-plus"></i> Pemeriksaan Awal';
        formPemeriksaanAwal.classList.add('close');

        // close perlu dibuat
        const btnPerluDibuat = document.querySelector('.perlu-dibuat-header-tadika');
        const formPerluDibuat = document.querySelector('.form-perlu-dibuat-tadika');
        btnPerluDibuat.innerHTML = '<i class="fas fa-plus"></i> Perlu Dibuat';
        formPerluDibuat.classList.add('close');

        // close penyata akhir 1
        const btnPenyataAkhir1 = document.querySelector('.penyata-akhir-1-header-tadika');
        const formPenyataAkhir1 = document.querySelector('.form-penyata-akhir-1-tadika');
        btnPenyataAkhir1.innerHTML = '<i class="fas fa-plus"></i> Penyata Akhir 1';
        formPenyataAkhir1.classList.add('close');

    });

    const btnStatusAnticipatoryGuidance = document.querySelector('.btn-status-anticipatory-guidance');
    const bilanganAGuidance = document.querySelector('.bilangan-a-guidance');

    btnStatusAnticipatoryGuidance.addEventListener('click', function(){
        if (btnStatusAnticipatoryGuidance.classList.contains('tiada')){
            btnStatusAnticipatoryGuidance.classList.remove('tiada');
            btnStatusAnticipatoryGuidance.classList.add('ada');
            btnStatusAnticipatoryGuidance.textContent = 'Bilangan Diberi Anticipatory Guidance';
            bilanganAGuidance.style.display = 'block';
        } else {
            btnStatusAnticipatoryGuidance.classList.remove('ada');
            btnStatusAnticipatoryGuidance.classList.add('tiada');
            btnStatusAnticipatoryGuidance.textContent = 'Diberi Anticipatory Guidance (AG)';
            bilanganAGuidance.style.display = 'none';
        }
    });

    const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
    // const taskaTadikaPraSekolahPendaftaranTadikaDOM = document.getElementById('taska-tadika-pra-sekolah-pendaftaran-tadika');
    const toddler = document.getElementById('input-wrap-todd-a-guidance');

    umurPendaftaranTadikaDOM.addEventListener('click', function() {
        if (umurPendaftaranTadikaDOM.value === '0' ||
            umurPendaftaranTadikaDOM.value === '1' ||
            umurPendaftaranTadikaDOM.value === '1.5' ||
            umurPendaftaranTadikaDOM.value === '2' ||
            umurPendaftaranTadikaDOM.value === '3' ||
            umurPendaftaranTadikaDOM.value === '4') {
            toddler.style.display = 'block';
        } else if (umurPendaftaranTadikaDOM.value === '5' ||
            umurPendaftaranTadikaDOM.value === '6') {
            toddler.style.display = 'none';
        }
    });

    // clear all penyata akhir 2 field on page load
    //CABUTAN
    const desidusJumlahGigiTelahDicabutPenyataAkhirDUATadikaDOM = document.getElementById('desidus-jumlah-gigi-telah-dicabut-penyata-akhir-2-tadika');
    const kekalJumlahGigiTelahDicabutPenyataAkhirDUATadikaDOM = document.getElementById('kekal-jumlah-gigi-telah-dicabut-penyata-akhir-2-tadika');
    //TAMPALANSEMENTARA
    const jumlahGigiTampalanSementaraPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-gigi-tampalan-sementara-penyata-akhir-2-tadika');
    //RAWATAN LAIN
    const jumlahPulpotomiRawatanLainPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-pulpotomi-rawatan-lain-penyata-akhir-2-tadika');
    const jumlahEndodontikRawatanLainPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-endodontik-rawatan-lain-penyata-akhir-2-tadika');
    const jumlahAbsesRawatanLainPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-abses-rawatan-lain-penyata-akhir-2-tadika');
    const kesSelesaiRawatanLainPenyataAkhirDUATadikaDOM = document.getElementById('kes-selesai-rawatan-lain-penyata-akhir-2-tadika');
    const kesSelesaiIcdasRawatanLainPenyataAkhirDUAtadikaDOM = document.getElementById('kes-selesai-icdas-rawatan-lain-penyata-akhir-2-tadika');
    const rujukRawatanLainPenyataAkhirDUATadikaDOM = document.getElementById('rujuk-rawatan-lain-penyata-akhir-2-tadika');
    const penskaleranRawatanLainPenyataAkhirDUATadikaDOM = document.getElementById('penskaleran-rawatan-lain-penyata-akhir-2-tadika');
    //PROMOSI
    const ceramahPromosiPenyataAkhirDUATadikaDOM = document.getElementById('ceramah-promosi-penyata-akhir-2-tadika');
    const lmgPromosiPenyataAkhirDUATadikaDOM = document.getElementById('lmg-promosi-penyata-akhir-2-tadika');
    //BEGIN
    const melaksanakanAktivitiBeginPenyataAkhirDUATadikaDOM = document.getElementById('melaksanakan-aktiviti-begin-penyata-akhir-2-tadika');
    //AG
    const aGuidancePenyataAkhirDUATadikaDOM = document.getElementById('a-guidance-penyata-akhir-2-tadika');
    const jumlahLimaBelasTujuhBelasAGPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-15-17-ag-penyata-akhir-2-tadika');
    const jumlahLapanBelasSembilanBelasAGPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-18-19-ag-penyata-akhir-2-tadika');
    const jumlahDuaPuluhDuaPuluhSembilanAGPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-20-29-ag-penyata-akhir-2-tadika');
    const jumlahTigaPuluhEmpatPuluhSembilanAGPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-30-49-ag-penyata-akhir-2-tadika');
    const jumlahLimaPuluhLimaPuluhSembilanAGPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-50-59-ag-penyata-akhir-2-tadika');
    const jumlahEnamPuluhAGPenyataAkhirDUATadikaDOM = document.getElementById('jumlah-60-ag-penyata-akhir-2-tadika');
    //CATATAN
    const catatanPenyataAkhirDUATadikaDOM = document.getElementById('catatan-penyata-akhir-2-tadika');

    //CABUTAN
    desidusJumlahGigiTelahDicabutPenyataAkhirDUATadikaDOM.value = '';
    kekalJumlahGigiTelahDicabutPenyataAkhirDUATadikaDOM.value = '';
    //TAMPALAN SEMENTARA
    jumlahGigiTampalanSementaraPenyataAkhirDUATadikaDOM.value = '';
    //RAWATAN LAIN
    jumlahPulpotomiRawatanLainPenyataAkhirDUATadikaDOM.value = '';
    jumlahEndodontikRawatanLainPenyataAkhirDUATadikaDOM.value = '';
    jumlahAbsesRawatanLainPenyataAkhirDUATadikaDOM.value = '';
    kesSelesaiRawatanLainPenyataAkhirDUATadikaDOM.checked = false;
    kesSelesaiIcdasRawatanLainPenyataAkhirDUAtadikaDOM.checked = false;
    rujukRawatanLainPenyataAkhirDUATadikaDOM.checked = false;
    penskaleranRawatanLainPenyataAkhirDUATadikaDOM.checked = false;
    //PROMOSI
    ceramahPromosiPenyataAkhirDUATadikaDOM.value = '0';
    lmgPromosiPenyataAkhirDUATadikaDOM.value = '0';
    //BEGIN
    melaksanakanAktivitiBeginPenyataAkhirDUATadikaDOM.value = '0';
    //AG
    aGuidancePenyataAkhirDUATadikaDOM.value = '';
    jumlahLimaBelasTujuhBelasAGPenyataAkhirDUATadikaDOM.value = '';
    jumlahLapanBelasSembilanBelasAGPenyataAkhirDUATadikaDOM.value = '';
    jumlahDuaPuluhDuaPuluhSembilanAGPenyataAkhirDUATadikaDOM.value = '';
    jumlahTigaPuluhEmpatPuluhSembilanAGPenyataAkhirDUATadikaDOM.value = '';
    jumlahLimaPuluhLimaPuluhSembilanAGPenyataAkhirDUATadikaDOM.value = '';
    jumlahEnamPuluhAGPenyataAkhirDUATadikaDOM.value = '';
    //CATATAN
    catatanPenyataAkhirDUATadikaDOM.value = '';

}