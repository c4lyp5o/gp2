const namaPendaftaranTadikaDOM = document.getElementById('nama-pendaftaran-tadika');
const umurPendaftaranTadikaDOM = document.getElementById('umur-pendaftaran-tadika');
const kelasPendaftaranTadikaDOM = document.getElementById('kelas-pendaftaran-tadika');
const btnSave = document.querySelector('.save');

btnSave.addEventListener('click', async () => {
    const namaPendaftaranTadika = namaPendaftaranTadikaDOM.value;
    const umurPendaftaranTadika = umurPendaftaranTadikaDOM.value;
    const kelasPendaftaranTadika = kelasPendaftaranTadikaDOM.value;
    try {
        await axios.post('/api/v1/tadika', { namaPendaftaranTadika,
            umurPendaftaranTadika,
            kelasPendaftaranTadika });
        namaPendaftaranTadikaDOM.value = "";
        umurPendaftaranTadikaDOM.value = "";
        kelasPendaftaranTadikaDOM.value = "";
        console.log('success');
    } catch (error) {
        console.log("Sila isi semua ruangan");
    }
});