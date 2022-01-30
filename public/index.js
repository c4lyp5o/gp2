const usernameDOM = document.getElementById('username');
const passwordDOM = document.getElementById('password');
const loginBtnDOM = document.querySelector('.login-btn');
const wrongUsernamePasswordDOM = document.querySelector('.wrong-username-password');

loginBtnDOM.addEventListener('click', async () => {
    const username = usernameDOM.value;
    const password = passwordDOM.value;
    try {
        const { data } = await axios.post('/api/v1/auth/login', { username, password });
        localStorage.setItem('token', data.token);
        const currentUrl = window.location.href;
        const newUrl = currentUrl.concat(data.redirectLogin);
        window.location.replace(newUrl);
    } catch (error) {
        wrongUsernamePasswordDOM.textContent = error.response.data.msg;
        localStorage.removeItem('token');
    }
    setTimeout(() => {
        wrongUsernamePasswordDOM.textContent = '';
    }, 3000);
});