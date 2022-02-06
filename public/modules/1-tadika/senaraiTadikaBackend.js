const loadingTextDOM = document.querySelector('.loading-text');
const namaTaskaTadikaCurrentSelectedDOM = document.querySelector('.nama-taska-tadika-current-selected');
const btnSenaraiTadikaContainerDOM = document.querySelector('.btn-senarai-tadika-container')
const namaPersonTadikaContainerDOM = document.querySelector('.nama-person-tadika-container');

const showAllPersonTadika = async () => {
    loadingTextDOM.style.display = 'block';
    try {
        const { data: { tadikas } } = await axios.get('/api/v1/tadika', { headers: { Authorization: `Bearer ${token}` } });

        if (tadikas.length < 1) {
            loadingTextDOM.style.display = 'none';
            namaTaskaTadikaCurrentSelectedDOM.style.display = 'block';
            namaTaskaTadikaCurrentSelectedDOM.textContent = 'Tiada Taska / Tadika yang dilawati';
            return;
        }

        displaySinglePersonTadika(tadikas);
        displayTaskaTadikaButton();
        function displaySinglePersonTadika(tadikas) {
            let displaySinglePerson = tadikas.map(function (singlePerson) {
                return `<div class="single-nama-person-tadika-container">
                            <p class="nama-person">${singlePerson.namaPendaftaranTadika}</p>
                            <div class="person-tadika-edit-delete">
                                <a href="./edit-tadika.html?id=${singlePerson._id}"  class="edit-link-person-tadika">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button class="btn-delete-person-tadika" data-id="${singlePerson._id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>`;
            });
            displaySinglePerson = displaySinglePerson.join('');
          
            namaPersonTadikaContainerDOM.innerHTML = displaySinglePerson;
            namaTaskaTadikaCurrentSelectedDOM.style.display = 'block';
            namaTaskaTadikaCurrentSelectedDOM.textContent = 'Semua pelajar di Taska / Tadika yang dilawati';
        }

        function displayTaskaTadikaButton() {
            const namaTaskaTadika = tadikas.reduce(
                function (values, singlePerson) {
                    if (!values.includes(singlePerson.namaTaskaTadikaPendaftaranTadika)) {
                        values.push(singlePerson.namaTaskaTadikaPendaftaranTadika);
                    }
                    return values;
                }, ['Semua Pelajar']);
            const taskaTadikaBtn = namaTaskaTadika.map(function (namaTaskaTadikaPendaftaranTadika) {
                return `<button class="btn-category filter-btn-taska-tadika btn-active" data-id="${namaTaskaTadikaPendaftaranTadika}">
                            ${namaTaskaTadikaPendaftaranTadika}
                        </button>`;
            }).join('');

            btnSenaraiTadikaContainerDOM.innerHTML = taskaTadikaBtn;
            const filterTaskaTadikaBtn = btnSenaraiTadikaContainerDOM.querySelectorAll('.filter-btn-taska-tadika');
          
            filterTaskaTadikaBtn.forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    const namaTaskaTadikaPendaftaranTadika = e.currentTarget.dataset.id;
                    const tadikasTaskaTadika = tadikas.filter(function (taskaTadika) {
                        if (taskaTadika.namaTaskaTadikaPendaftaranTadika === namaTaskaTadikaPendaftaranTadika) {
                            return taskaTadika;
                        }
                    });
                    if (namaTaskaTadikaPendaftaranTadika === 'Semua Pelajar') {
                        displaySinglePersonTadika(tadikas);
                        namaTaskaTadikaCurrentSelectedDOM.textContent = 'Semua pelajar di Taska / Tadika yang dilawati';
                    } else {
                        displaySinglePersonTadika(tadikasTaskaTadika);
                        namaTaskaTadikaCurrentSelectedDOM.textContent = namaTaskaTadikaPendaftaranTadika;
                    }
                });
            });
        }
    } catch (error) {
        namaTaskaTadikaCurrentSelectedDOM.textContent = 'Error';
    }
    loadingTextDOM.style.display = 'none';
};

showAllPersonTadika();

namaPersonTadikaContainerDOM.addEventListener('click', async (e) => {
    const el = e.target;
    if (el.parentElement.classList.contains('btn-delete-person-tadika')) {
        loadingTextDOM.style.display = 'block';
        const id = el.parentElement.dataset.id;
        try {
            await axios.delete(`/api/v1/tadika/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
    loadingTextDOM.style.display = 'none';
});