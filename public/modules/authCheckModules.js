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
        usernameKpDOM.innerHTML = `<p class="username"><b>Nama</b> : ${data.name}</p><p class="kp"><b>tempat bertugas</b> : ${data.kp}</p>`
    } catch (error) {
        usernameKpDOM.innerHTML = `<h4>${error.response.data.msg}</h4>`;
        const currentUrl = window.location.href;
        const splittedUrl = currentUrl.split('/');
        const newUrl = 'http://' + splittedUrl[2];
        window.location.replace(newUrl);
    }
};

onPageLoad();