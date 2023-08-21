import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useOndemandSetting } from '../context/useOndemandSetting';
import { useLogininfo } from '../context/useLogininfo';
// ! belum digunakan setakat 16/08/2023
// import { useToken } from '../context/useToken';

// component -----------------------------------------------------------
// header & navbar
import Header from '../components/Header';
import Navbar from '../components/Navbar';

// screen
import { Loading } from '../components/Screens';

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
const Negeri = lazy(() =>
  import('../components/superadmin/detailed-data/NegeriDetails')
);

// daerah details
const Daerah = lazy(() =>
  import('../components/superadmin/detailed-data/DaerahDetails')
);

// klinik details
const Klinik = lazy(() =>
  import('../components/superadmin/detailed-data/KlinikDetails')
);

// data -----------------------------------------------------------
const DataNegeri = lazy(() =>
  import('../components/superadmin/maklumat-untuk-negeri/Data')
);
const Data = lazy(() => import('../components/superadmin/Data'));
const DataKp = lazy(() => import('../components/admin-kp/Data'));
const DataSosmed = lazy(() => import('../components/sosmed/Data'));

// maklumat asas daerah
const MaklumatAsasDaerah = lazy(() =>
  import('../components/superadmin/maklumat-asas-daerah/MaklumatAsasDaerah')
);

// agensi luar
const ProgramGTodDaerah = lazy(() =>
  import('../components/superadmin/agensi-luar/ProgramGTod')
);
const ProgramWargaEmasDaerah = lazy(() =>
  import('../components/superadmin/agensi-luar/ProgramWargaEmas')
);

// settings
const Settings = lazy(() => import('../components/superadmin/Settings'));

// generate
const Generate = lazy(() => import('../components/superadmin/Generate'));
const GenerateKp = lazy(() => import('../components/admin-kp/Generate'));

// ondemand setting
const OndemandSetting = lazy(() =>
  import('../components/superadmin/ondemand/OndemandSetting')
);

// disabled admin page
const DisabledAdminPage = lazy(() => import('../pages/AdminDisabled'));

//ad hoc query
const AdHocQuery = lazy(() =>
  import('../components/superadmin/adhoc-query/AdHocQuery')
);

