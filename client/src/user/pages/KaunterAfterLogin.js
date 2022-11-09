import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import KaunterHeader from '../components/KaunterHeader';
import KaunterNavbar from '../components/KaunterNavbar';
import KaunterHeaderLoggedIn from '../components/KaunterHeaderLoggedIn';
import KaunterLanding from '../components/KaunterLanding';
import Kaunter from '../components/Kaunter';
import KaunterDaftarPesakit from '../components/KaunterDaftarPesakit';
import KaunterFooter from '../components/KaunterFooter';

import { useState, useEffect } from 'react';

import { useGlobalUserAppContext } from '../context/userAppContext';

function KaunterAfterLogin() {
  const { ToastContainer, kaunterToken, navigate, catchAxiosErrorAndLogout } =
    useGlobalUserAppContext();

  const [createdByKp, setCreatedByKp] = useState('');
  const [createdByDaerah, setCreatedByDaerah] = useState('');
  const [createdByNegeri, setCreatedByNegeri] = useState('');
  const [timer, setTimer] = useState(0);
  const [refreshTimer, setRefreshTimer] = useState(false);

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
    countdownTimer();
  }, [refreshTimer]);

  const countdownTimer = () => {
    const logOutTime = parseInt(process.env.REACT_APP_LOGOUT_TIME) * 60 * 1000;
    const nowMinutes = new Date().getTime();
    const real = nowMinutes + logOutTime;
    setTimer(real);
  };

  const logout = () => {
    catchAxiosErrorAndLogout();
    navigate('/pendaftaran');
  };

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
                setCreatedByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='kk-kd'
            element={
              <Kaunter
                jenisFasiliti='kk-kd'
                refreshTimer={refreshTimer}
                setRefreshTimer={setRefreshTimer}
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                setCreatedByNegeri={createdByNegeri}
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
                setCreatedByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='ipt-kolej'
            element={
              <Kaunter
                jenisFasiliti='ipt-kolej'
                refreshTimer={refreshTimer}
                setRefreshTimer={setRefreshTimer}
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                setCreatedByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='orang-asli'
            element={
              <Kaunter
                jenisFasiliti='orang-asli'
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                setCreatedByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='ppr'
            element={
              <Kaunter
                jenisFasiliti='ppr'
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                setCreatedByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='institusi-warga-emas'
            element={
              <Kaunter
                jenisFasiliti='institusi-warga-emas'
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                setCreatedByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='institusi-oku'
            element={
              <Kaunter
                jenisFasiliti='institusi-oku'
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                setCreatedByNegeri={createdByNegeri}
              />
            }
          />
          <Route
            path='kampung-angkat'
            element={
              <Kaunter
                jenisFasiliti='kampung-angkat'
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                setCreatedByNegeri={createdByNegeri}
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
                setCreatedByNegeri={createdByNegeri}
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
          {/* <Route
            path='rtc-kelantan'
            element={
              <Kaunter
                jenisFasiliti='rtc-kelantan'
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                setCreatedByNegeri={createdByNegeri}
              />
            }
          /> */}
        </Routes>
      </div>
      <KaunterFooter />
    </>
  );
}

export default KaunterAfterLogin;
