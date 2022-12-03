import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';

const storageUserToken = localStorage.getItem('userToken');
const storageUsername = localStorage.getItem('username');
const storageUserinfo = localStorage.getItem('userinfo');
const storageReliefUserToken = localStorage.getItem('reliefUserToken');
const storageFasilitiRelief = localStorage.getItem('fasilitiRelief');

const storageKaunterToken = localStorage.getItem('kaunterToken');

// get a date for today
const rawToday = new Date();
const dd = String(rawToday.getDate()).padStart(2, '0');
const mm = String(rawToday.getMonth() + 1).padStart(2, '0');
const yyyy = rawToday.getFullYear();
const dateToday = yyyy + '-' + mm + '-' + dd;

// format 24 hour time to 12 hour
function formatTime(timeString) {
  const [hourString, minute] = timeString.split(':');
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
}

// split no pendaftaran, return last two array
function noPendaftaranSplitter(noPendaftaran) {
  const arrSplitted = noPendaftaran.split('/');
  const newArrSplitted =
    arrSplitted[arrSplitted.length - 2] +
    '/' +
    arrSplitted[arrSplitted.length - 1];
  return newArrSplitted;
}

// set status pesakit base on umur
function statusPesakit(p) {
  let status = '';
  if (p.umur < 5) {
    status = 'TOD';
  }
  if (p.umur > 4) {
    status = 'UMUM';
  }
  if (p.umur > 59) {
    status = 'WE';
  }
  if (p.bersekolah === true) {
    status = 'SEK';
  }
  if (p.ibuMengandung === true) {
    status += '/';
    status += 'IM';
  }
  if (p.oku === true) {
    status += '/';
    status += 'OKU';
  }
  if (p.statusPesara) {
    status += '/';
    status += 'PES';
  }
  return status;
}

function masterDatePicker({
  selected,
  onChange,
  required,
  filterDate,
  className,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
  minDate,
}) {
  return (
    <DatePicker
      showPopperArrow={false}
      dateFormat='dd/MM/yyyy'
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode='select'
      selected={selected}
      onChange={onChange}
      required={required}
      filterDate={filterDate}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      withPortal={window.matchMedia('(max-width: 400px)').matches}
      onKeyDown={(e) => {
        e.preventDefault();
      }}
      onFocus={(e) => e.target.blur()} // disable keyboad input
      className={className}
    />
  );
}

const Dictionary = {
  kp: 'Klinik Pergigian',
  'kk-kd': 'Klinik Kesihatan / Klinik Desa',
  'taska-tadika': 'Taska / Tadika',
  'ipt-kolej': 'IPT / Kolej',
  'orang-asli': 'Orang Asli',
  ppr: 'Projek Perumahan Rakyat',
  'institusi-warga-emas': 'Institusi Warga Emas',
  'institusi-oku': 'Institusi OKU',
  'kampung-angkat': 'Kampung Angkat',
  'projek-komuniti-lain': 'Projek Komuniti Lain',
  'projek-komuniti': 'Projek Komuniti',
  ppkps: 'Program Pemasyarakatan Perkhidmatan Klinik Pergigian Sekolah',
  kgangkat: 'Kampung Angkat Pergigian',
  we: 'Institusi Warga Emas',
  oku: 'Institusi OKU / PDK',
  oap: 'Program Orang Asli dan Penan',

  // 'rtc-kelantan': 'RTC (Kelantan Sahaja)',
};

const dictionaryDaerah = {
  '': [],
  Johor: [
    'Batu Pahat',
    'Johor Bahru',
    'Kluang',
    'Kota Tinggi',
    'Kulai',
    'Mersing',
    'Muar',
    'Pontian',
    'Segamat',
  ],
  Kedah: [],
  Kelantan: [],
  Melaka: [],
  'Negeri Sembilan': [],
  Pahang: [],
  'Pulau Pinang': [],
  Perak: [],
  Perlis: ['Arau', 'Kangar'],
  Selangor: [],
  Terengganu: [],
  Sabah: [],
  Sarawak: [],
  'Wilayah Persekutuan Kuala Lumpur': [],
  'Wilayah Persekutuan Labuan': [],
  'Wilayah Persekutuan Putrajaya': [],
};

const UserAppContext = React.createContext();

