const loadingTextDOM = document.querySelector('.loading-text');
const namaSekolahCurrentSelectedDOM = document.querySelector('.nama-sekolah-current-selected');
const btnSenaraiSekolahContainerDOM = document.querySelector('.btn-senarai-sekolah-container')
const namaPersonSekolahContainerDOM = document.querySelector('.nama-person-sekolah-container');

const showAllPersonSekolah = async () => {
    loadingTextDOM.style.display = 'block';
    try {
        const { data: { sekolahs } } = await axios.get('/api/v1/sekolah', { headers: { Authorization: `Bearer ${token}` } });

        if (sekolahs.length < 1) {
            loadingTextDOM.style.display = 'none';
            namaSekolahCurrentSelectedDOM.style.display = 'block';
            namaSekolahCurrentSelectedDOM.textContent = 'tiada sekolah yang dilawati';
            return;
        }

        displaySinglePersonSekolah(sekolahs);
        displaySekolahButton();
        function displaySinglePersonSekolah(sekolahs) {
            let displaySinglePerson = sekolahs.map(function (singlePerson) {
                return `<div class="single-nama-person-sekolah-container">
                            <p class="nama-person">${singlePerson.namaPendaftaranSekolah}</p>
                            <p class="kelas-person">${singlePerson.kelasPendaftaranSekolah}</p>
                            <div class="person-sekolah-edit-delete">
                                <a href="./edit-sekolah.html?id=${singlePerson._id}"  class="edit-link-person-sekolah">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button class="btn-delete-person-sekolah" data-id="${singlePerson._id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>`;
            });
            displaySinglePerson = displaySinglePerson.join('');
          
            namaPersonSekolahContainerDOM.innerHTML = displaySinglePerson;
            namaSekolahCurrentSelectedDOM.style.display = 'block';
            namaSekolahCurrentSelectedDOM.textContent = 'semua pelajar di sekolah yang dilawati';
        }

        function displaySekolahButton() {
            const namaSekolah = sekolahs.reduce(
                function (values, singlePerson) {
                    if (!values.includes(singlePerson.namaSekolahPendaftaranSekolah)) {
                        values.push(singlePerson.namaSekolahPendaftaranSekolah);
                    }
                    return values;
                }, ['SEMUA PELAJAR']);
            const SekolahBtn = namaSekolah.map(function (namaSekolahPendaftaranSekolah) {
                return `<button class="btn-category filter-btn-sekolah btn-active" data-id="${namaSekolahPendaftaranSekolah}">
                            ${namaSekolahPendaftaranSekolah}
                        </button>`;
            }).join('');

            btnSenaraiSekolahContainerDOM.innerHTML = SekolahBtn;
            const filterSekolahBtn = btnSenaraiSekolahContainerDOM.querySelectorAll('.filter-btn-sekolah');
          
            filterSekolahBtn.forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    const namaSekolahPendaftaranSekolah = e.currentTarget.dataset.id;
                    const sekolahsSekolah = sekolahs.filter(function (Sekolah) {
                        if (Sekolah.namaSekolahPendaftaranSekolah === namaSekolahPendaftaranSekolah) {
                            return Sekolah;
                        }
                    });
                    if (namaSekolahPendaftaranSekolah === 'SEMUA PELAJAR') {
                        displaySinglePersonSekolah(sekolahs);
                        namaSekolahCurrentSelectedDOM.textContent = 'semua pelajar di sekolah yang dilawati';
                    } else {
                        displaySinglePersonSekolah(sekolahsSekolah);
                        namaSekolahCurrentSelectedDOM.textContent = namaSekolahPendaftaranSekolah;
                    }
                });
            });
        }
    } catch (error) {
        namaSekolahCurrentSelectedDOM.textContent = 'error';
    }
    loadingTextDOM.style.display = 'none';
};

showAllPersonSekolah();

namaPersonSekolahContainerDOM.addEventListener('click', async (e) => {
    const el = e.target;
    if (el.parentElement.classList.contains('btn-delete-person-sekolah')) {
        loadingTextDOM.style.display = 'block';
        const id = el.parentElement.dataset.id;
        try {
            await axios.delete(`/api/v1/sekolah/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
    loadingTextDOM.style.display = 'none';
});
