import { createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useToken } from './Tokenizer';
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
  const readSuperadminData = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'SuperadminCenter',
      Fn: 'read',
    });
    return response;
  };

  // adhoc query
  const adhocQuery = async (y, x) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
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
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'UserCenter',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  };
  const saveCurrentUser = async (data) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
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
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'TotpManager',
      Fn: 'create',
      token: adminToken,
    });
    saveTotpToken(response.data.totpToken);
    return response;
  }
  async function verifyInitialSecret(secret) {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
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
      apiKey: process.env.REACT_APP_API_KEY,
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
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'HqCenter',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  };
  const getKlinikData = async (id) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'HqCenter',
      Fn: 'readOne',
      token: adminToken,
      id,
    });
    return response;
  };

  // data superadmin
  const createData = async (type, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        apiKey: process.env.REACT_APP_API_KEY,
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
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'DataCenter',
      Fn: 'read',
      FType: type,
      token: adminToken,
    });
    return response;
  };
  const readKpData = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'DataCenter',
      Fn: 'read',
      FType: 'kp',
      token: adminToken,
    });
    return response;
  };
  const readOneData = async (type, id) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'DataCenter',
      Fn: 'readOne',
      FType: type,
      Id: id,
      token: adminToken,
    });
    return response;
  };
  const updateData = async (type, id, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        apiKey: process.env.REACT_APP_API_KEY,
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
        apiKey: process.env.REACT_APP_API_KEY,
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
        apiKey: process.env.REACT_APP_API_KEY,
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
  const readDataForKp = async (FType) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'KpCenter',
      Fn: 'read',
      FType: FType,
      token: adminToken,
    });
    return response;
  };
  const readOneDataForKp = async (FType, id) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'KpCenter',
      Fn: 'readOne',
      FType: FType,
      Id: id,
      token: adminToken,
    });
    return response;
  };
  const updateDataForKp = async (FType, id, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        apiKey: process.env.REACT_APP_API_KEY,
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
        apiKey: process.env.REACT_APP_API_KEY,
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

  // get all daerah in negeri
  const readAllDaerahInNegeri = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'SuperadminCenter',
      Fn: 'readDaerah',
      token: adminToken,
    });
    return response;
  };

  // get all klinik in daerah
  const readAllKlinikInDaerah = async (daerah) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'SuperadminCenter',
      Fn: 'readKlinik',
      daerah: daerah,
      token: adminToken,
    });
    return response;
  };

  // // read pegawai data
  // const readPegawaiData = async () => {
  //   const response = await axios.get('https://erkm.calypsocloud.one/pegawai');
  //   const currentPegawai = await readData('pp');
  //   if (currentPegawai.data.length === 0) {
  //     console.log('no pegawai');
  //     return response.data;
  //   }
  //   console.log('current pegawai', currentPegawai.data);
  //   for (let j = 0; j < currentPegawai.data.length; j++) {
  //     const deletePegawai = response.data
  //       .map((e) => e.mdcNumber)
  //       .indexOf(parseInt(currentPegawai.data[j].mdcNumber));
  //     response.data.splice(deletePegawai, 1);
  //   }
  //   return response.data;
  // };

  // read fasiliti data
  const readFasilitiData = async ({ negeri, daerah }) => {
    const response = await axios.get(
      `https://erkm.calypsocloud.one/fasiliti?negeri=${negeri}&daerah=${daerah}`
    );
    console.log(response.data);
    const currentFasiliti = await readData('kp');
    if (currentFasiliti.data.length === 0) {
      console.log('no fasiliti');
      return response.data;
    }
    console.log('current fasiliti', currentFasiliti.data);
    for (let j = 0; j < currentFasiliti.data.length; j++) {
      const deleteFasiliti = response.data.data
        .map((e) => e.kodFasilitiGiret)
        .indexOf(currentFasiliti.data[j].kodFasiliti);
      response.data.data.splice(deleteFasiliti, 1);
    }
    return response.data;
  };

  // read dpims data
  const readDpimsData = async (nama) => {
    try {
      const response = await axios.get(`/dpims?nama=${nama}`);
      const currentPegawai = await readData('ppall');
      if (currentPegawai.data.length === 0) {
        return response.data.matches;
      }
      if (response.data.matches.length === 1) {
        const match = currentPegawai.data
          .map((e) => e.mdcNumber)
          .includes(response.data.matches[0].nomborMdc);
        if (match) {
          return false;
        }
        return response.data.matches;
      }
      for (let j = 0; j < currentPegawai.data.length; j++) {
        const deletePegawai = response.data.matches
          .map((e) => e.nomborMdc)
          .indexOf(currentPegawai.data[j].mdcNumber);
        response.data.matches.splice(deletePegawai, 1);
      }
      return response.data.matches;
    } catch (err) {
      return false;
    }
  };

  // get mdtb data
  const readMdtbData = async (nama) => {
    try {
      const response = await axios.get(
        `https://erkm.calypsocloud.one/mdtb?nama=${nama}`
      );
      const currentJp = await readData('jpall');
      if (currentJp.data.length === 0) {
        return response.data.data;
      }
      if (response.data.data.length === 1) {
        const match = currentJp.data
          .map((e) => e.mdtbNumber)
          .includes(response.data.data[0].mdtbNumber);
        if (match) {
          return false;
        }
        return response.data.data;
      }
      if (response.data.data.length > 1) {
        for (let j = 0; j < currentJp.data.length; j++) {
          const deleteJp = response.data.data
            .map((e) => e.mdtbNumber)
            .indexOf(currentJp.data[j].mdtbNumber);
          if (deleteJp !== -1) {
            response.data.data.splice(deleteJp, 1);
          }
        }
        return response.data.data;
      }
    } catch (error) {
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
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'PromosiManager',
      Fn: 'read',
    });
    return response;
  };

  // auth
  async function loginUser(credentials) {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      username: credentials.username,
      password: credentials.password,
      main: 'UserCenter',
      Fn: 'update',
    });
    if (response.data.adminToken) {
      saveAdminToken(response.data.adminToken);
    }
    return response;
  }
  async function checkUser(username) {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      username,
      main: 'UserCenter',
      Fn: 'readOne',
    });
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
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'ImageResizer',
      Fn: 'resize',
    });
    return response;
  }

  // datepicker
  function masterDatePicker({
    selected,
    value,
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
        selected={selected}
        value={value}
        onChange={onChange}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode='select'
        required={required}
        filterDate={filterDate}
        className={className}
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
      />
    );
  }

  // Dictionaries
  const Dictionary = {
    pp: 'Pegawai Pergigian',
    jp: 'Juruterapi Pergigian',
    taska: 'Taska',
    tadika: 'Tadika',
    sr: 'Sekolah Rendah',
    sm: 'Sekolah Menengah',
    ins: 'Institusi',
    kpb: 'Klinik Pergigian Bergerak',
    mp: 'Makmal Pergigian',
    event: 'Event',
    'projek-komuniti': 'Projek Komuniti',
    utc: 'UTC',
    rtc: 'RTC',
    ppkps: 'PPKPS',
    kgangkat: 'Kampung Angkat',
    ppr: 'PPR',
    we: 'Institusi Warga Emas',
    oku: 'Institusi OKU / PDK',
    oap: 'Program Orang Asli dan Penan',
    ppb: 'Pasukan Pergigian Bergerak',
    mpb: 'Makmal Pergigian Bergerak',
    program: 'Program',
    sosmed: 'Media Sosial',
    tastad: 'Tadika dan Taska',
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
    if (data.includes('Tiktok')) {
      data = data.replace('Tiktok_', '');
      data = data.replace('live_', 'Tiktok LIVE: ');
      data = data.replace('video_', 'Tiktok Video: ');
      data = data.replace('poster_', 'Tiktok Poster: ');
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
        // main data
        createData,
        readData,
        readKpData,
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
        readDpimsData,
        readMdtbData,
        // readPegawaiData,
        readSekolahData,
        readFasilitiData,
        readKodProgramData,
        readAllDaerahInNegeri,
        readAllKlinikInDaerah,
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
