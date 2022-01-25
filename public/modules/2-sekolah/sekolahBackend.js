const namaPendaftaranSekolahDOM = document.getElementById('nama-pendaftaran-sekolah');
const umurPendaftaranSekolahDOM = document.getElementById('umur-pendaftaran-sekolah');
const kelasPendaftaranSekolahDOM = document.getElementById('kelas-pendaftaran-sekolah');
const btnSave = document.querySelector('.save');
const formAlertDOM = document.querySelector('.form-alert');

btnSave.addEventListener('click', async () => {
    const namaPendaftaranSekolah = namaPendaftaranSekolahDOM.value;
    const umurPendaftaranSekolah = umurPendaftaranSekolahDOM.value;
    const kelasPendaftaranSekolah = kelasPendaftaranSekolahDOM.value;
    try {
        await axios.post('/api/v1/sekolah', { namaPendaftaranSekolah,
            umurPendaftaranSekolah,
            kelasPendaftaranSekolah });
        namaPendaftaranSekolahDOM.value = "";
        umurPendaftaranSekolahDOM.value = "";
        kelasPendaftaranSekolahDOM.value = "";
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