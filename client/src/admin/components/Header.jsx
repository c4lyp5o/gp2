import { NavLink } from 'react-router-dom';
import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { FaAddressCard, FaRegSun, FaCreativeCommonsBy } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';

import { ConfirmModalForLogOut } from './Confirmation';
import CountdownTimer from '../context/countdownTimer';
import jatanegara from '../../../src/assets/Jata_MalaysiaV2.svg';
export default function Header(props) {
  const { loginInfo, currentOndemandSetting, logOutUser } =
    useGlobalAdminAppContext();
  const [showProfile, setShowProfile] = useState(false);

  // dropdown profil
  let profilRef = useRef();

  const dropdownProfile = () => {
    setShowProfile(!showProfile);
  };

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

  const handleLogout = () => {
    clearTimeout(props.kicker);
    clearTimeout(props.kickerNoti);
    logOutUser();
  };

  return (
    <ConfirmModalForLogOut callbackFunction={handleLogout}>
      {(confirm) => (
        <div
          className='absolute top-0 left-0 right-0 grid grid-cols-2 grid-rows-1 items-center justify-center h-28 bg-admin2 text-adminWhite font-sans capitalize'
          ref={profilRef}
        >
          <div className='grid grid-cols-2'>
            <div className='grid grid-rows-[50px_10px_10px] gap-1 text-center col-start-2 justify-end'>
              <img
                className='w-full h-full'
                src={jatanegara}
                alt='missing jata negara'
              />
              <p className='uppercase text-[0.65rem]'>
                kementerian kesihatan malaysia
              </p>
              <p className='uppercase text-[0.65rem]'>
                program kesihatan pergigian
              </p>
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='flex flex-col text-2xl font-bold text-center items-center pt-3 pl-2'>
              <h1>sistem gi-Ret 2.0</h1>
              <h1>
                PENTADBIR{' '}
                {loginInfo && (
                  <div className='inline-flex' data-cy='header'>
                    {loginInfo.accountType !== 'kpUser' ? (
                      <>
                        {loginInfo.accountType === 'daerahSuperadmin' && (
                          <p>DAERAH</p>
                        )}
                        {loginInfo.accountType === 'negeriSuperadmin' && (
                          <p>NEGERI</p>
                        )}
                      </>
                    ) : (
                      <p>KLINIK</p>
                    )}
                  </div>
                )}
              </h1>
              <span className='text-admin4'>{import.meta.env.VITE_ENV}</span>
            </div>
            {loginInfo ? (
              <div className='relative right-2'>
                {currentOndemandSetting?.adminPage ||
                loginInfo.accountType === 'hqSuperadmin' ? (
                  <div className='flex flex-col'>
                    <button
                      type='button'
                      className='p-1 m-2 w-36 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all flex flex-row'
                      onClick={dropdownProfile}
                    >
                      <FaAddressCard className='m-1' />
                      PROFIL ANDA
                    </button>
                    <button
                      type='button'
                      className='p-1 m-2 w-36 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all flex flex-row'
                      onClick={confirm(handleLogout)}
                    >
                      <FaCreativeCommonsBy className='m-1' />
                      LOG KELUAR
                    </button>
                    <div className='absolute right-0 top-12'>
                      <span>
                        <CountdownTimer
                          deadline={props.timer ? props.timer : 10}
                          place='header'
                        />
                      </span>
                    </div>
                  </div>
                ) : null}
                {showProfile && (
                  <div className='absolute z-0 bg-adminWhite text-user1 right-1 m-1 p-2 flex flex-col shadow-lg'>
                    <p className='w-auto text-sm leading-3 flex flex-col py-2 border-b-2 border-user1'>
                      <span className='uppercase pt-2'>
                        {loginInfo.username}
                      </span>
                    </p>
                    {loginInfo.accountType !== 'kpUser' ? (
                      <>
                        {loginInfo.accountType === 'daerahSuperadmin' && (
                          <p className='w-48 text-sm pt-1'>
                            <b>Daerah: </b>
                            {loginInfo.daerah}
                          </p>
                        )}
                        {loginInfo.accountType === 'negeriSuperadmin' && (
                          <p className='w-48 text-sm pt-1'>
                            <b>Negeri: </b>
                            {loginInfo.negeri}
                          </p>
                        )}
                        {loginInfo.accountType === 'hqSuperadmin' && (
                          <p className='w-48 text-xs pt-1 flex flex-col'>
                            <b>Kementerian Kesihatan Malaysia</b>
                            <b>Program Kesihatan Pergigian</b>
                          </p>
                        )}
                        <NavLink
                          className='p-1 my-1 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all flex flex-row'
                          to='/pentadbir/landing/tetapan'
                          onClick={() => {
                            setShowProfile(!showProfile);
                          }}
                        >
                          <FaRegSun className='m-1' />
                          Tetapan Saya
                        </NavLink>
                      </>
                    ) : (
                      <p className='w-40 text-sm pt-1'>
                        <b>KP: </b>
                        {loginInfo.kp}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </ConfirmModalForLogOut>
  );
}
