import { createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useToken } from './Tokenizer';

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
  const updateDataForKp = async (id, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        apiKey: process.env.REACT_APP_API_KEY,
        main: 'KpCenter',
        Fn: 'update',
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
  const deleteDataForKp = async (id) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        apiKey: process.env.REACT_APP_API_KEY,
        main: 'KpCenter',
        Fn: 'delete',
        Id: id,
        token: adminToken,
      });
      return response;
    } catch (err) {
      console.log(err);
      return err;
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

  // read pegawai data
  const readPegawaiData = async () => {
    const response = await axios.get('https://erkm.calypsocloud.one/pegawai');
    const currentPegawai = await readData('pp');
    if (currentPegawai.data.length === 0) {
      console.log('no pegawai');
      return response.data;
    }
    console.log('current pegawai', currentPegawai.data);
    for (let j = 0; j < currentPegawai.data.length; j++) {
      const deletePegawai = response.data
        .map((e) => e.mdcNumber)
        .indexOf(parseInt(currentPegawai.data[j].mdcNumber));
      response.data.splice(deletePegawai, 1);
    }
    return response.data;
  };

  // get mdtb data
  const readMdtbData = async () => {
    const response = await axios.get('https://erkm.calypsocloud.one/mdtb');
    console.log(response.data);
    const currentJp = await readData('jp');
    if (currentJp.data.length === 0) {
      console.log('no jp');
      return response.data;
    }
    console.log('current jp', currentJp.data);
    for (let j = 0; j < currentJp.data.length; j++) {
      const deleteJp = response.data
        .map((e) => e.registrationnumber)
        .indexOf(currentJp.data[j].mdtbNumber);
      response.data.splice(deleteJp, 1);
    }
    return response.data;
  };

  // read fasiliti data
  const readFasilitiData = async () => {
    const response = await axios.get('https://erkm.calypsocloud.one/fasiliti');
    console.log(response.data);
    const currentFasiliti = await readData('kp');
    if (currentFasiliti.data.length === 0) {
      console.log('no fasiliti');
      return response.data;
    }
    console.log('current fasiliti', currentFasiliti.data);
    for (let j = 0; j < currentFasiliti.data.length; j++) {
      const deleteFasiliti = response.data.data
        .map((e) => e.kodFasiliti)
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
      if (currentPegawai.data === 0) {
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

  // read superadmin data
  const readSuperadminData = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'SuperadminCenter',
      Fn: 'read',
    });
    return response;
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
  const DictionarySosMedParam = (key) => {
    if (key.includes('bilAktivitiShareKurang10') === true) {
      return 'Bilangan aktiviti share kurang 10';
    }
    if (key.includes('bilAktivitiShareLebih10') === true) {
      return 'Bilangan aktiviti share lebih 10';
    }
    if (key.includes('bilPenonton') === true) {
      return 'Bilangan penonton';
    }
    if (key.includes('bilReach') === true) {
      return 'Bilangan reach';
    }
    if (key.includes('bilShare') === true) {
      return 'Bilangan share';
    }
  };
  const DictionarySosMedAcronym = (key) => {
    if (key.includes('live') === true) {
      return 'GO LIVE!';
    }
    if (key.includes('poster') === true) {
      return 'POSTER';
    }
    if (key.includes('video') === true) {
      return 'VIDEO';
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
        readDpimsData,
        readSekolahData,
        readPegawaiData,
        readMdtbData,
        readFasilitiData,
        readKpData,
        readSuperadminData,
        readKodProgramData,
        // misc
        getCurrentUser,
        saveCurrentUser,
        logOutUser,
        Dictionary,
        DictionarySosMedParam,
        DictionarySosMedAcronym,
        navigate,
        toast,
        pingApdmServer,
        encryptEmail,
        encryptPassword,
        formatTime,
        resizeImage,
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
