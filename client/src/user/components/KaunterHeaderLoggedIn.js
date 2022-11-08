import { FaUserCircle, FaFingerprint } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';

function KaunterHeaderLoggedIn({ namaKlinik, logout }) {
  const [showProfile, setShowProfile] = useState(false);

  // dropdown profil
  const hilang = () => {
    setShowProfile(!showProfile);
  };

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

  return (
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
          onClick={logout}
        >
          <FaFingerprint className='inline-flex mr-1' />
          LOG KELUAR
        </button>
      </div>
      <div className='relative flex lg:hidden w-auto h-10 items-center justify-center capitalize text-kaunterWhite text-xs'>
        <FaUserCircle
          className='text-4xl cursor-pointer transition-all ease-in-out hover:-translate-y-1 hover:scale-110 duration-300'
          onClick={hilang}
        />
        {showProfile && (
          <div className='absolute z-50 bg-adminWhite text-user1 top-10 right-1 m-1 p-2 flex flex-col shadow-lg rounded-md'>
            <div className=''>
              <p className='w-48 text-sm flex flex-col'>
                <b>pendaftaran : </b>
                {namaKlinik}
              </p>
            </div>
            <button
              type='button'
              className='my-2 p-1 text-user2 bg-kaunter3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-kaunter4 transition-all'
              onClick={logout}
            >
              <FaFingerprint className='m-1 inline-flex' />
              LOG KELUAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default KaunterHeaderLoggedIn;
