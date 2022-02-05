const namaPendaftaranTadikaDOM = document.getElementById('nama-pendaftaran-tadika');
const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
const kelasPendaftaranTadikaDOM = document.getElementById('kelas-pendaftaran-tadika');
const namaTaskaTadikaPendaftaranDOM = document.getElementById('nama-taska/tadika-pendaftaran-tadika');
const btnSave = document.querySelector('.save');
const formAlertDOM = document.querySelector('.form-alert');

btnSave.addEventListener('click', async () => {
    const namaPendaftaranTadika = namaPendaftaranTadikaDOM.value;
    const umurPendaftaranTadika = umurPendaftaranTadikaDOM.value;
    const kelasPendaftaranTadika = kelasPendaftaranTadikaDOM.value;
    const namaTaskaTadikaPendaftaranTadika = namaTaskaTadikaPendaftaranDOM.value;
    try {
        await axios.post('/api/v1/tadika', { namaPendaftaranTadika,
            umurPendaftaranTadika,
            kelasPendaftaranTadika,
            namaTaskaTadikaPendaftaranTadika }, { headers: { Authorization: `Bearer ${token}` } });
        namaPendaftaranTadikaDOM.value = "";
        umurPendaftaranTadikaDOM.value = "";
        kelasPendaftaranTadikaDOM.value = "";
        // namaTaskaTadikaPendaftaranDOM.value = "";
        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = 'Success, data added';
        formAlertDOM.classList.add('text-success');
    } catch (error) {
        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = 'Please fill all data correctly';
    }
    setTimeout(() => {
        formAlertDOM.style.display = 'none';
        formAlertDOM.classList.remove('text-success');
    }, 3000);
});