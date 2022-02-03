const token = localStorage.getItem('token');

window.addEventListener('pageshow', function (event) {
    const historyTraversal = event.persisted;
    if (historyTraversal) {
        window.location.reload();
    }
});

const onPageLoad = async () => {
    const usernameKpDOM = document.querySelector('.username-kp');
    try {
        const { data } = await axios.get('/api/v1/dashboard', { headers: { Authorization: `Bearer ${token}` } });
        usernameKpDOM.innerHTML = `<p class="username"><b>Nama</b> : Dr ${data.name}</p><p class="kp"><b>Tempat Bertugas</b> : ${data.kp}</p>`
    } catch (error) {
        usernameKpDOM.innerHTML = `<h4>${error.response.data.msg}</h4>`;
        const currentUrl = window.location.href;
        const splittedUrl = currentUrl.split('/');
        const newUrl = 'http://' + splittedUrl[2];
        window.location.replace(newUrl);
    }
}

onPageLoad();

const btnSenaraiTadikaContainerDOM = document.querySelector('.btn-senarai-tadika-container')
const namaPersonTadikaContainerDOM = document.querySelector('.nama-person-tadika-container');
const loadingTextDOM = document.querySelector('.loading-text');
const namaTaskaTadikaCurrentSelectedDOM = document.querySelector('.nama-taska-tadika-current-selected');

const showAllPersonTadika = async () => {
    loadingTextDOM.style.display = 'block';
    try {
        const { data: { tadikas } } = await axios.get('/api/v1/tadika', { headers: { Authorization: `Bearer ${token}` } });

        if (tadikas.length < 1) {
            loadingTextDOM.style.display = 'none';
            namaTaskaTadikaCurrentSelectedDOM.innerHTML = "Tiada Taska / Tadika yang dilawati";
            return;
        }

        displaySinglePersonTadika(tadikas);
        displayTaskaTadikaButton();
        function displaySinglePersonTadika(tadikas) {
            let displaySinglePerson = tadikas.map(function (singlePerson) {
                return `<div class="single-nama-person-tadika-container">
                            <p class="nama-person">${singlePerson.namaPendaftaranTadika}</p>
                            <div class="murid-edit-delete">
                                <a href="../edit-tadika/edit-tadika.html?${singlePerson._id}"  class="murid-edit-link">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button class="murid-delete-btn" data-id="${singlePerson._id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>`;
            });
            displaySinglePerson = displaySinglePerson.join("");
          
            namaPersonTadikaContainerDOM.innerHTML = displaySinglePerson;
            namaTaskaTadikaCurrentSelectedDOM.innerHTML = "Semua Taska / Tadika";
        }

        function displayTaskaTadikaButton() {
            const namaTaskaTadika = tadikas.reduce(
                function (values, singlePerson) {
                    if (!values.includes(singlePerson.namaTaskaTadikaPendaftaranTadika)) {
                        values.push(singlePerson.namaTaskaTadikaPendaftaranTadika);
                    }
                    return values;
                }, ["Semua Taska / Tadika"]);
            const taskaTadikaBtn = namaTaskaTadika.map(function (namaTaskaTadikaPendaftaranTadika) {
                return `<button class="btn-category filter-btn-taska-tadika" data-id="${namaTaskaTadikaPendaftaranTadika}">
                            ${namaTaskaTadikaPendaftaranTadika}
                        </button>`;
            }).join("");

            btnSenaraiTadikaContainerDOM.innerHTML = taskaTadikaBtn;
            const filterTaskaTadikaBtn = btnSenaraiTadikaContainerDOM.querySelectorAll(".filter-btn-taska-tadika");
          
            filterTaskaTadikaBtn.forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    const namaTaskaTadikaPendaftaranTadika = e.currentTarget.dataset.id;
                    const tadikasTaskaTadika = tadikas.filter(function (taskaTadika) {
                        if (taskaTadika.namaTaskaTadikaPendaftaranTadika === namaTaskaTadikaPendaftaranTadika) {
                            return taskaTadika;
                        }
                    });
                    if (namaTaskaTadikaPendaftaranTadika === "Semua Taska / Tadika") {
                        displaySinglePersonTadika(tadikas);
                        namaTaskaTadikaCurrentSelectedDOM.innerHTML = namaTaskaTadikaPendaftaranTadika;
                    } else {
                        displaySinglePersonTadika(tadikasTaskaTadika);
                        namaTaskaTadikaCurrentSelectedDOM.innerHTML = namaTaskaTadikaPendaftaranTadika;
                    }
                });
            });
        }
    } catch (error) {
        namaTaskaTadikaCurrentSelectedDOM.innerHTML = "Error";
    }
    loadingTextDOM.style.display = 'none';
}

showAllPersonTadika();