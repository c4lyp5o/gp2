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

const centerDataDOM = document.querySelector('.center-data')
const namaTadikaHeaderDOM = document.querySelector('.nama-tadika-header');
const namaPersonTadikaContainerDOM = document.querySelector('.nama-person-tadika-container');
const loadingTextDOM = document.querySelector('.loading-text');

const showAllPersonTadika = async () => {
    loadingTextDOM.style.display = 'block';
    try {
        const { data: { tadikas } } = await axios.get('/api/v1/tadika', { headers: { Authorization: `Bearer ${token}` } });
        console.log(tadikas);
        if (tadikas.length < 1) {
            loadingTextDOM.style.display = 'none';
            centerDataDOM.innerHTML = `<h5>No person created</h5>`;
            return;
        }

        const groupByTaskaTadika = tadikas.reduce((taskaTadika, tadika) => {
            const { namaTaskaTadikaPendaftaranTadika } = tadika;
            taskaTadika[namaTaskaTadikaPendaftaranTadika] = taskaTadika[namaTaskaTadikaPendaftaranTadika] ?? [];
            taskaTadika[namaTaskaTadikaPendaftaranTadika].push(tadika);
            return taskaTadika;
        }, {});
        console.log(groupByTaskaTadika);

        // const allPersonTadika = groupByTaskaTadika.map((taskaTadika) => {
        //     return `<div class="nama-tadika-header">
        //                 <div class="single-nama-tadika-header">
        //                     ${taskaTadika.namaTaskaTadikaPendaftaranTadika}
        //                 </div>
        //             </div>
        //             <div class="nama-person-tadika-container">
        //                 <div class="single-nama-person-tadika-container">
        //                     <p class="nama-person">${taskaTadika.namaPendaftaranTadika}</p>
        //                     <div class="murid-edit-delete">
        //                         <a href="./edit-tadika.html?id=${taskaTadika._id}"  class="murid-edit-link">
        //                         <i class="fas fa-edit"></i>
        //                         </a>
        //                         <button class="murid-delete-btn" data-id="${taskaTadika._id}">
        //                         <i class="fas fa-trash"></i>
        //                         </button>
        //                     </div>
        //                 </div>
        //             </div>`
        // }).join('');
        // console.log(allPersonTadika);

        // centerDataDOM.innerHTML = allPersonTadika;
    } catch (error) {
        centerDataDOM.innerHTML = `<h5>Error</h5>`;
    }
    loadingTextDOM.style.display = 'none';
}

showAllPersonTadika();