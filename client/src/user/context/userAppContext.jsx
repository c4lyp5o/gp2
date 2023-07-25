import React, {
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import Datetime from 'react-datetime';

const storageUserToken = localStorage.getItem('userToken');
const storageUsername = localStorage.getItem('username');
const storageUserinfo = localStorage.getItem('userinfo');
const storageReliefUserToken = localStorage.getItem('reliefUserToken');
const storageFasilitiRelief = localStorage.getItem('fasilitiRelief');

const storageKaunterToken = localStorage.getItem('kaunterToken');

const storageMyVasToken = localStorage.getItem('myVasToken');
const storageMyVasIdToken = localStorage.getItem('myVasIdToken');

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
  if (p.kumpulanEtnik === 'bukan warganegara') {
    status += '/';
    status += 'BW';
  }
  if (p.ibuMengandung === true) {
    status += '/';
    status += 'IM';
  }
  if (p.orangKurangUpaya === true) {
    status += '/';
    status += 'OKU';
  }
  if (p.statusPesara) {
    status += '/';
    status += 'PES';
  }
  if (p.kakitanganKerajaan === true) {
    status += '/';
    status += 'e-GL';
  }
  return status;
}

function masterDatePicker({
  selected,
  onChange,
  required,
  filterDate,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
  minDate,
  disabled,
  className,
}) {
  return (
    <DatePicker
      showPopperArrow={false}
      dateFormat='dd/MM/yyyy'
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode='select'
      withPortal={window.matchMedia('(max-width: 400px)').matches}
      onKeyDown={(e) => {
        e.preventDefault();
      }}
      onFocus={(e) => e.target.blur()} // disable keyboad input
      selected={selected}
      onChange={onChange}
      required={required}
      filterDate={filterDate}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      disabled={disabled}
      className={className}
      portalId='root-portal'
    />
  );
}

// percentageCalculation
const percentageCalc = (numerator, denominator) => {
  if (numerator === 0 && denominator === 0) {
    return 0;
  }
  // two decimal place
  const numberLong = (numerator / denominator) * 100;
  const twoDecimalPlace = numberLong.toFixed(2);
  return twoDecimalPlace;
};

// wip ----------
function masterDatetime({ value, initialValue, onChange, inputProps }) {
  return (
    <Datetime
      initialViewMode='time'
      dateFormat={false}
      timeFormat='hh:mm A'
      input={true}
      value={value}
      initialValue={initialValue}
      onChange={onChange}
      inputProps={inputProps}
    />
  );
}
// --------------

const Dictionary = {
  kp: 'Klinik Pergigian',
  'kk-kd': 'Klinik Kesihatan / Klinik Desa',
  'taska-tadika': 'Taska / Tadika',
  'projek-komuniti-lain': 'Program Komuniti',
  programDewasaMuda: 'Program Dewasa Muda',
  kampungAngkatPergigian: 'Kampung Angkat Pergigian',
  ppr: 'Projek Perumahan Rakyat',
  we: 'Institusi Warga Emas',
  oku: 'Institusi OKU / PDK',
  'projek-komuniti': 'Projek Komuniti',
  ppkps: 'Program Pemasyarakatan Perkhidmatan Klinik Pergigian Sekolah',
  oap: 'Program Orang Asli dan Penan',
  // incremental: 'Program Pergigian Sekolah Sesi 2022/2023', //{206,207} shaja(sementara je tpi smpai bulan 3)***data jgn buang *****data tak masuk ke program koumniti & sekolah & pg211
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
    'Tangkak',
  ],
  Kedah: [
    'Baling',
    'Bandar Baharu',
    'Kota Setar',
    'Kuala Muda',
    'Kubang Pasu',
    'Langkawi',
    'Padang Terap',
    'Pendang',
    'Sik',
    'Yan',
    'Kulim',
  ],
  Kelantan: [
    'Bachok',
    'Gua Musang',
    'Jeli',
    'Kota Bharu',
    'Kuala Krai',
    'Machang',
    'Pasir Mas',
    'Pasir Puteh',
    'Tanah Merah',
    'Tumpat',
  ],
  Melaka: ['Alor Gajah', 'Jasin', 'Melaka Tengah'],
  'Negeri Sembilan': [
    'Jelebu',
    'Jempol',
    'Kuala Pilah',
    'Port Dickson',
    'Rembau',
    'Seremban',
    'Tampin',
  ],
  Pahang: [
    'Bentong',
    'Bera',
    'Cameron Highland',
    'Jerantut',
    'Kuala Lipis',
    'Kuantan',
    'Maran',
    'Pekan',
    'Raub',
    'Rompin',
    'Temerloh',
  ],
  'Pulau Pinang': [
    'Barat Daya',
    'Seberang Perai Selatan',
    'Seberang Perai Tengah',
    'Seberang Perai Utara',
    'Timur Laut',
  ],
  Perak: [
    'Batang Padang',
    'Hilir Perak',
    'Hulu Perak',
    'Kampar',
    'Kerian',
    'Kinta',
    'Kuala Kangsar',
    'Larut Matang',
    'Manjung',
    'Muallim',
    'Perak Tengah',
  ],
  Perlis: ['Arau', 'Kangar'],
  Selangor: [
    'Gombak',
    'Hulu Langat',
    'Hulu Selangor',
    'Klang',
    'Kuala Langat',
    'Kuala Selangor',
    'Petaling',
    'Sabak Bernam',
    'Sepang',
  ],
  Terengganu: [
    'Besut',
    'Dungun',
    'Hulu Terengganu',
    'Kemaman',
    'Kuala Nerus',
    'Kuala Terengganu',
    'Marang',
    'Setiu',
  ],
  Sabah: [
    'Beaufort',
    'Keningau',
    'Kota Belud',
    'Kota Kinabalu',
    'Kudat',
    'Lahad Datu',
    'Penampang',
    'Sandakan',
    'Tawau',
  ],
  Sarawak: [
    'Betong',
    'Bintulu',
    'Kapit',
    'Kuching',
    'Limbang',
    'Miri',
    'Mukah',
    'Samarahan',
    'Sarikei',
    'Sibu',
    'Sri Aman',
  ],
  'WP Kuala Lumpur': [
    'Zon Cheras',
    'Zon Kepong',
    'Zon Lembah Pantai',
    'Zon Titiwangsa',
  ],
  'WP Labuan': ['WP Labuan'],
  'WP Putrajaya': ['WP Putrajaya'],
  ILK: ['ILK'],
};

