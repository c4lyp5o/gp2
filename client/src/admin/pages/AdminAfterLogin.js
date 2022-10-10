import { useEffect, useState } from 'react';

import { Routes, Route } from 'react-router-dom';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

// -----------------------------------------------------------

import AdminLoginForm from './AdminLoginForm';

// logged in
import AdminHeaderLoggedIn from '../components/AdminHeaderLoggedIn';
import AdminNavbar from '../components/AdminNavbar';

// paparan utama
import AdminCenterStageLoggedIn from '../components/AdminCenterStageLoggedIn';

// logged in not found
import AdminLoggedInNotFound from './AdminLoggedInNotFound';

import AdminFooter from '../components/AdminFooter';
// -----------------------------------------------------------

import Data from '../components/Data';

import { ToastContainer } from 'react-toastify';

export default function AdminAfterLogin() {
  const { navigate, token, getCurrentUser, catchAxiosErrorAndLogout } =
    useGlobalAdminAppContext();
  const [loginInfo, setLoginInfo] = useState({
    isLoggedIn: false,
    username: '',
    daerah: '',
    negeri: '',
  });

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        setLoginInfo({
          isLoggedIn: true,
          username: res.data.username,
          daerah: res.data.daerah,
          negeri: res.data.negeri,
        });
      })
      .catch(() => {
        setLoginInfo({
          isLoggedIn: false,
        });
        catchAxiosErrorAndLogout();
        navigate('/pentadbir');
      });
  }, []);

  if (!token) {
    return <AdminLoginForm />;
  }

  return (
    <>
      <AdminHeaderLoggedIn
        daerah={loginInfo.daerah}
        user={loginInfo.username}
      />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <AdminNavbar />
      <div className='absolute inset-10 top-[8rem] -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize overflow-y-auto overflow-x-hidden pb-5'>
        <Routes>
          <Route index element={<AdminCenterStageLoggedIn />} />
          <Route path='kp' element={<Data FType='kp' />} />
          <Route path='pp' element={<Data FType='pp' />} />
          <Route path='jp' element={<Data FType='jp' />} />
          <Route path='taska' element={<Data FType='taska' />} />
          <Route path='tadika' element={<Data FType='tadika' />} />
          <Route path='sr' element={<Data FType='sr' />} />
          <Route path='sm' element={<Data FType='sm' />} />
          <Route path='ins' element={<Data FType='ins' />} />
          <Route path='kpb' element={<Data FType='kpb' />} />
          <Route path='mp' element={<Data FType='mp' />} />
          <Route path='*' element={<AdminLoggedInNotFound />} />
        </Routes>
      </div>
      <AdminFooter />
      <ToastContainer />
    </>
  );
}
