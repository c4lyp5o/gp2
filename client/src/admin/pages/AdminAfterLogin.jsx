import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

// component -----------------------------------------------------------
// header & navbar
import Header from '../components/Header';
import Navbar from '../components/Navbar';

// screen
import { Loading, LoadingSuperDark } from '../components/Screens';

// logged in not found
import AdminLoggedInNotFound from './AdminLoggedInNotFound';

// footer
import Footer from '../components/Footer';

// paparan utama
const AdminCenterStage = lazy(() =>
  import('../components/superadmin/AdminCenterStage')
);
const KpCenterStage = lazy(() =>
  import('../components/admin-kp/KpCenterStage')
);

// negeri details
const Negeri = lazy(() => import('../components/superadmin/NegeriDetails'));

// daerah details
const Daerah = lazy(() => import('../components/superadmin/DaerahDetails'));

// klinik details
const Klinik = lazy(() => import('../components/superadmin/KlinikDetails'));

// data -----------------------------------------------------------
const DataNegeri = lazy(() => import('../components/superadmin/negeri/Data'));
const Data = lazy(() => import('../components/superadmin/Data'));
const DataKp = lazy(() => import('../components/admin-kp/Data'));

// settings
const Settings = lazy(() => import('../components/superadmin/Settings'));

// generate
const Generate = lazy(() => import('../components/superadmin/Generate'));
const GenerateKp = lazy(() => import('../components/admin-kp/Generate'));

//ad hoc query
// import AdHocQuery from '../components/superadmin/AdHocQuery';

function AdminAfterLogin() {
  const {
    getAdminToken,
    adminToken,
    setAdminToken,
    getCurrentUser,
    logOutUser,
  } = useGlobalAdminAppContext();

  const [loginInfo, setLoginInfo] = useState(null);
  const [kickerNoti, setKickerNoti] = useState(null);
  const [kicker, setKicker] = useState(null);
  const kickerNotiId = useRef();
  const [timer, setTimer] = useState(null);

  const [refetchState, setRefetchState] = useState(false);

  // const init = useRef(false);

  const LOGOUT_TIME = parseInt(import.meta.env.VITE_LOGOUT_TIME);
  const HALF_LOGOUT_TIME = LOGOUT_TIME / 2;
  const WARNING_DURATION = 1000 * 60 * HALF_LOGOUT_TIME;
  const LOGOUT_DURATION = 1000 * 60 * LOGOUT_TIME;

  const logOutNotiSystem = () => {
    const notifyLogOut = () => {
      kickerNotiId.current = toast.warning(
        `Log keluar dalam masa ${HALF_LOGOUT_TIME} minit lagi. KLIK NOTIFIKASI INI SEKIRANYA INGIN KEKAL DI DALAM SISTEM`,
        {
          autoClose: WARNING_DURATION,
          pauseOnHover: false,
          onClick: () => {
            window.location.reload();
          },
        }
      );
    };

    const dismissLogOut = () => {
      toast.dismiss(kickerNotiId.current);
    };

    const clearTimers = () => {
      clearTimeout(kickerNoti);
      clearTimeout(kicker);
    };

    clearTimers();
    dismissLogOut();

    const kickerNotiNumber = setTimeout(notifyLogOut, WARNING_DURATION);
    const kickerNumber = setTimeout(logOutUser, LOGOUT_DURATION);

    setKickerNoti(kickerNotiNumber);
    setKicker(kickerNumber);

    const nowMinutes = new Date().getTime();
    const real = nowMinutes + LOGOUT_DURATION;
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
    };
    getUser().catch((err) => {
      console.log(err);
      logOutUser();
    });
    logOutNotiSystem();
  }, [adminToken]);

  // refetch identity
  useEffect(() => {
    const refetchIdentity = () => {
      setAdminToken(getAdminToken());
      {
        import.meta.env.VITE_ENV === 'DEV' &&
          console.log('refetch identity admin');
      }
    };
    refetchIdentity();
  }, [refetchState]);

  // refetch indentity on tab focus
  useEffect(() => {
    window.addEventListener('focus', setRefetchState);
    setRefetchState(!refetchState);
    return () => {
      window.removeEventListener('focus', setRefetchState);
    };
  }, []);

  if (!loginInfo) {
    return <LoadingSuperDark />;
  }

  return (
    <>
      <Header {...props} />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <Navbar {...props} />
      <div className='absolute inset-2 top-[7.5rem] bottom-[2rem] -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize overflow-y-auto overflow-x-hidden pt-2 pb-2 px-3'>
        <Routes>
          <Route
            path='followers'
            element={
              <Suspense fallback={<Loading />}>
                <DataKp FType='followers' />{' '}
              </Suspense>
            }
          />
          <Route
            path='sosmed'
            element={
              <Suspense fallback={<Loading />}>
                <DataKp FType='sosmed' />{' '}
              </Suspense>
            }
          />
          {/* hq, negeri & daerah superadmin */}
          {loginInfo.accountType !== 'kpUser' ? (
            <>
              <Route
                index
                element={
                  <Suspense fallback={<Loading />}>
                    <AdminCenterStage {...props} />{' '}
                  </Suspense>
                }
              />
              <Route
                path='negeri'
                element={
                  <Suspense fallback={<Loading />}>
                    <Negeri />{' '}
                  </Suspense>
                }
              />
              {/* Data untuk negeri */}
              <Route
                path='negeri/pp'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataNegeri DType='ppspn' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='negeri/jp'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataNegeri DType='jpspn' />{' '}
                  </Suspense>
                }
              />
              {/* Data untuk negeri */}
              <Route
                path='daerah'
                element={
                  <Suspense fallback={<Loading />}>
                    <Daerah />{' '}
                  </Suspense>
                }
              />
              <Route
                path='klinik'
                element={
                  <Suspense fallback={<Loading />}>
                    <Klinik />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kkiakd'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='kkiakd' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kp'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='kp' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='pp'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='pp' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='jp'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='jp' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='taska'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='taska' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='tadika'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='tadika' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='sr'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='sr' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='sm'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='sm' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='program'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='program' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kpb'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='kpb' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='mpb'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='mpb' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='tetapan'
                element={
                  <Suspense fallback={<Loading />}>
                    <Settings />{' '}
                  </Suspense>
                }
              />
              <Route
                path='generate'
                element={
                  <Suspense fallback={<Loading />}>
                    <Generate {...props} />
                  </Suspense>
                }
              />
              {/* AdHoc Query thanks myhdw! */}
              {/* <Route
                path='aq'
                element={
                  <DndProvider backend={HTML5Backend}>
                    <AdHocQuery />
                  </DndProvider>
                }
              /> */}
            </>
          ) : null}
          {/* KP superadmin */}
          {loginInfo.accountType === 'kpUser' ? (
            <>
              <Route
                index
                element={
                  <Suspense fallback={<Loading />}>
                    <KpCenterStage {...props} />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kp/pp'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='pp' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kp/jp'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='jp' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kp/tastad'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='tastad' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kp/program'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='program' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kp/kpb'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='kpb' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kp/mpb'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='mpb' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kp/generate'
                element={
                  <Suspense fallback={<Loading />}>
                    <GenerateKp {...props} />{' '}
                  </Suspense>
                }
              />
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

export default AdminAfterLogin;