function UserAppProvider({ children }) {
  const [userToken, setUserToken] = useState(storageUserToken);
  const [username, setUsername] = useState(storageUsername);
  const [userinfo, setUserinfo] = useState(JSON.parse(storageUserinfo));
  const [reliefUserToken, setReliefUserToken] = useState(
    storageReliefUserToken
  );
  const [fasilitiRelief, setFasilitiRelief] = useState(storageFasilitiRelief);

  const [kaunterToken, setKaunterToken] = useState(storageKaunterToken);

  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [isLoginError, setIsLoginError] = useState(false);

  const [displayLoginForm, setDisplayLoginForm] = useState(true);
  const [displayPilihNama, setDisplayPilihNama] = useState(false);
  const [displayPilihFasiliti, setDisplayPilihFasiliti] = useState(false);

  const [loggingInUser, setLoggingInUser] = useState(false);
  const [loggingInKaunter, setLoggingInKaunter] = useState(false);

  const [timer, setTimer] = useState(0);
  const [refreshTimer, setRefreshTimer] = useState(false);
  const [kicker, setKicker] = useState(null);
  const [kickerNoti, setKickerNoti] = useState(null);

  const kickerNotiId = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      if (kicker && kickerNoti) {
        clearTimeout(kickerNoti);
        clearTimeout(kicker);
        dismissLogOut();
      }

      const logOutTime =
        parseInt(process.env.REACT_APP_LOGOUT_TIME) * 60 * 1000;
      const nowMinutes = new Date().getTime();

      // waktu skrg + env minutes
      const real = nowMinutes + logOutTime;
      setTimer(real);

      const kickerNotiNumber = setTimeout(() => {
        notifyLogOut();
      }, 1000 * 60 * (parseInt(process.env.REACT_APP_LOGOUT_TIME) / 2));

      const kickerNumber = setTimeout(() => {
        logoutUser();
      }, 1000 * 60 * parseInt(process.env.REACT_APP_LOGOUT_TIME));

      setKickerNoti(kickerNotiNumber);
      setKicker(kickerNumber);

      console.log('user kicker started');
    }
  }, [refreshTimer]);

  const notifyLogOut = () =>
    (kickerNotiId.current = toast.warning(
      `Log keluar dalam masa ${
        parseInt(process.env.REACT_APP_LOGOUT_TIME) / 2
      } minit lagi. KLIK NOTIFIKASI INI SEKIRANYA INGIN KEKAL DI DALAM SISTEM`,
      {
        autoClose:
          1000 * 60 * (parseInt(process.env.REACT_APP_LOGOUT_TIME) / 2),
        pauseOnHover: false,
        onClick: () => {
          window.location.reload();
        },
      }
    ));

  const dismissLogOut = () => toast.dismiss(kickerNotiId.current);

  const loginUser = async ({ username, password }) => {
    setLoggingInUser(true);
    try {
      const { data } = await axios.post('/api/v1/auth/login', {
        apiKey: process.env.REACT_APP_API_KEY,
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
      navigate('/pengguna');
    }
    setLoggingInUser(false);
  };

  const logoutUser = () => {
    clearTimeout(kicker);
    clearTimeout(kickerNoti);
    catchAxiosErrorAndLogout();
    navigate('/pengguna');
  };

  const loginKaunter = async ({ username, password }) => {
    setLoggingInKaunter(true);
    try {
      const { data } = await axios.post('/api/v1/auth/kaunter/login', {
        apiKey: process.env.REACT_APP_API_KEY,
        username,
        password,
      });
      localStorage.setItem('kaunterToken', data.kaunterToken);
      setKaunterToken(data.kaunterToken);
      navigate('/pendaftaran/daftar');
    } catch (error) {
      catchAxiosErrorAndLogout();
      setLoginErrorMessage(error.response.data.msg);
      setIsLoginError(true);
      setTimeout(() => {
        setIsLoginError(false);
      }, 3000);
      navigate('/pendaftaran');
    }
    setLoggingInKaunter(false);
  };

  const catchAxiosErrorAndLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userinfo');
    localStorage.removeItem('reliefUserToken');
    localStorage.removeItem('fasilitiRelief');
    localStorage.removeItem('kaunterToken');
    setUserToken(null);
    setUsername(null);
    setUserinfo(null);
    setFasilitiRelief(null);
    setKaunterToken(null);
  };

  return (
    <UserAppContext.Provider
      value={{
        userToken,
        username,
        setUsername,
        userinfo,
        setUserinfo,
        reliefUserToken,
        setReliefUserToken,
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
        useParams,
        dateToday,
        formatTime,
        noPendaftaranSplitter,
        statusPesakit,
        masterDatePicker,
        Dictionary,
        dictionaryDaerah,
        ToastContainer,
        toast,
        loggingInUser,
        setLoggingInUser,
        loggingInKaunter,
        setLoggingInKaunter,
        timer,
        setTimer,
        refreshTimer,
        setRefreshTimer,
        kicker,
        kickerNoti,
        kickerNotiId,
        logoutUser,
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
