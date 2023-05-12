import { FaUserCircle, FaFingerprint } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';

import { useGlobalUserAppContext } from '../context/userAppContext';

import { ConfirmModalForLogOut } from '../../admin/components/Confirmation';
import CountdownTimer from '../../admin/context/countdownTimer';

function KaunterHeaderLoggedIn({ namaKlinik, logout, timer }) {
  const { kaunterToken, setKaunterToken, refetchDateTime, setRefetchDateTime } =
    useGlobalUserAppContext();

  const [showProfile, setShowProfile] = useState(false);

  const [refetchState, setRefetchState] = useState(false);

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

  // refetch identity & datetime on tab focus
  useEffect(() => {
    const refetchIdentityDatetime = () => {
      setKaunterToken(localStorage.getItem('kaunterToken'));
      setRefetchDateTime(!refetchDateTime);
      {
        import.meta.env.VITE_ENV === 'DEV' &&
          console.log('refetch identity kaunter');
      }
    };
    refetchIdentityDatetime();
  }, [refetchState]);

  // refetch identity & refetch datetime on tab focus
  useEffect(() => {
    window.addEventListener('focus', setRefetchState);
    setRefetchState(!refetchState);
    return () => {
      window.removeEventListener('focus', setRefetchState);
    };
  }, []);

  return (
    <ConfirmModalForLogOut callbackFunction={logout}>
      {(confirm) => (
        <div className='absolute top-10 right-5 ' ref={profilRef}>
          <div className='hidden lg:flex w-auto h-10 items-center justify-center capitalize text-kaunterWhite text-xs'>
            <div className='m-3 space-y-1 text-right pr-2'>
              <p className='w-96 text-sm leading-3'>
                <b>pendaftaran : </b>
                {namaKlinik}
              </p>
            </div>
            <button
              type='button'
              className='mt-5 mb-5 p-1 text-user2 bg-kaunter3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-kaunter4 transition-all'
              onClick={confirm(logout)}
              data-cy='logout-pendaftaran'
            >
              <FaFingerprint className='inline-flex mr-1' />
              LOG KELUAR
            </button>
          </div>
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
                  <b>pendaftaran : </b>
                  {namaKlinik}
                </p>
              </div>
              <button
                type='button'
                className='my-2 p-1 text-user2 bg-kaunter3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-kaunter4 transition-all'
                onClick={confirm(logout)}
              >
                <FaFingerprint className='m-1 inline-flex' />
                LOG KELUAR
              </button>
            </div>
          </div>
          <div className='absolute -right-2 -top-3 lg:-top-1'>
            <span>
              <CountdownTimer
                deadline={timer}
                place='header'
                from='kaunter'
                refetchDateTime={refetchDateTime}
                setRefetchDateTime={setRefetchDateTime}
              />
            </span>
          </div>
        </div>
      )}
    </ConfirmModalForLogOut>
  );
}

export default KaunterHeaderLoggedIn;