import { NavLink } from 'react-router-dom';
import { useGlobalAdminAppContext } from '../context/adminAppContext';

export default function AdminHeader({
  isLoggedIn,
  daerah,
  kp,
  user,
  accountType,
}) {
  const { navigate, removeAdminToken } = useGlobalAdminAppContext();

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
        <div className='grid grid-rows-2 text-2xl font-bold text-center'>
          <h1 className='row-span-2'>sistem gi-Ret 2.0</h1>
          <h1>PENTADBIR</h1>
        </div>
        {isLoggedIn === true ? (
          <div className='admin-header-logged-in-container'>
            <div className='absolute top-10 right-5 flex w-auto h-10 items-center justify-center capitalize text-userWhite text-xs'>
              <div className='m-3 space-y-1 text-right pr-2'>
                <p className='w-96 text-sm leading-3'>
                  <b>Pengguna: </b>
                  <span className='uppercase'>{user}</span>
                </p>
                {accountType !== 'kpSuperadmin' ? (
                  <>
                    <p className='w-96 text-sm pt-1'>
                      <b>Daerah: </b>
                      {daerah}
                    </p>
                    <NavLink
                      className='w-96 text-xs pt-1 hover:underline'
                      to='/pentadbir/landing/tetapan'
                    >
                      Tetapan Saya
                    </NavLink>
                  </>
                ) : (
                  <p className='w-96 text-sm pt-1'>
                    <b>KP: </b>
                    {kp}
                  </p>
                )}
              </div>
              <button
                type='button'
                className='p-1 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all'
                onClick={() => {
                  removeAdminToken();
                  navigate('/pentadbir');
                }}
              >
                LOG KELUAR
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
