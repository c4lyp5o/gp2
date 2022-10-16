import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserPilihFasiliti() {
  const {
    userToken,
    setFasilitiRelief,
    setDisplayLoginForm,
    setDisplayPilihFasiliti,
    navigate,
    catchAxiosErrorAndLogout,
  } = useGlobalUserAppContext();

  const [listPilihFasiliti, setListPilihFasiliti] = useState([]);
  const pilihanFasiliti = useRef(null);

  useEffect(() => {
    const fetchPilihFasiliti = async () => {
      try {
        const { data } = await axios.get('/api/v1/pilih/fasiliti', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setListPilihFasiliti(data.fasilitis);
      } catch (error) {
        catchAxiosErrorAndLogout();
        navigate('/pengguna');
      }
    };
    fetchPilihFasiliti();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pilihanFasiliti) {
      try {
        const { data } = await axios.post(
          '/api/v1/auth/login',
          {
            apiKey: process.env.REACT_APP_API_KEY,
            pilihanFasiliti: pilihanFasiliti.current.value,
          },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
    localStorage.setItem('fasilitiRelief', pilihanFasiliti.current.value);
    setFasilitiRelief(pilihanFasiliti.current.value);
    setDisplayLoginForm(true);
    setDisplayPilihFasiliti(false);
    navigate('/pengguna/landing');
  };

  return (
    <>
      <h3 className='text-xl font-semibold mt-10'>
        pilih fasiliti relief anda
      </h3>
      <form onSubmit={handleSubmit}>
        <select
          ref={pilihanFasiliti}
          className='mt-12 leading-7 px-3 py-1 capitalize ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl hover:cursor-pointer'
          required
        >
          {listPilihFasiliti.map((singleFasiliti, index) => {
            return (
              <option key={index} value={`${singleFasiliti.kp}`}>
                {singleFasiliti.kp}
              </option>
            );
          })}
        </select>
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

export default UserPilihFasiliti;
