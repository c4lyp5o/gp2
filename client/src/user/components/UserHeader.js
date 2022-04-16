import UserHeaderLoggedIn from './UserHeaderLoggedIn';

function UserHeader() {
  return (
    <div className='flex items-center justify-center h-40 bg-user2 text-userWhite font-sans capitalize'>
      <div className='grid grid-rows-[70px_15px_15px] text-center p-10'>
        <img
          className='w-full h-full'
          src='https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg'
          alt='missing jata negara'
        />
        <p className='uppercase text-xs'>kementerian kesihatan malaysia</p>
        <p className='uppercase text-xs'>program kesihatan pergigian</p>
      </div>
      <div className='text-4xl font-bold'>
        <h1>sistem gi-Ret PSY 2.0</h1>
      </div>
      <UserHeaderLoggedIn />
    </div>
  );
}

export default UserHeader;
