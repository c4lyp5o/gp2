import { createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useToken } from './useToken';
import { useLogininfo } from '../context/useLogininfo';
import { useOndemandSetting } from './useOndemandSetting';

const AdminAppContext = createContext();

function AdminAppProvider({ children }) {
  const navigate = useNavigate();

  const { adminToken, saveAdminToken, removeAdminToken } = useToken();
  const { removeLoginInfo } = useLogininfo();
  const { removeCurrentondemandSetting } = useOndemandSetting();

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

  // adhoc query (he he boi)
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

  return (
    <AdminAppContext.Provider
      value={{
        // toast
        toast,
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
        // semua jenis reten
        semuaJenisReten,
        // misc
        getCurrentUser,
        saveCurrentUser,
        logOutUser,
        // ad hoc query (he he boi)
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
