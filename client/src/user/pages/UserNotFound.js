import { Link } from 'react-router-dom';

import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';

function UserNotFound() {
  return (
    <>
      <UserHeader />
      <div className='absolute inset-0 -z-10 flex bg-user4 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-userWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          <div>Page not found</div>
          <Link to='/'>Back to login</Link>
        </div>
      </div>
      <UserFooter />
    </>
  );
}

export default UserNotFound;
