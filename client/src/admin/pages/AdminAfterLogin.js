import { Routes, Route } from 'react-router-dom';

import AdminLoginForm from '../components/public/LoginForm';
import AdminLoggedInNotFound from './AdminLoggedInNotFound';

// defaults
import AdminNavbar from '../components/Navbar';
import AdminFooter from '../components/Footer';

// logged in
import AdminCenterStageLoggedIn from '../components/Centerstage';
import AdminHeaderLoggedIn from '../components/HeaderLoggedIn';

// klinik
import KlinikCenter from '../components/klinik/Center';

// pegawai
import PegawaiCenter from '../components/pegawai/Center';

// jp
import JPCenter from '../components/jp/Center';

// data for facility
import FacilityCenter from '../components/Data';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

function AdminAfterLogin() {
  const { token, setToken } = useGlobalAdminAppContext();

  function LoggedIn() {
    return (
      <>
        <AdminCenterStageLoggedIn />
      </>
    );
  }

  function Klinik() {
    return (
      <>
        <KlinikCenter />
      </>
    );
  }

  function PP() {
    return (
      <>
        <PegawaiCenter />
      </>
    );
  }

  function JP() {
    return (
      <>
        <JPCenter />
      </>
    );
  }

  function Taska() {
    return (
      <>
        <FacilityCenter FType='taska' />
      </>
    );
  }

  function Tadika() {
    return (
      <>
        <FacilityCenter FType='tadika' />
      </>
    );
  }

  function SR() {
    return (
      <>
        <FacilityCenter FType='sr' />
      </>
    );
  }

  function SM() {
    return (
      <>
        <FacilityCenter FType='sm' />
      </>
    );
  }

  function Institusi() {
    return (
      <>
        <FacilityCenter FType='ins' />
      </>
    );
  }

  if (!token) {
    return <AdminLoginForm />;
  }

  return (
    <>
      <AdminHeaderLoggedIn />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <AdminNavbar />
      <div className='absolute inset-10 top-44 -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize'>
        <Routes>
          <Route index element={<LoggedIn />} />
          <Route path='kp' element={<Klinik />} />
          <Route path='pp' element={<PP />} />
          <Route path='jp' element={<JP />} />
          <Route path='taska' element={<Taska />} />
          <Route path='tadika' element={<Tadika />} />
          <Route path='sr' element={<SR />} />
          <Route path='sm' element={<SM />} />
          <Route path='ins' element={<Institusi />} />
          <Route path='*' element={<AdminLoggedInNotFound />} />
        </Routes>
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminAfterLogin;
