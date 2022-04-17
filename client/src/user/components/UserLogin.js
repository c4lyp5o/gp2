import UserLoginForm from './UserLoginForm';
import UserPilihNama from './UserPilihNama';
import UserPilihFasiliti from './UserPilihFasiliti';

function UserLogin() {
  return (
    <>
      <div className='absolute inset-0 -z-10 flex text-center bg-user4 justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-userWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          <UserLoginForm />
          {/* <UserPilihNama /> */}
          {/* <UserPilihFasiliti /> */}
        </div>
      </div>
    </>
  );
}

export default UserLogin;
