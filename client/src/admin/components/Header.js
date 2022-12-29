import { NavLink } from 'react-router-dom';
import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { FaAddressCard, FaRegSun, FaCreativeCommonsBy } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';

import { ConfirmModalForLogOut } from './superadmin/Confirmation';
import CountdownTimer from '../context/countdownTimer';

export default function Header(props) {
  const { navigate, removeAdminToken } = useGlobalAdminAppContext();
  const [showProfile, setShowProfile] = useState(false);

  // dropdown profil
  const hilang = () => {
    setShowProfile(!showProfile);
  };

  let profilRef = useRef();

  const handleLogout = () => {
    clearTimeout(props.kicker);
    clearTimeout(props.kickerNoti);
    removeAdminToken();
    navigate('/pentadbir');
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
                src='https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg'
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
                {props.loginInfo && (
                  <div className='inline-flex'>
                    {props.loginInfo.accountType !== 'kpUser' ? (
                      <>
                        {props.loginInfo.accountType === 'daerahSuperadmin' && (
                          <p>DAERAH</p>
                        )}
                        {props.loginInfo.accountType === 'negeriSuperadmin' && (
                          <p>NEGERI</p>
                        )}
                      </>
                    ) : (
                      <p>KLINIK</p>
                    )}
                  </div>
                )}
              </h1>
            </div>
            {props.loginInfo ? (
              <div className='relative right-2'>
                <div className='flex flex-col'>
                  <button
                    type='button'
                    className='p-1 m-2 w-36 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all flex flex-row'
                    onClick={hilang}
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
                      <CountdownTimer deadline={props.timer} place='header' />
                    </span>
                  </div>
                </div>
                {showProfile && (
                  <div className='absolute z-50 bg-adminWhite text-user1 right-1 m-1 p-2 flex flex-col shadow-lg'>
                    {props.loginInfo.accountType !== 'kpUser' ? (
                      <div className='flex items-center justify-center'>
                        <img
                          className='rounded-full shadow-md'
                          src={props.loginInfo.image}
                          alt='profile'
                          width='70'
                          height='70'
                        />
                      </div>
                    ) : null}
                    <p className='w-auto text-sm leading-3 flex flex-col py-2 border-b-2 border-user1'>
                      <span className='uppercase pt-2'>
                        {props.loginInfo.username}
                      </span>
                    </p>
                    {props.loginInfo.accountType !== 'kpUser' ? (
                      <>
                        {props.loginInfo.accountType === 'daerahSuperadmin' && (
                          <p className='w-48 text-sm pt-1'>
                            <b>Daerah: </b>
                            {props.loginInfo.daerah}
                          </p>
                        )}
                        {props.loginInfo.accountType === 'negeriSuperadmin' && (
                          <p className='w-48 text-sm pt-1'>
                            <b>Negeri: </b>
                            {props.loginInfo.negeri}
                          </p>
                        )}
                        {props.loginInfo.accountType === 'hqSuperadmin' && (
                          <p className='w-48 text-xs pt-1 flex flex-col'>
                            <b>Kementerian Kesihatan Malaysia</b>
                            <b>Program Kesihatan Pergigian</b>
                          </p>
                        )}
                        <NavLink
                          className='p-1 my-1 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all flex flex-row'
                          to='/pentadbir/landing/tetapan'
                        >
                          <FaRegSun className='m-1' />
                          Tetapan Saya
                        </NavLink>
                      </>
                    ) : (
                      <p className='w-40 text-sm pt-1'>
                        <b>KP: </b>
                        {props.loginInfo.kp}
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
