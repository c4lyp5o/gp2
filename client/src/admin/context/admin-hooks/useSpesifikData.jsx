import axios from 'axios';

import { useToken } from '../useToken';

export function useSpesifikData() {
  const { adminToken } = useToken();

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
  return {
    readSpesifikKkiaData,
    readSpesifikProgramData,
    readSpesifikKPBMPBData,
    readSpesifikIndividuData,
    readSpesifikRTCData,
    readSpesifikJanaTadikaData,
    readSpesifikJanaSekolahRendahData,
    readSpesifikJanaSekolahMenengahData,
  };
}
