import UserHeader from '../components/UserHeader';

import UserLoginForm from '../components/UserLoginForm';
import UserPilihNama from '../components/UserPilihNama';
import UserPilihFasiliti from '../components/UserPilihFasiliti';

import UserFooter from '../components/UserFooter';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserLogin() {
  const { displayLoginForm, displayPilihNama, displayPilihFasiliti } =
    useGlobalUserAppContext();

  return (
    <>
      <UserHeader />
      <div className='absolute inset-0 -z-10 flex bg-user5 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-userWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          {displayLoginForm && <UserLoginForm />}
          {displayPilihNama && <UserPilihNama />}
          {displayPilihFasiliti && <UserPilihFasiliti />}
        </div>
      </div>
      <UserFooter />
    </>
  );
}

export default UserLogin;
