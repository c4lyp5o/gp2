import { useState, useEffect } from 'react';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

function AdminHeaderLoggedIn() {
  const [user, setUser] = useState('');
  const [daerah, setDaerah] = useState('');
  const { getCurrentUser, navigate, catchAxiosErrorAndLogout } =
    useGlobalAdminAppContext();

  useEffect(() => {
    getCurrentUser().then((res) => {
      setUser(res.data.username);
      setDaerah(res.data.daerah);
    });
  }, []);

  return (
    <div className='absolute top-0 left-0 right-0 flex flew-wrap items-center justify-center h-28 bg-admin2 text-adminWhite font-sans capitalize'>
      <div className='flex flex-wrap items-center shrink'>
        <div className='grid grid-rows-[50px_10px_10px] gap-1 text-center'>
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
        <div className='grid grid-rows-2 text-2xl font-bold pl-10 text-center'>
          <h1 className='row-span-2'>sistem gi-Ret 2.0</h1>
          <h1>ADMIN</h1>
        </div>
        <div className='admin-header-logged-in-container'>
          <div className='absolute top-10 right-5 flex w-auto h-10 items-center justify-center capitalize text-userWhite text-xs'>
            <div className='m-3 space-y-1 text-right pr-2'>
              <p className='w-96 text-sm leading-3'>
                <b>User: </b>
                {user}
              </p>
              <p className='w-96 text-sm pt-1'>
                <b>Daerah: </b>
                {daerah}
              </p>
            </div>
            <button
              type='button'
              className='p-1 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all'
              onClick={() => {
                catchAxiosErrorAndLogout();
                navigate('/admin');
              }}
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHeaderLoggedIn;
