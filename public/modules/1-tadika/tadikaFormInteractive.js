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

    // logic enrolmen
    const namaPendaftaranTadika = document.getElementById('nama-pendaftaran-tadika');
    const enrolmenPendaftaranTadika = document.getElementById('enrolmen-pendaftaran-tadika');

    namaPendaftaranTadika.addEventListener('input', function() {
        if (namaPendaftaranTadika.value) {
            enrolmenPendaftaranTadika.checked = true;
        } else if (!namaPendaftaranTadika.value) {
            enrolmenPendaftaranTadika.checked = false;
        }
    });

    // logic fasiliti
    const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
    const taskaTadikaPraSekolahPendaftaranTadikaDOM = document.getElementById('taska-tadika-pra-sekolah-pendaftaran-tadika');
    const divKerajaanSwastaPendaftaranTadikaDOM = document.getElementById('div-kerajaan-swasta-pendaftaran-tadika');
    const kerajaanSwastaPendaftaranTadikaDOM = document.getElementById('kerajaan-swasta-pendaftaran-tadika');
    const divKemasPerpaduanLain2PendaftaranTadikaDOM = document.getElementById('div-kemas-perpaduan-lain2-pendaftaran-tadika');
    const kemasPerpaduanLain2PendaftaranTadikaDOM = document.getElementById('kemas-perpaduan-lain2-pendaftaran-tadika');
    const divJantinaPendaftaranTadikaDOM = document.getElementById('div-jantina-pendaftaran-tadika');
    const jantinaPendaftaranTadikaDOM = document.getElementById('jantina-pendaftaran-tadika');
    const divKelasToddlerPendaftaranTadikaDOM = document.getElementById('div-kelas-toddler-pendaftaran-tadika');
    const kelasToddlerPendaftaranTadikaDOM = document.getElementById('kelas-toddler-pendaftaran-tadika');

    // if any change to umur, reset logic fasiliti
    umurPendaftaranTadikaDOM.addEventListener('change', function() {
        taskaTadikaPraSekolahPendaftaranTadikaDOM.value = '0'
        divKerajaanSwastaPendaftaranTadikaDOM.style.display = 'none';
        kerajaanSwastaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
        divKemasPerpaduanLain2PendaftaranTadikaDOM.style.display = 'none';
        kemasPerpaduanLain2PendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
        divJantinaPendaftaranTadikaDOM.style.display = 'none';
        jantinaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
        divKelasToddlerPendaftaranTadikaDOM.style.display = 'none';
        kelasToddlerPendaftaranTadikaDOM.checked = false;
    });
    taskaTadikaPraSekolahPendaftaranTadikaDOM.addEventListener('change', function() {
        // kalau pilih taska || tadika
        if (taskaTadikaPraSekolahPendaftaranTadikaDOM.value === 'taska' || taskaTadikaPraSekolahPendaftaranTadikaDOM.value === 'tadika') {
            // set
            divKerajaanSwastaPendaftaranTadikaDOM.style.display = 'block';
            kerajaanSwastaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>
                                                            <option value="kerajaan">Kerajaan</option>
                                                            <option value="swasta">Swasta</option>`;
            // reset
            divKemasPerpaduanLain2PendaftaranTadikaDOM.style.display = 'none';
            kemasPerpaduanLain2PendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
            divJantinaPendaftaranTadikaDOM.style.display = 'none';
            jantinaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
            divKelasToddlerPendaftaranTadikaDOM.style.display = 'none';
            kelasToddlerPendaftaranTadikaDOM.checked = false;
        }
        // kalau pilih tadika && umur 4 tahun ke bawah
        if (taskaTadikaPraSekolahPendaftaranTadikaDOM.value === 'tadika' && parseInt(umurPendaftaranTadikaDOM.value) <= 4) {
            // set
            divKelasToddlerPendaftaranTadikaDOM.style.display = 'block';
        }
        // kalau pilih pra sekolah
        if (taskaTadikaPraSekolahPendaftaranTadikaDOM.value === 'pra-sekolah') {
            // set
            divKerajaanSwastaPendaftaranTadikaDOM.style.display = 'block';
            kerajaanSwastaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>
                                                            <option value="kerajaan">Kerajaan</option>`;
            divJantinaPendaftaranTadikaDOM.style.display = 'block';
            jantinaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>
                                                    <option value="lelaki">Lelaki</option>
                                                    <option value="perempuan">Perempuan</option>`
            // reset
            divKemasPerpaduanLain2PendaftaranTadikaDOM.style.display = 'none';
            kemasPerpaduanLain2PendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
            divKelasToddlerPendaftaranTadikaDOM.style.display = 'none';
            kelasToddlerPendaftaranTadikaDOM.checked = false;
        }
        // kalau pilih empty
        if (taskaTadikaPraSekolahPendaftaranTadikaDOM.value === '0') {
            divKerajaanSwastaPendaftaranTadikaDOM.style.display = 'none';
            kerajaanSwastaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
            divKemasPerpaduanLain2PendaftaranTadikaDOM.style.display = 'none';
            kemasPerpaduanLain2PendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
            divJantinaPendaftaranTadikaDOM.style.display = 'none';
            jantinaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
            divKelasToddlerPendaftaranTadikaDOM.style.display = 'none';
            kelasToddlerPendaftaranTadikaDOM.checked = false;
        }
    });
    kerajaanSwastaPendaftaranTadikaDOM.addEventListener('change', function() {
        // kalau pilih kerajaan && taska || kerajaan && tadika
        if (kerajaanSwastaPendaftaranTadikaDOM.value === 'kerajaan' && taskaTadikaPraSekolahPendaftaranTadikaDOM.value === 'taska' || kerajaanSwastaPendaftaranTadikaDOM.value === 'kerajaan' && taskaTadikaPraSekolahPendaftaranTadikaDOM.value === 'tadika') {
            // set
            divKemasPerpaduanLain2PendaftaranTadikaDOM.style.display = 'block';
            kemasPerpaduanLain2PendaftaranTadikaDOM.innerHTML = `<option value="0"></option>
                                                                <option value="kemas">KEMAS</option>
                                                                <option value="perpaduan">Perpaduan</option>
                                                                <option value="lain-lain">Lain-lain</option>`;
        }
        // kalau pilih swasta
        if (kerajaanSwastaPendaftaranTadikaDOM.value === 'swasta') {
            // reset
            divKemasPerpaduanLain2PendaftaranTadikaDOM.style.display = 'none';
            kemasPerpaduanLain2PendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
        }
        // kalau pilih empty
        if (kerajaanSwastaPendaftaranTadikaDOM.value === '0') {
            divKemasPerpaduanLain2PendaftaranTadikaDOM.style.display = 'none';
            kemasPerpaduanLain2PendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
        }
    });

    // logic pemeriksaan ada tiada
    const chkbxEngganPendaftaranTadikaDOM = document.getElementById('enggan-pendaftaran-tadika');
    const chkbxTidakHadirPendaftaranTadikaDOM = document.getElementById('tidak-hadir-pendaftaran-tadika');
    const fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM = document.getElementById('fieldset-pemeriksaan-ada-tiada-pendaftaran-tadika');
    const pemeriksaanAdaTiadaPendaftaranTadikaDOM = document.getElementById('pemeriksaan-ada-tiada-pendaftaran-tadika')

    chkbxEngganPendaftaranTadikaDOM.addEventListener('change', function() {
        if (chkbxEngganPendaftaranTadikaDOM.checked === true) {
            fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM.style.display = 'block';
            pemeriksaanAdaTiadaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>
                                                                <option value="ada">Ada</option>
                                                                <option value="tiada">Tiada</option>`;
        }
        if (chkbxEngganPendaftaranTadikaDOM.checked === false && chkbxTidakHadirPendaftaranTadikaDOM.checked === false){
            fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM.style.display = 'none';
            pemeriksaanAdaTiadaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
        }
    });
    chkbxTidakHadirPendaftaranTadikaDOM.addEventListener('change', function() {
        if (chkbxTidakHadirPendaftaranTadikaDOM.checked === true) {
            fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM.style.display = 'block';
            pemeriksaanAdaTiadaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>
                                                                <option value="ada">Ada</option>
                                                                <option value="tiada">Tiada</option>`;
        }
        if (chkbxEngganPendaftaranTadikaDOM.checked === false && chkbxTidakHadirPendaftaranTadikaDOM.checked === false){
            fieldsetPemeriksaanAdaTiadaPendaftaranTadikaDOM.style.display = 'none';
            pemeriksaanAdaTiadaPendaftaranTadikaDOM.innerHTML = `<option value="0"></option>`;
        }
    });

    // clear all pendaftaran value on page load
    umurPendaftaranTadikaDOM.value = '-';
    taskaTadikaPraSekolahPendaftaranTadikaDOM.value = '0';
    enrolmenPendaftaranTadika.checked = false;
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
}

$(document).ready(function(){
    $("select").change(function(){
        $(this).find("option:selected").each(function(){
            var optionClass = $(this).attr("class");
            if(optionClass){
                $(".input-wrap-todd").not("." + optionClass).hide();
                $("." + optionClass).show();
            } else{
                $(".input-wrap-todd").hide();
            }
        });
    }).change();
});

$(document).ready(function(){
    $('input[type="checkbox"]').click(function(){
        var inputValue = $(this).attr("value");
        $("." + inputValue).toggle();
    });
});