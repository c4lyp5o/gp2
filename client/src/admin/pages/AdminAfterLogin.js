import { useLayoutEffect, useState } from 'react';

import { Routes, Route } from 'react-router-dom';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

// -----------------------------------------------------------

import AdminLoginForm from './AdminLoginForm';

// logged in
import AdminHeader from '../components/AdminHeader';
import AdminNavbar from '../components/AdminNavbar';

// paparan utama
import AdminCenterStage from '../components/AdminCenterStage';

// klinik details
import Klinik from '../components/Klinik';

// logged in not found
import AdminLoggedInNotFound from './AdminLoggedInNotFound';

import AdminFooter from '../components/AdminFooter';
// -----------------------------------------------------------

import Data from '../components/Data';

// settings
import Settings from '../components/Settings';

import { ToastContainer } from 'react-toastify';

export default function AdminAfterLogin() {
  const { navigate, getCurrentUser, catchAxiosErrorAndLogout } =
    useGlobalAdminAppContext();
  const [loginInfo, setLoginInfo] = useState({});

  useLayoutEffect(() => {
    getCurrentUser()
      .then((res) => {
        setLoginInfo({
          isLoggedIn: true,
          id: res.data.userId,
          username: res.data.username,
          kp: res.data.kp,
          daerah: res.data.daerah,
          negeri: res.data.negeri,
          accountType: res.data.accountType,
          totp: res.data.totp,
        });
      })
      .catch(() => {
        setLoginInfo({
          isLoggedIn: false,
        });
        catchAxiosErrorAndLogout();
        navigate('/pentadbir');
      });
    return () => setLoginInfo({});
  }, []);

  return (
    <>
      <AdminHeader
        isLoggedIn={loginInfo.isLoggedIn}
        daerah={loginInfo.daerah}
        kp={loginInfo.kp}
        user={loginInfo.username}
        accountType={loginInfo.accountType}
      />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <AdminNavbar accountType={loginInfo.accountType} />
      <div className='absolute inset-10 top-[8rem] -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize overflow-y-auto overflow-x-hidden pb-5 px-3'>
        <Routes>
          <Route
            index
            element={
              <AdminCenterStage
                user={loginInfo.username}
                accountType={loginInfo.accountType}
              />
            }
          />
          <Route path='klinik' element={<Klinik />} />
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
          <Route
            path='event'
            element={<Data FType='event' kp={loginInfo.kp} />}
          />
          <Route path='tetapan' element={<Settings />} />
          <Route path='*' element={<AdminLoggedInNotFound />} />
        </Routes>
      </div>
      <AdminFooter />
      <ToastContainer />
    </>
  );
}
