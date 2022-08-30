import { Routes, Route } from 'react-router-dom';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

// -----------------------------------------------------------

import AdminLoginForm from './AdminLoginForm';

// logged in
import AdminHeaderLoggedIn from '../components/AdminHeaderLoggedIn';
import AdminNavbar from '../components/AdminNavbar';
// paparan utama
import AdminCenterStageLoggedIn from '../components/AdminCenterStageLoggedIn';
// klinik
import KlinikCenter from '../components/klinik/Center';
// pegawai
import PegawaiCenter from '../components/pegawai/Center';
// jp
import JPCenter from '../components/jp/Center';
// data for facility
import FacilityCenter from '../components/DataFacility';
// logged in not found
import AdminLoggedInNotFound from './AdminLoggedInNotFound';

import AdminFooter from '../components/AdminFooter';
// -----------------------------------------------------------

function AdminAfterLogin() {
  const { token } = useGlobalAdminAppContext();

  if (!token) {
    return <AdminLoginForm />;
  }

  return (
    <>
      <AdminHeaderLoggedIn />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <AdminNavbar />
      <div className='absolute inset-10 top-[8rem] -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize'>
        <Routes>
          <Route index element={<AdminCenterStageLoggedIn />} />
          <Route path='kp' element={<KlinikCenter />} />
          <Route path='pp' element={<PegawaiCenter />} />
          <Route path='jp' element={<JPCenter />} />
          <Route path='taska' element={<FacilityCenter FType='taska' />} />
          <Route path='tadika' element={<FacilityCenter FType='tadika' />} />
          <Route path='sr' element={<FacilityCenter FType='sr' />} />
          <Route path='sm' element={<FacilityCenter FType='sm' />} />
          <Route path='ins' element={<FacilityCenter FType='ins' />} />
          <Route path='*' element={<AdminLoggedInNotFound />} />
        </Routes>
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminAfterLogin;
