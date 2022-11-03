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

  // ping apdm

  async function pingApdmServer() {
    const response = await axios.get(`https://erkm.calypsocloud.one/`);
    return response;
  }

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

  async function getCurrentUser() {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'UserCenter',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  }

  async function saveCurrentUser(data) {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'UserCenter',
      Fn: 'updateOne',
      token: adminToken,
      data: data,
    });
    saveAdminToken(response.data.adminToken);
    return response;
  }

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

  // data

  const createData = async (type, data) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'DataCenter',
      Fn: 'create',
      FType: type,
      Data: data,
      token: adminToken,
    });
    return response;
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
    console.log(data);
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
    } catch (e) {
      return e;
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

  const Dictionary = {
    pp: 'Pegawai Pergigian',
    jp: 'Juruterapi Pergigian',
    taska: 'Taska',
    tadika: 'Tadika',
    sr: 'Sekolah Rendah',
    sm: 'Sekolah Menengah',
    ins: 'Institusi',
    kpb: 'KP Bergerak',
    mp: 'Makmal Pergigian',
    event: 'Event',
    'projek-komuniti': 'Projek Komuniti',
    utc: 'UTC',
    rtc: 'RTC',
    ppkps: 'PPKPS',
    kgangkat: 'Kampung Angkat',
    ppr: 'PPR',
    'we-oku': 'Institusi Warga Emas dan Institusi Orang Kurang Upaya',
    oap: 'Program Orang Asli dan Penan',
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
        // misc data
        readSekolahData,
        readPegawaiData,
        readMdtbData,
        readFasilitiData,
        readKpData,
        // misc
        getCurrentUser,
        saveCurrentUser,
        Dictionary,
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
