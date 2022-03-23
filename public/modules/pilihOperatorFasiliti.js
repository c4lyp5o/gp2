const token = localStorage.getItem('token');

const pilihNamaOperatorDOM = document.getElementById('pilih-operator');

const reqOperator = async () => {
    try {
        const { data: { operators } } = await axios.get('/api/v1/pilih/operator', { headers: { Authorization: `Bearer ${token}` } });
        console.log(operators);
        displayOperator(operators);
        function displayOperator(operators) {
            let displayOperator = operators.map(function (singlePerson) {
                return `<option value="${singlePerson.nama}">${singlePerson.nama}</option>`;
            });
            displayOperator = displayOperator.join('');
            pilihNamaOperatorDOM.innerHTML = displayOperator;
        }
    } catch (error) {
        console.log(error);
    }
}

reqOperator();






















const pilihNamaFasilitiDOM = document.getElementById('pilih-fasiliti');