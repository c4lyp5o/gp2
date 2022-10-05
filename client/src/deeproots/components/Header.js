import { useGlobalDeeprootsContext } from '../context/deeprootsAppContext';

export default function Header({ status }) {
  const { navigate, catchAxiosErrorAndLogout } = useGlobalDeeprootsContext();

  return (
    <div className='absolute top-0 left-0 right-0 flex items-center h-28 bg-admin2 text-adminWhite font-sans capitalize justify-center'>
      <div className='grid grid-rows-[50px_10px_10px] gap-1 text-center'>
        <img
          className='w-full h-full'
          src='https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg'
          alt='missing jata negara'
        />
        <p className='uppercase text-[0.65rem]'>
          kementerian kesihatan malaysia
        </p>
        <p className='uppercase text-[0.65rem]'>program kesihatan pergigian</p>
      </div>
      <div className='grid grid-rows-2 text-2xl font-bold text-center'>
        <h1 className='row-span-2'>welcome to the deeproots system</h1>
      </div>
      {status && (
        <div className='admin-header-logged-in-container'>
          <div className='absolute top-10 right-5 flex w-auto h-10 items-center justify-center capitalize text-userWhite text-xs'>
            <div className='m-3 space-y-1 text-right pr-2'>
              <p className='w-96 text-sm leading-3'>
                <b>Pengguna: </b>
                <span className='uppercase'>khalypso</span>
              </p>
            </div>
            <button
              type='button'
              className='p-1 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all'
              onClick={() => {
                catchAxiosErrorAndLogout();
                navigate('/deeproots/login');
              }}
            >
              LOG KELUAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
