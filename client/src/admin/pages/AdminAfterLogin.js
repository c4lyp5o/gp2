import { useEffect, useState, useRef } from 'react';

import { Routes, Route } from 'react-router-dom';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

// -----------------------------------------------------------

// logged in
import Header from '../components/Header';
import Navbar from '../components/Navbar';

// paparan utama
import AdminCenterStage from '../components/superadmin/AdminCenterStage';
import KpCenterStage from '../components/admin-kp/KpCenterStage';

// negeri details
import Negeri from '../components/superadmin/NegeriDetails';

// daerah details
import Daerah from '../components/superadmin/DaerahDetails';

// klinik details
import Klinik from '../components/superadmin/KlinikDetails';

// logged in not found
import AdminLoggedInNotFound from './AdminLoggedInNotFound';

import Footer from '../components/Footer';
// -----------------------------------------------------------

import Data from '../components/superadmin/Data';
import DataKp from '../components/admin-kp/Data';

// settings
import Settings from '../components/superadmin/Settings';

// generate
import Generate from '../components/superadmin/Generate';
import GenerateKp from '../components/admin-kp/Generate';

//ad hoc query
import AdHocQuery from '../components/superadmin/AdHocQuery';

import { LoadingSuperDark } from '../components/Screens';

import { toast, ToastContainer } from 'react-toastify';

export default function AdminAfterLogin() {
  const { getCurrentUser, adminToken, logOutUser } = useGlobalAdminAppContext();

  const [loginInfo, setLoginInfo] = useState(null);
  const [kickerNoti, setKickerNoti] = useState(null);
  const [kicker, setKicker] = useState(null);
  const kickerNotiId = useRef();
  const [timer, setTimer] = useState(null);

  const logOutNotiSystem = () => {
    const notifyLogOut = () =>
      (kickerNotiId.current = toast.warning(
        `Log keluar dalam masa ${
          process.env.REACT_APP_LOGOUT_TIME / 2
        } minit lagi. KLIK NOTIFIKASI INI SEKIRANYA INGIN KEKAL DI DALAM SISTEM`,
        {
          autoClose: 1000 * 60 * (process.env.REACT_APP_LOGOUT_TIME / 2),
          pauseOnHover: false,
          onClick: () => {
            window.location.reload();
          },
        }
      ));

    const dismissLogOut = () => toast.dismiss(kickerNotiId.current);

    if (kicker && kickerNoti) {
      clearTimeout(kickerNoti);
      clearTimeout(kicker);
      dismissLogOut();
    }

    const kickerNotiNumber = setTimeout(() => {
      notifyLogOut();
    }, 1000 * 60 * (parseInt(process.env.REACT_APP_LOGOUT_TIME) / 2));

    const kickerNumber = setTimeout(() => {
      logOutUser();
    }, 1000 * 60 * parseInt(process.env.REACT_APP_LOGOUT_TIME));

    setKickerNoti(kickerNotiNumber);
    setKicker(kickerNumber);

    const logOutTime = parseInt(process.env.REACT_APP_LOGOUT_TIME) * 60 * 1000;
    const nowMinutes = new Date().getTime();

    // waktu skrg + env minutes
    const real = nowMinutes + logOutTime;
    setTimer(real);
  };

  const props = {
    timer,
    loginInfo,
    setLoginInfo,
    logOutNotiSystem,
    kicker,
    kickerNoti,
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser();
      setLoginInfo({
        ...res.data,
        isLoggedIn: true,
      });
      logOutNotiSystem();
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
      <Header {...props} />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <Navbar {...props} />
      <div className='absolute inset-10 top-[8rem] -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize overflow-y-auto overflow-x-hidden pb-5 px-3'>
        <Routes>
          <Route path='followers' element={<DataKp FType='followers' />} />
          <Route path='sosmed' element={<DataKp FType='sosmed' />} />
          {/* daerah, negeri, hq superadmin */}
          {loginInfo.accountType !== 'kpUser' ? (
            <>
              <Route index element={<AdminCenterStage {...props} />} />
              <Route path='negeri' element={<Negeri />} />
              <Route path='daerah' element={<Daerah />} />
              <Route path='klinik' element={<Klinik />} />
              <Route path='kkiakd' element={<Data FType='kkiakd' />} />
              <Route path='kp' element={<Data FType='kp' />} />
              <Route path='pp' element={<Data FType='pp' />} />
              <Route path='jp' element={<Data FType='jp' />} />
              <Route path='taska' element={<Data FType='taska' />} />
              <Route path='tadika' element={<Data FType='tadika' />} />
              <Route path='sr' element={<Data FType='sr' />} />
              <Route path='sm' element={<Data FType='sm' />} />
              <Route path='program' element={<Data FType='program' />} />
              <Route path='kpb' element={<Data FType='kpb' />} />
              <Route path='mpb' element={<Data FType='mpb' />} />
              <Route path='tetapan' element={<Settings />} />
              <Route path='generate' element={<Generate {...props} />} />
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
              <Route path='kp/pp' element={<DataKp FType='pp' />} />
              <Route path='kp/jp' element={<DataKp FType='jp' />} />
              <Route path='kp/tastad' element={<DataKp FType='tastad' />} />
              <Route path='kp/program' element={<DataKp FType='program' />} />
              <Route path='kp/kpb' element={<DataKp FType='kpb' />} />
              <Route path='kp/mpb' element={<DataKp FType='mpb' />} />
              {/* <Route path='kp/generate' element={<GenerateKp {...props} />} /> */}
            </>
          ) : null}
          <Route path='*' element={<AdminLoggedInNotFound />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
