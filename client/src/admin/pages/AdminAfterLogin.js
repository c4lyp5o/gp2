import { useEffect, useState, useRef } from 'react';

import { Routes, Route } from 'react-router-dom';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

// -----------------------------------------------------------

// logged in
import AdminHeader from '../components/AdminHeader';
import AdminNavbar from '../components/AdminNavbar';

// paparan utama
import AdminCenterStage from '../components/AdminCenterStage';
import KpCenterStage from '../components/admin-kp/KpCenterStage';

// klinik details
import Klinik from '../components/Klinik';

// logged in not found
import AdminLoggedInNotFound from './AdminLoggedInNotFound';

import AdminFooter from '../components/AdminFooter';
// -----------------------------------------------------------

import Data from '../components/Data';
import DataKp from '../components/admin-kp/Data';

// settings
import Settings from '../components/Settings';

//ad hoc query
import AdHocQuery from '../components/AdHocQuery';

import { LoadingSuperDark } from '../components/Loading';

import { toast, ToastContainer } from 'react-toastify';

export default function AdminAfterLogin() {
  const { getCurrentUser, adminToken, logOutUser } = useGlobalAdminAppContext();
  const [loginInfo, setLoginInfo] = useState(null);
  const [kicker, setKicker] = useState('');
  const [kickerNoti, setKickerNoti] = useState('');
  const kickerNotiId = useRef();
  const [timer, setTimer] = useState(null);

  const logOutNotiSystem = () => {
    const notifyLogOut = () =>
      (kickerNotiId.current = toast(
        `Anda sudah tidak aktif selama ${
          process.env.REACT_APP_LOGOUT_TIME / 2
        } minit. Proses log keluar akan dilakukan dalam masa ${
          process.env.REACT_APP_LOGOUT_TIME / 2
        } minit. Jika anda ingin log keluar sekarang, klik di sini`,
        {
          autoClose: 1000 * 60 * (process.env.REACT_APP_LOGOUT_TIME / 2),
          onClick: () => {
            logOutUser();
            clearTimeout(kicker);
          },
        }
      ));
    const dismissLogOut = () => toast.dismiss(kickerNotiId.current);

    if (kicker && kickerNoti) {
      dismissLogOut();
      clearTimeout(kicker);
      clearTimeout(kickerNoti);
    }
    const kickerNotiNumber = setTimeout(() => {
      notifyLogOut();
    }, 1000 * 60 * (process.env.REACT_APP_LOGOUT_TIME / 2));
    const kickerNumber = setTimeout(() => {
      logOutUser();
    }, 1000 * 60 * process.env.REACT_APP_LOGOUT_TIME);
    setKicker(kickerNumber);
    setKickerNoti(kickerNotiNumber);
  };

  const props = {
    timer,
    loginInfo,
    setLoginInfo,
    logOutNotiSystem,
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser();
      setLoginInfo({
        ...res.data,
        isLoggedIn: true,
      });
      logOutNotiSystem();
      const logOutTime =
        parseInt(process.env.REACT_APP_LOGOUT_TIME) * 60 * 1000;
      const nowMinutes = new Date().getTime();
      const real = nowMinutes + logOutTime;
      setTimer(real);
    };
    getUser().catch((err) => {
      console.log(err);
      logOutUser();
    });
  }, [adminToken, getCurrentUser]);

  if (!loginInfo) {
    return <LoadingSuperDark />;
  }

  return (
    <>
      <AdminHeader {...props} />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <AdminNavbar {...props} />
      <div className='absolute inset-10 top-[8rem] -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize overflow-y-auto overflow-x-hidden pb-5 px-3'>
        <Routes>
          {/* daerah, negeri, hq superadmin */}
          {loginInfo.accountType !== 'kpUser' ? (
            <>
              <Route index element={<AdminCenterStage {...props} />} />
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
              <Route path='tetapan' element={<Settings />} />
              {/* AdHoc Query thanks myhdw! */}
              <Route
                path='aq'
                element={
                  <DndProvider backend={HTML5Backend}>
                    <AdHocQuery />
                  </DndProvider>
                }
              />
            </>
          ) : null}
          {/* KP superadmin */}
          {loginInfo.accountType === 'kpUser' ? (
            <>
              <Route index element={<KpCenterStage {...props} />} />
              <Route path='kp/program' element={<DataKp FType='program' />} />
              <Route path='kp/sosmed' element={<DataKp FType='sosmed' />} />
              <Route path='kp/tastad' element={<DataKp FType='tastad' />} />
              <Route path='kp/pp' element={<DataKp FType='pp' />} />
              <Route path='kp/jp' element={<DataKp FType='jp' />} />
              <Route path='kp/institusi' element={<DataKp FType='ins' />} />
            </>
          ) : null}
          <Route path='*' element={<AdminLoggedInNotFound />} />
        </Routes>
      </div>
      <AdminFooter />
      <ToastContainer />
    </>
  );
}
