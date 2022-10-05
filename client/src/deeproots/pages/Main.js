import { useEffect, useState } from 'react';

import { Routes, Route } from 'react-router-dom';

import { useGlobalDeeprootsContext } from '../context/deeprootsAppContext';

// -----------------------------------------------------------

// logged in
import Header from '../components/Header';
// import AdminNavbar from '../components/AdminNavbar';
// paparan utama
import Query from '../components/Query';
// klinik
// pegawai
// jp
// data for facility
// logged in not found
import Fourohfour from './404';

import Footer from '../components/Footer';
// -----------------------------------------------------------

// import Data from '../components/Data';

import { ToastContainer } from 'react-toastify';

export default function Main() {
  const { navigate, getCurrentUser, catchAxiosErrorAndLogout } =
    useGlobalDeeprootsContext();

  const [loginInfo, setLoginInfo] = useState({
    isLoggedIn: false,
    username: '',
    daerah: '',
    negeri: '',
  });

  const tempData = localStorage.getItem('deeprootsToken');
  const token = JSON.parse(tempData);

  useEffect(() => {
    // getCurrentUser()
    //   .then((res) => {
    //     setLoginInfo({
    //       isLoggedIn: true,
    //       username: res.data.username,
    //       daerah: res.data.daerah,
    //       negeri: res.data.negeri,
    //     });
    //   })
    //   .catch(() => {
    //     setLoginInfo({
    //       isLoggedIn: false,
    //     });
    //     catchAxiosErrorAndLogout();
    //     navigate('/admin');
    //   });
    console.log('deeproots after login');
  }, []);

  //   if (!token) {
  //     return <AdminLoginForm />;
  //   }

  return (
    <>
      <Header status={token} />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <div className='absolute inset-10 top-[8rem] -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize overflow-y-auto overflow-x-hidden pb-5'>
        <Routes>
          <Route index element={<Query />} />
          {/* <Route path='kp' element={<Data FType='kp' />} />
          <Route path='pp' element={<Data FType='pp' />} />
          <Route path='jp' element={<Data FType='jp' />} />
          <Route path='taska' element={<Data FType='taska' />} />
          <Route path='tadika' element={<Data FType='tadika' />} />
          <Route path='sr' element={<Data FType='sr' />} />
          <Route path='sm' element={<Data FType='sm' />} />
          <Route path='ins' element={<Data FType='ins' />} />
          <Route path='kpb' element={<Data FType='kpb' />} />
          <Route path='mp' element={<Data FType='mp' />} /> */}
          <Route path='*' element={<Fourohfour />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
