import { Routes, Route } from 'react-router-dom';

import UserHeader from '../components/UserHeader';
import UserNavbar from '../components/UserNavbar';
import UserHeaderLoggedIn from '../components/UserHeaderLoggedIn';

import UserDashboard from '../components/UserDashboard';

import UserUmum from '../components/UserUmum';
import UserFormUmumHeader from '../components/UserFormUmumHeader';

import UserSenaraiSekolah from '../components/UserSenaraiSekolah';
import UserSekolah from '../components/UserSekolah';
import UserFormSekolahPemeriksaan from '../components/form-sekolah/UserFormSekolahPemeriksaan';
import UserFormSekolahRawatan from '../components/form-sekolah/UserFormSekolahRawatan';
import UserFormSekolahKOTAK from '../components/form-sekolah/UserFormSekolahKOTAK';

import UserGenerateIndividu from '../components/UserGenerateIndividu';
import UserGenerateKlinik from '../components/UserGenerateKlinik';

import UserStatusHarian from '../components/UserStatusHarian';

import UserLoggedInNotFound from './UserLoggedInNotFound';

import UserFooter from '../components/UserFooter';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserAfterLogin() {
  const { ToastContainer } = useGlobalUserAppContext();

  return (
    <>
      <ToastContainer />
      <UserHeader />
      <div className='absolute inset-0 -z-10 bg-user5'></div>
      <UserNavbar />
      <UserHeaderLoggedIn />
      <div className='absolute inset-2 top-[7.5rem] bottom-[2rem] -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize'>
        <Routes>
          <Route index element={<UserDashboard />} />

          <Route path='status-harian' element={<UserStatusHarian />} />

          <Route path='umum' element={<UserUmum />} />
          <Route
            path='umum/form-umum/:personUmumId'
            element={<UserFormUmumHeader />}
          />

          <Route path='senarai-sekolah' element={<UserSenaraiSekolah />} />
          <Route path='senarai-sekolah/sekolah' element={<UserSekolah />} />
          <Route
            path='senarai-sekolah/sekolah/form-sekolah/pemeriksaan/:personSekolahId/:pemeriksaanSekolahId'
            element={<UserFormSekolahPemeriksaan />}
          />
          <Route
            path='senarai-sekolah/sekolah/form-sekolah/rawatan/:personSekolahId'
            element={<UserFormSekolahRawatan />}
          />
          <Route
            path='senarai-sekolah/sekolah/form-sekolah/kotak/:personSekolahId/:kotakSekolahId'
            element={<UserFormSekolahKOTAK />}
          />

          <Route path='generate-individu' element={<UserGenerateIndividu />} />
          <Route path='generate-klinik' element={<UserGenerateKlinik />} />

          {/* <Route path='carian' element={<UserCarian />} /> */}

          <Route path='*' element={<UserLoggedInNotFound />} />
        </Routes>
      </div>
      <UserFooter />
    </>
  );
}

export default UserAfterLogin;
