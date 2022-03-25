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
}

































































































































$(document).ready(function(){
    $("#umur-pendaftaran-tadika").change(function(){
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
    $('input[type="checkbox"]#enggan-pendaftaran-tadika,#tidak-hadir-pendaftaran-tadika').click(function(){
        var inputValue = $(this).attr("value");
        $("." + inputValue).toggle();
    });
});