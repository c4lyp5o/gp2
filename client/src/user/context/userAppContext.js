import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { gql } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';

const storageUserToken = localStorage.getItem('userToken');
const storageUsername = localStorage.getItem('username');
const storageFasilitiRelief = localStorage.getItem('fasilitiRelief');

const storageKaunterToken = localStorage.getItem('kaunterToken');

// get a date for today
const rawToday = new Date();
const dd = String(rawToday.getDate()).padStart(2, '0');
const mm = String(rawToday.getMonth() + 1).padStart(2, '0');
const yyyy = rawToday.getFullYear();
const dateToday = yyyy + '-' + mm + '-' + dd;

const UserAppContext = React.createContext();

function UserAppProvider({ children }) {
  const [userToken, setUserToken] = useState(storageUserToken);
  const [username, setUsername] = useState(storageUsername);
  const [fasilitiRelief, setFasilitiRelief] = useState(storageFasilitiRelief);

  const [kaunterToken, setKaunterToken] = useState(storageKaunterToken);

  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [isLoginError, setIsLoginError] = useState(false);

  const [displayLoginForm, setDisplayLoginForm] = useState(true);
  const [displayPilihNama, setDisplayPilihNama] = useState(false);
  const [displayPilihFasiliti, setDisplayPilihFasiliti] = useState(false);

  const navigate = useNavigate();

  const loginUser = async ({ username, password }) => {
    try {
      const { data } = await axios.post('/api/v1/auth/login', {
        username,
        password,
      });
      localStorage.setItem('userToken', data.userToken);
      setUserToken(data.userToken);
      setDisplayLoginForm(false);
      setDisplayPilihNama(true);
    } catch (error) {
      catchAxiosErrorAndLogout();
      setLoginErrorMessage(error.response.data.msg);
      setIsLoginError(true);
      setTimeout(() => {
        setIsLoginError(false);
      }, 3000);
      navigate('/');
    }
  };

  const loginKaunter = async ({ username, password }) => {
    try {
      const { data } = await axios.post('/api/v1/auth/kaunter/login', {
        username,
        password,
      });
      localStorage.setItem('kaunterToken', data.kaunterToken);
      setKaunterToken(data.kaunterToken);
      navigate('/kaunter/daftar');
    } catch (error) {
      catchAxiosErrorAndLogout();
      setLoginErrorMessage(error.response.data.msg);
      setIsLoginError(true);
      setTimeout(() => {
        setIsLoginError(false);
      }, 3000);
      navigate('/kaunter');
    }
  };

  const catchAxiosErrorAndLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    localStorage.removeItem('fasilitiRelief');
    localStorage.removeItem('kaunterToken');
    setUserToken(null);
    setUsername(null);
    setFasilitiRelief(null);
    setKaunterToken(null);
  };

  const Dictionary = {
    kp: 'Klinik Pergigian',
    'kk-kd': 'Klinik Kesihatan / Klinik Desa',
    'taska-tadika': 'Taska / Tadika',
    'ipt-kolej': 'IPT / Kolej',
    'orang-asli': 'Orang Asli',
    ppr: 'PPR',
    'institusi-warga-emas': 'Institusi Warga Emas',
    'institusi-oku': 'Institusi OKU',
    'kampung-angkat': 'Kampung Angkat',
    'projek-komuniti-lain': 'Projek Komuniti Lain',
    // 'rtc-kelantan': 'RTC (Kelantan Sahaja)',
  };

  return (
    <UserAppContext.Provider
      value={{
        userToken,
        username,
        setUsername,
        fasilitiRelief,
        setFasilitiRelief,
        kaunterToken,
        loginErrorMessage,
        isLoginError,
        displayLoginForm,
        setDisplayLoginForm,
        displayPilihNama,
        setDisplayPilihNama,
        displayPilihFasiliti,
        setDisplayPilihFasiliti,
        navigate,
        loginUser,
        loginKaunter,
        catchAxiosErrorAndLogout,
        Dictionary,
        useParams,
        dateToday,
        ToastContainer,
        toast,
      }}
    >
      {children}
    </UserAppContext.Provider>
  );
}

const useGlobalUserAppContext = () => {
  return useContext(UserAppContext);
};

export { UserAppProvider, useGlobalUserAppContext };
