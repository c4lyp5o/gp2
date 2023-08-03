import axios from 'axios';

import { useToken } from '../useToken';

export function useSpesifikKpData() {
  const { adminToken } = useToken();

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

  return {
    readSpesifikKkiaDataForKp,
    readSpesifikProgramDataForKp,
    readSpesifikKPBMPBDataForKp,
    readSpesifikIndividuDataForKp,
    readSpesifikJanaTadikaDataForKp,
    readSpesifikJanaSekolahRendahDataForKp,
    readSpesifikJanaSekolahMenengahDataForKp,
  };
}
