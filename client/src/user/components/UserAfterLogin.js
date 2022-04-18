import UserDashboard from './UserDashboard';

function UserSelamatDatang() {
  return (
    <>
      <div className='absolute inset-0 -z-10 bg-user4'></div>
      <div className='absolute inset-10 top-44 -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize'>
        <div className='h-full p-3 overflow-y-auto'>
          <UserDashboard />
        </div>
      </div>
    </>
  );
}

export default UserSelamatDatang;
