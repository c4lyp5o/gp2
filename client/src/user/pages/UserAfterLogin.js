import { Routes, Route } from 'react-router-dom';

import UserNavbar from '../components/UserNavbar';
import UserHeaderLoggedIn from '../components/UserHeaderLoggedIn';

import UserDashboard from '../components/UserDashboard';
import UserTaska from '../components/UserTaska';
import UserSekolah from '../components/UserSekolah';

import UserLoggedInNotFound from './UserLoggedInNotFound';

function UserSelamatDatang() {
  return (
    <>
      <div className='absolute inset-0 -z-10 bg-user4'></div>
      <UserNavbar />
      <UserHeaderLoggedIn />
      <div className='absolute inset-10 top-44 -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize'>
        <Routes>
          <Route path='/' element={<UserDashboard />} />
          <Route path='/taska' element={<UserTaska />} />
          <Route path='/sekolah' element={<UserSekolah />} />
          {/* <Route path='/institusi' element={<UserInstitusi />} /> */}

          <Route path='*' element={<UserLoggedInNotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default UserSelamatDatang;
