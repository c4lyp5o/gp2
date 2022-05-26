import UserLoginForm from '../components/UserLoginForm';
import UserPilihNama from '../components/UserPilihNama';
import UserPilihFasiliti from '../components/UserPilihFasiliti';
import UserForgotPassword from '../components/UserForgotPassword';

function UserLogin() {
  return (
    <>
      <div className='absolute inset-0 -z-10 flex bg-user4 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-userWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          {/* <UserLoginForm /> */}
          {/* <UserPilihNama /> */}
          {/* <UserPilihFasiliti /> */}
          <UserForgotPassword />
        </div>
      </div>
    </>
  );
}

export default UserLogin;
