import { createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useToken } from './useToken';
import DatePicker from 'react-datepicker';

const AdminAppContext = createContext();

function AdminAppProvider({ children }) {
  const {
    saveAdminToken,
    saveTotpToken,
    removeAdminToken,
    removeTotpToken,
    adminToken,
    totpToken,
  } = useToken();
  const navigate = useNavigate();

  // read superadmin data
  const readNegeri = async () => {
    const response = await axios.get('/api/v1/superadmin/getnegeri');
    return response;
  };
  const readDaerah = async (negeri) => {
    const response = await axios.get(
      `/api/v1/superadmin/getdaerah?negeri=${negeri}`
    );
    return response;
  };
  const readKlinik = async (daerah) => {
    const response = await axios.get(
      `/api/v1/superadmin/getklinik?daerah=${daerah}`
    );
    return response;
  };
  const readAdmins = async (kod) => {
    const response = await axios.get(
      `/api/v1/superadmin/getadmins?kodFasiliti=${kod}`
    );
    return response;
  };
  const readSuperadminData = async () => {
    const response = await axios.get('/api/v1/superadmin/initialdata');
    return response;
  };

  // adhoc query
  const adhocQuery = async (y, x) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'AQManager',
      Fn: 'read',
      y: y,
      x: x,
      token: adminToken,
    });
    return response;
  };

  // ping apdm
  const pingApdmServer = async () => {
    const response = await axios.get(`https://erkm.calypsocloud.one/`);
    return response;
  };

  // crypter
  const encryptEmail = (email) => {
    if (!email) return 'No email provided';
    const letterToEncrypt = Math.round(email.split('@')[0].length / 1.5);
    const encrypted =
      email
        .split('@')[0]
        .replace(
          email.split('@')[0].substring(0, letterToEncrypt),
          '*'.repeat(letterToEncrypt)
        ) +
      '@' +
      email.split('@')[1];
    return encrypted;
  };
  const encryptPassword = (password) => {
    if (!password) return 'No password provided';
    const letterToEncrypt = password.length;
    const encrypted = password.replace(
      password.substring(0, letterToEncrypt),
      '*'.repeat(letterToEncrypt)
    );
    return encrypted;
  };

  // user
  const getCurrentUser = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'UserCenter',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  };
  const saveCurrentUser = async (data) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'UserCenter',
      Fn: 'updateOne',
      token: adminToken,
      data: data,
    });
    saveAdminToken(response.data.adminToken);
    return response;
  };
  const logOutUser = () => {
    removeAdminToken();
    navigate('/pentadbir');
  };

  // totp
  async function generateSecret() {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'TotpManager',
      Fn: 'create',
      token: adminToken,
    });
    saveTotpToken(response.data.totpToken);
    return response;
  }
  async function verifyInitialSecret(secret) {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'TotpManager',
      Fn: 'update',
      token: adminToken,
      initialTotpCode: secret,
      initialTotpToken: totpToken,
    });
    return response;
  }
  async function verifySecret(secret) {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'TotpManager',
      Fn: 'update',
      token: adminToken,
      totpCode: secret,
    });
    return response;
  }

  // hq functions
  const getAllNegeriAndDaerah = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'HqCenter',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  };
  const getKlinikData = async (id) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'HqCenter',
      Fn: 'readOne',
      token: adminToken,
      id,
    });
    return response;
  };
  const getStatsData = async (negeri, daerah) => {
    const response = await axios.get(
      `/api/v1/superadmin/getstats?negeri=${negeri}&daerah=${daerah}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response;
  };

  // data superadmin
  const createData = async (type, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'DataCenter',
        Fn: 'create',
        FType: type,
        Data: data,
        token: adminToken,
      });
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  const readData = async (type) => {
    const response = await axios.get(
      `/api/v1/superadmin/getdata?FType=${type}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response;
  };
  const readOneData = async (type, id) => {
    const response = await axios.get(
      `/api/v1/superadmin/getonedata?FType=${type}&Id=${id}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response;
  };
  const updateData = async (type, id, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'DataCenter',
        Fn: 'update',
        FType: type,
        Id: id,
        Data: data,
        token: adminToken,
      });
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  const deleteData = async (type, id) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'DataCenter',
        Fn: 'delete',
        FType: type,
        Id: id,
        token: adminToken,
      });
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  // data KP
  const createDataForKp = async (FType, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'KpCenter',
        Fn: 'create',
        FType: FType,
        Data: data,
        token: adminToken,
      });
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  const readDataForKp = async (type) => {
    const response = await axios.get(
      `/api/v1/superadmin/getkpdata?FType=${type}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response;
  };
  const readOneDataForKp = async (type, id) => {
    const response = await axios.get(
      `/api/v1/superadmin/getonekpdata?FType=${type}&Id=${id}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response;
  };
  const updateDataForKp = async (FType, id, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'KpCenter',
        Fn: 'update',
        FType: FType,
        Id: id,
        Data: data,
        token: adminToken,
      });
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  const deleteDataForKp = async (FType, id) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'KpCenter',
        Fn: 'delete',
        FType: FType,
        Id: id,
        token: adminToken,
      });
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  // read fasiliti data
  const readFasilitiData = async ({ negeri, daerah }) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getfasiliti?negeri=${negeri}&daerah=${daerah}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };

  // read operator data
  const readOperatorData = async (type, nama) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getoperator?nama=${nama}&type=${type}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };

  // read kkia data
  const readKkiaData = async ({ negeri }) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkkiakd?negeri=${negeri}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };

  // read token data
  const readGenerateTokenData = async () => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=tokenbal`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };
  const readGenerateTokenDataForKp = async () => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkpdata?FType=tokenbal`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };

  // specifics for each kp for superadmin
  const readSpesifikKkiaData = async (kp) => {
    console.log(kp);
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=kkiakdspesifik&kp=${kp}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };
  const readSpesifikProgramData = async (kp) => {
    console.log(kp);
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=programspesifik&kp=${kp}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };
  const readSpesifikKPBMPBData = async (kp) => {
    console.log(kp);
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=kpbmpbspesifik&kp=${kp}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };

  // specifics for each kp for kpuser
  const readSpesifikKkiaDataForKp = async (kp) => {
    console.log(kp);
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkpdata?FType=kkiakdspesifik&kp=${kp}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };
  const readSpesifikProgramDataForKp = async (kp) => {
    console.log(kp);
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkpdata?FType=programspesifik&kp=${kp}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };
  const readSpesifikKPBMPBDataForKp = async (kp) => {
    console.log(kp);
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkpdata?FType=kpbmpbspesifik&kp=${kp}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return false;
    }
  };

  // erkm
  const readSekolahData = async (FType) => {
    const response = await axios.get(
      'https://erkm.calypsocloud.one/listsekolah'
    );
    switch (FType) {
      case 'sr':
        const currentSr = await readData(FType);
        if (currentSr.data.length === 0) {
          console.log('no sr');
          console.log(response.data);
          return response.data[1].sekolahRendah;
        }
        console.log('current sr', currentSr.data);
        for (let j = 0; j < currentSr.data.length; j++) {
          const deleteSr = response.data[1].sekolahRendah
            .map((e) => e.kodSekolah)
            .indexOf(currentSr.data[j].kodSekolah);
          response.data[1].sekolahRendah.splice(deleteSr, 1);
        }
        return response.data[1].sekolahRendah;
      case 'sm':
        const currentSm = await readData(FType);
        if (currentSm.data.length === 0) {
          console.log('no sm');
          return response.data[2].sekolahMenengah;
        }
        console.log('current sm', currentSm.data);
        for (let j = 0; j < currentSm.data.length; j++) {
          const deleteSm = response.data[2].sekolahMenengah
            .map((e) => e.kodSekolah)
            .indexOf(currentSm.data[j].kodSekolah);
          response.data[2].sekolahMenengah.splice(deleteSm, 1);
        }
        return response.data[2].sekolahMenengah;
      default:
        console.log('there was no request');
    }
  };

  // read kod program data
  const readKodProgramData = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'PromosiManager',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  };

  // auth
  async function loginUser(credentials) {
    const response = await axios.post(`/api/v1/superadmin/login`, {
      username: credentials.username,
      password: credentials.password,
    });
    if (response.data.adminToken) {
      saveAdminToken(response.data.adminToken);
    }
    return response;
  }
  async function checkUser(username) {
    const response = await axios.get(
      `/api/v1/superadmin/check?username=${username}`
    );
    return response;
  }

  // format 24 hour time to 12 hour
  function formatTime(timeString) {
    const [hourString, minute] = timeString.split(':');
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
  }

  // image resizer
  async function resizeImage(data) {
    const response = await axios.post('/api/v1/superadmin/newroute', {
      image: data.image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
      type: data.type,
      main: 'ImageResizer',
      Fn: 'resize',
      token: adminToken,
    });
    return response;
  }

  // datepicker
  function masterDatePicker({
    value,
    selected,
    onChange,
    required,
    filterDate,
    selectsStart,
    selectsEnd,
    startDate,
    endDate,
    minDate,
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
        value={value}
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

  // Dictionaries
  const Dictionary = {
    kkiakd: 'KKIA / KD',
    pp: 'Pegawai Pergigian',
    jp: 'Juruterapi Pergigian',
    taska: 'Taska',
    tadika: 'Tadika',
    sr: 'Sekolah Rendah',
    sm: 'Sekolah Menengah',
    ins: 'Institusi',
    statik: 'Klinik Pergigian Statik',
    kpb: 'Klinik Pergigian Bergerak',
    'kp-bergerak': 'Klinik Pergigian Bergerak',
    mp: 'Makmal Pergigian Bergerak',
    mpb: 'Makmal Pergigian Bergerak',
    'makmal-pergigian': 'Makmal Pergigian Bergerak',
    event: 'Event',
    utc: 'UTC',
    kgangkat: 'Kampung Angkat',
    ppb: 'Pasukan Pergigian Bergerak',
    program: 'Program',
    sosmed: 'Media Sosial',
    followers: 'Followers',
    tastad: 'Tadika dan Taska',
    'kolej-komuniti': 'Kolej Komuniti',
    'kolej-vokasional': 'Kolej Vokasional',
    ipg: 'Institusi Pendidikan Guru (IPG)',
    ipta: 'Institusi Pengajian Tinggi Awam (IPTA)',
    'lain-lain': 'Lain-lain Institusi Pengajian',
    // this is for program-komuniti ------------------------------------------
    programDewasaMuda: 'Program Dewasa Muda',
    kampungAngkatPergigian: 'Progam Kampung Angkat Pergigian',
    ppr: 'Projek Perumahan Rakyat',
    we: 'Institusi Warga Emas',
    oku: 'Institusi OKU / PDK',
    'projek-komuniti': 'Projek Komuniti',
    ppkps: 'PPKPS',
    oap: 'Program Orang Asli dan Penan',
    'penjara-koreksional': 'Program di Penjara / Pusat Koreksional',
    fds: 'Flying Dental Service (Sabah)',
    rtc: 'RTC (Kelantan)',
    incremental: 'Program Pergigian Sekolah Sesi 2022/2023', //{206,207} shaja(sementara je tpi smpai bulan 3)***data jgn buang *****data tak masuk ke program koumniti & sekolah & pg211
    // negeri
    negerijohor: 'Johor',
    negerikedah: 'Kedah',
    negerikelantan: 'Kelantan',
    negerimelaka: 'Melaka',
    negerinegerisembilan: 'Negeri Sembilan',
    negeripahang: 'Pahang',
    negeripulaupinang: 'Pulau Pinang',
    negeriperak: 'Perak',
    negeriperlis: 'Perlis',
    negeriselangor: 'Selangor',
    negeriterengganu: 'Terengganu',
    negerisabah: 'Sabah',
    negerisarawak: 'Sarawak',
    negeriwpkualalumpur: 'WP Kuala Lumpur',
    negeriwpputrajaya: 'WP Putrajaya',
    negeriwplabuan: 'WP Labuan',
    negeriilk: 'ILK',
  };
  const DictionarySosMedParam = (data) => {
    if (data.includes('bilAktivitiShareKurang10') === true) {
      return 'Bilangan aktiviti share kurang 10';
    }
    if (data.includes('bilAktivitiShareLebih10') === true) {
      return 'Bilangan aktiviti share lebih 10';
    }
    if (data.includes('bilPenonton') === true) {
      return 'Bilangan penonton';
    }
    if (data.includes('bilReach') === true) {
      return 'Bilangan reach';
    }
    if (data.includes('bilShare') === true) {
      return 'Bilangan share';
    }
  };
  const DictionarySosMedAcronym = (data) => {
    if (data.includes('live') === true) {
      return 'GO LIVE!';
    }
    if (data.includes('poster') === true) {
      return 'POSTER';
    }
    if (data.includes('video') === true) {
      return 'VIDEO';
    }
  };
  const InfoDecoder = (data) => {
    if (data.includes('Facebook')) {
      data = data.replace('Facebook_', '');
      data = data.replace('live_', 'Facebook LIVE: ');
      data = data.replace('video_', 'Facebook Video: ');
      data = data.replace('poster_', 'Facebook Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('Instagram')) {
      data = data.replace('Instagram_', '');
      data = data.replace('live_', 'Instagram LIVE: ');
      data = data.replace('video_', 'Instagram Video: ');
      data = data.replace('poster_', 'Instagram Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('Twitter')) {
      data = data.replace('Twitter_', '');
      data = data.replace('live_', 'Twitter LIVE: ');
      data = data.replace('video_', 'Twitter Video: ');
      data = data.replace('poster_', 'Twitter Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('Youtube')) {
      data = data.replace('Youtube_', '');
      data = data.replace('live_', 'Youtube LIVE: ');
      data = data.replace('video_', 'Youtube Video: ');
      data = data.replace('poster_', 'Youtube Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('TikTok')) {
      data = data.replace('TikTok_', '');
      data = data.replace('live_', 'TikTok LIVE: ');
      data = data.replace('video_', 'TikTok Video: ');
      data = data.replace('poster_', 'TikTok Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
    if (data.includes('Lain')) {
      data = data.replace('Lain_', '');
      data = data.replace('live_', 'Lain LIVE: ');
      data = data.replace('video_', 'Lain Video: ');
      data = data.replace('poster_', 'Lain Poster: ');
      data = data.replace('bilAktivitiShareKurang10', 'Share kurang dari 10');
      data = data.replace('bilAktivitiShareLebih10', 'Share lebih dari 10');
      data = data.replace('bilPenonton', 'Penonton');
      data = data.replace('bilReach', 'Reach');
      data = data.replace('bilShare', 'Share');
      return data;
    }
  };

  const EmailValidator = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <AdminAppContext.Provider
      value={{
        // tokens
        adminToken,
        totpToken,
        saveAdminToken,
        saveTotpToken,
        removeAdminToken,
        removeTotpToken,
        // start
        readSuperadminData,
        readNegeri,
        readDaerah,
        readKlinik,
        readAdmins,
        // main data
        createData,
        readData,
        readOneData,
        updateData,
        deleteData,
        // kp data
        createDataForKp,
        readDataForKp,
        readOneDataForKp,
        updateDataForKp,
        deleteDataForKp,
        // misc data
        readOperatorData,
        readKkiaData,
        readSekolahData,
        readFasilitiData,
        readKodProgramData,
        readGenerateTokenData,
        readGenerateTokenDataForKp,
        readSpesifikKkiaData,
        readSpesifikProgramData,
        readSpesifikKPBMPBData,
        readSpesifikKkiaDataForKp,
        readSpesifikProgramDataForKp,
        readSpesifikKPBMPBDataForKp,
        // stats data
        getStatsData,
        // misc
        getCurrentUser,
        saveCurrentUser,
        logOutUser,
        Dictionary,
        DictionarySosMedParam,
        DictionarySosMedAcronym,
        InfoDecoder,
        navigate,
        toast,
        pingApdmServer,
        encryptEmail,
        encryptPassword,
        formatTime,
        resizeImage,
        masterDatePicker,
        EmailValidator,
        // auth
        loginUser,
        checkUser,
        generateSecret,
        verifyInitialSecret,
        verifySecret,
        // hq
        getAllNegeriAndDaerah,
        getKlinikData,
        // ahq
        adhocQuery,
      }}
    >
      {children}
    </AdminAppContext.Provider>
  );
}

const useGlobalAdminAppContext = () => {
  return useContext(AdminAppContext);
};

export { AdminAppProvider, useGlobalAdminAppContext };
