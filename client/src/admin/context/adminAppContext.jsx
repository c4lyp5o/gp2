import { createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useToken } from './useToken';
import { useLogininfo } from './useLogininfo';
import { useOndemandSetting } from './useOndemandSetting';
import DatePicker from 'react-datepicker';

const AdminAppContext = createContext();

function AdminAppProvider({ children }) {
  const {
    getAdminToken,
    getTotpToken,
    saveAdminToken,
    saveTotpToken,
    removeAdminToken,
    removeTotpToken,
    adminToken,
    setAdminToken,
    totpToken,
    setTotpToken,
  } = useToken();

  const { getLoginInfo, saveLoginInfo, removeLoginInfo, loginInfo } =
    useLogininfo();

  const {
    getCurrentOndemandSetting,
    saveCurrentondemandSetting,
    removeCurrentondemandSetting,
    currentOndemandSetting,
  } = useOndemandSetting();

  const navigate = useNavigate();

  // login data
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

  // login method
  const loginUser = async (credentials) => {
    const response = await axios.post(`/api/v1/superadmin/login`, {
      username: credentials.username,
      password: credentials.password,
    });
    if (response.data.adminToken) {
      saveAdminToken(response.data.adminToken);
    }
    return response;
  };
  const checkUser = async (username) => {
    const response = await axios.get(
      `/api/v1/superadmin/check?username=${username}`
    );
    return response;
  };

  // totp
  const generateSecret = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'TotpManager',
      Fn: 'create',
      token: adminToken,
    });
    saveTotpToken(response.data.totpToken);
    return response;
  };
  const verifyInitialSecret = async (secret) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'TotpManager',
      Fn: 'update',
      token: adminToken,
      initialTotpCode: secret,
      initialTotpToken: totpToken,
    });
    return response;
  };
  const verifySecret = async (secret) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'TotpManager',
      Fn: 'update',
      token: adminToken,
      totpCode: secret,
    });
    return response;
  };

  // percentageCalculation
  const percentageCalc = (numerator, denominator) => {
    if (numerator === 0 && denominator === 0) {
      return 0;
    }
    // one decimal place and if numerator is bigger become negative % value and become positive % value if denominator is bigger
    return Math.round(((numerator - denominator) / denominator) * 100);
  };

  // ondemand setting
  const readOndemandSetting = async () => {
    const response = await axios.get('/api/v1/ondemand', {
      headers: {
        Authorization: adminToken,
      },
    });
    return response;
  };
  const saveOndemandSetting = async (data) => {
    const response = await axios.patch(
      '/api/v1/ondemand',
      { ondemandSetting: data },
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response;
  };

  // main data
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
  const newRouteCreateData = async (type, data) => {
    try {
      const response = await axios.post(
        `/api/v1/superadmin/post`,
        { FType: type, Data: data },
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
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
  const newRouteUpdateData = async (type, id, data) => {
    try {
      const response = await axios.patch(
        `/api/v1/superadmin/patch`,
        { FType: type, Id: id, Data: data },
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
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
  const newRouteDeleteData = async (type, id) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/delete?FType=${type}&Id=${id}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  // main kp data
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

  // misc data
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
  const readSekolahData = async (FType) => {
    const responseMOIES = await axios.get(
      `/api/v1/superadmin/getsekolahMOEIS?FType=${FType}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return responseMOIES.data.SENARAI_INSTITUSI;

    // switch (FType) { // will be used later
    //   case 'sr':
    //     const currentSr = await readData('sr-sm-all');
    //     if (currentSr.data.length === 0) {
    //       return response.data[1].sekolahRendah;
    //     }
    //     for (let j = 0; j < currentSr.data.length; j++) {
    //       const deleteSr = response.data[1].sekolahRendah
    //         .map((e) => e.kodSekolah)
    //         .indexOf(currentSr.data[j].kodSekolah);
    //       response.data[1].sekolahRendah.splice(deleteSr, 1);
    //     }
    //     return response.data[1].sekolahRendah;
    //   default:
    //     const currentSm = await readData('sr-sm-all');
    //     if (currentSm.data.length === 0) {
    //       return response.data[2].sekolahMenengah;
    //     }
    //     for (let j = 0; j < currentSm.data.length; j++) {
    //       const deleteSm = response.data[2].sekolahMenengah
    //         .map((e) => e.kodSekolah)
    //         .indexOf(currentSm.data[j].kodSekolah);
    //       response.data[2].sekolahMenengah.splice(deleteSm, 1);
    //     }
    //     return response.data[2].sekolahMenengah;
    // }
  };
  const readKodProgramData = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'PromosiManager',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  };
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

  // spesifik superadmin data
  const readSpesifikKkiaData = async (kp) => {
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
  const readSpesifikIndividuData = async (kp) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=pegawaispesifik&kp=${kp}`,
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
  const readSpesifikRTCData = async (kp) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=rtc&kp=${kp}`,
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
  const readSpesifikJanaTadikaData = async (kp) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=janatadika`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return toast.error('Tiada tadika ditemui');
    }
  };
  const readSpesifikJanaSekolahRendahData = async (kp) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=janasekolahrendah`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return toast.error(
        'Tiada sekolah ditemui atau sekolah masih menjalankan pemeriksaan atau rawatan'
      );
    }
  };
  const readSpesifikJanaSekolahMenengahData = async (kp) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=janasekolahmenengah`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return toast.error(
        'Tiada sekolah ditemui atau sekolah masih menjalankan pemeriksaan atau rawatan'
      );
    }
  };

  // spesifik kp data
  const readSpesifikKkiaDataForKp = async (kp) => {
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
  const readSpesifikIndividuDataForKp = async (kp) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkpdata?FType=pegawaispesifik&kp=${kp}`,
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
  const readSpesifikJanaTadikaDataForKp = async (kp) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkpdata?FType=janatadika`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return toast.error('Tiada Data Tadika Ditemui');
    }
  };
  const readSpesifikJanaSekolahRendahDataForKp = async (kp) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkpdata?FType=janasekolahrendah`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return toast.error(
        'Tiada Data Sekolah Ditemui Atau Sekolah Masih Menjalankan Pemeriksaan Atau Rawatan'
      );
    }
  };
  const readSpesifikJanaSekolahMenengahDataForKp = async (kp) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkpdata?FType=janasekolahmenengah`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response;
    } catch (err) {
      return toast.error(
        'Tiada Data Sekolah Ditemui Atau Sekolah Masih Menjalankan Pemeriksaan Atau Rawatan'
      );
    }
  };

  // hq functions
  const getAllNegeriAndDaerah = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'HqCenter',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  };
  const getDetailedData = async ({ type, idn, idd, id }) => {
    const endpoint = '/api/v1/superadmin/newroute';
    const params = {
      main: 'HqCenter',
      Fn: 'readOne',
      token: adminToken,
    };

    switch (type) {
      case 'negeri':
        params.idn = idn;
        break;
      case 'daerah':
        params.idn = idn;
        params.idd = idd;
        break;
      case 'klinik':
        params.id = id;
        break;
      default:
        throw new Error('Invalid type');
    }

    const response = await axios.post(`${endpoint}`, params);
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

  // semua jenis reten
  const semuaJenisReten = [
    {
      kod: 'PG101A Pind. 1/2022',
      kodRingkas: 'PG101A',
      deskripsi:
        'Daftar Kehadiran Harian Pesakit Warganegara/ Bukan Warganegara',
      deskripsi2:
        '- Klinik Pergigian Primer & program lawatan pergigian di KKIA/KD',
    },
    {
      kod: 'PG101C Pind. 1/2022',
      kodRingkas: 'PG101C',
      deskripsi:
        'Daftar Kehadiran Harian Pesakit Warganegara/ Bukan Warganegara',
      deskripsi2: '- Program Outreach dan Klinik Pergigian Sekolah (Statik)',
    },
    {
      kod: 'PG211A Pind. 1/2022',
      kodRingkas: 'PG211A',
      deskripsi:
        'Rekod Kehadiran Bulanan Pesakit Warganegara/ Bukan Warganegara',
      deskripsi2: '- Perkhidmatan Pergigian Klinik Pergigian Primer',
    },
    {
      kod: 'PG211C Pind. 1/2022',
      kodRingkas: 'PG211C',
      deskripsi:
        'Rekod Kehadiran Bulanan Pesakit Warganegara/ Bukan Warganegara',
      deskripsi2: '- Perkhidmatan Pergigian Outreach',
    },
    {
      kod: 'PG211C Pind. 1/2022 - KPB/MPB',
      kodRingkas: 'PG211C-KPBMPB',
      deskripsi:
        'Rekod Kehadiran Bulanan Pesakit Warganegara/ Bukan Warganegara',
      deskripsi2:
        '- Klinik Pergigian Bergerak (KPB) / Makmal Pergigian Bergerak (MPB)',
    },
    {
      kod: 'PG206 Pind. 1/2022',
      kodRingkas: 'PG206',
      deskripsi:
        'Laporan Bulanan Individu/Klinik/Daerah/Negeri Hasil Kerja Juruterapi Pergigian Bagi Rawatan Am/Orang Kurang Upaya (OKU)/Bukan Warganegara',
    },
    {
      kod: 'PG207 Pind. 1/2022',
      kodRingkas: 'PG207',
      deskripsi:
        'Laporan Bulanan Individu/Klinik/Daerah/Negeri Hasil Kerja Pegawai Pergigian Bagi Rawatan Am/Ibu Mengandung/Orang Kurang Upaya (OKU)/Bukan Warganegara',
    },
    {
      kod: 'PG214 Pind. 1/2022',
      kodRingkas: 'PG214',
      deskripsi:
        'Laporan Bulanan Pesakit Baru Warga Emas Warganegara Dan Bukan Warganegara',
    },
    {
      kod: 'PGPR201 Pind. 1/2022',
      kodRingkas: 'PGPR201',
      deskripsi:
        'Laporan Bulanan Pendidikan Kesihatan Pergigian Oleh Juruterapi Pergigian/Pegawai Pergigian',
    },
    {
      kod: 'PGPR201 Pind. 1/2022-CUSTOM-IM',
      kodRingkas: 'PGPR201-CUSTOM-IM',
      deskripsi:
        'Laporan Bulanan Pendidikan Kesihatan Pergigian Oleh Juruterapi Pergigian/Pegawai Pergigian Bagi Pesakit Ibu Mengandung',
    },
    {
      kod: 'PGPRO 01 Pind. 2/2022 Kod Program',
      kodRingkas: 'PGPRO01',
      deskripsi:
        'Laporan Bulanan Individu/Fasiliti/Daerah/Negeri Bagi Aktiviti Promosi Dan Pendidikan Kesihatan Pergigian Mengikut Kod Program',
    },
    {
      kod: 'PGPRO 01 Pind. 2/2022 FFR',
      kodRingkas: 'PGPRO01Combined',
      deskripsi:
        'Laporan Bulanan Individu/Fasiliti/Daerah/Negeri Bagi Aktiviti Promosi Dan Pendidikan Kesihatan Pergigian',
    },
    {
      kod: 'PGS201',
      kodRingkas: 'PGS201',
      deskripsi:
        'Laporan Kesihatan Pergigian Dan Status Rawatan Di Fasiliti Prasekolah/Tadika, Sekolah Rendah/Pendidikan Khas, Sekolah Menengah/Pendidikan Khas',
    },
    {
      kod: 'PGS203 Pind. 2/2022',
      kodRingkas: 'PGS203P2',
      deskripsi:
        'Laporan Bulanan Kesihatan Pergigian Dan Status Rawatan Murid Prasekolah/Tadika, Sekolah Rendah/Pendidikan Khas, Sekolah Menengah/Pendidikan Khas',
    },
    {
      kod: 'KPI FS',
      kodRingkas: 'KPIFS',
      deskripsi:
        'Peratus Keberhasilan Aplikasi Fissure Sealant Pada Gigi Yang Dikenal Pasti',
    },
    {
      kod: 'TOD 02 Pin. 1/2022',
      kodRingkas: 'TODP1',
      deskripsi:
        'Laporan Bulanan Hasil Kerja Pegawai Pergigian dan Jururawat Pergigian Klinik/ Daerah/ Negeri bagi Toddler',
    },
    {
      kod: '-',
      kodRingkas: 'MASA',
      deskripsi: 'KPI Piagam Masa',
    },
    {
      kod: 'BP Pind.1/2023',
      kodRingkas: 'BP',
      deskripsi: 'Laporan Tekanan Darah',
    },
    {
      kod: 'BPE 01/2018 Pind. 1/2022',
      kodRingkas: 'BPE',
      deskripsi: 'Laporan Basic Periodontal Examination',
    },
    {
      kod: '-',
      kodRingkas: 'GENDER',
      deskripsi: 'Laporan Gender',
    },
    {
      kod: 'KEPP',
      kodRingkas: 'KEPP',
      deskripsi: 'KEPP',
    },
    {
      kod: 'BEGIN',
      kodRingkas: 'BEGIN',
      deskripsi:
        'Laporan Aktiviti Latihan Memberus Gigi Berkesan (Begin) Di Taska, Pra-Sekolah Dan Sekolah Rendah',
    },
    {
      kod: 'CPPC1',
      kodRingkas: 'CPPC1',
      deskripsi:
        'CPPC Treatment Need and Treament Rendered by Year of Preschool/School Children',
    },
    {
      kod: 'CPPC2',
      kodRingkas: 'CPPC2',
      deskripsi:
        'Trend Data of Decayed Teeth with Occlusal Caries in Preschool/School Children',
    },
    {
      kod: 'PPIM 03',
      kodRingkas: 'PPIM03',
      deskripsi:
        'Rekod Saringan Dan Intervensi Merokok Melalui Perkhidmatan Pergigian Sekolah',
    },
    {
      kod: 'PPIM 04',
      kodRingkas: 'PPIM04',
      deskripsi: 'Daftar Murid Menjalani Intervensi Program Kotak Di Sekolah',
    },
    {
      kod: 'PPIM 05',
      kodRingkas: 'PPIM05',
      deskripsi: 'Rekod Intervensi Program Kotak Di Sekolah',
    },
    {
      kod: 'Dewasa Muda',
      kodRingkas: 'DEWASAMUDA',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Perkhidmatan Pergigian Program Dewasa Muda',
    },
    {
      kod: 'PPR',
      kodRingkas: 'PPR',
      deskripsi: 'Projek Perumahan Rakyat (PPR)',
    },
    {
      kod: 'PPKPS',
      kodRingkas: 'PPKPS',
      deskripsi: 'Pemasyarakatan Perkhidmatan Klinik Pergigian Sekolah (PPKPS)',
    },
    // {
    //   kod: 'PKAP1',
    //   kodRingkas: 'PKAP1',
    //   deskripsi: 'PKAP1',
    // },
    {
      kod: 'PKAP2',
      kodRingkas: 'PKAP2',
      deskripsi: 'Program Kampung Angkat Pergigian (PKAP)',
    },
    {
      kod: 'KOM-OAP',
      kodRingkas: 'KOM-OAP',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Program Orang Asli dan Penan di Komuniti',
    },
    {
      kod: 'KOM-WE',
      kodRingkas: 'KOM-WE',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Institusi Warga Emas',
    },
    {
      kod: 'KOM-OKU-PDK',
      kodRingkas: 'KOM-OKU-PDK',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Institusi OKU / PDK',
    },
    {
      kod: 'KOM-Komuniti',
      kodRingkas: 'KOM-Komuniti',
      deskripsi: 'Laporan Bulanan Klinik/Daerah/Negeri Bagi Projek Komuniti',
    },
    {
      kod: 'KOM-Penjara',
      kodRingkas: 'KOM-Penjara',
      deskripsi: 'Laporan Bulanan Klinik/Daerah/Negeri Bagi Institusi Penjara',
    },
    {
      kod: 'KOM-FDS',
      kodRingkas: 'KOM-FDS',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Flying Dental Service, Sabah',
    },
    {
      kod: 'KOM-ISN',
      kodRingkas: 'KOM-ISN',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Institut Sukan Negara (ISN)',
    },
    {
      kod: 'KOM-HRC',
      kodRingkas: 'KOM-HRC',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Komuniti Berisiko Tinggi (Program Kanser Mulut)',
    },
    {
      kod: 'KOM',
      kodRingkas: 'KOM',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Semua Program Komuniti',
    },
    {
      kod: 'OAP',
      kodRingkas: 'OAP',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Perkhidmatan Pergigian Etnik Orang Asli/Penan',
    },
    {
      kod: 'Liputan ORANG ASLI',
      kodRingkas: 'LiputanOA',
      deskripsi:
        'Laporan Bulanan/Tahunan Di Negeri Bagi Liputan Populasi Etnik Orang Asli',
    },
    {
      kod: 'Liputan PENAN',
      kodRingkas: 'LiputanPenan',
      deskripsi:
        'Laporan Bulanan/Tahunan Di Negeri Bagi Liputan Populasi Etnik Penan',
    },
    {
      kod: 'RTC',
      kodRingkas: 'RTC',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Rural Transformation Center (RTC)',
    },
    {
      kod: 'UTC',
      kodRingkas: 'UTC',
      deskripsi:
        'Laporan Bulanan/Tahunan Di Negeri Bagi Urban Transformation Center (UTC)',
    },
    // {
    //   kod: 'KPBMPB Harian',
    //   kodRingkas: 'KPBMPBHarian',
    //   deskripsi: 'KPB MPB Harian',
    // },
    {
      kod: 'KPB / MPB',
      kodRingkas: 'KPBMPBBulanan',
      deskripsi:
        'Laporan Bulanan Klinik/Daerah/Negeri Bagi Perkhidmatan Pergigian Di Klinik Pergigian Bergerak (KPB) Dan Makmal Pergigian Bergerak (MPB)',
    },
  ];

  // misc
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
    removeLoginInfo();
    removeCurrentondemandSetting();
    navigate('/pentadbir');
  };
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
  const formatTime = (timeString) => {
    const [hourString, minute] = timeString.split(':');
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
  };
  // const resizeImage = async (data) => {
  //   const response = await axios.post('/api/v1/superadmin/newroute', {
  //     image: data.image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
  //     type: data.type,
  //     main: 'ImageResizer',
  //     Fn: 'resize',
  //     token: adminToken,
  //   });
  //   return response;
  // }
  const masterDatePicker = ({
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
    disabled,
    className,
  }) => {
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
        disabled={disabled}
        className={className}
        portalId='root-portal'
      />
    );
  };
  const EmailValidator = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // dictionaries
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
  const Dictionary = {
    all: 'all',
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
    tastad: 'Tadika/Taska',
    'kolej-komuniti': 'Kolej Komuniti',
    'kolej-vokasional': 'Kolej Vokasional',
    ipg: 'Institusi Pendidikan Guru (IPG)',
    ipta: 'Pra Universiti (PRA U) & Universiti Awam (UA)',
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
    // incremental: 'Program Pergigian Sekolah Sesi 2022/2023', //{206,207} shaja(sementara je tpi smpai bulan 3)***data jgn buang *****data tak masuk ke program koumniti & sekolah & pg211
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
    // KHUSUS UNTUK RTC
    Pahang: 'Pahang',
    Melaka: 'Melaka',
    Kelantan: 'Kelantan',
    Sarawak: 'Sarawak',
  };
  const DictionaryHurufNegeri = {
    Johor: 'J',
    Kedah: 'K',
    Kelantan: 'D',
    Melaka: 'M',
    'Negeri Sembilan': 'N',
    Pahang: 'C',
    'Pulau Pinang': 'P',
    Perak: 'A',
    Perlis: 'R',
    Selangor: 'B',
    Terengganu: 'T',
    Sabah: 'S',
    Sarawak: 'Q',
    'WP Kuala Lumpur': 'W',
    'WP Labuan': 'L',
    'WP Putrajaya': 'F',
    ILK: 'ILK',
  };
  const DictionarySubProgram = {
    kampungAngkatPergigian: 'Program Kampung Angkat Pergigian',
    oap: 'Program Orang Asli dan Penan',
    ppr: 'Projek Perumahan Rakyat',
    hrc: 'Komuniti Berisiko Tinggi',
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

  // adhoc query (he he boi)
  const adhocQuery = async (payload) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'AQManager',
      Fn: 'read',
      payload,
      token: adminToken,
    });
    return response;
  };

  return (
    <AdminAppContext.Provider
      value={{
        // toast
        toast,
        // tokens
        getAdminToken,
        getTotpToken,
        saveAdminToken,
        saveTotpToken,
        removeAdminToken,
        removeTotpToken,
        adminToken,
        setAdminToken,
        totpToken,
        setTotpToken,
        // login info
        getLoginInfo,
        saveLoginInfo,
        removeLoginInfo,
        loginInfo,
        // ondemand data
        getCurrentOndemandSetting,
        saveCurrentondemandSetting,
        removeCurrentondemandSetting,
        currentOndemandSetting,
        // navigation
        navigate,
        // login data
        readNegeri,
        readDaerah,
        readKlinik,
        readAdmins,
        // login method
        loginUser,
        checkUser,
        // totp
        generateSecret,
        verifyInitialSecret,
        verifySecret,
        percentageCalc,
        // ondemand data
        readOndemandSetting,
        saveOndemandSetting,
        // main data
        createData,
        readData,
        readOneData,
        updateData,
        deleteData,
        // main kp data
        createDataForKp,
        readDataForKp,
        readOneDataForKp,
        updateDataForKp,
        deleteDataForKp,
        // misc data
        readFasilitiData,
        readOperatorData,
        readKkiaData,
        readSekolahData,
        readKodProgramData,
        readGenerateTokenData,
        readGenerateTokenDataForKp,
        // spesifik superadmin data
        readSpesifikKkiaData,
        readSpesifikProgramData,
        readSpesifikKPBMPBData,
        readSpesifikIndividuData,
        readSpesifikRTCData,
        readSpesifikJanaTadikaData,
        readSpesifikJanaSekolahRendahData,
        readSpesifikJanaSekolahMenengahData,
        // spesifik kp data
        readSpesifikKkiaDataForKp,
        readSpesifikProgramDataForKp,
        readSpesifikKPBMPBDataForKp,
        readSpesifikIndividuDataForKp,
        readSpesifikJanaTadikaDataForKp,
        readSpesifikJanaSekolahRendahDataForKp,
        readSpesifikJanaSekolahMenengahDataForKp,
        // hq functions
        getStatsData,
        getAllNegeriAndDaerah,
        getDetailedData,
        // semua jenis reten
        semuaJenisReten,
        // misc
        getCurrentUser,
        saveCurrentUser,
        logOutUser,
        encryptEmail,
        encryptPassword,
        formatTime,
        // resizeImage,
        masterDatePicker,
        EmailValidator,
        // dictionaries
        InfoDecoder,
        Dictionary,
        DictionaryHurufNegeri,
        DictionarySubProgram,
        DictionarySosMedParam,
        DictionarySosMedAcronym,
        // ad hoc query (he he boi)
        adhocQuery,
        // testing pada maklumat asas
        newRouteCreateData,
        newRouteUpdateData,
        newRouteDeleteData,
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