function AdminAfterLogin() {
  // ! belum digunakan setakat 16/08/2023
  // const { getAdminToken, setAdminToken } = useToken();
  const {
    saveCurrentondemandSetting,
    currentOndemandSetting,
    readOndemandSetting,
  } = useOndemandSetting();
  const { saveLoginInfo, loginInfo } = useLogininfo();
  const { getCurrentUser, logOutUser } = useGlobalAdminAppContext();

  const [kickerNoti, setKickerNoti] = useState(null);
  const [kicker, setKicker] = useState(null);
  const kickerNotiId = useRef();
  const [timer, setTimer] = useState(null);

  // ! belum digunakan setakat 16/08/2023
  // const [refetchState, setRefetchState] = useState(false);

  const init = useRef(false);

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

  const adminPageInit = async () => {
    const { data: currentUserInfo } = await getCurrentUser();
    const { data } = await readOndemandSetting();
    const { currentOndemandSetting } = data;
    saveLoginInfo({
      ...currentUserInfo,
      isLoggedIn: true,
    });
    saveCurrentondemandSetting({ ...currentOndemandSetting });
  };

  const adminPageOndemandRefresh = async () => {
    const { data } = await readOndemandSetting();
    const { currentOndemandSetting } = data;
    saveCurrentondemandSetting({ ...currentOndemandSetting });
  };

  const props = {
    timer,
    logOutNotiSystem,
    kicker,
    kickerNoti,
  };

  // init
  // useEffect(() => {
  //   if (init.current === false) {
  //     console.log('page init');
  //     adminPageInit()
  //       .catch((err) => {
  //         console.log(err);
  //         logOutUser();
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //         logOutNotiSystem();
  //       });
  //     setTimeout(() => {
  //       init.current = true;
  //     }, 2000);
  //   }
  // }, [adminToken]);

  // refetch identity
  // ! belum digunakan setakat 16/8/2023
  // useEffect(() => {
  //   const refetchIdentity = () => {
  //     setAdminToken(getAdminToken());
  //     {
  //       import.meta.env.VITE_ENV === 'DEV' &&
  //         console.log('refetch identity admin');
  //     }
  //   };
  //   if (init.current === true) {
  //     refetchIdentity();
  //   }
  // }, [refetchState]);

  // refresh logOutNotiSystem and currentOndemandSetting on path change
  useEffect(() => {
    if (init.current === true) {
      adminPageOndemandRefresh().then(() => {
        logOutNotiSystem();
      });
    }
  }, [window.location.pathname]);

  // TODO needs rework because refetch identity not working if token tempered
  // page init and activate event listener refetch indentity on tab focus
  useEffect(() => {
    if (init.current === false) {
      try {
        adminPageInit().then(() => {
          logOutNotiSystem();
        });
      } catch (err) {
        logOutUser();
        console.error(err);
      }
      // window.addEventListener('focus', setRefetchState);
      // setRefetchState(!refetchState);
      init.current = true;
    }
    return () => {
      // window.removeEventListener('focus', setRefetchState);
      init.current = false;
    };
  }, []);

  if (!loginInfo && !currentOndemandSetting) return <Loading />;

  if (
    loginInfo.accountType !== 'hqSuperadmin' &&
    currentOndemandSetting.adminPage !== true
  ) {
    return (
      <Suspense fallback={<Loading />}>
        <DisabledAdminPage />
      </Suspense>
    );
  }

  return (
    <>
      <Header {...props} />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <Navbar {...props} />
      <div className='absolute inset-2 top-[7.5rem] bottom-[2rem] -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize overflow-y-auto overflow-x-hidden pt-2 pb-2 px-3'>
        <Routes>
          {/* route for all: hq, negeri, daerah, kp superadmin, kp sosmedadmin sharing all these */}
          <Route
            path='followers'
            element={
              <Suspense fallback={<Loading />}>
                <DataSosmed FType='followers' />
              </Suspense>
            }
          />
          <Route
            path='sosmed'
            element={
              <Suspense fallback={<Loading />}>
                <DataSosmed FType='sosmed' />
              </Suspense>
            }
          />
          {/* route landing page, bendera stuff, graph, generate, tetapan untuk hq, negeri, daerah superadmin sahaja */}
          {loginInfo.accountType === 'hqSuperadmin' ||
          loginInfo.accountType === 'negeriSuperadmin' ||
          loginInfo.accountType === 'daerahSuperadmin' ? (
            <>
              <Route
                index
                element={
                  <Suspense fallback={<Loading />}>
                    <AdminCenterStage {...props} />
                  </Suspense>
                }
              />
              <Route
                path='negeri'
                element={
                  <Suspense fallback={<Loading />}>
                    <Negeri />
                  </Suspense>
                }
              />
              <Route
                path='daerah'
                element={
                  <Suspense fallback={<Loading />}>
                    <Daerah />
                  </Suspense>
                }
              />
              <Route
                path='klinik'
                element={
                  <Suspense fallback={<Loading />}>
                    <Klinik />
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
              <Route
                path='tetapan'
                element={
                  <Suspense fallback={<Loading />}>
                    <Settings />
                  </Suspense>
                }
              />
            </>
          ) : null}
          {/* route hq superadmin sahaja */}
          {loginInfo.accountType === 'hqSuperadmin' ? (
            <>
              <Route
                path='ondemand'
                element={
                  <Suspense fallback={<Loading />}>
                    <OndemandSetting />
                  </Suspense>
                }
              />
              {/* AdHoc Query thanks myhdw! */}
              <Route
                path='aq'
                element={
                  <Suspense fallback={<Loading />}>
                    <DndProvider backend={HTML5Backend}>
                      <AdHocQuery />
                    </DndProvider>
                  </Suspense>
                }
              />
            </>
          ) : null}
          {/* route negeri superadmin sahaja */}
          {loginInfo.accountType === 'negeriSuperadmin' ? (
            <>
              <Route
                path='negeri/pp'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataNegeri DType='ppspn' />
                  </Suspense>
                }
              />
              <Route
                path='negeri/jp'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataNegeri DType='jpspn' />
                  </Suspense>
                }
              />
            </>
          ) : null}
          {/* route daerah superadmin sahaja */}
          {loginInfo.accountType === 'daerahSuperadmin' ? (
            <>
              <Route
                path='kp'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='kp' />
                  </Suspense>
                }
              />
              <Route
                path='kkiakd'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='kkiakd' />
                  </Suspense>
                }
              />
              <Route
                path='pp'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='pp' />
                  </Suspense>
                }
              />
              <Route
                path='jp'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='jp' />
                  </Suspense>
                }
              />
              <Route
                path='taska'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='taska' />
                  </Suspense>
                }
              />
              <Route
                path='tadika'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='tadika' />
                  </Suspense>
                }
              />
              <Route
                path='sr'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='sr' />
                  </Suspense>
                }
              />
              <Route
                path='sm'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='sm' />
                  </Suspense>
                }
              />
              <Route
                path='program'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='program' />
                  </Suspense>
                }
              />
              <Route
                path='kpb'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='kpb' />
                  </Suspense>
                }
              />
              <Route
                path='mpb'
                element={
                  <Suspense fallback={<Loading />}>
                    <Data FType='mpb' />
                  </Suspense>
                }
              />
              {import.meta.env.VITE_ENV === 'UNSTABLE' ||
              import.meta.env.VITE_ENV === 'DEV' ? (
                <Route
                  path='maklumat-asas'
                  element={
                    <Suspense fallback={<Loading />}>
                      <MaklumatAsasDaerah />
                    </Suspense>
                  }
                />
              ) : null}
              {import.meta.env.VITE_ENV === 'UNSTABLE' ||
              import.meta.env.VITE_ENV === 'DEV' ? (
                <Route
                  path='program-gtod'
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProgramGTodDaerah />
                    </Suspense>
                  }
                />
              ) : null}
              {import.meta.env.VITE_ENV === 'UNSTABLE' ||
              import.meta.env.VITE_ENV === 'DEV' ? (
                <Route
                  path='program-warga-emas'
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProgramWargaEmasDaerah />
                    </Suspense>
                  }
                />
              ) : null}
            </>
          ) : null}
          {/* route kp superadmin sahaja */}
          {loginInfo.accountType === 'kpUserAdmin' &&
          loginInfo.role === 'admin' ? (
            <>
              <Route
                index
                element={
                  <Suspense fallback={<Loading />}>
                    <KpCenterStage {...props} />
                  </Suspense>
                }
              />
              <Route
                path='kp/pp'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='pp' />
                  </Suspense>
                }
              />
              <Route
                path='kp/jp'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='jp' />
                  </Suspense>
                }
              />
              <Route
                path='kp/tastad'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='tastad' />
                  </Suspense>
                }
              />
              <Route
                path='kp/program'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='program' />
                  </Suspense>
                }
              />
              <Route
                path='kp/kpb'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='kpb' />
                  </Suspense>
                }
              />
              <Route
                path='kp/mpb'
                element={
                  <Suspense fallback={<Loading />}>
                    <DataKp FType='mpb' />
                  </Suspense>
                }
              />
              <Route
                path='kp/generate'
                element={
                  <Suspense fallback={<Loading />}>
                    <GenerateKp {...props} />
                  </Suspense>
                }
              />
            </>
          ) : null}
          {/* route kp sosmedadmin sahaja */}
          {loginInfo.role === 'sosmedadmin' ? (
            <>
              <Route
                index
                element={
                  <Suspense fallback={<Loading />}>
                    <KpCenterStage {...props} />
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
