import { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

import CountdownTimer from '../../admin/context/countdownTimer';

function UserHeaderLoggedIn() {
  const {
    userToken,
    username,
    setUsername,
    setReliefUserToken,
    fasilitiRelief,
    setFasilitiRelief,
    setDisplayLoginForm,
    setDisplayPilihNama,
    setDisplayPilihFasiliti,
    navigate,
    catchAxiosErrorAndLogout,
    timer,
  } = useGlobalUserAppContext();

  const [namaKlinik, setNamaKlinik] = useState('');

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const { data } = await axios.get('/api/v1/identity', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setNamaKlinik(data.kp);
      } catch (error) {
        catchAxiosErrorAndLogout();
        navigate('/pengguna');
      }
    };
    fetchIdentity();
  }, []);

  const tukarPengguna = () => {
    setDisplayLoginForm(false);
    setDisplayPilihNama(true);
    setDisplayPilihFasiliti(false);
    localStorage.removeItem('username');
    localStorage.removeItem('userinfo');
    localStorage.removeItem('reliefUserToken');
    localStorage.removeItem('fasilitiRelief');
    setUsername(null);
    setReliefUserToken(null);
    setFasilitiRelief(null);
    navigate('/pengguna');
  };

  const logout = () => {
    catchAxiosErrorAndLogout();
    navigate('/pengguna');
  };

  return (
    <div className='hidden lg:flex absolute top-10 right-5 w-auto h-10 items-center justify-center capitalize text-userWhite text-xs'>
      <div className='m-3 space-y-1 text-right pr-2'>
        <p className='w-96 text-sm leading-3'>
          <b>{username}</b>
        </p>
        <p className='w-96 text-sm'>{namaKlinik}</p>
        {fasilitiRelief && (
          <p className='w-96 text-sm pt-1'>
            <b>anda relief : </b>
            {fasilitiRelief}
          </p>
        )}
        <div>
          <button
            type='button'
            className='p-1 m-2 w-72 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all flex flex-row'
          >
            <CountdownTimer deadline={timer} place='header' />
          </button>
        </div>
      </div>
      <div className='grid grid-rows-2 gap-2'>
        <button
          type='button'
          className='p-1 text-user2 bg-user3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4 transition-all'
          onClick={tukarPengguna}
        >
          TUKAR PENGGUNA
        </button>
        <button
          type='button'
          className='p-1 text-user2 bg-user3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4 transition-all'
          onClick={logout}
        >
          LOG KELUAR
        </button>
      </div>
    </div>
  );
}

export default UserHeaderLoggedIn;
