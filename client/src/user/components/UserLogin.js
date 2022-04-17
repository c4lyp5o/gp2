import UserLoginForm from './UserLoginForm';
import UserPilihNama from './UserPilihNama';

function UserLogin() {
  return (
    <>
      <div className='flex text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 outline outline-1 outline-userBlack rounded-md shadow-xl'>
          {/* <UserLoginForm /> */}
          <UserPilihNama />
        </div>
      </div>
    </>
  );
}

export default UserLogin;
