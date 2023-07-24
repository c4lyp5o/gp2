import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import KaunterHeader from '../components/KaunterHeader';
import KaunterNavbar from '../components/KaunterNavbar';
import KaunterHeaderLoggedIn from '../components/KaunterHeaderLoggedIn';
import KaunterLanding from '../components/KaunterLanding';
import Kaunter from '../components/Kaunter';
import MyVas from '../components/pt-registration/MyVas';
import MyVasCallback from '../components/pt-registration/MyVasCallback';
import KaunterDaftarPesakit from '../components/KaunterDaftarPesakit';
import KaunterLoggedInNotFound from './KaunterLoggedInNotFound';
import KaunterFooter from '../components/KaunterFooter';

import { useGlobalUserAppContext } from '../context/userAppContext';

function KaunterAfterLogin() {
  const {
    kaunterToken,
    myVasToken,
    myVasIdToken,
    navigate,
    catchAxiosErrorAndLogout,
    refetchDateTime,
    setRefetchDateTime,
    ToastContainer,
    toast,
  } = useGlobalUserAppContext();

  const [createdByKp, setCreatedByKp] = useState('');
  const [createdByDaerah, setCreatedByDaerah] = useState('');
  const [createdByNegeri, setCreatedByNegeri] = useState('');
  const [timer, setTimer] = useState(0);
  const [refreshTimer, setRefreshTimer] = useState(false);
  const [kicker, setKicker] = useState(null);
  const [kickerNoti, setKickerNoti] = useState(null);

  const [patientDataFromMyVas, setPatientDataFromMyVas] = useState({});
  const [dariMyVas, setDariMyVas] = useState(false);
  const [masaTemujanji, setMasaTemujanji] = useState('');
  const [queryingMyVas, setQueryingMyVas] = useState(false);

  const kickerNotiId = useRef();

  const handleSubmitMyVas = async (identifier, timeslot) => {
    setQueryingMyVas(true);
    try {
      const response = await axios.get(
        `/api/v1/myvas/patient-details?identifier=${identifier}`,
        {
          headers: {
            Authorization: `Bearer ${kaunterToken} ${
              myVasToken ? myVasToken : ''
            }`,
          },
        }
      );
      if (
        response &&
        response.data.next_status &&
        response.data.next_status >= 400 &&
        response.data.next_status <= 599
      ) {
        if (response.data.redirect_uri) {
          window.location.href = response.data.redirect_uri;
          return;
        }
      }
      setPatientDataFromMyVas(response.data.entry[0]);
      setMasaTemujanji(timeslot);
      setDariMyVas(true);
      setQueryingMyVas(false);
    } catch (error) {
      toast.error('Log masuk ke MyVAS gagal');
      setQueryingMyVas(false);
      navigate('/pendaftaran/daftar/kp');
    }
  };

  const logOutNotiSystem = () => {
    const notifyLogOut = () =>
      (kickerNotiId.current = toast.warning(
        `Log keluar dalam masa ${
          import.meta.env.VITE_LOGOUT_TIME / 2
        } minit lagi. KLIK NOTIFIKASI INI SEKIRANYA INGIN KEKAL DI DALAM SISTEM`,
        {
          autoClose: 1000 * 60 * (import.meta.env.VITE_LOGOUT_TIME / 2),
          pauseOnHover: false,
          onClick: () => {
            window.location.reload();
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
    }, 1000 * 60 * (parseInt(import.meta.env.VITE_LOGOUT_TIME_PENDAFTARAN) / 2));

    const kickerNumber = setTimeout(() => {
      logout();
    }, 1000 * 60 * parseInt(import.meta.env.VITE_LOGOUT_TIME_PENDAFTARAN));

    setKickerNoti(kickerNotiNumber);
    setKicker(kickerNumber);

    const logOutTime =
      parseInt(import.meta.env.VITE_LOGOUT_TIME_PENDAFTARAN) * 60 * 1000;
    const nowMinutes = new Date().getTime();

    // waktu skrg + env minutes
    const real = nowMinutes + logOutTime;
    setTimer(real);
  };

  const logout = async () => {
    clearTimeout(kicker);
    clearTimeout(kickerNoti);
    try {
      await axios.get('/api/v1/myvas/logout', {
        headers: {
          Authorization: `Bearer ${kaunterToken} ${
            myVasToken ? myVasToken : ''
          } ${myVasIdToken ? myVasIdToken : ''}`,
        },
      });
      catchAxiosErrorAndLogout();
      navigate('/pendaftaran');
    } catch (error) {
      catchAxiosErrorAndLogout();
      navigate('/pendaftaran');
    }
  };

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const { data } = await axios.get('/api/v1/identity', {
          headers: { Authorization: `Bearer ${kaunterToken}` },
        });
        setCreatedByKp(data.kp);
        setCreatedByDaerah(data.daerah);
        setCreatedByNegeri(data.negeri);
      } catch (error) {
        catchAxiosErrorAndLogout();
        navigate('/pendaftaran');
      }
    };
    fetchIdentity();
  }, []);

  useEffect(() => {
    logOutNotiSystem();
    setRefetchDateTime(!refetchDateTime);
  }, [refreshTimer]);

  return (
    <>
      <ToastContainer />
      <KaunterHeader />
      <div className='absolute inset-0 -z-10 bg-kaunter3'></div>
      <KaunterNavbar />
      <KaunterHeaderLoggedIn
        namaKlinik={createdByKp}
        timer={timer}
        logout={logout}
        kickerNumber={kicker}
        kickerNotiNumber={kickerNoti}
      />
      <div className='absolute inset-2 top-[7.5rem] bottom-[2rem] -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize overflow-y-auto overflow-x-hidden'>
        <Routes>
          <Route index element={<KaunterLanding />} />
          <Route
            path='kp'
            element={
              <Kaunter
                jenisFasiliti='kp'
                refreshTimer={refreshTimer}
                setRefreshTimer={setRefreshTimer}
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                createdByNegeri={createdByNegeri}
                dariMyVas={dariMyVas}
                setDariMyVas={setDariMyVas}
                patientDataFromMyVas={patientDataFromMyVas}
                masaTemujanji={masaTemujanji}
                queryingMyVas={queryingMyVas}
              />
            }
          />
          {import.meta.env.VITE_ENV === 'UNSTABLE' ||
          import.meta.env.VITE_ENV === 'DEV' ? (
            <>
              <Route
                path='kp/myvas'
                element={<MyVas handleSubmitMyVas={handleSubmitMyVas} />}
              />
              <Route path='kp/callback' element={<MyVasCallback />} />
            </>
          ) : null}
          <Route
            path='kk-kd'
            element={
              <Kaunter
                jenisFasiliti='kk-kd'
                refreshTimer={refreshTimer}
                setRefreshTimer={setRefreshTimer}
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                createdByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='taska-tadika'
            element={
              <Kaunter
                jenisFasiliti='taska-tadika'
                refreshTimer={refreshTimer}
                setRefreshTimer={setRefreshTimer}
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                createdByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='projek-komuniti-lain'
            element={
              <Kaunter
                jenisFasiliti='projek-komuniti-lain'
                refreshTimer={refreshTimer}
                setRefreshTimer={setRefreshTimer}
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                createdByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='registry'
            element={
              <KaunterDaftarPesakit
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                createdByNegeri={createdByNegeri}
              />
            }
          />
          <Route path='*' element={<KaunterLoggedInNotFound />} />
        </Routes>
      </div>
      <KaunterFooter />
    </>
  );
}

export default KaunterAfterLogin;
