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

        const btnAdaTiadaGigiDesidus = document.querySelector('.btn-status-gigi-desidus-tadika');
        const statusGigiDesidus = document.querySelector('.status-gigi-desidus-tadika');
        statusGigiDesidus.innerHTML = `<p>Klik butang di atas jika ada gigi desidus</p>`;
        btnAdaTiadaGigiDesidus.textContent = 'Tiada';
        btnAdaTiadaGigiDesidus.classList.remove('ada');
        btnAdaTiadaGigiDesidus.classList.add('tiada');

        const btnAdaTiadaGigiKekal = document.querySelector('.btn-status-gigi-kekal-tadika');
        const statusGigiKekal = document.querySelector('.status-gigi-kekal-tadika');
        statusGigiKekal.innerHTML = `<p>Klik butang di atas jika ada gigi kekal</p>`;
        btnAdaTiadaGigiKekal.textContent = 'Tiada';
        btnAdaTiadaGigiKekal.classList.remove('ada');
        btnAdaTiadaGigiKekal.classList.add('tiada');
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
            // change status gigi desidus to 'tiada'
            statusGigiDesidus.innerHTML = `<p>Klik butang di atas jika ada gigi desidus</p>`;
            btnAdaTiadaGigiDesidus.textContent = 'Tiada';
            btnAdaTiadaGigiDesidus.classList.remove('ada');
            btnAdaTiadaGigiDesidus.classList.add('tiada');
            //change status gigi kekal to 'tiada'
            statusGigiKekal.innerHTML = `<p>Klik butang di atas jika ada gigi kekal</p>`;
            btnAdaTiadaGigiKekal.textContent = 'Tiada';
            btnAdaTiadaGigiKekal.classList.remove('ada');
            btnAdaTiadaGigiKekal.classList.add('tiada');
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
    const statusGigiDesidus = document.querySelector('.status-gigi-desidus-tadika');

    btnAdaTiadaGigiDesidus.addEventListener('click', function(){
        if (btnAdaTiadaGigiDesidus.classList.contains('tiada')){
            statusGigiDesidus.innerHTML = ` <br>
                                            <label for="decay-desidus-pemeriksaan-awal-tadika">d</label>
                                            <input type="number" id="decay-desidus-pemeriksaan-awal-tadika" class="number-input-pemeriksaan-awal-tadika">
                                            <label for="missing-desidus-pemeriksaan-awal-tadika">m</label>
                                            <input type="number" id="missing-desidus-pemeriksaan-awal-tadika" class="number-input-pemeriksaan-awal-tadika">
                                            <label for="filled-desidus-pemeriksaan-awal-tadika">f</label>
                                            <input type="number" id="filled-desidus-pemeriksaan-awal-tadika" class="number-input-pemeriksaan-awal-tadika">
                                            <label for="for-extraction-desidus-pemeriksaan-awal-tadika">x</label>
                                            <input type="number" id="for-extraction-desidus-pemeriksaan-awal-tadika" class="number-input-pemeriksaan-awal-tadika">`;
            btnAdaTiadaGigiDesidus.textContent = 'Ada';
            btnAdaTiadaGigiDesidus.classList.remove('tiada');
            btnAdaTiadaGigiDesidus.classList.add('ada');
        } else {
            statusGigiDesidus.innerHTML = `<p>Klik butang di atas jika ada gigi desidus</p>`;
            btnAdaTiadaGigiDesidus.textContent = 'Tiada';
            btnAdaTiadaGigiDesidus.classList.remove('ada');
            btnAdaTiadaGigiDesidus.classList.add('tiada');
        }
    });

    const btnAdaTiadaGigiKekal = document.querySelector('.btn-status-gigi-kekal-tadika');
    const statusGigiKekal = document.querySelector('.status-gigi-kekal-tadika');

    btnAdaTiadaGigiKekal.addEventListener('click', function(){
        if (btnAdaTiadaGigiKekal.classList.contains('tiada')){
            statusGigiKekal.innerHTML = `   <br>
                                            <label for="decay-kekal-pemeriksaan-awal-tadika">D</label>
                                            <input type="number" id="decay-kekal-pemeriksaan-awal-tadika" class="number-input-pemeriksaan-awal-tadika">
                                            <label for="missing-kekal-pemeriksaan-awal-tadika">M</label>
                                            <input type="number" id="missing-kekal-pemeriksaan-awal-tadika" class="number-input-pemeriksaan-awal-tadika">
                                            <label for="filled-kekal-pemeriksaan-awal-tadika">F</label>
                                            <input type="number" id="filled-kekal-pemeriksaan-awal-tadika" class="number-input-pemeriksaan-awal-tadika">
                                            <label for="for-extraction-kekal-pemeriksaan-awal-tadika">X</label>
                                            <input type="number" id="for-extraction-kekal-pemeriksaan-awal-tadika" class="number-input-pemeriksaan-awal-tadika">
                                            <label for="e-kekal-pemeriksaan-awal-tadika">E</label>
                                            <input type="number" id="e-kekal-pemeriksaan-awal-tadika" class="number-input-pemeriksaan-awal-tadika">`;
            btnAdaTiadaGigiKekal.textContent = 'Ada';
            btnAdaTiadaGigiKekal.classList.remove('tiada');
            btnAdaTiadaGigiKekal.classList.add('ada');
        } else {
            statusGigiKekal.innerHTML = `<p>Klik butang di atas jika ada gigi kekal</p>`;
            btnAdaTiadaGigiKekal.textContent = 'Tiada';
            btnAdaTiadaGigiKekal.classList.remove('ada');
            btnAdaTiadaGigiKekal.classList.add('tiada');
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

        const btnAdaTiadaGigiDesidus = document.querySelector('.btn-status-gigi-desidus-tadika');
        const statusGigiDesidus = document.querySelector('.status-gigi-desidus-tadika');
        statusGigiDesidus.innerHTML = `<p>Klik butang di atas jika ada gigi desidus</p>`;
        btnAdaTiadaGigiDesidus.textContent = 'Tiada';
        btnAdaTiadaGigiDesidus.classList.remove('ada');
        btnAdaTiadaGigiDesidus.classList.add('tiada');

        const btnAdaTiadaGigiKekal = document.querySelector('.btn-status-gigi-kekal-tadika');
        const statusGigiKekal = document.querySelector('.status-gigi-kekal-tadika');
        statusGigiKekal.innerHTML = `<p>Klik butang di atas jika ada gigi kekal</p>`;
        btnAdaTiadaGigiKekal.textContent = 'Tiada';
        btnAdaTiadaGigiKekal.classList.remove('ada');
        btnAdaTiadaGigiKekal.classList.add('tiada');
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

        const btnAdaTiadaGigiDesidus = document.querySelector('.btn-status-gigi-desidus-tadika');
        const statusGigiDesidus = document.querySelector('.status-gigi-desidus-tadika');
        statusGigiDesidus.innerHTML = `<p>Klik butang di atas jika ada gigi desidus</p>`;
        btnAdaTiadaGigiDesidus.textContent = 'Tiada';
        btnAdaTiadaGigiDesidus.classList.remove('ada');
        btnAdaTiadaGigiDesidus.classList.add('tiada');

        const btnAdaTiadaGigiKekal = document.querySelector('.btn-status-gigi-kekal-tadika');
        const statusGigiKekal = document.querySelector('.status-gigi-kekal-tadika');
        statusGigiKekal.innerHTML = `<p>Klik butang di atas jika ada gigi kekal</p>`;
        btnAdaTiadaGigiKekal.textContent = 'Tiada';
        btnAdaTiadaGigiKekal.classList.remove('ada');
        btnAdaTiadaGigiKekal.classList.add('tiada');
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

        const btnAdaTiadaGigiDesidus = document.querySelector('.btn-status-gigi-desidus-tadika');
        const statusGigiDesidus = document.querySelector('.status-gigi-desidus-tadika');
        statusGigiDesidus.innerHTML = `<p>Klik butang di atas jika ada gigi desidus</p>`;
        btnAdaTiadaGigiDesidus.textContent = 'Tiada';
        btnAdaTiadaGigiDesidus.classList.remove('ada');
        btnAdaTiadaGigiDesidus.classList.add('tiada');

        const btnAdaTiadaGigiKekal = document.querySelector('.btn-status-gigi-kekal-tadika');
        const statusGigiKekal = document.querySelector('.status-gigi-kekal-tadika');
        statusGigiKekal.innerHTML = `<p>Klik butang di atas jika ada gigi kekal</p>`;
        btnAdaTiadaGigiKekal.textContent = 'Tiada';
        btnAdaTiadaGigiKekal.classList.remove('ada');
        btnAdaTiadaGigiKekal.classList.add('tiada');
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
            var optionValue = $(this).attr("value");
            if(optionValue){
                $(".input-wrap-todd").not("." + optionValue).hide();
                $("." + optionValue).show();
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