import { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

import {
  ConfirmModalForLogOut,
  ConfirmModalForTukarPengguna,
} from '../../admin/components/superadmin/Confirmation';
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
    kicker,
    kickerNoti,
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
    clearTimeout(kicker);
    clearTimeout(kickerNoti);
    catchAxiosErrorAndLogout();
    navigate('/pengguna');
  };

  return (
    <ConfirmModalForLogOut callbackFunction={logout}>
      {(confirm) => (
        <ConfirmModalForTukarPengguna callbackFunction={tukarPengguna}>
          {(confirmTP) => (
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
              </div>
              <div className='grid grid-rows-2 gap-4'>
                <button
                  type='button'
                  className='p-1 text-user2 bg-user3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4 transition-all'
                  onClick={confirmTP(tukarPengguna)}
                >
                  TUKAR PENGGUNA
                </button>
                <button
                  type='button'
                  className='p-1 text-user2 bg-user3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4 transition-all'
                  onClick={confirm(logout)}
                >
                  LOG KELUAR
                </button>
              </div>
              <div className='absolute -right-3 top-4'>
                <span>
                  <CountdownTimer deadline={timer} place='header' />
                </span>
              </div>
            </div>
          )}
        </ConfirmModalForTukarPengguna>
      )}
    </ConfirmModalForLogOut>
  );
}

export default UserHeaderLoggedIn;