const dictionaryJenisFasiliti = {
  'kp-bergerak': 'KPB',
  'makmal-pergigian': 'MPB',
};

const UserAppContext = React.createContext();

function UserAppProvider({ children }) {
  const [dateToday, setDateToday] = useState('');
  const [dateYesterday, setDateYesterday] = useState('');
  const [datePastTwoDays, setDatePastTwoDays] = useState('');
  const [refetchDateTime, setRefetchDateTime] = useState(false);

  // pengguna
  const [userToken, setUserToken] = useState(storageUserToken);
  const [username, setUsername] = useState(storageUsername);
  const [userinfo, setUserinfo] = useState(JSON.parse(storageUserinfo));
  const [reliefUserToken, setReliefUserToken] = useState(
    storageReliefUserToken
  );
  const [fasilitiRelief, setFasilitiRelief] = useState(storageFasilitiRelief);

  // pendaftaran
  const [kaunterToken, setKaunterToken] = useState(storageKaunterToken);

  // MyVAS
  const [myVasToken, setMyVasToken] = useState(storageMyVasToken);
  const [myVasIdToken, setMyVasIdToken] = useState(storageMyVasIdToken);

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

  // getdate from the server
  useLayoutEffect(() => {
    const fetchDate = async () => {
      try {
        const { data } = await axios.get('/api/v1/getdate');
        setDateToday(data.dateToday);
        setDateYesterday(data.dateYesterday);
        setDatePastTwoDays(data.datePastTwoDays);
      } catch (error) {
        console.log(error.response.status);
      }
    };
    fetchDate();
    {
      import.meta.env.VITE_ENV === 'DEV' && console.log('refetch datetime');
    }
  }, [refetchDateTime]);

  // pengguna logout timer
  useEffect(() => {
    if (userToken) {
      if (kicker && kickerNoti) {
        clearTimeout(kickerNoti);
        clearTimeout(kicker);
        dismissLogOut();
      }

      const logOutTime = parseInt(import.meta.env.VITE_LOGOUT_TIME) * 60 * 1000;
      const nowMinutes = new Date().getTime();

      // waktu skrg + env minutes
      const real = nowMinutes + logOutTime;
      setTimer(real);

      const kickerNotiNumber = setTimeout(() => {
        notifyLogOut();
      }, 1000 * 60 * (parseInt(import.meta.env.VITE_LOGOUT_TIME) / 2));

      const kickerNumber = setTimeout(() => {
        logoutUser();
      }, 1000 * 60 * parseInt(import.meta.env.VITE_LOGOUT_TIME));

      setKickerNoti(kickerNotiNumber);
      setKicker(kickerNumber);
    }
  }, [refreshTimer]);

  const notifyLogOut = () =>
    (kickerNotiId.current = toast.warning(
      `Log keluar dalam masa ${
        parseInt(import.meta.env.VITE_LOGOUT_TIME) / 2
      } minit lagi. KLIK NOTIFIKASI INI SEKIRANYA INGIN KEKAL DI DALAM SISTEM`,
      {
        autoClose: 1000 * 60 * (parseInt(import.meta.env.VITE_LOGOUT_TIME) / 2),
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
    localStorage.removeItem('myVasToken');
    localStorage.removeItem('myVasIdToken');
    setUserToken(null);
    setUsername(null);
    setUserinfo(null);
    setReliefUserToken(null);
    setFasilitiRelief(null);
    setKaunterToken(null);
    setMyVasToken(null);
    setMyVasIdToken(null);
  };

  const destroyMyVasSessionOnly = async () => {
    try {
      await axios.get('/api/v1/myvas/logout', {
        headers: {
          Authorization: `Bearer ${kaunterToken} ${
            myVasToken ? myVasToken : ''
          } ${myVasIdToken ? myVasIdToken : ''}`,
        },
      });
      localStorage.removeItem('myVasToken');
      localStorage.removeItem('myVasIdToken');
      setMyVasToken(null);
      setMyVasIdToken(null);
    } catch (error) {
      localStorage.removeItem('myVasToken');
      localStorage.removeItem('myVasIdToken');
      setMyVasToken(null);
      setMyVasIdToken(null);
    }
  };

  return (
    <UserAppContext.Provider
      value={{
        userToken,
        setUserToken,
        username,
        setUsername,
        userinfo,
        setUserinfo,
        reliefUserToken,
        setReliefUserToken,
        fasilitiRelief,
        setFasilitiRelief,
        kaunterToken,
        setKaunterToken,
        myVasToken,
        setMyVasToken,
        myVasIdToken,
        setMyVasIdToken,
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
        destroyMyVasSessionOnly,
        useParams,
        dateToday,
        dateYesterday,
        datePastTwoDays,
        refetchDateTime,
        setRefetchDateTime,
        formatTime,
        noPendaftaranSplitter,
        statusPesakit,
        percentageCalc,
        masterDatePicker,
        Dictionary,
        dictionaryDaerah,
        dictionaryJenisFasiliti,
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
