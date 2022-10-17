import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserPilihNama() {
  const {
    userToken,
    setUsername,
    setDisplayLoginForm,
    setDisplayPilihNama,
    setDisplayPilihFasiliti,
    navigate,
    catchAxiosErrorAndLogout,
  } = useGlobalUserAppContext();

  const [namaFasilitiToken, setNamaFasilitiToken] = useState('');
  const [listPilihNama, setListPilihNama] = useState([]);
  const pilihanOperator = useRef(null);
  const checkboxRelief = useRef(null);

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const { data } = await axios.get('/api/v1/identity', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setNamaFasilitiToken(data.kp);
      } catch (error) {
        catchAxiosErrorAndLogout();
        navigate('/pengguna');
      }
    };
    fetchIdentity();
    const fetchPilihNama = async () => {
      try {
        const { data } = await axios.get('/api/v1/pilih/operator', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setListPilihNama(data.operators);
      } catch (error) {
        catchAxiosErrorAndLogout();
        navigate('/pengguna');
      }
    };
    fetchPilihNama();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkboxRelief.current.checked === false) {
      localStorage.setItem('username', pilihanOperator.current.value);
      setUsername(pilihanOperator.current.value);
      // new
      const userinfo = listPilihNama.find(
        (operator) => operator.nama === pilihanOperator.current.value
      );
      localStorage.setItem('userinfo', JSON.stringify(userinfo));
      // new
      setDisplayLoginForm(true);
      setDisplayPilihNama(false);
      navigate('/pengguna/landing');
    }
    if (checkboxRelief.current.checked === true) {
      localStorage.setItem('username', pilihanOperator.current.value);
      setUsername(pilihanOperator.current.value);
      setDisplayPilihNama(false);
      setDisplayPilihFasiliti(true);
    }
  };

  return (
    <>
      <h3 className='text-xl font-semibold mt-10'>
        selamat datang {namaFasilitiToken}
      </h3>
      <form onSubmit={handleSubmit}>
        <p className='mt-3'>sila pilih nama pengguna</p>
        <select
          ref={pilihanOperator}
          className='mt-12 leading-7 px-3 py-1 capitalize ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl hover:cursor-pointer'
          required
        >
          {listPilihNama.map((singlePerson, index) => {
            return (
              <option key={index} value={`${singlePerson.nama}`}>
                {singlePerson.nama}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <label
          htmlFor='user-pilih-nama-pengguna-relief'
          className='m-5 text-sm hover:cursor-pointer'
        >
          saya pegawai / juruterapi pergigian relief
        </label>
        <input
          id='user-pilih-nama-pengguna-relief'
          ref={checkboxRelief}
          type='checkbox'
          className='w-4 h-4 rounded hover:cursor-pointer'
        />
        <br />
        <br />
        <button
          type='submit'
          className='capitalize bg-user3 text-userWhite rounded-md shadow-xl px-5 py-2 hover:bg-user1 transition-all'
        >
          pilih
        </button>
      </form>
    </>
  );
}

export default UserPilihNama;
