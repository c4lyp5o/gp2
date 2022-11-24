import { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaUnlockAlt, FaUserFriends } from 'react-icons/fa';
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

  const [showProfile, setShowProfile] = useState(false);

  // dropdown profil
  let profilRef = useRef();

  useEffect(() => {
    let tutupProfil = (e) => {
      if (!profilRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', tutupProfil);
    return () => {
      document.removeEventListener('mousedown', tutupProfil);
    };
  });

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
            <div ref={profilRef}>
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
                    className='p-1 text-user2 flex items-center justify-center bg-user3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4 transition-all'
                    onClick={confirmTP(tukarPengguna)}
                  >
                    <FaUserFriends className='inline-flex mr-1' />
                    TUKAR PENGGUNA
                  </button>
                  <button
                    type='button'
                    className='p-1 text-user2 flex items-center justify-center bg-user3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4 transition-all'
                    onClick={confirm(logout)}
                  >
                    <FaUnlockAlt className='inline-flex mr-1' />
                    LOG KELUAR
                  </button>
                </div>
              </div>
              <div className='absolute top-10 right-5'>
                <div className='relative flex lg:hidden w-auto h-10 items-center justify-center capitalize text-kaunterWhite text-xs'>
                  <FaUserCircle
                    className='text-4xl cursor-pointer transition-all ease-in-out hover:-translate-y-1 hover:scale-110 duration-300'
                    onClick={() => setShowProfile(!showProfile)}
                  />
                  <div
                    className={`absolute z-50 bg-adminWhite text-user1 top-10 right-1 flex flex-col shadow-lg rounded-md transition-all duration-500 ${
                      showProfile
                        ? 'max-h-96 p-2 translate-y-1'
                        : 'max-h-0 overflow-hidden'
                    }`}
                  >
                    <div className=''>
                      <p className='w-48 text-sm flex flex-col'>
                        <b>{username}</b>
                      </p>
                      <p className='w-48 text-sm'>{namaKlinik}</p>
                      {fasilitiRelief && (
                        <p className='w-48 text-sm pt-1'>
                          <b>anda relief : </b>
                          {fasilitiRelief}
                        </p>
                      )}
                    </div>
                    <button
                      type='button'
                      className='my-1 p-1 text-user2 bg-user3 flex items-center justify-center hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4 transition-all'
                      onClick={confirmTP(tukarPengguna)}
                    >
                      <FaUserFriends className='inline-flex mr-1' />
                      TUKAR PENGGUNA
                    </button>
                    <button
                      type='button'
                      className='my-1 p-1 text-user2 bg-user3 flex items-center justify-center hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4 transition-all'
                      onClick={confirm(logout)}
                    >
                      <FaUnlockAlt className='inline-flex mr-1' />
                      LOG KELUAR
                    </button>
                  </div>
                </div>
              </div>
              <div className='absolute right-3 top-7 lg:top-14'>
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
