import { Link } from 'react-router-dom';

// import UserFooter from '../components/UserFooter';

function UserNotFound() {
  return (
    <>
      {/* header */}
      {/* <div className='absolute top-0 left-0 right-0 grid grid-cols-1 md:grid-cols-2 grid-rows-1 items-center h-28 bg-user2 text-userWhite font-sans capitalize justify-evenly'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='grid grid-rows-[50px_10px_10px] md:gap-1 text-center col-start-1 md:col-start-2 md:justify-end'>
            <img
              className='w-full h-full'
              src='https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg'
              alt='missing jata negara'
            />
            <p className='uppercase text-[0.55rem] lg:text-[0.65rem]'>
              kementerian kesihatan malaysia
            </p>
            <p className='uppercase text-[0.55rem] lg:text-[0.65rem]'>
              program kesihatan pergigian
            </p>
            <h1 className='md:hidden text-base font-semibold'>
              sistem gi-Ret 2.0
            </h1>
            <span className='lg:hidden text-xs text-user6 font-bold'>
              {import.meta.env.VITE_ENV}
            </span>
          </div>
        </div>
        <div className='hidden md:grid grid-rows-2 text-2xl font-bold text-start'>
          <h1 className='row-span-2 mb-3'>sistem gi-Ret 2.0</h1>
          <span className='ml-10 text-user6'>{import.meta.env.VITE_ENV}</span>
        </div>
      </div> */}
      {/* content */}
      {/* <div className='absolute inset-0 -z-10 flex bg-user4 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-userWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          <div>Page not found</div>
          <Link to='/'>Back to home</Link>
        </div>
      </div>
      <UserFooter /> */}
      <div className='bg-userWhite'></div>
    </>
  );
}

export default UserNotFound;
