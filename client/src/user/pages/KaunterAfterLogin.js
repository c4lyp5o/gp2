import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import UserHeader from '../components/UserHeader';
import KaunterNavbar from '../components/KaunterNavbar';
import KaunterHeaderLoggedIn from '../components/KaunterHeaderLoggedIn';
import KaunterLanding from '../components/KaunterLanding';
import Kaunter from './Kaunter';
import UserFooter from '../components/UserFooter';

import { useState } from 'react';

import { useGlobalUserAppContext } from '../context/userAppContext';
import { useEffect } from 'react';

function KaunterAfterLogin() {
  const { ToastContainer, kaunterToken, navigate, catchAxiosErrorAndLogout } =
    useGlobalUserAppContext();

  const [createdByKp, setCreatedByKp] = useState('');
  const [createdByDaerah, setCreatedByDaerah] = useState('');
  const [createdByNegeri, setCreatedByNegeri] = useState('');

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
        navigate('/kaunter');
      }
    };
    fetchIdentity();
  }, []);

  const logout = () => {
    catchAxiosErrorAndLogout();
    navigate('/kaunter');
  };

  return (
    <>
      <ToastContainer />
      <UserHeader />
      <div className='absolute inset-0 -z-10 bg-user5'></div>
      <KaunterNavbar />
      <KaunterHeaderLoggedIn namaKlinik={createdByKp} logout={logout} />
      <div className='absolute inset-10 top-[8rem] -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize'>
        <Routes>
          <Route index element={<KaunterLanding />} />

          <Route
            path='klinik'
            element={
              <Kaunter
                jenisFasiliti='klinik'
                createdByKp={createdByKp}
                createdByDaerah={createdByDaerah}
                setCreatedByNegeri={createdByNegeri}
              />
            }
          />
          {/* <Route
            path='form-umum/:personUmumId'
            element={<UserFormUmumHeader />}
          /> */}

          <Route
            path='kkkd'
            element={() => {
              // setJenisFasiliti('kkkd');
              <Kaunter jenisFasiliti='kkkd' />;
            }}
          />
          {/* <Route
            path='form-sekolah/:personSekolahId'
            element={<UserFormSekolahHeader />}
          /> */}

          <Route
            path='tastad'
            element={() => {
              // setJenisFasiliti('tastad');
              <Kaunter jenisFasiliti='tastad' />;
            }}
          />
          {/* <Route
            path='form-sekolah/:personSekolahId'
            element={<UserFormSekolahHeader />}
          /> */}

          <Route
            path='ipt'
            element={() => {
              // setJenisFasiliti('ipt');
              <Kaunter jenisFasiliti='ipt' />;
            }}
          />
          {/* <Route
            path='form-sekolah/:personSekolahId'
            element={<UserFormSekolahHeader />}
          /> */}

          <Route
            path='outreach'
            element={() => {
              // setJenisFasiliti('outreach');
              <Kaunter jenisFasiliti='outreach' />;
            }}
          />
          {/* <Route
            path='form-sekolah/:personSekolahId'
            element={<UserFormSekolahHeader />}
          /> */}

          {/* <Route path='status-harian' element={<UserStatusHarian />} /> */}
          {/* <Route path='generate-individu' element={<UserGenerateIndividu />} /> */}
          {/* <Route path='generate-klinik' element={<UserGenerateKlinik />} /> */}

          {/* <Route path='carian' element={<UserCarian />} /> */}

          {/* <Route path='*' element={<UserLoggedInNotFound />} /> */}
        </Routes>
      </div>
      <UserFooter />
    </>
  );
}

export default KaunterAfterLogin;
