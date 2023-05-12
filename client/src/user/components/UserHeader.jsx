import jatanegara from '../../assets/Jata_MalaysiaV2.svg';
function UserHeader() {
  return (
    <div className='absolute top-0 left-0 right-0 grid grid-cols-1 lg:grid-cols-2 grid-rows-1 items-center h-28 bg-user2 text-userWhite font-sans capitalize justify-center'>
      <div className='hidden lg:grid grid-cols-2'>
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
      <div className='lg:flex'>
        <div className='grid grid-rows-2 text-2xl font-bold text-center'>
          <h1 className='row-span-2'>sistem gi-Ret 2.0</h1>
          <h1>PENGGUNA</h1>
          <span className='text-user6'>{import.meta.env.VITE_ENV}</span>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
