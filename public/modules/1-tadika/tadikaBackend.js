const formAlertDOM = document.querySelector('.form-alert');
const btnSaveDOM = document.querySelector('.save');

const namaPendaftaranTadikaDOM = document.getElementById('nama-pendaftaran-tadika');
const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
const kelasPendaftaranTadikaDOM = document.getElementById('kelas-pendaftaran-tadika');
const namaTaskaTadikaPendaftaranTadikaDOM = document.getElementById('nama-taska/tadika-pendaftaran-tadika');

btnSaveDOM.addEventListener('click', async () => {
    const namaPendaftaranTadika = namaPendaftaranTadikaDOM.value;
    const umurPendaftaranTadika = umurPendaftaranTadikaDOM.value;
    const kelasPendaftaranTadika = kelasPendaftaranTadikaDOM.value;
    const namaTaskaTadikaPendaftaranTadika = namaTaskaTadikaPendaftaranTadikaDOM.value;
    try {
        await axios.post('/api/v1/tadika', { namaPendaftaranTadika,
            umurPendaftaranTadika,
            kelasPendaftaranTadika,
            namaTaskaTadikaPendaftaranTadika }, { headers: { Authorization: `Bearer ${token}` } });
        namaPendaftaranTadikaDOM.value = '';
        umurPendaftaranTadikaDOM.value = '';
        kelasPendaftaranTadikaDOM.value = '';
        // namaTaskaTadikaPendaftaranTadikaDOM.value = '';
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