import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserPilihFasiliti() {
  const {
    userToken,
    setReliefUserToken,
    setFasilitiRelief,
    setDisplayLoginForm,
    setDisplayPilihFasiliti,
    navigate,
    catchAxiosErrorAndLogout,
  } = useGlobalUserAppContext();

  const [listPilihFasiliti, setListPilihFasiliti] = useState([]);
  const pilihanKodFasiliti = useRef(null);
  const [pilihanFasiliti, setPilihanFasiliti] = useState([]);
  const [pilihanDaerah, setPilihanDaerah] = useState([]);

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
    try {
      const { data } = await axios.post('/api/v1/auth/login', {
        userToken,
        pilihanKodFasiliti: pilihanKodFasiliti.current.value,
        pilihanFasiliti,
        pilihanDaerah,
      });
      localStorage.setItem('reliefUserToken', data.reliefUserToken);
      setReliefUserToken(data.reliefUserToken);
      localStorage.setItem('fasilitiRelief', pilihanFasiliti);
      setFasilitiRelief(pilihanFasiliti);
      setDisplayLoginForm(true);
      setDisplayPilihFasiliti(false);
      navigate('/pengguna/landing');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='m-3'>
        <h3 className='text-xl font-semibold mt-10'>
          pilih fasiliti relief anda
        </h3>
        <form onSubmit={handleSubmit}>
          <select
            ref={pilihanKodFasiliti}
            onChange={(e) => {
              const indexFasiliti = listPilihFasiliti
                .map((f) => f.kodFasiliti)
                .indexOf(pilihanKodFasiliti.current.value);
              const arrFasilitis = listPilihFasiliti.filter(
                (f, i) => i === indexFasiliti
              );
              setPilihanFasiliti(arrFasilitis[0].kp);
              setPilihanDaerah(arrFasilitis[0].daerah);
            }}
            className='mt-12 leading-7 px-3 py-1 capitalize ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl hover:cursor-pointer'
            required
          >
            <option value=''>Pilih fasiliti relief anda..</option>
            {listPilihFasiliti.map((singleFasiliti, index) => {
              return (
                <option key={index} value={`${singleFasiliti.kodFasiliti}`}>
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
      </div>
    </>
  );
}

export default UserPilihFasiliti;
