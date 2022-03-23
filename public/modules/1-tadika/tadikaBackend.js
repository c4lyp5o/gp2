const formAlertDOM = document.querySelector('.form-alert');
const btnSaveDOM = document.querySelector('.save');

const namaPendaftaranTadikaDOM = document.getElementById('nama-pendaftaran-tadika');
const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
const bangsaPendaftaranTadikaDOM = document.getElementById('bangsa-pendaftaran-tadika');
const kelasPendaftaranTadikaDOM = document.getElementById('kelas-pendaftaran-tadika');
const namaTaskaTadikaPendaftaranTadikaDOM = document.getElementById('nama-taska/tadika-pendaftaran-tadika');
const baruPendaftaranTadikaDOM = document.getElementById('baru-pendaftaran-tadika');
const ulanganPendaftaranTadikaDOM = document.getElementById('ulangan-pendaftaran-tadika');
const engganPendaftaranTadikaDOM = document.getElementById('enggan-pendaftaran-tadika');
const tidakhadirPendaftaranTadikaDOM = document.getElementById('tidak-hadir-pendaftaran-tadika');


btnSaveDOM.addEventListener('click', async () => {
    const namaPendaftaranTadika = namaPendaftaranTadikaDOM.value;
    const umurPendaftaranTadika = umurPendaftaranTadikaDOM.value;
    const kelasPendaftaranTadika = kelasPendaftaranTadikaDOM.value;
    const namaTaskaTadikaPendaftaranTadika = namaTaskaTadikaPendaftaranTadikaDOM.value;

    const baruPendaftaranTadika = baruPendaftaranTadikaDOM.value;
    const umurPendaftaranTadika = umurPendaftaranTadikaDOM.value;
    const kelasPendaftaranTadika = kelasPendaftaranTadikaDOM.value;
    const namaTaskaTadikaPendaftaranTadika = namaTaskaTadikaPendaftaranTadikaDOM.value;
    
    try {
        await axios.post('/api/v1/tadika', { namaPendaftaranTadika,
            umurPendaftaranTadika,
            kelasPendaftaranTadika,
            namaTaskaTadikaPendaftaranTadika }, { headers: { Authorization: `Bearer ${token}` } });
        
        // clearing all value after creating person
        namaPendaftaranTadikaDOM.value = '';
        umurPendaftaranTadikaDOM.value = '';
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